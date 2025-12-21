/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../utils/supabase";

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor global
export const AuthProvider = ({ children }) => {
  // Inicializar usuario desde localStorage para evitar flash de login (sesión persistente básica)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios de Supabase al montar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching users from Supabase...");
      const { data, error } = await supabase.from("usuarios").select("*");

      if (error) throw error;
      console.log(`Fetched ${data?.length || 0} users successfully.`);
      setRegisteredUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función de registro con Supabase
  const register = useCallback(async (userData) => {
    try {
      // Verificar si el usuario ya existe (DNI, Email o Username)
      const { data: duplicates, error: checkError } = await supabase
        .from("usuarios")
        .select("username, email, dni")
        .or(
          `username.eq.${userData.username},email.eq.${userData.email},dni.eq.${userData.dni}`
        );

      if (checkError) throw checkError;

      if (duplicates && duplicates.length > 0) {
        const existing = duplicates[0];
        let message = "El usuario ya está registrado";
        if (existing.email === userData.email)
          message = `El email "${userData.email}" ya está registrado`;
        if (existing.dni === userData.dni)
          message = `El DNI "${userData.dni}" ya está registrado`;
        if (existing.username === userData.username)
          message = `El nombre de usuario "${userData.username}" ya está registrado`;
        return { success: false, message };
      }

      // Crear nuevo usuario con rol de alumno
      const newUser = {
        ...userData,
        role: "alumno",
        activo: true,
        // No enviamos fechaRegistro ni created_at, dejamos que Supabase lo maneje por defecto
      };

      const { data, error } = await supabase
        .from("usuarios")
        .insert([newUser])
        .select();

      if (error) throw error;

      // Actualizar lista local
      setRegisteredUsers((prev) => [...prev, data[0]]);

      return {
        success: true,
        message: "Registro exitoso. Ahora puedes iniciar sesión",
      };
    } catch (error) {
      console.error("Error in register:", error.message);
      return {
        success: false,
        message: "Error al registrar: " + error.message,
      };
    }
  }, []);

  // Función de login con Supabase
  const login = useCallback(async (username, password) => {
    try {
      const { data: foundUser, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("username", username)
        .eq("password", password) // Nota: En producción usar auth.signIn y contraseñas hasheadas
        .single();

      if (error || !foundUser) {
        return { success: false, message: "Usuario o contraseña incorrectos" };
      }

      if (!foundUser.activo) {
        return { success: false, message: "Tu cuenta está desactivada" };
      }

      // Crear objeto de sesión sin la contraseña
      const { password: _, ...userSession } = foundUser;
      setUser(userSession);
      localStorage.setItem("user", JSON.stringify(userSession));
      return { success: true, user: userSession };
    } catch (error) {
      console.error("Error in login:", error.message);
      return { success: false, message: "Error al iniciar sesión" };
    }
  }, []);

  // Función para actualizar usuario
  const updateUser = useCallback(
    async (id, userData) => {
      try {
        const { data, error } = await supabase
          .from("usuarios")
          .update(userData)
          .eq("id", id)
          .select();

        if (error) throw error;

        const updatedUser = data[0];

        // Actualizar lista local
        setRegisteredUsers((prev) =>
          prev.map((u) => (u.id === id ? updatedUser : u))
        );

        // Si el usuario actualizado es el actual, actualizar el estado y localStorage
        if (user && user.id === id) {
          const { password: _, ...userSession } = updatedUser;
          setUser(userSession);
          localStorage.setItem("user", JSON.stringify(userSession));
        }

        return { success: true, message: "Usuario actualizado correctamente" };
      } catch (error) {
        console.error("Error updating user:", error.message);
        return {
          success: false,
          message: "Error al actualizar: " + error.message,
        };
      }
    },
    [user]
  );

  // Función para eliminar usuario
  const deleteUser = useCallback(async (id) => {
    try {
      const { error } = await supabase.from("usuarios").delete().eq("id", id);

      if (error) throw error;

      // Actualizar lista local
      setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));

      return { success: true, message: "Usuario eliminado correctamente" };
    } catch (error) {
      console.error("Error deleting user:", error.message);
      return { success: false, message: "Error al eliminar: " + error.message };
    }
  }, []);

  // Función para verificar disponibilidad de campo (para validación en tiempo real)
  const checkAvailability = useCallback(async (field, value) => {
    if (!value) return true;
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select(field)
        .eq(field, value)
        .limit(1);

      if (error) throw error;
      return data.length === 0; // true si está disponible
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error.message);
      return true; // En caso de error, asumir disponible para no bloquear
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  // Obtener todos los alumnos (para el panel admin)
  const getAlumnos = useCallback(() => {
    return registeredUsers.filter((u) => u.role === "alumno");
  }, [registeredUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getAlumnos,
        registeredUsers,
        loading,
        fetchUsers,
        updateUser,
        deleteUser,
        checkAvailability,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
