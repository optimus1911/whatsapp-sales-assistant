import app from './app.js'
import connectDB from './config/db.js'

// Connect to MongoDB Database
connectDB()
import dotenv from "dotenv";
dotenv.config();

console.log("Gemini:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("Mongo :", process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌");
console.log("WA Token:", process.env.WHATSAPP_ACCESS_TOKEN ? "Loaded ✅" : "Missing ❌");

const PORT = process.env.PORT || 5000

// Initialize Server listener
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
