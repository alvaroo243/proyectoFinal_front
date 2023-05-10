import React, { useState } from 'react'
import Tabla from '../../components/Tablas/Tabla'
import FiltrosUsuarios from './FiltrosUsuarios'

export default function AdministrarUsuarios() {

    const [filtros, setFiltros] = useState({});

    const columns = [
        {
            title: "Nombre",
            key: "name",
            dataIndex: "name",
            sorter: true,
            sorterId: 'name',
        },
        {
            title: "Username",
            key: "username",
            dataIndex: "username",
            sorter: true,
            sorterId: 'username',
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email",
            sorter: true,
            sorterId: 'email',
        },
        {
            title: "Creado",
            key: "creado",
            dataIndex: "creado",
            sorter: true,
            sorterId: 'creado',
        }
    ]

  return (
    <div className='fdc aic'>
        <h1>Zona de Administracion de Usuarios</h1>
        <Tabla
            columns={columns}
            modalContent={({...props}) => <FiltrosUsuarios {...props}/> }
            filterCallback={(filtro) => {
                setFiltros({...filtro})
            }}
            filterModalCallback={(filtro) => {
                setFiltros({...filtros, ...filtro})
            }}
            request={{
                url: "/usuarios",
                method: "POST",
            }}
        />
    </div>
  )
}
