import Input from 'antd/es/input/Input'
import { validadorLetras, validadorNumeros } from '../../utils/utils'

// Componente el cual utilizaremos como un input de strings o de numeros
export default function Entrada({
    label,
    value = null,
    requerido = false,
    soloNumeros = false,
    soloLetras = false,
    regex = null,
    className = "" ,
    error = "",
    onChange = (valor) => console.log( "Entrada", valor ),
}) {
    const cambio = (valor) => {
        if(soloLetras && !validadorLetras.test(valor)) return
        if(soloNumeros && !validadorNumeros.test(valor)) return 

        return onChange(valor)
    }

  return (
    <>
        <label>{label && <>{label}{requerido && <span className='red'>*</span>}</>}</label>
        <Input
            value={value}
            type='text'
            onChange={(e) => cambio(e.currentTarget.value.replace(/ +/g, ' ').trimStart(' '))}
        />
    </>
  )
}
