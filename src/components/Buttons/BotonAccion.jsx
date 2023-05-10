import { Button } from 'antd'

// Componente el cual es un boton que al apretarlo realizara acciones
export default function BotonAccion({
    icon,
    text = "",
    className = "",
    children,
    type = "primary",
    onClick = () => console.log( "Accion Boton" )
}) {
  return (
    <Button
        children={children || text}
        type={type}
        icon={icon}
        className={className}
        onClick={onClick}
    />
  )
}
