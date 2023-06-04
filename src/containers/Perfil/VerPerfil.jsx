import BotonAccion from '../../components/Buttons/BotonAccion'
import { useUsuarioContext } from '../../context/UsuarioContext'
import '../../styles/perfil.scss'
import { generadorCuando } from '../../utils/generador'
import EdicionPerfil from './EdicionPerfil'
import ModalRender from '../../components/Modal/ModalRender'
import { useEffect, useState } from 'react'
import { request } from '../../utils/request'

// Componente que utilizaremos para la vista de VerPerfil
export default function VerPerfil() {

    // Creamos los useStates
    const [usuario, setUsuario] = useUsuarioContext()
    const [puntuaciones, setPuntuaciones] = useState(null)

    // Elementos que tendrá el modal
    const objModal = {
        title: <h1>Editar</h1>,
        content: <EdicionPerfil 
            usuario={usuario} 
            setUsuario={setUsuario}
            />,
        // Tendrá botones customizados
        botonesCustom: true
    }

    // UseEffect con el que haremos una llamada para coger las puntuaciones del jugador
    useEffect(() => {
        // Funcion autollamada
        (async () => {
            const puntuaciones = await request({
                url:"/puntuaciones",
                method: "POST",
                options: {
                    username: usuario.username
                }
            })
            // Seteamos las puntuaciones
            return setPuntuaciones(puntuaciones)
        })()
    }, [])

    // Devolvemos un titulo con el nombre del jugador y un boton con el que abriremos el modal de edicion de usuario
    return (
        <div id='perfil' className='jdc jcc aic mvh85'>
            <div>
                {/* Le damos un classname segun su color preferido */}
                <h1><strong className={usuario.color?usuario.color: "black"}>{usuario.name.toUpperCase()}</strong>
                    <ModalRender 
                        className = "flr"
                        iniciador={<BotonAccion
                            id="boton"
                            text='Editar perfil'
                        />}
                        objModal={objModal}
                    />
                </h1>
                {/* Aqui mostraremos cada campo del usuario que deseemos */}
                <div>
                    <strong>Username:</strong> {usuario.username}
                </div>
                <div>
                    <strong>Email:</strong> {usuario.email}
                </div>
                <div>
                    <strong>Creado el: </strong> {usuario.creado?generadorCuando(usuario.creado * 1000, "DD/MM/YYYY").str: "Indefinido"}
                </div>
                <div>
                    <strong>Biografía: </strong> {usuario.biografia}
                </div>
                <div className='fdr'>
                    <strong>Puntuaciones: </strong>
                    <div>
                        {/* Si tiene puntuaciones y tiene alguna del tresEnRaya */}
                        {
                            puntuaciones?.tresEnRaya !== undefined &&
                            <div>
                                - Tres en Raya: {puntuaciones.tresEnRaya}
                            </div>
                        }
                        {/* Si tiene puntuaciones y tiene alguna del blackJack */}
                        { 
                            puntuaciones?.blackJack !== undefined &&
                            <div>
                                - BlackJack: {puntuaciones.blackJack}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
