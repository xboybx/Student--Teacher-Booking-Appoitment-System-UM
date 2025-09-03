import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MessageCircle, Clock } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with teachers quickly and efficiently'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Separate dashboards for admins, teachers, and students'
    },
    {
      icon: MessageCircle,
      title: 'Messaging System',
      description: 'Communicate directly with teachers about appointments'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about appointment status'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Section */}
        <div className="glass-morphism p-8 mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">
            Student-Teacher
            <span className="text-yellow-300"> Booking System</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            A modern, efficient way to schedule appointments between students and teachers. 
            Streamline your educational interactions with our intuitive platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {features.map((feature, index) => (
            <div key={index} className="glass-morphism p-6 card-hover">
              <feature.icon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="glass-morphism p-8 mt-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Register</h3>
              <p className="text-gray-200">Sign up as a student or teacher with your credentials</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search & Book</h3>
              <p className="text-gray-200">Find teachers by subject and book appointments</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect</h3>
              <p className="text-gray-200">Meet with teachers and achieve your learning goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home