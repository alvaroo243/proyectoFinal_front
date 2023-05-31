import { Link } from 'react-router-dom'

// Este componente lo que hara es mostrar un mensaje y un boton para volver a '/' si has intentado acceder a una pagina inexistente
export default function PaginaNoEncontrada() {
  return (
    <div>
        <h1>¡Pagina No Encontrada!</h1>
        <h2><Link to={"/"}>Volver</Link></h2>
    </div>
  )
}
