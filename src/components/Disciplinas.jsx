import React from 'react'

const Disciplinas = () => (
  <section id="disciplinas" className="py-5 bg-light">
    <div className="container">
      <h2 className="section-title" data-aos="fade-up">Disciplinas</h2>
      <div className="row g-4">
        {[
          { title: 'Combate Urbano', text: 'Entrenamiento táctico...' },
          { title: 'Defensa Personal', text: 'Aplicación práctica...' },
          { title: 'Entrenamiento Integral', text: 'Condición física...' },
        ].map((d, i) => (
          <div className="col-md-4" data-aos="zoom-in" data-aos-delay={100*(i+1)} key={d.title}>
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">{d.title}</h5>
                <p>{d.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Disciplinas
