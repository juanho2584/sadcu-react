import React from 'react';

const Alumnos = ({ datosAlumnos = [] }) => {
  if (datosAlumnos.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No hay datos de alumnos para mostrar.
      </div>
    );
  }

  return (
    <>
      <div className="alert alert-warning mb-4">
        <h5><i className="bi bi-shield-lock me-2"></i>Panel de Administrador</h5>
        <p className="mb-0">
          Información confidencial: Usuarios y contraseñas visibles solo para administradores autorizados.
        </p>
      </div>

      <div className="row">
        {datosAlumnos.map((alumno, idx) => (
          <div className="col-md-6 col-lg-4 mb-4" key={`${alumno.dni}-${idx}`}>
            <div className="card h-100 shadow border-start border-4 border-danger">
              <div className="card-header bg-dark text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    {alumno.nombre} {alumno.apellido}
                  </h6>
                  <span className="badge bg-light text-dark">#{idx + 1}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="mb-3">
                  <div className="row g-2">
                    <div className="col-6">
                      <small className="text-muted">DNI</small>
                      <p className="mb-0 fw-bold">{alumno.dni}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Estado</small>
                      <p className="mb-0">
                        <span className={`badge ${alumno.estado === 'activo' ? 'bg-success' : 'bg-warning'}`}>
                          {alumno.estado || 'activo'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Email</small>
                  <p className="mb-1 text-truncate">
                    <i className="bi bi-envelope me-1 text-primary"></i>
                    {alumno.email}
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Teléfono</small>
                  <p className="mb-1">
                    <i className="bi bi-telephone me-1 text-success"></i>
                    {alumno.telefono || 'No especificado'}
                  </p>
                </div>

                {/* Credenciales - Sección destacada */}
                <div className="border-top pt-3">
                  <h6 className="text-danger">
                    <i className="bi bi-key me-2"></i>
                    Credenciales de acceso
                  </h6>
                  
                  <div className="mb-2">
                    <small className="text-muted">Usuario</small>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control font-monospace"
                        value={alumno.username}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(alumno.username);
                          alert(`Usuario copiado: ${alumno.username}`);
                        }}
                        title="Copiar usuario"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Contraseña</small>
                    <div className="input-group input-group-sm">
                      <input
                        type="password"
                        className="form-control font-monospace text-danger fw-bold"
                        value={alumno.password}
                        readOnly
                        id={`password-${idx}`}
                      />
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                          const input = document.getElementById(`password-${idx}`);
                          input.type = input.type === 'password' ? 'text' : 'password';
                        }}
                        title="Mostrar/ocultar contraseña"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(alumno.password);
                          alert(`Contraseña copiada para ${alumno.nombre}`);
                        }}
                        title="Copiar contraseña"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer bg-light">
                <small className="text-muted">
                  <i className="bi bi-calendar-event me-1"></i>
                  Registrado: {alumno.fechaRegistro || 'No disponible'}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Panel de resumen */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-4">
              <h3 className="text-primary">{datosAlumnos.length}</h3>
              <p className="text-muted mb-0">Total de Alumnos</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-success">
                {datosAlumnos.filter(a => a.estado === 'activo').length}
              </h3>
              <p className="text-muted mb-0">Alumnos Activos</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-danger">
                {datosAlumnos.filter(a => a.password && a.password.length < 8).length}
              </h3>
              <p className="text-muted mb-0">Contraseñas débiles</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alumnos;