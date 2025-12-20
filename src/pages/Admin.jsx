import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import Alumnos from "../components/Alumnos";

const Admin = () => {
  const {
    user,
    logout,
    registeredUsers,
    loading: authLoading,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useAuth();
  const { comentarios, eliminarComentario } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState("alumnos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  // Estado para edición
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const calcularEstadisticas = useCallback((alumnos) => {
    const alumnosFiltrados = alumnos.filter((a) => a.role === "alumno");
    const total = alumnosFiltrados.length;
    const activos = alumnosFiltrados.filter(
      (a) => a.activo === true || a.estado === "activo"
    ).length;

    setStats({
      total,
      activos,
      inactivos: total - activos,
    });
  }, []);

  const cargarDatosAlumnos = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (registeredUsers.length > 0) {
      calcularEstadisticas(registeredUsers);
    }
  }, [registeredUsers, calcularEstadisticas]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Recalcular estadísticas cuando cambian los usuarios
  useEffect(() => {
    if (registeredUsers.length > 0) {
      calcularEstadisticas(registeredUsers);
    }
  }, [registeredUsers, calcularEstadisticas]);

  // Handlers para CRUD
  const handleEditClick = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditFormData({ ...userToEdit });
    setShowEditModal(true);
  };

  const handleDeleteClick = async (userToDelete) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar a ${userToDelete.nombre} ${userToDelete.apellido}? Esta acción no se puede deshacer.`
      )
    ) {
      const result = await deleteUser(userToDelete.id);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUser(editingUser.id, editFormData);
    if (result.success) {
      setShowEditModal(false);
      setEditingUser(null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const exportarDatos = () => {
    try {
      const alumnosExport = registeredUsers.filter(
        (alumno) => alumno.role === "alumno"
      );

      if (alumnosExport.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      const datosJSON = JSON.stringify(alumnosExport, null, 2);

      const blob = new Blob([datosJSON], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alumnos_exportados_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Se exportaron ${alumnosExport.length} registros correctamente.`);
    } catch (error) {
      console.error("Error al exportar datos:", error);
      alert("Error al exportar los datos");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "alumnos":
        return (
          <Alumnos
            datosAlumnos={registeredUsers.filter((a) => a.role === "alumno")}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        );
      case "estadisticas":
        return (
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-danger">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Estadísticas de Alumnos
              </h5>

              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h3 className="card-title">{stats.total}</h3>
                      <p className="card-text">Total de Alumnos</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h3 className="card-title">{stats.activos}</h3>
                      <p className="card-text">Alumnos Activos</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h3 className="card-title">{stats.inactivos}</h3>
                      <p className="card-text">Alumnos Inactivos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas adicionales */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6>Información de credenciales</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Contraseñas visibles:</span>
                          <span className="badge bg-success">
                            {stats.total}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Usuarios únicos:</span>
                          <span className="badge bg-info">{stats.total}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6>Acciones disponibles</h6>
                      <button
                        className="btn btn-outline-primary w-100 mb-2"
                        onClick={exportarDatos}
                        disabled={registeredUsers.length === 0}
                      >
                        <i className="bi bi-download me-2"></i>
                        Exportar todos los datos
                      </button>
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={cargarDatosAlumnos}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Actualizar datos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "comentarios":
        return (
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-danger mb-4">
                <i className="bi bi-chat-quote-fill me-2"></i>
                Moderación de Comentarios
              </h5>

              {comentarios.length === 0 ? (
                <div className="alert alert-info">
                  No hay comentarios para moderar.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comentarios.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <small>{c.fecha}</small>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                                style={{
                                  width: 30,
                                  height: 30,
                                  fontSize: "0.8em",
                                }}
                              >
                                {c.nombre.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-bold">{c.nombre}</span>
                            </div>
                            <small className="text-muted d-block">
                              {c.username}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                c.role === "admin" ? "bg-danger" : "bg-primary"
                              }`}
                            >
                              {c.role || "alumno"}
                            </span>
                          </td>
                          <td>{c.texto}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "¿Seguro que deseas eliminar este comentario?"
                                  )
                                ) {
                                  eliminarComentario(c.id);
                                }
                              }}
                              title="Eliminar comentario"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case "configuracion":
        return (
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-danger">
                <i className="bi bi-gear-fill me-2"></i>
                Configuración del Sistema
              </h5>

              <div className="alert alert-warning">
                <h6>
                  <i className="bi bi-shield-exclamation me-2"></i>
                  Advertencia de seguridad
                </h6>
                <p>
                  Como administrador, tienes acceso completo a las credenciales
                  de todos los alumnos. Esta información es altamente sensible.
                  Asegúrate de:
                </p>
                <ul>
                  <li>No compartir estas credenciales</li>
                  <li>Mantener la sesión cerrada cuando no la uses</li>
                  <li>
                    Usar una contraseña fuerte para tu cuenta de administrador
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <h6>Acciones de administrador</h6>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={exportarDatos}
                    disabled={registeredUsers.length === 0}
                  >
                    <i className="bi bi-download me-2"></i>
                    Exportar Datos a JSON (incluye contraseñas)
                  </button>

                  <button
                    className="btn btn-outline-success"
                    onClick={cargarDatosAlumnos}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Recargar Datos
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h6>Información del sistema</h6>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Administrador actual:</span>
                    <span className="badge bg-danger">{user.username}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Alumnos con acceso visible:</span>
                    <span className="badge bg-success">{stats.total}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Privilegios:</span>
                    <span className="badge bg-warning">Ver contraseñas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Alumnos
            datosAlumnos={registeredUsers.filter((a) => a.role === "alumno")}
          />
        );
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div
          className={`col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed sidebar ${
            mobileMenuOpen ? "d-block" : "d-none d-md-block"
          }`}
          style={{ zIndex: 1050, top: 0, left: 0, overflowY: "auto" }}
        >
          <div className="p-3">
            {/* Botón cerrar menú móvil */}
            <div className="d-flex justify-content-end d-md-none mb-2">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="text-center mb-4">
              <h4 className="text-danger mb-1">
                <i className="bi bi-shield-lock me-2"></i>
                Admin
              </h4>
              <small className="text-light">Acceso completo</small>
            </div>

            <div className="user-info mb-4 p-3 bg-dark rounded">
              <div className="d-flex align-items-center">
                <div className="bg-danger rounded-circle p-2 me-3">
                  <i className="bi bi-person-fill text-white"></i>
                </div>
                <div>
                  <p className="mb-0 text-light fw-semibold">{user.username}</p>
                  <small className="text-muted">Administrador</small>
                  <small className="d-block text-warning">
                    <i className="bi bi-key me-1"></i>
                    Ver contraseñas
                  </small>
                </div>
              </div>
            </div>

            <nav className="nav flex-column">
              <Link
                to="/"
                className="nav-link text-white text-start mb-2 rounded hover-bg"
              >
                <i className="bi bi-house-door-fill me-2"></i>
                Volver al Inicio
              </Link>
              <button
                className={`nav-link text-white text-start mb-2 rounded ${
                  activeSection === "alumnos" ? "bg-danger" : "hover-bg"
                }`}
                onClick={() => setActiveSection("alumnos")}
              >
                <i className="bi bi-people-fill me-2"></i>
                Alumnos
                <span className="badge bg-light text-dark ms-2">
                  {stats.total}
                </span>
              </button>

              <button
                className={`nav-link text-white text-start mb-2 rounded ${
                  activeSection === "estadisticas" ? "bg-danger" : "hover-bg"
                }`}
                onClick={() => setActiveSection("estadisticas")}
              >
                <i className="bi bi-bar-chart-fill me-2"></i>
                Estadísticas
              </button>

              <button
                className={`nav-link text-white text-start mb-2 rounded ${
                  activeSection === "comentarios" ? "bg-danger" : "hover-bg"
                }`}
                onClick={() => setActiveSection("comentarios")}
              >
                <i className="bi bi-chat-quote-fill me-2"></i>
                Comentarios
                <span className="badge bg-light text-dark ms-2">
                  {comentarios.length}
                </span>
              </button>

              <button
                className={`nav-link text-white text-start mb-2 rounded ${
                  activeSection === "configuracion" ? "bg-danger" : "hover-bg"
                }`}
                onClick={() => setActiveSection("configuracion")}
              >
                <i className="bi bi-gear-fill me-2"></i>
                Configuración
              </button>

              <hr className="text-light my-4" />

              <button
                className="btn btn-outline-light w-100 mt-2"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </button>
            </nav>

            <div className="mt-5 pt-3 border-top border-secondary">
              <small className="text-muted">
                <i className="bi bi-eye-fill me-1"></i>
                Permisos: Ver todas las contraseñas
              </small>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            {/* Mobile Header Toggle */}
            <div className="d-flex justify-content-between align-items-center d-md-none mb-4">
              <h4 className="text-danger mb-0">Admin Panel</h4>
              <button
                className="btn btn-outline-danger"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="bi bi-list fs-4"></i>
              </button>
            </div>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-danger mb-0">
                  {activeSection === "alumnos" && (
                    <>
                      <i className="bi bi-people-fill me-2"></i>
                      Gestión de Alumnos
                    </>
                  )}
                  {activeSection === "estadisticas" && (
                    <>
                      <i className="bi bi-bar-chart-fill me-2"></i>
                      Estadísticas
                    </>
                  )}
                  {activeSection === "configuracion" && (
                    <>
                      <i className="bi bi-gear-fill me-2"></i>
                      Configuración
                    </>
                  )}
                </h2>
                <p className="text-muted mb-0">
                  {activeSection === "alumnos" &&
                    "Visualización completa de datos, incluyendo credenciales"}
                  {activeSection === "estadisticas" &&
                    "Estadísticas y análisis de los alumnos"}
                  {activeSection === "configuracion" &&
                    "Configuración del sistema y privilegios de administrador"}
                </p>
              </div>

              {activeSection === "alumnos" && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-danger"
                    onClick={cargarDatosAlumnos}
                    disabled={authLoading}
                    title="Recargar datos"
                  >
                    {authLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Cargando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Recargar
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={exportarDatos}
                    disabled={registeredUsers.length === 0}
                    title="Exportar con contraseñas"
                  >
                    <i className="bi bi-download me-2"></i>
                    Exportar
                  </button>
                </div>
              )}
            </div>

            {/* Contenido principal */}
            {authLoading && activeSection === "alumnos" ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-danger"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 fs-5">Cargando datos de alumnos...</p>
              </div>
            ) : registeredUsers.length === 0 && activeSection === "alumnos" ? (
              <div className="text-center py-5">
                <div className="alert alert-warning">
                  <h5>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    No hay datos de alumnos
                  </h5>
                  <p className="mb-0">
                    No se encontraron usuarios en la base de datos de Supabase.
                  </p>
                  <button
                    className="btn btn-sm btn-outline-danger mt-3"
                    onClick={cargarDatosAlumnos}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Intentar cargar nuevamente
                  </button>
                </div>
              </div>
            ) : (
              renderContent()
            )}

            {/* Información de sistema */}
            <div className="mt-5 pt-4 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-shield-fill-check me-1"></i>
                  Modo administrador - Ver contraseñas habilitado
                </small>
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {new Date().toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Alumno: {editingUser.nombre} {editingUser.apellido}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={editFormData.nombre || ""}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellido"
                        value={editFormData.apellido || ""}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Usuario</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={editFormData.username || ""}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editFormData.email || ""}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">DNI</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dni"
                        value={editFormData.dni || ""}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={editFormData.telefono || ""}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="activo"
                          id="activoSwitch"
                          checked={editFormData.activo || false}
                          onChange={handleEditInputChange}
                        />
                        <label
                          className="form-check-label fw-bold"
                          htmlFor="activoSwitch"
                        >
                          Usuario Activo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-danger px-4">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
