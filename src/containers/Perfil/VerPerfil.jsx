import BotonAccion from '../../components/Buttons/BotonAccion'
import { useUsuarioContext } from '../../context/UsuarioContext'
import '../../styles/perfil.scss'
import { generadorCuando } from '../../utils/generador'
import EdicionPerfil from './EdicionPerfil'
import ModalRender from '../../components/Modal/ModalRender'
import { useEffect, useState } from 'react'
import { request } from '../../utils/request'

export default function VerPerfil() {

    const [usuario, setUsuario] = useUsuarioContext()
    const [puntuaciones, setPuntuaciones] = useState(null)


    const objModal = {
        title: <h1>Editar</h1>,
        content: <EdicionPerfil 
            usuario={usuario} 
            setUsuario={setUsuario}
            />,
        botonesCustom: true
    }

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

            return setPuntuaciones(puntuaciones)
        })()
    }, [])

    return (
        <div id='perfil' className='jdc jcc aic vh90 '>
            <div>
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
                        {
                            puntuaciones?.tresEnRaya !== undefined &&
                            <div>
                                - Tres en Raya: {puntuaciones.tresEnRaya}
                            </div>
                        }
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
