import assert from 'node:assert/strict'
import { processIncomingText } from './controllers/whatsappController.js'

const productMessages = [
  'HP 15s',
  'price of HP 15s',
  'HP Pavilion',
  'Dell Inspiron',
  'MacBook',
  'laptop under 80000'
]

const ordinaryMessages = [
  'hii',
  'hello',
  'what is your name',
  'oak',
  'cricket bat',
  'mrf cricket bat'
]

let geminiCalls = 0
const mockGemini = async (message) => {
  geminiCalls += 1
  return `mock response for ${message}`
}

for (const message of productMessages) {
  const result = await processIncomingText(message, mockGemini)

  assert.equal(result.path, 'gemini')
  assert.equal(result.geminiCalled, true)
  assert.equal(result.productLookup, false)
}

for (const message of ordinaryMessages) {
  const result = await processIncomingText(message, mockGemini)

  assert.equal(result.path, 'gemini')
  assert.equal(result.geminiCalled, true)
  assert.equal(result.productLookup, false)
}

assert.equal(geminiCalls, productMessages.length + ordinaryMessages.length)
console.log('WhatsApp routing test passed.')