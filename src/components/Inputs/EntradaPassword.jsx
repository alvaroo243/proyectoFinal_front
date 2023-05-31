import { Input } from 'antd'

// Componente que utilizaremos como un input de passwords
// Creamos el componente
export default function EntradaPassword({
    label,
    requerido = false,
    className="",
    value = null,
    onChange = () => console.log( "Entrada Password" ),
    onKeyDown = () => {}
}) {

    // Parecido al componente Entrada, pero en este caso utilizamos un Input.Password, el cual no mostrará 
    // el valor del campo a no ser que se lo indiques en el boton que aparecerá a la derecha del campo
    return (
        <>
            <label className='labelEntradas'>{label && <>{label}{requerido && <span className='red'>*</span>}</>}</label>
            <Input.Password
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                className={className}
                onKeyDown={onKeyDown}
            />
        </>
    )
}
