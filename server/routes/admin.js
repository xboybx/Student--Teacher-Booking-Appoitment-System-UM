const express = require('express')
const User = require('../models/User')
const Appointment = require('../models/Appointment')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

const router = express.Router()

// Get all teachers
router.get('/teachers', auth, adminAuth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password')
    res.json(teachers)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all students
router.get('/students', auth, adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password')
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all appointments
router.get('/appointments', auth, adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('student', 'name email')
      .populate('teacher', 'name email subject')
      .sort({ createdAt: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Approve student
router.put('/students/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' })
    }

    student.approved = true
    await student.save()

    res.json({ message: 'Student approved successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete teacher
router.delete('/teachers/:id', auth, adminAuth, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id)
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Teacher deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router