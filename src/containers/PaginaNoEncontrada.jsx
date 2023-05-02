import React from 'react'
import { Link } from 'react-router-dom'

export default function PaginaNoEncontrada() {
  return (
    <div>
        <h1>¡Pagina No Encontrada!</h1>
        <h2><Link to={"/"}>Volver</Link></h2>
    </div>
  )
}
