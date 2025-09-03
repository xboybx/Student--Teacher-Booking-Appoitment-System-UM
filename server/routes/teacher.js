const express = require('express')
const Appointment = require('../models/Appointment')
const Message = require('../models/Message')
const auth = require('../middleware/auth')
const teacherAuth = require('../middleware/teacherAuth')

const router = express.Router()

// Get teacher's appointments
router.get('/appointments', auth, teacherAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ teacher: req.user.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update appointment status
router.put('/appointments/:id', auth, teacherAuth, async (req, res) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (appointment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    appointment.status = status
    await appointment.save()

    res.json({ message: 'Appointment updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get teacher's messages
router.get('/messages', auth, teacherAuth, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router