import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Route imports
import customerRoutes from './routes/customerRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import whatsappRoutes from './routes/whatsappRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Middleware imports
import errorHandler from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    message: 'WhatsApp Sales Assistant backend foundation is healthy.'
  })
})

// Route mounting
app.use('/api/customers', customerRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Fallback path handler for undefined routes
app.use((req, res, next) => {
  res.status(404)
  const error = new Error(`Not Found - Path: ${req.originalUrl}`)
  next(error)
})

// Global Centralized Error Middleware
app.use(errorHandler)

export default app
