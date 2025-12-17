import React, { useState } from 'react'

const Contacto = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // comportamiento simple: notificar al usuario
    alert('Gracias por contactarte con nosotros. ¡Te responderemos pronto!')
    setNombre(''); setEmail(''); setMensaje('')
  }

  return (
    <section id="contacto" className="py-5">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Contacto</h2>
        <div className="row">
          <div className="col-md-6">
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Mensaje</label>
                <textarea className="form-control" value={mensaje} onChange={e => setMensaje(e.target.value)} rows="4" required />
              </div>
              <button type="submit" className="btn btn-danger w-100">Enviar</button>
            </form>
          </div>
          <div className="col-md-6 text-center">
            <h5>Ubicación</h5>
            <p>Av. Siempreviva 123, Buenos Aires, Argentina</p>
            <iframe src="https://www.google.com/maps" className="w-100" height="250" style={{border:0}} title="mapa" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contacto
