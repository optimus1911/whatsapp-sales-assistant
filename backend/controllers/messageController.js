import Message from '../models/Message.js'
import Customer from '../models/Customer.js'

// @desc    Get messages for a specific customer
// @route   GET /api/messages/:customerId
// @access  Public
export const getMessagesByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params
    
    // Check if customer exists
    const customerExists = await Customer.findById(customerId)
    if (!customerExists) {
      res.status(404)
      throw new Error(`Customer not found with ID ${customerId}`)
    }

    const messages = await Message.find({ customerId }).sort({ timestamp: 1 })
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Send/Post a new message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res, next) => {
  try {
    const { customerId, sender, message } = req.body

    if (!customerId || !sender || !message) {
      res.status(400)
      throw new Error('Please provide customerId, sender, and message text')
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId)
    if (!customer) {
      res.status(404)
      throw new Error(`Customer not found with ID ${customerId}`)
    }

    // Create the message
    const newMessage = await Message.create({
      customerId,
      sender,
      message,
      status: sender === 'customer' ? 'read' : 'sent' // AI outgoing starts as sent
    })

    // Update the customer's last message tracker
    customer.lastMessage = message
    await customer.save()

    res.status(201).json({
      success: true,
      data: newMessage
    })
  } catch (error) {
    next(error)
  }
}
