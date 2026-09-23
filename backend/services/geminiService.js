import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const GEMINI_MAX_RETRIES = Number.parseInt(process.env.GEMINI_MAX_RETRIES || "2", 10);
const GEMINI_RETRY_BASE_DELAY_MS = Number.parseInt(
  process.env.GEMINI_RETRY_BASE_DELAY_MS || "500",
  10
);
const GEMINI_RETRY_MAX_DELAY_MS = Number.parseInt(
  process.env.GEMINI_RETRY_MAX_DELAY_MS || "5000",
  10
);
const GEMINI_FALLBACK_RESPONSE =
  "I'm unable to prepare an accurate response right now. Please try again shortly.";

const RETRYABLE_NETWORK_CODES = new Set([
  "ECONNABORTED",
  "ECONNRESET",
  "ENETUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN"
]);

const getErrorStatus = (error) => {
  const status =
    error?.status ??
    error?.response?.status ??
    error?.error?.code ??
    error?.code ??
    error?.cause?.status;

  const numericStatus = Number(status);
  return Number.isInteger(numericStatus) ? numericStatus : undefined;
};

const getErrorCode = (error) =>
  error?.error?.status ||
  error?.statusText ||
  (typeof error?.status === "string" ? error.status : undefined) ||
  (typeof error?.code === "string" ? error.code : undefined) ||
  "UNKNOWN";

const sanitizeErrorMessage = (message = "Unknown Gemini error") =>
  String(message)
    .replace(/([?&]key=)[^&\s]+/gi, "$1[redacted]")
    .replace(/(Bearer\s+)[^\s]+/gi, "$1[redacted]")
    .replace(/(api[\s_-]?key[=:]\s*)[^\s,]+/gi, "$1[redacted]");

const isDailyQuotaExhausted = (error, message) => {
  const errorText = [
    message,
    error?.error?.message,
    error?.response?.data?.error?.message
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    /daily|per day|requests per day|rpd/.test(errorText) &&
    /quota|limit|exhaust|resource_exhausted/.test(errorText)
  );
};

const getRetryAfterMs = (error) => {
  const retryAfter =
    error?.response?.headers?.["retry-after"] ??
    error?.response?.headers?.get?.("retry-after") ??
    error?.headers?.["retry-after"] ??
    error?.headers?.get?.("retry-after");

  if (!retryAfter) return undefined;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);

  const timestamp = Date.parse(retryAfter);
  return Number.isNaN(timestamp) ? undefined : Math.max(0, timestamp - Date.now());
};

const isRetryableError = (error, status, code) =>
  status === 429 ||
  (status !== undefined && status >= 500 && status <= 599) ||
  ["ABORTED", "DEADLINE_EXCEEDED", "INTERNAL", "RESOURCE_EXHAUSTED", "UNAVAILABLE"].includes(code) ||
  RETRYABLE_NETWORK_CODES.has(code) ||
  Boolean(error?.cause?.code && RETRYABLE_NETWORK_CODES.has(error.cause.code));

const getRetryDelayMs = (error, attempt, random = Math.random) => {
  const retryAfterMs = getRetryAfterMs(error);
  if (retryAfterMs !== undefined) return retryAfterMs;

  const exponentialDelay = Math.min(
    GEMINI_RETRY_MAX_DELAY_MS,
    GEMINI_RETRY_BASE_DELAY_MS * (2 ** attempt)
  );
  return Math.round(exponentialDelay * (0.5 + random()));
};

export const generateAiResponse = async (
  prompt,
  customerContext = "",
  options = {}
) => {
  const {
    generateContent = (request) => ai.models.generateContent(request),
    maxRetries = GEMINI_MAX_RETRIES,
    sleep = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs)),
    random = Math.random
  } = options;

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

    const request = {
      model: GEMINI_MODEL,
      contents: finalPrompt,
    };

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await generateContent(request);
        const responseText = response?.text?.trim();

        if (!responseText) {
          console.error("Gemini returned empty text; using fallback response.");
          return GEMINI_FALLBACK_RESPONSE;
        }

        console.log("Gemini request succeeded with non-empty text.");
        return responseText;
      } catch (error) {
        const status = getErrorStatus(error);
        const code = getErrorCode(error);
        const message = sanitizeErrorMessage(error?.message);
        const dailyQuotaExhausted = isDailyQuotaExhausted(error, message);
        const retryable = !dailyQuotaExhausted && isRetryableError(error, status, code);

        console.error(
          `Gemini API error: status=${status ?? "unknown"} code=${code} quota=${dailyQuotaExhausted ? "daily-exhausted" : "not-daily-exhausted"} attempt=${attempt + 1} message=${message}`
        );

        if (!retryable || attempt === maxRetries) {
          console.error("Gemini request will not be retried; using fallback response.");
          return GEMINI_FALLBACK_RESPONSE;
        }

        const delayMs = getRetryDelayMs(error, attempt, random);
        console.log(`Gemini retry scheduled in ${delayMs}ms.`);
        await sleep(delayMs);
      }
    }

  } catch (error) {
    console.error(
      "Gemini request setup failed; using fallback response:",
      sanitizeErrorMessage(error?.message)
    );

    return GEMINI_FALLBACK_RESPONSE;
  }
};

