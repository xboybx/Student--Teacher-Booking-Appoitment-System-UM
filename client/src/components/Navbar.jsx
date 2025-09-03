import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, BookOpen } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    switch (user.role) {
      case 'admin': return '/admin'
      case 'teacher': return '/teacher'
      case 'student': return '/student'
      default: return '/'
    }
  }

  return (
    <nav className="glass-morphism m-4 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">EduBooking</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="text-white hover:text-blue-200 transition-colors duration-300 flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <span className="text-white text-sm">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-200 transition-colors duration-300 flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-200 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar