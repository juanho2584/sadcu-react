import React from 'react'

const Hero = () => (
  <section className="hero d-flex align-items-center" id="inicio">
    <div className="container text-center text-light" data-aos="zoom-in">
      <img src="/public/img/lOGO.png" alt="Logo principal" className="hero-logo mb-4" />
      <h1 className="fw-bold text-danger">Disciplina. Defensa. Equilibrio.</h1>
      <p className="lead">Sistema Argentino de Defensa y Combate Urbano</p>
      <a href="#nosotros" className="btn btn-danger mt-3">Conocé más</a>
    </div>
  </section>
)

export default Hero
