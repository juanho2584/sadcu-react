/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor global
export const AuthProvider = ({ children }) => {
  // Inicializar usuario desde localStorage para evitar flash de login
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    // Usuarios iniciales
    const initialUsers = [
      {
        username: "facu",
        password: "Admin123+",
        nombre: "Facundo",
        apellido: "Caceres",
        dni: "12898081",
        email: "admin@sistema.com",
        telefono: "",
        role: "admin",
        fechaRegistro: new Date().toISOString(),
      },
      {
        username: "juancho",
        password: "Admin124+",
        nombre: "Juan",
        apellido: "Pinto",
        dni: "12898081",
        email: "admin@sistema.com",
        telefono: "",
        role: "admin",
        fechaRegistro: new Date().toISOString(),
      },
    ];

    // Recuperar usuarios registrados de localStorage
    const savedUsers = localStorage.getItem("registeredUsers");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Función de registro
  const register = (userData) => {
    // Verificar si el usuario ya existe
    const userExists = registeredUsers.some(
      (user) =>
        user.username === userData.username || user.email === userData.email
    );

    if (userExists) {
      return {
        success: false,
        message: "El usuario o email ya están registrados",
      };
    }

    // Verificar si el DNI ya existe
    const dniExists = registeredUsers.some((user) => user.dni === userData.dni);

    if (dniExists) {
      return { success: false, message: "El DNI ya está registrado" };
    }

    // Crear nuevo usuario con rol de alumno
    const newUser = {
      ...userData,
      role: "alumno",
      fechaRegistro: new Date().toISOString(),
      activo: true,
    };

    // Agregar a la lista de usuarios
    setRegisteredUsers((prev) => [...prev, newUser]);

    return {
      success: true,
      message: "Registro exitoso. Ahora puedes iniciar sesión",
    };
  };

  // Función de login (ahora asíncrona para buscar en JSON si es necesario)
  const login = async (username, password) => {
    // 1. Buscar en usuarios ya cargados en memoria (admins o alumnos previos)
    let foundUser = registeredUsers.find(
      (user) => user.username === username && user.password === password
    );

    // 2. Si no se encuentra, intentar buscar en alumnos.json
    if (!foundUser) {
      try {
        console.log("DEBUG: Iniciando búsqueda en alumnos.json para:", username); 
        const response = await fetch('/data/alumnos.json');
        console.log("DEBUG: Fetch status:", response.status);
        
        if (response.ok) {
          const alumnosJson = await response.json();
          console.log("DEBUG: JSON cargado. Cantidad:", alumnosJson.length);
          
          foundUser = alumnosJson.find(
            (user) => user.username === username && user.password === password
          );
          
          if (foundUser) {
             console.log("DEBUG: Usuario ENCONTRADO:", foundUser.username);
             setRegisteredUsers((prev) => {
               if (prev.some(u => u.username === foundUser.username)) return prev;
               return [...prev, foundUser];
             });
          } else {
             console.log("DEBUG: Usuario NO encontrado en JSON. Buscaba:", username, "con pass:", password);
             // Log de nombres disponibles para ver si hay mismatch
             console.log("DEBUG: Nombres disponibles:", alumnosJson.map(u => u.username));
          }
        } else {
            console.error("DEBUG: Error en fetch:", response.statusText);
        }
      } catch (error) {
        console.error("DEBUG: Excepción buscando en alumnos.json:", error);
      }
    }

    if (foundUser) {
      // Crear objeto de sesión sin la contraseña
      const { password: _, ...userSession } = foundUser;
      setUser(userSession);
      localStorage.setItem("user", JSON.stringify(userSession));
      return { success: true, user: userSession };
    }

    return { success: false, message: "Usuario o contraseña incorrectos" };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Obtener todos los alumnos (para el panel admin)
  const getAlumnos = () => {
    return registeredUsers.filter((user) => user.role === "alumno");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getAlumnos,
        registeredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
