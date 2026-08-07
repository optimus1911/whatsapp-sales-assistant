import Customer from "../models/Customer.js";
import { generateAiResponse } from "../services/geminiService.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";
import { saveMessage } from "../services/chatService.js";

// @desc    Verify WhatsApp Webhook subscription (GET)
// @route   GET /api/whatsapp/webhook
// @access  Public
export const verifyWebhook = async (req, res, next) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken =
      process.env.WHATSAPP_VERIFY_TOKEN || "mock_webhook_verify_token";

    if (mode && token) {
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

    if (body.object) {
      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body;

        console.log("Customer:", from);
        console.log("Message:", text);
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
        if (text) {
          await saveMessage(from, "user", text);
        }

        // Generate AI reply
        const aiReply = await generateAiResponse(text);

        console.log("Gemini Reply:", aiReply);

        // Save outgoing AI reply to database
        if (aiReply) {
          await saveMessage(from, "assistant", aiReply);
        }

        // Send reply back to WhatsApp
        await sendWhatsAppMessage(from, aiReply);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};