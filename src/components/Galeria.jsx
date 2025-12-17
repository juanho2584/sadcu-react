import React from 'react'

const CarouselSection = ({ id, title, seeds }) => (
  <div className="galeria-seccion">
    <div className="galeria-seccion-titulo">{title}</div>
    <div id={id} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {seeds.map((s, i) => (
          <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={s}>
            <img src={`https://picsum.photos/seed/${s}/1200/600`} className="d-block w-100" alt={title + i} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
        <span className="carousel-control-next-icon" />
      </button>
    </div>
  </div>
)

const Galeria = () => (
  <section id="galeria" className="py-5 bg-light">
    <div className="container" data-aos="fade-up">
      <h2 className="section-title text-center mb-5">Galería</h2>
      <div className="galeria-grid">
        <CarouselSection id="carouselEventos" title="Eventos" seeds={['evento1','evento2','evento3']} />
        <CarouselSection id="carouselExamenes" title="Exámenes" seeds={['examen1','examen2','examen3']} />
        <CarouselSection id="carouselEntrenamiento" title="Entrenamiento" seeds={['entreno1','entreno2','entreno3']} />
      </div>
    </div>
  </section>
)

export default Galeria
