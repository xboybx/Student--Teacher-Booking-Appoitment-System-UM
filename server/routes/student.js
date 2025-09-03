const express = require('express')
const User = require('../models/User')
const Appointment = require('../models/Appointment')
const Message = require('../models/Message')
const auth = require('../middleware/auth')
const studentAuth = require('../middleware/studentAuth')

const router = express.Router()

// Get all approved teachers
router.get('/teachers', auth, studentAuth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', approved: true })
      .select('-password')
    res.json(teachers)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get student's appointments
router.get('/appointments', auth, studentAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate('teacher', 'name email subject')
      .sort({ createdAt: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Book appointment
router.post('/appointments', auth, studentAuth, async (req, res) => {
  try {
    const { teacher, date, subject, message } = req.body

    const appointment = new Appointment({
      student: req.user.id,
      teacher,
      date,
      subject,
      message
    })

    await appointment.save()
    res.status(201).json({ message: 'Appointment booked successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Send message to teacher
router.post('/messages', auth, studentAuth, async (req, res) => {
  try {
    const { teacher, subject, message } = req.body

    const newMessage = new Message({
      sender: req.user.id,
      recipient: teacher,
      subject,
      message
    })

    await newMessage.save()
    res.status(201).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router