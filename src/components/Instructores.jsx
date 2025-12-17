import React from 'react'

const Instructores = () => {
  const instructors = [
    { img: '/img/instructor1.jpg', name: 'Sensei Juan Pérez', bio: 'Fundador y director técnico...' },
    { img: '/img/instructor2.jpg', name: 'Instructor Ana Gómez', bio: 'Especialista en defensa femenina...' },
    { img: '/img/instructor3.jpg', name: 'Coach Luis Torres', bio: 'Entrenador físico...' }
  ]

  return (
    <section id="instructores" className="py-5">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Instructores</h2>
        <div className="row g-4 text-center">
          {instructors.map((ins, idx) => (
            <div className="col-md-4" data-aos="flip-left" data-aos-delay={100*(idx+1)} key={ins.name}>
              <img src={ins.img} className="rounded-circle mb-3" width="150" alt={ins.name} />
              <h5 className="text-danger">{ins.name}</h5>
              <p>{ins.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Instructores
