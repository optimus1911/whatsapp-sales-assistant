import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_FALLBACK_RESPONSE =
  "I'm unable to prepare an accurate response right now. Please try again shortly.";

export const generateAiResponse = async (
  prompt,
  customerContext = ""
) => {
  try {
    console.log("Gemini request started.");

    const finalPrompt = `
You are a professional AI Sales Assistant.

Customer Context:
${customerContext}

Customer Message:
${prompt}

Reply professionally, politely, and help the customer.
Do not invent product inventory, prices, specifications, stock, availability,
warranty, discounts, offers, delivery details, or variants.
No product catalog or policy database information has been supplied for this
request. For product or service questions requiring specific facts, say:
"I don't have enough specific information in our current product catalog or
policy database to answer that accurately. Would you like me to check our
available options?"
Do not claim that you checked a catalog or policy database when you did not.
`;

    console.log("Creating request...");

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: finalPrompt,
});

    const responseText = response?.text?.trim();

    if (!responseText) {
      console.error("Gemini returned empty text; using fallback response.");
      return GEMINI_FALLBACK_RESPONSE;
    }

    console.log("Gemini request succeeded with non-empty text.");
    return responseText;
  } catch (error) {
    console.error("Gemini request failed; using fallback response:", error.message);

    return GEMINI_FALLBACK_RESPONSE;
}
};

