import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user info
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const data = await api.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.post("/api/auth/login", { email, password });
      const { token, user } = data;
      localStorage.setItem("token", token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.post("/api/auth/register", userData);
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useContext, useEffect } from "react";
// import api from "../api";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Verify token and get user info
//       verifyToken(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const verifyToken = async (token) => {
//     try {
//       const response = await api.get("/api/auth/verify", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(response.data.user);
//     } catch (error) {
//       localStorage.removeItem("token");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await api.post("/api/auth/login", { email, password });
//       const { token, user } = response.data;
//       localStorage.setItem("token", token);
//       setUser(user);
//       return { success: true, user };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await api.post("/api/auth/register", userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || "Registration failed",
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };
