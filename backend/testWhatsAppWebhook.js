import assert from 'node:assert/strict'
import {
  clearProcessedMessageIds,
  handleWebhook
} from './controllers/whatsappController.js'

const createResponse = () => ({
  statusCode: 200,
  sendStatus(statusCode) {
    this.statusCode = statusCode
    return this
  }
})

const createTextPayload = (id) => ({
  object: 'whatsapp_business_account',
  entry: [{
    changes: [{
      value: {
        contacts: [{ profile: { name: 'Test Customer' } }],
        messages: [{ id, from: '15550000000', text: { body: 'hello' } }]
      }
    }]
  }]
})

const createStatusPayload = () => ({
  object: 'whatsapp_business_account',
  entry: [{
    changes: [{
      value: {
        statuses: [{ id: 'wamid.status', status: 'delivered' }]
      }
    }]
  }]
})

const run = async () => {
  clearProcessedMessageIds()
  let processCalls = 0
  let sendCalls = 0
  let savedMessages = 0
  const dependencies = {
    updateCustomer: async () => {},
    persistMessage: async () => { savedMessages += 1 },
    processText: async () => {
      processCalls += 1
      return { response: 'mock reply' }
    },
    sendMessage: async () => { sendCalls += 1 }
  }

  const firstResponse = createResponse()
  await handleWebhook({ body: createTextPayload('wamid.duplicate-test') }, firstResponse, () => {}, dependencies)
  const duplicateResponse = createResponse()
  await handleWebhook({ body: createTextPayload('wamid.duplicate-test') }, duplicateResponse, () => {}, dependencies)

  assert.equal(firstResponse.statusCode, 200)
  assert.equal(duplicateResponse.statusCode, 200)
  assert.equal(processCalls, 1)
  assert.equal(sendCalls, 1)
  assert.equal(savedMessages, 2)

  clearProcessedMessageIds()
  let releaseProcessing
  const processingReleased = new Promise((resolve) => { releaseProcessing = resolve })
  const concurrentDependencies = {
    ...dependencies,
    processText: async () => {
      processCalls += 1
      await processingReleased
      return { response: 'concurrent mock reply' }
    }
  }
  const firstConcurrent = handleWebhook(
    { body: createTextPayload('wamid.concurrent-test') },
    createResponse(),
    () => {},
    concurrentDependencies
  )
  const duplicateConcurrent = handleWebhook(
    { body: createTextPayload('wamid.concurrent-test') },
    createResponse(),
    () => {},
    concurrentDependencies
  )
  await duplicateConcurrent
  releaseProcessing()
  await firstConcurrent
  assert.equal(processCalls, 2)
  assert.equal(sendCalls, 2)

  const statusResponse = createResponse()
  await handleWebhook({ body: createStatusPayload() }, statusResponse, () => {}, dependencies)
  assert.equal(statusResponse.statusCode, 200)
  assert.equal(processCalls, 2)
  assert.equal(sendCalls, 2)

  console.log('WhatsApp webhook tests passed.')
}

run()