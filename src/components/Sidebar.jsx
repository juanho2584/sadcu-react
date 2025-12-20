import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ activeSection, setActiveSection, isOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    {
      id: "materias",
      label: "Mis Materias",
      icon: "bi-layout-text-sidebar-reverse",
    },
    { id: "notas", label: "Calificaciones", icon: "bi-journal-check" },
    { id: "perfil", label: "Perfil y Seguridad", icon: "bi-gear-fill" },
  ];

  return (
    <div
      className={`sidebar-student d-flex flex-column ${isOpen ? "active" : ""}`}
    >
      <div className="logo-container py-5 text-center">
        <div className="d-flex flex-column align-items-center justify-content-center px-3 mb-2">
          <img
            src="/img/lOGO.png"
            alt="SADCU Logo"
            width="100"
            className="mb-3 animate__animated animate__zoomIn"
          />
          <h4 className="text-white mb-0 fw-bold letter-spacing-2">SADCU</h4>
        </div>
        <small
          className="text-muted opacity-75 text-uppercase fw-bold"
          style={{ fontSize: "0.65rem", letterSpacing: "2px" }}
        >
          Portal Académico
        </small>
      </div>

      <div className="flex-grow-1 p-3">
        <div
          className="d-flex align-items-center mb-4 p-3 rounded-3"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
          >
            <i className="bi bi-person-fill fs-5"></i>
          </div>
          <div className="ms-3 overflow-hidden">
            <p className="mb-0 fw-bold text-white text-truncate small">
              {user.nombre}
            </p>
            <span
              className="badge bg-danger bg-opacity-10 text-danger p-0 small"
              style={{ fontSize: "0.65rem" }}
            >
              ALUMNO
            </span>
          </div>
        </div>

        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link border-0 text-start mb-2 px-3 py-2 ${
                activeSection === item.id
                  ? "active"
                  : "text-light bg-transparent"
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={`bi ${item.icon} me-3`}></i>
              <span className="small fw-medium">{item.label}</span>
            </button>
          ))}

          <div className="my-4 border-top border-secondary opacity-25"></div>

          <Link
            to="/"
            className="nav-link text-light bg-transparent border-0 text-start mb-2 px-3 py-2 opacity-75"
          >
            <i className="bi bi-arrow-left-circle me-3"></i>
            <span className="small">Volver al Sitio</span>
          </Link>

          <button
            onClick={logout}
            className="nav-link text-danger bg-transparent border-0 text-start px-3 py-2 mt-2"
          >
            <i className="bi bi-power me-3"></i>
            <span className="small fw-bold">Cerrar Sesión</span>
          </button>
        </nav>
      </div>

      <div className="p-3 text-center border-top border-secondary border-opacity-10">
        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
          v2.0.4 • SADCU Campus
        </small>
      </div>
    </div>
  );
};

export default Sidebar;
