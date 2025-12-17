import React from "react";
import { useAuth } from "../context/AuthContext";

const Alumno = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow-lg mt-5">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Panel de Alumno
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center border-end">
              <div className="mb-3">
                <div className="display-1 text-primary">
                  <i className="bi bi-person-circle"></i>
                </div>
              </div>
              <h4 className="card-title">
                {user.nombre} {user.apellido}
              </h4>
              <span className="badge bg-success mb-3">Alumno Activo</span>
              <p className="text-muted small">
                Miembro desde: {new Date(user.fechaRegistro).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-8">
              <h5 className="border-bottom pb-2 mb-3">Información Personal</h5>
              <div className="row mb-3">
                <div className="col-sm-4 fw-bold">Usuario:</div>
                <div className="col-sm-8">{user.username}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 fw-bold">Email:</div>
                <div className="col-sm-8">{user.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 fw-bold">DNI:</div>
                <div className="col-sm-8">{user.dni}</div>
              </div>
              {user.telefono && (
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">Teléfono:</div>
                  <div className="col-sm-8">{user.telefono}</div>
                </div>
              )}
              
              <hr />
              
              <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                Próximamente podrás ver tus cursos y calificaciones aquí.
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                 <button className="btn btn-outline-danger" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumno;
