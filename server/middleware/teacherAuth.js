const teacherAuth = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Teacher only.' })
  }
  next()
}

module.exports = teacherAuth