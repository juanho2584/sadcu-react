/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [comentarios, setComentarios] = useState([])

  const agregarComentario = (usuario, texto) => {
    const fecha = new Date()
    setComentarios(prev => [
      {
        id: Date.now(),
        nombre: usuario.nombre || usuario.username || "Anónimo",
        username: usuario.username,
        role: usuario.role,
        texto,
        fecha: fecha.toLocaleString('es-AR')
      },
      ...prev
    ])
  }

  const eliminarComentario = (id) => {
    setComentarios(prev => prev.filter(c => c.id !== id))
  }

  return (
    <AppContext.Provider value={{
      comentarios,
      agregarComentario,
      eliminarComentario
    }}>
      {children}
    </AppContext.Provider>
  )
}
