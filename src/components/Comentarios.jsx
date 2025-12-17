import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const Comentarios = () => {
  const { comentarios, agregarComentario } = useContext(AppContext);
  const { user } = useAuth();
  const [comentario, setComentario] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    
    // Enviar obj usuario completo y el texto
    agregarComentario(user, comentario.trim());
    setComentario("");
  };

  return (
    <section id="comentarios" className="py-5 bg-light">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Dejanos tu comentario</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            
            {!user ? (
               <div className="alert alert-info text-center shadow-sm">
                 <i className="bi bi-lock-fill me-2"></i>
                 Debes <Link to="/login" className="alert-link">iniciar sesión</Link> como alumno para dejar un comentario.
               </div>
            ) : (
                <div className="card shadow-sm mb-4 border-0">
                  <div className="card-body bg-white p-4">
                     <div className="d-flex align-items-center mb-3">
                        <div className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: 40, height: 40}}>
                           <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                           <p className="mb-0 text-muted small">Comentando como:</p>
                           <h6 className="mb-0 fw-bold text-dark">{user.nombre} {user.apellido}</h6>
                        </div>
                     </div>
                     
                    <form id="comentarioForm" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <textarea
                          className="form-control bg-light border-0"
                          placeholder="Escribe tu opinión aquí..."
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          rows="3"
                          required
                          style={{resize: "none"}}
                        />
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="submit" className="btn btn-danger px-4 rounded-pill">
                          <i className="bi bi-send-fill me-2"></i>
                          Publicar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            )}

            <div id="listaComentarios" className="mt-3">
              {comentarios.length === 0 && (
                <p className="text-muted">Todavía no hay comentarios.</p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {comentarios.map((c) => (
                  <div
                    className="comentario-card mb-3 p-3 rounded shadow-sm border-start border-4 border-danger"
                    key={c.id}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <div
                        className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                        style={{
                          width: 40,
                          height: 40,
                          fontWeight: "bold",
                          fontSize: "1.2em",
                        }}
                      >
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="fw-bold">{c.nombre}</span>
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.9em" }}
                        >
                          {c.fecha}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: "1.1em" }}
                    >
                      {c.texto}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comentarios;
