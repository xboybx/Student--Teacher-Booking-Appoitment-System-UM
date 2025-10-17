# Student-Teacher Booking Appointment System

A modern, full-stack web application for managing appointments between students and teachers in educational institutions.

[#*Preview*](https://student-teacher-booking-appoitment-24ut.onrender.com)
## 🚀 Features

### Admin Features
- **User Management**: Add, update, and delete teachers
- **Student Approval**: Approve student registrations
- **System Overview**: View all appointments and system statistics
- **Role-based Access Control**: Secure admin dashboard

### Teacher Features
- **Appointment Management**: View and manage appointment requests
- **Status Control**: Approve or reject student appointments
- **Message Center**: Receive and view messages from students
- **Dashboard Analytics**: Track appointment statistics

### Student Features
- **Teacher Search**: Find teachers by name, subject, or department
- **Appointment Booking**: Schedule appointments with available teachers
- **Message System**: Send messages to teachers
- **Appointment Tracking**: View appointment status and history

## 🛠️ Technologies Used

### Frontend
- **React.js** (without TypeScript)
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Development Tools
- **Vite** for fast development
- **Nodemon** for server auto-restart
- **Concurrently** for running multiple scripts

## 📁 Project Structure

```
student-teacher-booking-system/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   │   ├── Navbar.jsx      # Navigation component
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── contexts/          # React Context API
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Landing page
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   ├── TeacherDashboard.jsx  # Teacher dashboard
│   │   └── StudentDashboard.jsx  # Student dashboard
│   └── main.jsx           # Application entry point
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   │   ├── User.js        # User model (Admin/Teacher/Student)
│   │   ├── Appointment.js # Appointment model
│   │   └── Message.js     # Message model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── admin.js       # Admin-specific routes
│   │   ├── teacher.js     # Teacher-specific routes
│   │   └── student.js     # Student-specific routes
│   ├── middleware/        # Authentication middleware
│   │   ├── auth.js        # General authentication
│   │   ├── adminAuth.js   # Admin role verification
│   │   ├── teacherAuth.js # Teacher role verification
│   │   └── studentAuth.js # Student role verification
│   └── server.js          # Server entry point
├── public/                # Static assets
└── README.md             # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-teacher-booking-system.git
   cd student-teacher-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/booking-system
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For Windows (if MongoDB is installed as a service)
   net start MongoDB
   
   # For macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

5. **Start the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 🔐 User Authentication & Login Instructions

### Creating Admin Account

Since this is the first setup, you'll need to create an admin account manually:

**Method 1: Register as Admin (Recommended)**
1. Go to `http://localhost:5173/register`
2. Fill in the registration form:
   - **Name**: Your admin name
   - **Email**: Your admin email
   - **Role**: Select "Teacher" (we'll change this manually)
   - **Department**: Any department
   - **Subject**: Any subject
   - **Password**: Your secure password
3. After registration, you need to manually update the role in MongoDB:

```javascript
// Connect to MongoDB and run this command
use booking-system
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Method 2: Direct Database Insert**
```javascript
// Connect to MongoDB and run this command
use booking-system
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$hash_your_password_here", // Use bcrypt to hash
  role: "admin",
  department: "Administration",
  approved: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Login Instructions by Role

#### 🔑 Admin Login
1. **URL**: `http://localhost:5173/login`
2. **Credentials**: Use the admin email and password you created
3. **Dashboard Route**: After login, you'll be redirected to `/admin`
4. **Features Available**:
   - View all teachers and students
   - Approve pending student registrations
   - Delete teachers
   - View all appointments in the system
   - System statistics overview

#### 👨‍🏫 Teacher Login
1. **Registration**: 
   - Go to `http://localhost:5173/register`
   - Select "Teacher" as role
   - Fill in department and subject
   - Teachers are automatically approved
2. **Login**: 
   - URL: `http://localhost:5173/login`
   - Use teacher credentials
3. **Dashboard Route**: After login, redirected to `/teacher`
4. **Features Available**:
   - View appointment requests from students
   - Approve or reject appointments
   - View messages from students
   - Dashboard with appointment statistics

#### 👨‍🎓 Student Login
1. **Registration**: 
   - Go to `http://localhost:5173/register`
   - Select "Student" as role
   - Fill in department
   - **Note**: Students need admin approval before they can login
2. **Approval Process**:
   - Admin must approve the student from admin dashboard
   - Students cannot login until approved
3. **Login**: 
   - URL: `http://localhost:5173/login`
   - Use student credentials (only after approval)
4. **Dashboard Route**: After login, redirected to `/student`
5. **Features Available**:
   - Search for teachers by name, subject, or department
   - Book appointments with teachers
   - Send messages to teachers
   - View appointment history and status

## 🛣️ Application Routes

### Public Routes
- `/` - Home page (landing page)
- `/login` - Login page for all users
- `/register` - Registration page for new users

### Protected Routes (Require Authentication)

#### Admin Routes
- `/admin` - Admin dashboard
  - **Access**: Only users with role "admin"
  - **Features**: Teacher management, student approval, system overview

#### Teacher Routes
- `/teacher` - Teacher dashboard
  - **Access**: Only users with role "teacher"
  - **Features**: Appointment management, message viewing

#### Student Routes
- `/student` - Student dashboard
  - **Access**: Only users with role "student" AND approved status
  - **Features**: Teacher search, appointment booking, messaging

### API Routes

#### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

#### Admin Routes (`/api/admin`) - Requires Admin Role
- `GET /api/admin/teachers` - Get all teachers
- `GET /api/admin/students` - Get all students
- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/students/:id/approve` - Approve student
- `DELETE /api/admin/teachers/:id` - Delete teacher

#### Teacher Routes (`/api/teacher`) - Requires Teacher Role
- `GET /api/teacher/appointments` - Get teacher's appointments
- `PUT /api/teacher/appointments/:id` - Update appointment status
- `GET /api/teacher/messages` - Get teacher's messages

#### Student Routes (`/api/student`) - Requires Student Role
- `GET /api/student/teachers` - Get all approved teachers
- `GET /api/student/appointments` - Get student's appointments
- `POST /api/student/appointments` - Book appointment
- `POST /api/student/messages` - Send message

## 📱 User Roles & Permissions

### Admin
- **Full system access**
- **Teacher management**: Add, update, delete teachers
- **Student approval**: Approve/reject student registrations
- **System analytics**: View all appointments and statistics
- **No restrictions**: Can access all data

### Teacher
- **Appointment management**: View and respond to appointment requests
- **Message viewing**: Read messages from students
- **Status updates**: Approve or reject appointments
- **Personal dashboard**: View personal statistics
- **Automatic approval**: No admin approval needed for registration

### Student
- **Teacher search**: Find teachers by various criteria
- **Appointment booking**: Schedule appointments with teachers
- **Message sending**: Send messages to teachers
- **Appointment tracking**: View personal appointment history
- **Requires approval**: Must be approved by admin before login

## 🎨 Design Features

- **Modern UI/UX**: Clean, intuitive interface with glass morphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Subtle hover effects and transitions
- **Color System**: Professional gradient-based color scheme (Blue #3B82F6 to Purple #8B5CF6)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Glass Morphism**: Modern frosted glass effect for cards and modals

## 🔧 Development Workflow

### Starting Development
1. **Backend Development**: Start with `npm run server`
2. **Frontend Development**: Start with `npm run client`
3. **Full Development**: Use `npm run dev` for both

### Code Structure Guidelines
- **Modular Architecture**: Each component has a single responsibility
- **Separation of Concerns**: Frontend and backend are completely separate
- **Reusable Components**: Common UI elements are componentized
- **Protected Routes**: Role-based access control throughout the application

## 🧪 Testing

### Manual Testing Checklist

#### Admin Testing
- [ ] Admin can login with correct credentials
- [ ] Admin can view all teachers and students
- [ ] Admin can approve pending students
- [ ] Admin can delete teachers
- [ ] Admin can view all appointments

#### Teacher Testing
- [ ] Teacher can register and login immediately
- [ ] Teacher can view appointment requests
- [ ] Teacher can approve/reject appointments
- [ ] Teacher can view messages from students

#### Student Testing
- [ ] Student can register (but cannot login until approved)
- [ ] Student can login after admin approval
- [ ] Student can search for teachers
- [ ] Student can book appointments
- [ ] Student can send messages to teachers

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student","department":"Computer Science"}'

# Test user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider (Netlify, Vercel, etc.)
```

### Backend Deployment
- Configure environment variables on your hosting platform
- Set up MongoDB connection (MongoDB Atlas recommended for production)
- Deploy to platforms like Heroku, DigitalOcean, or AWS

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booking-system
JWT_SECRET=your_super_secure_jwt_secret_for_production
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

--