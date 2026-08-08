import { generateAiResponse } from './geminiService.js';

/**
 * Analyzes the customer conversation and returns AI predictions.
 * Calls Gemini directly to retrieve structured intelligence.
 *
 * @param {string} prompt The latest customer message text.
 * @param {string} [customerContext=""] Historical or profile context of the customer.
 * @returns {Promise<{
 *   reply: string,
 *   leadScore: number,
 *   intent: string,
 *   sentiment: string,
 *   priority: string,
 *   summary: string,
 *   purchaseProbability: number,
 *   recommendedProduct: string
 * }>} Consolidated analysis and reply.
 */
export const analyzeConversation = async (prompt, customerContext = "") => {
  return await generateAiResponse(prompt, customerContext);
};
