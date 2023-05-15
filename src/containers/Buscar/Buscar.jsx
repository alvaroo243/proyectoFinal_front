import React, { useState } from 'react'
import Tabla from '../../components/Tablas/Tabla'
import BotonAccion from '../../components/Buttons/BotonAccion';
import { modalCore } from '../../utils/modalCore';
import { generadorCuando } from '../../utils/generador';

export default function Buscar() {

  const [filtros, setFiltros] = useState({});

  const columns = [
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
      render: (option, elem) => {
        return <>
          <BotonAccion
            text={option}
            type=''
            onClick={() => {
              modalCore.abrirModal(objModal(elem), 'info')
            }}
          />
        </>
      }
    },
  ]

  const objModal = (user) => {
    return {
      title: <h3 className={user.color?user.color:"black"}>{user.name}</h3>,
      content: (
        <div className="fdc w100">
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Cuenta creada el: </strong>{user.creado ? generadorCuando(user.creado * 1000, "DD/MM/YYYY").str : "Indefinido"}
          </div>
          <div>
            <strong>Biografía: </strong>{user.biografia}
          </div>
          <div className="asr">
            <BotonAccion
              text="Aceptar"
              onClick={() => {
                return modalCore.cerrarModal()
              }}
            />
          </div>
        </div>
      )
    }
  };

  return (
    <div className='fdc aic'>
      <h1>Buscar</h1>
      <Tabla
        className='w50'
        onSearch={Text}
        searchKey='username'
        placeholderSearch='Username'
        showBreadCrum={false}
        columns={columns}
        filterCallback={(filtro) => {
          setFiltros({ ...filtro })
        }}
        filterModalCallback={(filtro) => {
          setFiltros({ ...filtros, ...filtro })
        }}
        request={{
          url: "/usuarios/busqueda",
          method: "POST"
        }}
      />
    </div>
  )
}
