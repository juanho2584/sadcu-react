import React from 'react'

const Footer = () => (
  <footer className="text-center text-light py-4 bg-dark">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-4 mb-3 mb-md-0">
          <img src="/img/LOGO_02.png" alt="Logo" width="60" className="mb-2" />
          <p className="mb-0 fw-bold">SADCU</p>
          <small>Sistema Argentino de Defensa y Combate Urbano</small>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <p className="mb-2 fw-bold">Seguinos</p>
          <a href="https://facebook.com/" target="_blank" rel="noreferrer" className="text-light me-3" aria-label="Facebook"><i className="bi bi-facebook fs-4" />_</a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="text-light me-3" aria-label="Instagram"><i className="bi bi-instagram fs-4" />_</a>
          <a href="https://wa.me/5491123456789" target="_blank" rel="noreferrer" className="text-light me-3" aria-label="WhatsApp"><i className="bi bi-whatsapp fs-4" />_</a>
          <a href="https://youtube.com/" target="_blank" rel="noreferrer" className="text-light me-3" aria-label="YouTube"><i className="bi bi-youtube fs-4" />_</a>
          <a href="https://tiktok.com/" target="_blank" rel="noreferrer" className="text-light me-3" aria-label="TikTok"><i className="bi bi-tiktok fs-4" />_</a>
          <a href="mailto:info@sadcu.com" className="text-light"><i className="bi bi-envelope fs-4" />_</a>
        </div>
        <div className="col-md-4 text-md-end">
          <p className="mb-1 fw-bold">Contacto</p>
          <p className="mb-0">Av. Siempreviva 123, Buenos Aires</p>
          <p className="mb-0">info@sadcu.com</p>
          <p className="mb-0">+54 11 2345-6789</p>
        </div>
      </div>
      <hr className="bg-secondary my-3" />
      <small>© {new Date().getFullYear()} Sistema Argentino de Defensa y Combate Urbano — Todos los derechos reservados.</small>
    </div>
  </footer>
)

export default Footer
