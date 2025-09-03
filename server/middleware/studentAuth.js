const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student only.' })
  }
  next()
}

module.exports = studentAuth