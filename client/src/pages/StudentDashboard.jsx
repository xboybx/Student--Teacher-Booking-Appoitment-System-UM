import React, { useState, useEffect } from "react";
import ChatInterface from "../components/ChatInterface";
import VideoCall from "../components/VideoCall";
import {
  Search,
  Calendar,
  MessageSquare,
  Send,
  Plus,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoCallInitiator, setVideoCallInitiator] = useState(false);
  const { user } = useAuth();

  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    subject: "",
    message: "",
  });

  const [messageForm, setMessageForm] = useState({
    teacher: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [teachersRes, appointmentsRes] = await Promise.all([
        api.get("/api/student/teachers", { headers }),
        api.get("/api/student/appointments", { headers }),
      ]);

      setTeachers(teachersRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const appointmentData = {
        teacher: selectedTeacher._id,
        date: new Date(`${bookingForm.date}T${bookingForm.time}`),
        subject: bookingForm.subject,
        message: bookingForm.message,
      };

      await api.post("/api/student/appointments", appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowBookingModal(false);
      setBookingForm({ date: "", time: "", subject: "", message: "" });
      fetchData();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/api/student/messages", messageForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowMessageModal(false);
      setMessageForm({ teacher: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const openChat = (appointment) => {
    setSelectedAppointment(appointment);
    setChatOpen(true);
  };

  const openVideoCall = (appointment) => {
    setSelectedAppointment(appointment);
    setVideoCallOpen(true);
    setVideoCallInitiator(true);
  };

  const closeVideoCall = () => {
    setVideoCallOpen(false);
    setVideoCallInitiator(false);
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedAppointment(null);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-morphism p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-200">Find teachers and book appointments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-morphism p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {appointments.length}
            </h3>
            <p className="text-gray-200">My Appointments</p>
          </div>
          <div className="glass-morphism p-6 text-center">
            <Search className="h-8 w-8 text-green-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{teachers.length}</h3>
            <p className="text-gray-200">Available Teachers</p>
          </div>
          <div className="glass-morphism p-6 text-center">
            <MessageSquare className="h-8 w-8 text-purple-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {appointments.filter((a) => a.status === "approved").length}
            </h3>
            <p className="text-gray-200">Approved</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-morphism p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "search"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Search Teachers
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "appointments"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              Send Message
            </button>
          </div>

          {/* Search Teachers Tab */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">Find Teachers</h2>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, subject, or department"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="bg-white bg-opacity-20 rounded-lg p-4 card-hover"
                  >
                    <h3 className="font-semibold text-white mb-2">
                      {teacher.name}
                    </h3>
                    <p className="text-gray-200">{teacher.department}</p>
                    <p className="text-gray-300 text-sm">{teacher.subject}</p>
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setShowBookingModal(true);
                      }}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors w-full"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">
                My Appointments
              </h2>
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white bg-opacity-20 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {appointment.teacher?.name}
                      </h3>
                      <p className="text-gray-200">{appointment.subject}</p>
                      <p className="text-gray-300 text-sm">
                        {new Date(appointment.date).toLocaleString()}
                      </p>
                      {appointment.message && (
                        <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                          <p className="text-gray-200 text-sm">
                            {appointment.message}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          appointment.status === "approved"
                            ? "bg-green-500"
                            : appointment.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } text-white`}
                      >
                        {appointment.status}
                      </span>
                      {appointment.status === "approved" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openChat(appointment)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>Chat</span>
                          </button>
                          <button
                            onClick={() => openVideoCall(appointment)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Video Call</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass-morphism p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                Book Appointment with {selectedTeacher?.name}
              </h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, time: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={bookingForm.subject}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        subject: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message (optional)"
                    value={bookingForm.message}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        message: e.target.value,
                      })
                    }
                    className="input-field h-24 resize-none"
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex-1">
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="glass-morphism p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                Send Message
              </h2>
              <form onSubmit={handleMessage} className="space-y-4">
                <div>
                  <select
                    value={messageForm.teacher}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        teacher: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={messageForm.subject}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        subject: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    value={messageForm.message}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        message: e.target.value,
                      })
                    }
                    className="input-field h-32 resize-none"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex-1">
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {chatOpen && selectedAppointment && (
          <ChatInterface
            isOpen={chatOpen}
            onClose={closeChat}
            appointmentId={selectedAppointment._id}
            otherUser={selectedAppointment.teacher}
            currentUser={user}
          />
        )}
        {/* Video Call Modal */}
        {videoCallOpen && selectedAppointment && (
          <VideoCall
            isOpen={videoCallOpen}
            onClose={closeVideoCall}
            appointmentId={selectedAppointment._id}
            otherUser={selectedAppointment.teacher}
            currentUser={user}
            isInitiator={videoCallInitiator}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
