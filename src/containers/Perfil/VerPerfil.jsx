import BotonAccion from '../../components/Buttons/BotonAccion'
import { useUsuarioContext } from '../../context/UsuarioContext'
import '../../styles/perfil.scss'
import { generadorCuando } from '../../utils/generador'
import EdicionPerfil from './EdicionPerfil'
import ModalRender from '../../components/Modal/ModalRender'
import { useEffect, useState } from 'react'

export default function VerPerfil() {

    const [usuario, setUsuario] = useUsuarioContext()


    const objModal = {
        title: <h1>Editar</h1>,
        content: <EdicionPerfil 
            usuario={usuario} 
            setUsuario={setUsuario}
            />,
        botonesCustom: true
    }

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
                    <strong>Creado el: </strong> {usuario.creado?generadorCuando(usuario.creado * 1000, "DD/MM/YYYY").str: "Indefinido"}
                </div>
                <div>
                    <strong>Biografía: </strong> {usuario.biografia}
                </div>
            </div>
        </div>
    )
}
