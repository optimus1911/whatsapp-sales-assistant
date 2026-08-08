import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates structured conversation analysis and reply from Gemini.
 *
 * @param {string} prompt The incoming customer message text.
 * @param {string} [customerContext=""] Background/historical context about the customer.
 * @returns {Promise<{
 *   reply: string,
 *   leadScore: number,
 *   intent: string,
 *   sentiment: string,
 *   priority: string,
 *   summary: string,
 *   purchaseProbability: number,
 *   recommendedProduct: string
 * }>} The parsed or fallback structured analysis data.
 */
export const generateAiResponse = async (
  prompt,
  customerContext = ""
) => {
  const defaultData = {
    reply: "We're experiencing high traffic right now. Please try again shortly.",
    leadScore: 50,
    intent: "Unknown",
    sentiment: "Neutral",
    priority: "Medium",
    summary: "",
    purchaseProbability: 50,
    recommendedProduct: ""
  };

  try {
    const systemPrompt = `
You are a professional AI Sales Assistant and Conversation Intelligence Analyst for SalesPilot-AI (a WhatsApp CRM).
Your role is twofold:
1. Act as an assistant to formulate a helpful, professional, and conversational reply to the customer's WhatsApp message. Keep the reply natural, polite, and direct (tailored for WhatsApp chats).
2. Act as a CRM analyst to extract key business intelligence fields from the conversation.

You MUST respond ONLY with a valid JSON object matching the following structure:
{
  "reply": "Conversational, professional response directly to the customer in natural language",
  "leadScore": (Number between 0 and 100 representing their buying readiness/urgency based on budget, need, timeline, or decision power),
  "intent": "Short phrase summarizing the customer's intent, e.g., 'Product Inquiry', 'Pricing Inquiry', 'Demo Request', 'Support', 'Spam', 'Unknown'",
  "sentiment": "The sentiment of the customer, e.g., 'Positive', 'Neutral', 'Negative'",
  "priority": "Sales follow-up priority: 'Low', 'Medium', 'High'",
  "summary": "A concise one-sentence summary of the customer's interest/need.",
  "purchaseProbability": (Number between 0 and 100 representing probability of closing a sale),
  "recommendedProduct": "Specifically identified or recommended product based on their needs, or empty string if none"
}

Ensure the response is strict JSON. Do not write any markdown formatting, preamble, or text other than the JSON object.
`;

    const finalPrompt = `
System Instructions:
${systemPrompt}

Customer Context:
${customerContext}

Customer Message:
${prompt}
`;

    console.log("Querying Gemini for conversation analysis...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    console.log("Received structured response from Gemini.");

    const rawText = response.text || "";
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText.trim());
    } catch (parseError) {
      console.error("Gemini output parsing failed. Raw response text was:", rawText);
      // Try extracting JSON using regex if JSON.parse fails (failsafe)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResult = JSON.parse(jsonMatch[0].trim());
        } catch (e) {
          throw new Error("Unable to parse extracted JSON block.");
        }
      } else {
        throw parseError;
      }
    }

    return { ...defaultData, ...parsedResult };
  } catch (error) {
    console.error("Gemini Error:", error.message);
    
    // In case of timeout or rate limit, generate a basic reply fallback
    let fallbackReply = defaultData.reply;
    try {
      // Basic text generation call to get a simple fallback text reply if possible
      const basicResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Reply politely to this customer message: "${prompt}"`
      });
      if (basicResponse.text) {
        fallbackReply = basicResponse.text.trim();
      }
    } catch (fallbackError) {
      console.error("Fallback text generation failed too:", fallbackError.message);
    }

    return {
      ...defaultData,
      reply: fallbackReply
    };
  }
};