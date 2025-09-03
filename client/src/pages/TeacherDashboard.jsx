import React, { useState, useEffect } from "react";
import ChatInterface from "../components/ChatInterface";
import VideoCall from "../components/VideoCall";
import {
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoCallInitiator, setVideoCallInitiator] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [appointmentsRes, messagesRes] = await Promise.all([
        api.get("/api/teacher/appointments", { headers }),
        api.get("/api/teacher/messages", { headers }),
      ]);

      setAppointments(appointmentsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/teacher/appointments/${appointmentId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating appointment:", error);
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
            Teacher Dashboard
          </h1>
          <p className="text-gray-200">Manage your appointments and messages</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="glass-morphism p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {appointments.length}
            </h3>
            <p className="text-gray-200">Total Appointments</p>
          </div>
          <div className="glass-morphism p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {appointments.filter((a) => a.status === "pending").length}
            </h3>
            <p className="text-gray-200">Pending</p>
          </div>
          <div className="glass-morphism p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {appointments.filter((a) => a.status === "approved").length}
            </h3>
            <p className="text-gray-200">Approved</p>
          </div>
          <div className="glass-morphism p-6 text-center">
            <MessageSquare className="h-8 w-8 text-purple-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{messages.length}</h3>
            <p className="text-gray-200">Messages</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-morphism p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "appointments"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "messages"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Messages
            </button>
          </div>

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">
                Appointment Requests
              </h2>
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white bg-opacity-20 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {appointment.student?.name}
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
                      {appointment.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "approved"
                              )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "rejected"
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">
                Student Messages
              </h2>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className="bg-white bg-opacity-20 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {message.sender?.name}
                      </h3>
                      <p className="text-gray-200">{message.subject}</p>
                      <p className="text-gray-300 text-sm">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-white bg-opacity-10 rounded">
                    <p className="text-gray-200">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Interface */}
        {chatOpen && selectedAppointment && (
          <ChatInterface
            isOpen={chatOpen}
            onClose={closeChat}
            appointmentId={selectedAppointment._id}
            otherUser={selectedAppointment.student}
            currentUser={user}
          />
        )}
        {/* Video Call Modal */}
        {videoCallOpen && selectedAppointment && (
          <VideoCall
            isOpen={videoCallOpen}
            onClose={closeVideoCall}
            appointmentId={selectedAppointment._id}
            otherUser={selectedAppointment.student}
            currentUser={user}
            isInitiator={videoCallInitiator}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
