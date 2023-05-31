import Input from 'antd/es/input/Input'
import { validadorLetras, validadorNumeros } from '../../utils/utils'

// Componente el cual utilizaremos como un input de strings o de numeros
// Creamos el componente
export default function Entrada({
    label,
    value = null,
    requerido = false,
    soloNumeros = false,
    soloLetras = false,
    className = "mb2" ,
    onChange = (valor) => console.log( "Entrada", valor ),
    onKeyDown = () => {}
}) {
    // Cada vez que haya un cambio en el Input si hay un validador, se validará el valor enviado, y si pasa la validacion
    // se cambiará el campo
    const cambio = (valor) => {
        if(soloLetras && !validadorLetras.test(valor)) return
        if(soloNumeros && !validadorNumeros.test(valor)) return 

        return onChange(valor)
    }

    // Devolvemos un label, en el que mostraremos lo que queremos que aparezca encima del Input

    // Devolvemos un input el cual borrará cualquier espacio que se genere al principio de el campo
    // y cualquier espacio el cual se repita seguidamente de otro
    
    // Tambien tiene un keyDown el cual se puede utilizar para cuando aprete por ejemplo la tecla Enter
    // se envie un formulario
  return (
    <>
        <label className='labelEntradas'>{label && <>{label}{requerido && <span className='red'>*</span>}</>}</label>
        <Input
            className={className}
            value={value}
            type='text'
            onChange={(e) => cambio(e.currentTarget.value.replace(/ +/g, ' ').trimStart(' '))}
            onKeyDown={onKeyDown}
        />
    </>
  )
}
