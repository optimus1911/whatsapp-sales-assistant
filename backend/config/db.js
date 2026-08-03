import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp_sales_assistant')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(error)
    // Exit process with failure code
    process.exit(1)
  }
}

export default connectDB
