import assert from 'node:assert/strict'
import { generateAiResponse } from './services/geminiService.js'

const fallback = "I'm unable to prepare an accurate response right now. Please try again shortly."
const requestOptions = {
  maxRetries: 2,
  sleep: async () => {},
  random: () => 0.5
}

const createError = (status, message, code) =>
  Object.assign(new Error(message), { status, code })

const run = async () => {
  let calls = 0
  const success = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async (request) => {
      calls += 1
      assert.equal(request.model, process.env.GEMINI_MODEL || 'gemini-3.8-flash')
      return { text: 'Hello from Gemini.' }
    }
  })
  assert.equal(success, 'Hello from Gemini.')
  assert.equal(calls, 1)

  calls = 0
  const recovered = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async () => {
      calls += 1
      if (calls === 1) throw createError(503, 'temporary overload', 'UNAVAILABLE')
      return { text: 'Recovered response.' }
    }
  })
  assert.equal(recovered, 'Recovered response.')
  assert.equal(calls, 2)

  calls = 0
  const repeated503 = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async () => {
      calls += 1
      throw createError(503, 'temporary overload', 'UNAVAILABLE')
    }
  })
  assert.equal(repeated503, fallback)
  assert.equal(calls, 3)

  calls = 0
  const rateLimited = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async () => {
      calls += 1
      throw createError(429, 'rate limited', 'RESOURCE_EXHAUSTED')
    }
  })
  assert.equal(rateLimited, fallback)
  assert.equal(calls, 3)

  calls = 0
  const invalidKey = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async () => {
      calls += 1
      throw createError(401, 'API key=secret-key is invalid', 'UNAUTHENTICATED')
    }
  })
  assert.equal(invalidKey, fallback)
  assert.equal(calls, 1)

  let retryAfterDelay
  calls = 0
  const retryAfterResponse = await generateAiResponse('hello', '', {
    ...requestOptions,
    sleep: async (delayMs) => {
      retryAfterDelay = delayMs
    },
    generateContent: async () => {
      calls += 1
      if (calls === 1) {
        throw Object.assign(createError(503, 'temporary overload', 'UNAVAILABLE'), {
          response: { headers: { 'retry-after': '2' } }
        })
      }
      return { text: 'Retry-After response.' }
    }
  })
  assert.equal(retryAfterResponse, 'Retry-After response.')
  assert.equal(retryAfterDelay, 2000)
  assert.equal(calls, 2)

  calls = 0
  const emptyResponse = await generateAiResponse('hello', '', {
    ...requestOptions,
    generateContent: async () => {
      calls += 1
      return { text: '   ' }
    }
  })
  assert.equal(emptyResponse, fallback)
  assert.equal(calls, 1)

  console.log('Gemini retry tests passed.')
}

run()