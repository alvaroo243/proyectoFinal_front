import { useState } from 'react';
import { RollbackOutlined } from '@ant-design/icons';
import Entrada from '../../components/Inputs/Entrada'
import EntradaPassword from '../../components/Inputs/EntradaPassword'
import '../../styles/registro.scss'
import BotonAccion from '../../components/Buttons/BotonAccion';
import { validadorEmail } from '../../utils/utils';
import dayjs from 'dayjs';
import { request } from '../../utils/request';
import { message } from 'antd';
import { Link } from 'react-router-dom';

// Componente que utilizaremos para mostrar la vista de Registro
export default function Registro({
    titulo = "REGISTRO",
    onFinish = () => window.location = '/login' // Por defecto se enviara a '/login' cuando se finalice el login
}) {

    // Creamos los useStates
    const [registro, setRegistro] = useState({});
    const [error, setError] = useState(null);

    // Función en la que haremos las validaciones necesarias
    const validaciones = () => {
        if (!registro.name || !registro.username || !registro.email || !registro.password || !registro.repitePass) {
            setError("Hay campos obligatorios vacios.")
            return false
        }
        if (!validadorEmail.test(registro.email)) {
            setError("Email no valido.")
            return false
        }
        if (registro.password.length < 6) {
            setError("La contraseña tiene que tener al menos 6 caracteres.")
            return false
        }
        if (registro.password !== registro.repitePass) {
            setError("Las contraseñas no son iguales.")
            return false
        }

        return true
    }

    // Funcion en la que realizaremos el registro
    const hacerRegistro = async () => {
        // Comprobamos que estan bien validados los campos
        if (!validaciones()) return

        try {
            // Creamos una fecha actual en formato ts para saber cuando se ha creado el usuario
            const creado = dayjs().unix()
            // Creamos el objeto de nuevoUsuario con su fecha de creacion y su role
            const nuevoUsuario = { ...registro, creado: creado, role: "USER" };
            // Borramos el repitePassword
            delete nuevoUsuario.repitePass

            // Hacemos la llamada al back
            const getRegistro = await request({
                url: '/registro',
                method: 'POST',
                options: {
                    registro: nuevoUsuario
                }
            })

            // Si todo ha salido bien
            if (getRegistro.ok) {
                // Borramos los datos
                setRegistro({})
                // Y lo indicamos con un mensaje
                message.success(getRegistro.message)
                return onFinish()
            } else {
                // Sinos devolvemos un error
                return setError(getRegistro.message)
            }

        } catch (error) {
            return setError(error)
        }
    }

    // Devolvemos un formulario con los distintos campos a rellenar para hacer el registro correctamente
    return (
        <div id='contRegistro' className='fdc jcc aic vh100'>
            <div id='registro' className='bg-white fdc'>
                {/* Le añadimos al titulo un boton en el que se puede volver a la ruta del login */}
                <h2 className='purple'>{titulo}<Link to={'/login'}><p id='atras' className='flr black'><RollbackOutlined /></p></Link></h2>
                <Entrada
                    className='mb2'
                    label={"Nombre"}
                    requerido
                    value={registro.name}
                    onChange={(valor) => {
                        if (!valor) {
                            delete registro.name
                            return setRegistro({ ...registro })
                        }

                        setRegistro({ ...registro, name: valor })
                        return setError(null)
                    }}
                    onKeyDown={async (ev) => {
                        if (ev.key !== "Enter") return
                        return await hacerRegistro()
                    }}
                />
                <Entrada
                    className='mb2'
                    label={"Username"}
                    requerido
                    value={registro.username}
                    onChange={(valor) => {
                        if (!valor) {
                            delete registro.username
                            return setRegistro({ ...registro })
                        }

                        setRegistro({ ...registro, username: valor })
                        return setError(null)
                    }}
                    onKeyDown={async (ev) => {
                        if (ev.key !== "Enter") return
                        return await hacerRegistro()
                    }}
                />
                <Entrada
                    className='mb2'
                    label={"Email"}
                    requerido
                    value={registro.email}
                    onChange={(valor) => {
                        if (!valor) {
                            delete registro.email
                            return setRegistro({ ...registro })
                        }

                        setRegistro({ ...registro, email: valor })
                        return setError(null)
                    }}
                    onKeyDown={async (ev) => {
                        if (ev.key !== "Enter") return
                        return await hacerRegistro()
                    }}
                />
                <EntradaPassword
                    className='mb2'
                    label={"Contraseña"}
                    requerido
                    value={registro.password}
                    onChange={(valor) => {
                        if (!valor) {
                            delete registro.password
                            return setRegistro({ ...registro })
                        }

                        setRegistro({ ...registro, password: valor })
                        return setError(null)
                    }}
                    onKeyDown={async (ev) => {
                        if (ev.key !== "Enter") return
                        return await hacerRegistro()
                    }}
                />
                <EntradaPassword
                    className='mb2'
                    label={"Repite contraseña"}
                    requerido
                    value={registro.repitePass}
                    onChange={(valor) => {
                        if (!valor) {
                            delete registro.repitePass
                            return setRegistro({ ...registro })
                        }

                        setRegistro({ ...registro, repitePass: valor })
                        return setError(null)
                    }}
                    onKeyDown={async (ev) => {
                        if (ev.key !== "Enter") return
                        return await hacerRegistro()
                    }}
                />
                <BotonAccion
                    className='w30 asc'
                    text='Crear'
                    onClick={async () => await hacerRegistro()}
                />
                {error && <p className='red'>❗ Registro incorrecto: ({error})</p>}
            </div>
        </div>
    )
}
