import { useState } from 'react'
import Entrada from '../../components/Inputs/Entrada'
import { EntradaTextArea } from '../../components/Inputs/EntradaTextArea'
import BotonAccion from '../../components/Buttons/BotonAccion';
import { request } from '../../utils/request';
import { validadorEmail } from '../../utils/utils';
import { message } from 'antd';
import EntradaSelect from '../../components/Inputs/EntradaSelect';

export default function EdicionPerfil({
    usuario, 
    setUsuario,
    cerrarModal
}) {
    
    const [usuarioEditar, setUsuarioEditar] = useState(usuario);
    const [errores, setErrores] = useState(null);
    
    const editarUsuario = async () => {
        const usuarioEnvio = usuarioEditar
        delete usuarioEnvio.iat
        delete usuarioEnvio.exp
        const {ok, token} = await request({
            url: "/usuarios/editar",
            method: "PUT",
            options: {
                usuarioEditado: usuarioEnvio
            }
        })

        if (!ok) return ok

        localStorage.setItem('minijuegostoken', token)
        return ok
    }

    const existeUsuario = async () =>{
        const {existe, error} = await request({
            url: "/usuarios/validar",
            method: "POST",
            options: {
                username: usuarioEditar.username,
                email: usuarioEditar.email
            }
        })
        if (existe) setErrores(error)
        return existe
    }

    const comprobarEdicion = () => {
        if (usuario.name !== usuarioEditar.name) return true
        if (usuario.username !== usuarioEditar.username) return true
        if (usuario.email !== usuarioEditar.email) return true
        if (usuario.biografia !== usuarioEditar.biografia) return true
        if (usuario.color !== usuarioEditar.color) return true
        setErrores("¡Tienes que editar algun campo!")
        return false
    }

    const validarEdicion = async () => {
        if (!usuarioEditar.name || !usuarioEditar.username || !usuarioEditar.email) {
            setErrores("No pueden haber campos vacios (exceptuando biografía)")
            return false
        }
        if (!validadorEmail.test(usuarioEditar.email)) {
            setErrores("Email no válido")
            return false
        }
        const existe = await existeUsuario()
        return !existe
    }

    const colores = [
        {
            key: "black",
            label: "Negro",
            value: "black"
        },
        {
            key: "blue",
            label: "Azul",
            value: "blue"
        },
        {
            key: "green",
            label: "Verde",
            value: "green"
        },
        {
            key: "orange",
            label: "Naranja",
            value: "orange"
        },
        {
            key: "purple",
            label: "Morado",
            value: "purple"
        },
        {
            key: "red",
            label: "Rojo",
            value: "red"
        },
        {
            key: "yellow",
            label: "Amarillo",
            value: "yellow"
        },
        {
            key: "brown",
            label: "Marron",
            value: "brown"
        }
        
    ]

    return (
        <>
            <div>
                <Entrada
                    label={"Nombre"}
                    value={usuarioEditar.name}
                    onChange={(value) => {
                        setErrores(null)
                        if (!value) {
                            delete usuarioEditar.name
                            return setUsuarioEditar({ ...usuarioEditar })
                        }

                        return setUsuarioEditar({ ...usuarioEditar, name: value })
                    }}
                    requerido
                />
            </div>
            <div>
                <Entrada
                    label={"Username"}
                    value={usuarioEditar.username}
                    onChange={(value) => {
                        setErrores(null)
                        if (!value) {
                            delete usuarioEditar.username
                            return setUsuarioEditar({ ...usuarioEditar })
                        }

                        return setUsuarioEditar({ ...usuarioEditar, username: value })
                    }}
                    requerido
                />
            </div>
            <div>
                <Entrada
                    label={"Email"}
                    value={usuarioEditar.email}
                    onChange={(value) => {
                        setErrores(null)
                        if (!value) {
                            delete usuarioEditar.email
                            return setUsuarioEditar({ ...usuarioEditar })
                        }

                        return setUsuarioEditar({ ...usuarioEditar, email: value })
                    }}
                    requerido
                />
            </div>
            <div>
                <EntradaTextArea
                    titulo={"Biografía"}
                    value={usuarioEditar.biografia}
                    onChange={(value) => {
                        setErrores(null)
                        if (!value) {
                            delete usuarioEditar.biografia
                            return setUsuarioEditar({ ...usuarioEditar })
                        }

                        return setUsuarioEditar({ ...usuarioEditar, biografia: value })
                    }}
                />
            </div>
            <div>
                <EntradaSelect 
                    label={"Color favorito"}
                    selected={usuarioEditar.color}
                    listado={colores}
                    onChange={(value) => {
                        setUsuarioEditar({...usuarioEditar, color: value})
                    }}
                />
            </div>

            <strong className='red'>{errores}</strong>

            <div className='flr'>
                <BotonAccion 
                    text='Editar'
                    onClick={async () => {
                        const validar = await validarEdicion()
                        if (!comprobarEdicion() || !validar) return;
                        const editar = await editarUsuario()
                        if (!editar) return;
                        message.success("Usuario editado correctamente")
                        setUsuario(usuarioEditar)
                        return cerrarModal()
                    }}
                />
                <BotonAccion 
                    text='Cancelar'
                    type='default'
                    onClick={() => cerrarModal()}
                />
            </div>
        </>
    )
}
