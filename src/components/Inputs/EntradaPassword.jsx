import { Input } from 'antd'

export default function EntradaPassword({
    label,
    requerido,
    value = null,
    error = "",
    onChange = () => console.log( "Entrada Password" )
}) {

    return (
        <>
            <label>{label && <>{label}{requerido && <span className='red'>*</span>}</>}</label>
            <Input.Password
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
            />
        </>
    )
}
