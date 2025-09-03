import React, { useState, useEffect } from "react";
// import ChatDrawer from "../components/ChatDrawer";
import {
  Users,
  UserPlus,
  UserCheck,
  MessageSquare,
  Calendar,
} from "lucide-react";
import api from "../api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Chat feature removed

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [teachersRes, studentsRes, appointmentsRes] = await Promise.all([
        api.get("/api/admin/teachers", { headers }),
        api.get("/api/admin/students", { headers }),
        api.get("/api/admin/appointments", { headers }),
      ]);

      setTeachers(teachersRes);
      setStudents(studentsRes);
      setAppointments(appointmentsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/admin/students/${studentId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const deleteTeacher = async (teacherId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-morphism p-6 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-200">
              Manage teachers, students, and appointments
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="glass-morphism p-6 text-center">
              <Users className="h-8 w-8 text-blue-300 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {teachers.length}
              </h3>
              <p className="text-gray-200">Teachers</p>
            </div>
            <div className="glass-morphism p-6 text-center">
              <UserPlus className="h-8 w-8 text-green-300 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {students.length}
              </h3>
              <p className="text-gray-200">Students</p>
            </div>
            <div className="glass-morphism p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-300 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {appointments.length}
              </h3>
              <p className="text-gray-200">Appointments</p>
            </div>
            <div className="glass-morphism p-6 text-center">
              <UserCheck className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {students.filter((s) => !s.approved).length}
              </h3>
              <p className="text-gray-200">Pending Approvals</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="glass-morphism p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "teachers"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "students"
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Students
              </button>
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
            </div>

            {/* Teachers Tab */}
            {activeTab === "teachers" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">
                  Teachers Management
                </h2>
                {teachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="bg-white bg-opacity-20 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {teacher.name}
                      </h3>
                      <p className="text-gray-200">
                        {teacher.department} - {teacher.subject}
                      </p>
                      <p className="text-gray-300 text-sm">{teacher.email}</p>
                    </div>
                    <button
                      onClick={() => deleteTeacher(teacher._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">
                  Students Management
                </h2>
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="bg-white bg-opacity-20 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {student.name}
                      </h3>
                      <p className="text-gray-200">{student.department}</p>
                      <p className="text-gray-300 text-sm">{student.email}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          student.approved ? "bg-green-500" : "bg-yellow-500"
                        } text-white`}
                      >
                        {student.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    {!student.approved && (
                      <button
                        onClick={() => approveStudent(student._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">
                  All Appointments
                </h2>
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white bg-opacity-20 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">
                          {appointment.student?.name} →{" "}
                          {appointment.teacher?.name}
                        </h3>
                        <p className="text-gray-200">{appointment.subject}</p>
                        <p className="text-gray-300 text-sm">
                          {new Date(appointment.date).toLocaleString()}
                        </p>
                        {appointment.message && (
                          <p className="text-gray-200 text-sm mt-2">
                            {appointment.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
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
                        {/* Chat button removed */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ChatDrawer removed */}
    </>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// // import ChatDrawer from "../components/ChatDrawer";
// import {
//   Users,
//   UserPlus,
//   UserCheck,
//   MessageSquare,
//   Calendar,
// } from "lucide-react";
// import api from "../api";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [teachers, setTeachers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // Chat feature removed

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       const [teachersRes, studentsRes, appointmentsRes] = await Promise.all([
//         api.get("/api/admin/teachers", { headers }),
//         api.get("/api/admin/students", { headers }),
//         api.get("/api/admin/appointments", { headers }),
//       ]);

//       setTeachers(teachersRes.data);
//       setStudents(studentsRes.data);
//       setAppointments(appointmentsRes.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveStudent = async (studentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/api/admin/students/${studentId}/approve`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchData();
//     } catch (error) {
//       console.error("Error approving student:", error);
//     }
//   };

//   const deleteTeacher = async (teacherId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/api/admin/teachers/${teacherId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting teacher:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="glass-morphism p-6 mb-6">
//             <h1 className="text-3xl font-bold text-white mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-gray-200">
//               Manage teachers, students, and appointments
//             </p>
//           </div>

//           {/* Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//             <div className="glass-morphism p-6 text-center">
//               <Users className="h-8 w-8 text-blue-300 mx-auto mb-2" />
//               <h3 className="text-2xl font-bold text-white">
//                 {teachers.length}
//               </h3>
//               <p className="text-gray-200">Teachers</p>
//             </div>
//             <div className="glass-morphism p-6 text-center">
//               <UserPlus className="h-8 w-8 text-green-300 mx-auto mb-2" />
//               <h3 className="text-2xl font-bold text-white">
//                 {students.length}
//               </h3>
//               <p className="text-gray-200">Students</p>
//             </div>
//             <div className="glass-morphism p-6 text-center">
//               <Calendar className="h-8 w-8 text-purple-300 mx-auto mb-2" />
//               <h3 className="text-2xl font-bold text-white">
//                 {appointments.length}
//               </h3>
//               <p className="text-gray-200">Appointments</p>
//             </div>
//             <div className="glass-morphism p-6 text-center">
//               <UserCheck className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
//               <h3 className="text-2xl font-bold text-white">
//                 {students.filter((s) => !s.approved).length}
//               </h3>
//               <p className="text-gray-200">Pending Approvals</p>
//             </div>
//           </div>

//           {/* Navigation Tabs */}
//           <div className="glass-morphism p-6">
//             <div className="flex space-x-4 mb-6">
//               <button
//                 onClick={() => setActiveTab("teachers")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   activeTab === "teachers"
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Teachers
//               </button>
//               <button
//                 onClick={() => setActiveTab("students")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   activeTab === "students"
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Students
//               </button>
//               <button
//                 onClick={() => setActiveTab("appointments")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   activeTab === "appointments"
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Appointments
//               </button>
//             </div>

//             {/* Teachers Tab */}
//             {activeTab === "teachers" && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-white mb-4">
//                   Teachers Management
//                 </h2>
//                 {teachers.map((teacher) => (
//                   <div
//                     key={teacher._id}
//                     className="bg-white bg-opacity-20 rounded-lg p-4 flex justify-between items-center"
//                   >
//                     <div>
//                       <h3 className="font-semibold text-white">
//                         {teacher.name}
//                       </h3>
//                       <p className="text-gray-200">
//                         {teacher.department} - {teacher.subject}
//                       </p>
//                       <p className="text-gray-300 text-sm">{teacher.email}</p>
//                     </div>
//                     <button
//                       onClick={() => deleteTeacher(teacher._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Students Tab */}
//             {activeTab === "students" && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-white mb-4">
//                   Students Management
//                 </h2>
//                 {students.map((student) => (
//                   <div
//                     key={student._id}
//                     className="bg-white bg-opacity-20 rounded-lg p-4 flex justify-between items-center"
//                   >
//                     <div>
//                       <h3 className="font-semibold text-white">
//                         {student.name}
//                       </h3>
//                       <p className="text-gray-200">{student.department}</p>
//                       <p className="text-gray-300 text-sm">{student.email}</p>
//                       <span
//                         className={`inline-block px-2 py-1 rounded text-xs ${
//                           student.approved ? "bg-green-500" : "bg-yellow-500"
//                         } text-white`}
//                       >
//                         {student.approved ? "Approved" : "Pending"}
//                       </span>
//                     </div>
//                     {!student.approved && (
//                       <button
//                         onClick={() => approveStudent(student._id)}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
//                       >
//                         Approve
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Appointments Tab */}
//             {activeTab === "appointments" && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-white mb-4">
//                   All Appointments
//                 </h2>
//                 {appointments.map((appointment) => (
//                   <div
//                     key={appointment._id}
//                     className="bg-white bg-opacity-20 rounded-lg p-4"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-white">
//                           {appointment.student?.name} →{" "}
//                           {appointment.teacher?.name}
//                         </h3>
//                         <p className="text-gray-200">{appointment.subject}</p>
//                         <p className="text-gray-300 text-sm">
//                           {new Date(appointment.date).toLocaleString()}
//                         </p>
//                         {appointment.message && (
//                           <p className="text-gray-200 text-sm mt-2">
//                             {appointment.message}
//                           </p>
//                         )}
//                       </div>
//                       <div className="flex flex-col items-end gap-2">
//                         <span
//                           className={`px-2 py-1 rounded text-xs ${
//                             appointment.status === "approved"
//                               ? "bg-green-500"
//                               : appointment.status === "rejected"
//                               ? "bg-red-500"
//                               : "bg-yellow-500"
//                           } text-white`}
//                         >
//                           {appointment.status}
//                         </span>
//                         {/* Chat button removed */}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* ChatDrawer removed */}
//     </>
//   );
// };

// export default AdminDashboard;
