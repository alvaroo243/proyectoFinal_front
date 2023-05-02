import { Button } from 'antd'

export default function BotonAccion({
    icon,
    text = "",
    className = "",
    children,
    onClick = () => console.log( "Accion Boton" )
}) {
  return (
    <Button
        children={children || text}
        type='primary'
        icon={icon}
        className={className}
        onClick={onClick}
    />
  )
}
