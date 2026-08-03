import Chat from '../models/Chat.js'

/**
 * Saves a WhatsApp message to the MongoDB database.
 * @param {string} phoneNumber The customer's WhatsApp phone number
 * @param {'user' | 'assistant'} sender The sender type ('user' for customer, 'assistant' for AI reply)
 * @param {string} message The text content of the message
 * @returns {Promise<object>} The saved chat document from MongoDB
 */
export const saveMessage = async (phoneNumber, sender, message) => {
  try {
    if (!phoneNumber || !sender || !message) {
      throw new Error('Missing parameters for saving message')
    }

    const newChat = await Chat.create({
      phoneNumber,
      sender,
      message
    })

    console.log(`[Chat Database]: Message saved successfully for ${phoneNumber} (${sender})`)
    return newChat
  } catch (error) {
    console.error(`[Chat Service Error]: Failed to save message. Details: ${error.message}`)
    throw error
  }
}
