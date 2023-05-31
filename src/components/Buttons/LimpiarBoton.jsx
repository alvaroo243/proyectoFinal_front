import { DeleteOutlined } from "@ant-design/icons"
import { Tag } from "antd"

// Componente que utilizaremos para limpiar los filtros de las tablas
// Creamos el componente
export default function LimpiarBoton({
    className = '',
    color = 'cyan',
    onClick = (value) => console.log('Click Limpiar')
}) {
    // Como no va a ser un boton en si, lo que haremos es cambiar el cursor al tipo pointer para asi que parezca
    // que si que es un boton
    className += ' pointer'
    // Devolvemos el Tag de React modificado con el onClick
    return <Tag
        className={className}
        color={color}
        onClick={onClick}
    >
        Limpiar <DeleteOutlined />
    </Tag>

};