import Customer from "../models/Customer.js";
import { generateAiResponse } from "../services/geminiService.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { saveMessage } from "../services/chatService.js";

export const processIncomingText = async (
  text,
  generateResponse = generateAiResponse
) => {
  console.log("Processing path: normal conversation; product lookup bypassed.");
  console.log("Gemini called: yes.");
  const response = await generateResponse(text);
  console.log("Response path: Gemini result or fallback.");

  return {
    response,
    path: "gemini",
    geminiCalled: true,
    productLookup: false,
  };
};

// @desc    Verify WhatsApp Webhook subscription (GET)
// @route   GET /api/whatsapp/webhook
// @access  Public
export const verifyWebhook = async (req, res, next) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token && verifyToken) {
      if (mode === "subscribe" && token === verifyToken) {
        console.log("WhatsApp Webhook Verified Successfully.");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }

    return res.status(400).json({
      success: false,
      message: "Missing verify parameters",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Receive incoming WhatsApp messages
// @route   POST /api/whatsapp/webhook
// @access  Public
export const handleWebhook = async (req, res, next) => {
  try {
    const body = req.body;

    console.log(
      "Incoming Webhook:",
      JSON.stringify(body, null, 2)
    );

    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(200);
    }

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.trim();

    if (!from || !text) {
      console.log("Ignoring WhatsApp event without a text message.");
      return res.sendStatus(200);
    }

    console.log("Incoming text message received.");
    // Create or update customer
    await Customer.findOneAndUpdate(
      { phone: from },
      {
        phone: from,
        name:
          body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ||
          from,
        lastMessage: text,
        online: true,
        lastSeen: "Just now",
      },
      {
        new: true,
        upsert: true,
      }
    );

    // Save incoming customer message to database first
    await saveMessage(from, "user", text);

    const processingResult = await processIncomingText(text);
    const aiReply = processingResult.response;

    if (!aiReply?.trim()) {
      console.error("Response generation returned empty text; no reply was saved or sent.");
      return res.sendStatus(200);
    }

    // Save outgoing AI reply to database
    await saveMessage(from, "assistant", aiReply);

    // Send reply back to WhatsApp
    await sendWhatsAppMessage(from, aiReply);

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};