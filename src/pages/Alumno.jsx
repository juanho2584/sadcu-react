import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../App.css";

const Alumno = () => {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Efecto para manejar el fondo oscuro solo en esta página
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#121212"; // var(--inst-dark)

    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  // Estados para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    dni: user?.dni || "",
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Datos de ejemplo para las notas
  const notasEjemplo = [
    {
      id: 1,
      materia: "Krav Maga I",
      nota: 9,
      estado: "Aprobado",
      fecha: "15/11/2023",
    },
    {
      id: 2,
      materia: "Defensa Personal Urbana",
      nota: 8,
      estado: "Aprobado",
      fecha: "20/10/2023",
    },
    {
      id: 3,
      materia: "Primeros Auxilios",
      nota: 10,
      estado: "Aprobado",
      fecha: "05/12/2023",
    },
    {
      id: 4,
      materia: "Táctica y Estrategia",
      nota: 7,
      estado: "Regular",
      fecha: "12/12/2023",
    },
  ];

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "info", text: "Guardando cambios..." });
    const result = await updateUser(user.id, {
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      email: profileData.email,
      telefono: profileData.telefono,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
      setIsEditing(false);
    } else {
      setMessage({ type: "danger", text: result.message });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "danger", text: "Las contraseñas no coinciden" });
      return;
    }

    setMessage({ type: "info", text: "Cambiando contraseña..." });
    const result = await updateUser(user.id, {
      password: passwordData.newPassword,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Contraseña cambiada con éxito" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({ type: "danger", text: result.message });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="animate__animated animate__fadeIn">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card card-dashboard stats-card p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-star-fill text-primary fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-light opacity-75 mb-1 small">
                        Promedio General
                      </h6>
                      <h3 className="mb-0 fw-bold">8.5</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-dashboard p-4 border-start border-success border-5">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-check-circle-fill text-success fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-light opacity-75 mb-1 small">
                        Materias Aprobadas
                      </h6>
                      <h3 className="mb-0 fw-bold">12</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-dashboard p-4 border-start border-warning border-5">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-calendar-check-fill text-warning fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-light opacity-75 mb-1 small">
                        Asistencias
                      </h6>
                      <h3 className="mb-0 fw-bold">92%</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-dashboard p-4">
              <h5 className="mb-4 d-flex align-items-center">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Actividad Reciente
              </h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 py-3 border-0 border-bottom">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold">
                        Nota cargada: Primeros Auxilios
                      </h6>
                      <p className="mb-0 text-light opacity-50 small">
                        Calificación final: 10/10
                      </p>
                    </div>
                    <span className="badge bg-light text-muted fw-normal">
                      Hace 2 días
                    </span>
                  </div>
                </div>
                <div className="list-group-item px-0 py-3 border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold">
                        Nueva materia disponible: Krav Maga III
                      </h6>
                      <p className="mb-0 text-light opacity-50 small">
                        Inscripciones abiertas hasta el 20/01.
                      </p>
                    </div>
                    <span className="badge bg-light text-muted fw-normal">
                      Hace 5 días
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "notas":
        return (
          <div className="card card-dashboard p-4 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Historial Académico</h5>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-download me-2"></i>Descargar Analítico
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark border-secondary">
                  <tr className="text-white">
                    <th>Materia</th>
                    <th>Fecha</th>
                    <th className="text-center">Nota</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {notasEjemplo.map((n) => (
                    <tr key={n.id}>
                      <td className="fw-bold">{n.materia}</td>
                      <td>{n.fecha}</td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            n.nota >= 7 ? "bg-success" : "bg-warning"
                          } rounded-pill`}
                        >
                          {n.nota}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge bg-opacity-10 ${
                            n.estado === "Aprobado"
                              ? "bg-success text-success"
                              : "bg-warning text-warning"
                          }`}
                        >
                          {n.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "materias":
        return (
          <div className="card card-dashboard p-5 text-center animate__animated animate__fadeIn">
            <div className="py-4">
              <div className="bg-dark d-inline-block p-4 rounded-circle mb-4 border border-secondary">
                <i className="bi bi-journals display-4 text-primary"></i>
              </div>
              <h4>Cursos en curso</h4>
              <p
                className="text-light opacity-75 mx-auto"
                style={{ maxWidth: "400px" }}
              >
                Actualmente estás inscripto en <strong>Krav Maga II</strong> y{" "}
                <strong>Táctica y Estrategia</strong>. Revisa el calendario para
                tus próximas clases.
              </p>
              <button className="btn btn-primary px-4 py-2 mt-3 shadow-sm">
                <i className="bi bi-calendar3 me-2"></i>Ver Calendarios
              </button>
            </div>
          </div>
        );
      case "perfil":
        return (
          <div className="animate__animated animate__fadeIn">
            {message.text && (
              <div
                className={`alert alert-${message.type} alert-dismissible fade show`}
                role="alert"
              >
                {message.text}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage({ type: "", text: "" })}
                ></button>
              </div>
            )}

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card card-dashboard p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Datos Personales</h5>
                    {!isEditing ? (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>Editar Datos
                      </button>
                    ) : (
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={saveProfile}
                        >
                          <i className="bi bi-check-lg me-1"></i>Guardar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={saveProfile}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Nombre
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={profileData.nombre}
                            onChange={handleProfileChange}
                          />
                        ) : (
                          <p className="border-bottom pb-2 fw-semibold">
                            {user.nombre}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Apellido
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="apellido"
                            value={profileData.apellido}
                            onChange={handleProfileChange}
                          />
                        ) : (
                          <p className="border-bottom pb-2 fw-semibold">
                            {user.apellido}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                          />
                        ) : (
                          <p className="border-bottom pb-2 fw-semibold">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            value={profileData.telefono}
                            onChange={handleProfileChange}
                          />
                        ) : (
                          <p className="border-bottom pb-2 fw-semibold">
                            {user.telefono || "No especificado"}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Documento (DNI)
                        </label>
                        <p className="border-bottom pb-2 text-muted">
                          {user.dni}
                        </p>
                        <small className="text-secondary opacity-75">
                          El DNI no puede ser editado por el alumno.
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-light opacity-75 small fw-bold">
                          Legajo
                        </label>
                        <p className="border-bottom pb-2 text-muted">
                          #2023-A-04
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-dashboard p-4 mb-4 text-center">
                  <div
                    className="mx-auto mb-3"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <div className="bg-primary bg-opacity-10 text-primary w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-person-fill display-3"></i>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-0">
                    {user.nombre} {user.apellido}
                  </h6>
                  <small className="text-light opacity-75 d-block mb-3">
                    Alumno Regular
                  </small>
                  <button className="btn btn-sm btn-light w-100 border">
                    Cambiar Foto
                  </button>
                </div>

                <div
                  className="card card-dashboard p-4 shadow-sm"
                  style={{
                    backgroundColor: "var(--inst-dark-alt)",
                    color: "white",
                  }}
                >
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="bi bi-shield-lock me-2 text-primary"></i>
                    Seguridad
                  </h6>
                  <form onSubmit={changePassword}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold mb-1">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Repite la contraseña"
                      />
                    </div>
                    <button type="submit" className="btn btn-dark btn-sm w-100">
                      Actualizar Seguridad
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Seleccione una sección</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Overlay para móviles */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <Sidebar
        activeSection={activeSection}
        setActiveSection={(section) => {
          setActiveSection(section);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
      />

      <main className="main-content">
        <div
          className="container-fluid px-0"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <header className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light d-lg-none me-3 shadow-sm border-opacity-25"
                onClick={() => setIsSidebarOpen(true)}
              >
                <i className="bi bi-list fs-4"></i>
              </button>
              <div>
                <nav aria-label="breadcrumb" className="d-none d-md-block mb-1">
                  <ol className="breadcrumb small mb-0">
                    <li className="breadcrumb-item">
                      <a
                        href="#"
                        className="text-decoration-none text-light opacity-100"
                      >
                        Campus
                      </a>
                    </li>
                    <li
                      className="breadcrumb-item active text-danger"
                      aria-current="page"
                    >
                      {activeSection === "dashboard" && "Panel Principal"}
                      {activeSection === "materias" && "Materias"}
                      {activeSection === "notas" && "Calificaciones"}
                      {activeSection === "perfil" && "Perfil"}
                    </li>
                  </ol>
                </nav>
                <h3 className="mb-0 fw-bold text-white">
                  {activeSection === "dashboard" &&
                    "¡Bienvenido, " + user.nombre + "! 👋"}
                  {activeSection === "materias" && "Mis Materias"}
                  {activeSection === "notas" && "Mis Calificaciones"}
                  {activeSection === "perfil" && "Configuración de Perfil"}
                </h3>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="dropdown d-none d-sm-block">
                <button
                  className="btn btn-dark-alt position-relative shadow-sm rounded-circle p-2 border border-secondary border-opacity-25"
                  type="button"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  <i className="bi bi-bell text-white"></i>
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark"
                    style={{ fontSize: "0.6em" }}
                  >
                    2
                  </span>
                </button>
              </div>
              <div
                className="vr mx-2 d-none d-md-block bg-secondary opacity-50"
                style={{ height: "30px" }}
              ></div>
              <div className="text-end d-none d-md-block">
                <p className="mb-0 fw-bold small text-white opacity-100">
                  {user.nombre} {user.apellido}
                </p>
                <small
                  className="text-light opacity-100 fw-medium"
                  style={{ fontSize: "0.75em" }}
                >
                  ID: #2023-SADCU-04
                </small>
              </div>
            </div>
          </header>

          <div className="content-body">{renderContent()}</div>

          <footer className="mt-5 pt-5 pb-4 text-center text-white border-top border-secondary border-opacity-10">
            <p className="small mb-0 opacity-100 fw-medium">
              © 2025 Sistema Argentino de Defensa y Combate Urbano (SADCU).
              Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Alumno;
