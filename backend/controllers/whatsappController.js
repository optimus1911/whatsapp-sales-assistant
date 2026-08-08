import Customer from "../models/Customer.js";
import Message from "../models/Message.js";
import { analyzeConversation } from "../services/aiAnalysisService.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

// Helper to determine lead status based on score
const getLeadStatus = (score) => {
  if (score >= 80) return "Hot";
  if (score >= 50) return "Warm";
  return "Cold";
};

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
    console.error("Webhook Verification Error:", error);
    next(error);
  }
};

// @desc    Receive incoming WhatsApp messages and run intelligence analysis
// @route   POST /api/whatsapp/webhook
// @access  Public
export const handleWebhook = async (req, res, next) => {
  try {
    const body = req.body;

    console.log(
      "Incoming Webhook:",
      JSON.stringify(body, null, 2)
    );

    // Phase 8: Robustness - check for expected properties safely
    if (!body || !body.object) {
      return res.sendStatus(200);
    }

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    // Phase 8: Ignore webhook events with missing text or phone
    if (!text || !from) {
      return res.sendStatus(200);
    }

    const customerName =
      body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ||
      from;

    console.log("Processing webhook message for:", customerName, `(${from})`);

    // Find customer by phone
    let customer = await Customer.findOne({ phone: from });

    // If customer doesn't exist, create customer
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone: from,
        online: true,
        lastSeen: "Just now",
        lastMessage: text
      });
    } else {
      // Update existing customer immediately before AI response (state synchronization)
      customer.online = true;
      customer.lastSeen = "Just now";
      customer.lastMessage = text;
      await customer.save();
    }

    // Save incoming customer message
    await Message.create({
      customerId: customer._id,
      sender: "customer",
      message: text,
      status: "read",
      timestamp: new Date()
    });

    // Call Gemini for structured AI analysis
    let aiAnalysis;
    try {
      const context = `Customer Name: ${customer.name}. Phone: ${customer.phone}. Existing Lead Status: ${customer.leadStatus}. Last Message Summary: ${customer.summary || "None"}.`;
      aiAnalysis = await analyzeConversation(text, context);
    } catch (aiError) {
      console.error("AI Analysis Service failed:", aiError);
      // Failsafe fallback
      aiAnalysis = {
        reply: "Thank you for reaching out. We will get back to you shortly.",
        leadScore: 50,
        intent: "Unknown",
        sentiment: "Neutral",
        priority: "Medium",
        summary: "Error during AI analysis.",
        purchaseProbability: 50,
        recommendedProduct: ""
      };
    }

    const {
      reply,
      leadScore,
      intent,
      sentiment,
      priority,
      summary,
      purchaseProbability,
      recommendedProduct
    } = aiAnalysis;

    // Calculate automatic Lead Status from Lead Score (Phase 4)
    const leadStatus = getLeadStatus(leadScore);

    // Save AI reply
    if (reply && reply.trim()) {
      await Message.create({
        customerId: customer._id,
        sender: "ai",
        message: reply,
        status: "sent",
        timestamp: new Date()
      });

      // Update customer intelligence fields in one database write (Phase 4 & 9)
      customer.leadScore = leadScore;
      customer.leadStatus = leadStatus;
      customer.intent = intent;
      customer.sentiment = sentiment;
      customer.priority = priority;
      customer.summary = summary;
      customer.purchaseProbability = purchaseProbability;
      customer.recommendedProduct = recommendedProduct;
      customer.lastMessage = reply;
      customer.online = true;
      customer.lastSeen = "Just now";
      await customer.save();

      // Phase 7: Log CRM details
      console.log("=== AI Conversation Intelligence ===");
      console.log(`Customer Name:        ${customer.name}`);
      console.log(`Phone:                ${customer.phone}`);
      console.log(`Intent:               ${intent}`);
      console.log(`Sentiment:            ${sentiment}`);
      console.log(`Lead Score:           ${leadScore}`);
      console.log(`Lead Status:          ${leadStatus}`);
      console.log(`Priority:             ${priority}`);
      console.log(`Purchase Probability: ${purchaseProbability}%`);
      console.log(`Recommended Product:  ${recommendedProduct || "N/A"}`);
      console.log(`Summary:              ${summary}`);
      console.log(`Reply:                ${reply}`);
      console.log("====================================");

      // Send reply back to WhatsApp
      try {
        await sendWhatsAppMessage(from, reply);
      } catch (waError) {
        console.error("WhatsApp Send Message failed:", waError);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);
    // Phase 8: Never crash webhook, return 200 OK
    if (!res.headersSent) {
      return res.sendStatus(200);
    }
  }
};