import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAiResponse = async (
  prompt,
  customerContext = ""
) => {
  try {
    const finalPrompt = `
You are a professional AI Sales Assistant.

Customer Context:
${customerContext}

Customer Message:
${prompt}

Reply professionally, politely, and help the customer.
`;

    console.log("Creating request...");

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: finalPrompt,
});

console.log("Received response");
console.log(response);

return response.text;
  } catch (error) {
  console.error("Gemini Error:");
  console.error(error);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);

  return "We're experiencing high traffic right now. Please try again shortly.";
}
};