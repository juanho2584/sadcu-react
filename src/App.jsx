import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Alumno from "./pages/Alumno";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida Alumno */}
          <Route
            path="/alumno"
            element={
              <ProtectedRoute requiredRole="alumno">
                <Alumno />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
