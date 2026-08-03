import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: [true, 'Sender type is required']
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
)

// Indexing for faster history lookups based on phone number and timestamp
chatSchema.index({ phoneNumber: 1, createdAt: 1 })

const Chat = mongoose.model('Chat', chatSchema)
export default Chat
