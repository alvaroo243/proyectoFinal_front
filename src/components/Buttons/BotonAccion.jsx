import { Button } from 'antd'

// Componente el cual es un boton que al apretarlo realizara acciones
// Creamos el componente
export default function BotonAccion({
    icon,
    text = "",
    className = "",
    children,
    type = "primary",
    onClick = () => console.log( "Accion Boton" ),
    ...options
}) {
  // Devulvemos el boton que nos proporciona react modificado
  return (
    <Button
        children={children || text}
        type={type}
        icon={icon}
        className={className}
        onClick={onClick}
        {...options}
    />
  )
}
