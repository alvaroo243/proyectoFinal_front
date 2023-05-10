import { DeleteOutlined } from "@ant-design/icons"
import { Tag } from "antd"

export default function LimpiarBoton({
    className = '',
    color = 'cyan',
    onClick = (value) => console.log('Click Limpiar')
}) {
    className += ' pointer'
    return <Tag
        className={className}
        color={color}
        onClick={onClick}
        data-testid="limpiar"
    >
        Limpiar <DeleteOutlined />
    </Tag>

};