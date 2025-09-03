const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


const app = express()
const http = require('http')
const setupSocket = require('./socket')
const server = http.createServer(app)

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-system')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/teacher', require('./routes/teacher'))
app.use('/api/student', require('./routes/student'))

// Setup Socket.io
setupSocket(server)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})