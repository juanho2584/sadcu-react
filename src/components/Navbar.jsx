import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 importa el contexto

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth(); // 👈 accede a usuario y función logout

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="container">
        <a className="navbar-brand" href="/#inicio">
          <img
            src="https://dftbmejancszlkrnoulo.supabase.co/storage/v1/object/public/actividades/general/lOGO.png"
            alt="Logo"
            width="50"
            className="me-2"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/#nosotros">
                Nosotros
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#disciplinas">
                Disciplinas
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#instructores">
                Instructores
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#galeria">
                Galería
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#comentarios">
                Comentarios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#contacto">
                Contacto
              </a>
            </li>

            {/* 🔒 Zona de autenticación */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-warning"
                    to={user.role === "admin" ? "/admin" : "/alumno"}
                  >
                    {user.username || "Panel"}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-outline-light ms-2"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
