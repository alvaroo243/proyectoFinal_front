import { useState } from 'react';
import Tabla from '../../components/Tablas/Tabla'

export default function Puntuaciones() {

  const [filtros, setFiltros] = useState({});

  const columnasTresEnRaya = [
    {
      title: "Username",
      key: "username",
      dataIndex: "username"
    },
    {
      title: "Mejor Puntuacion",
      key: "tresEnRaya",
      dataIndex: "tresEnRaya",
      sorter: true,
      sorterId: "tresEnRaya"
    }
  ]

  return (
    <div className='fdc aic'>
      <h1>Puntuaciones</h1>
      <div className='w50'>
        <Tabla 
          title={"Mejores puntuaciones Tres En Raya"}
          showBreadCrum={false}
          columns={columnasTresEnRaya}
          key={"TablaTresEnRaya"}
          request={{
            url: "/puntuaciones/getTresEnRaya",
            method: "POST"
          }}
          filterCallback={(filtro) => {
            setFiltros({ ...filtro })
          }}
          filterModalCallback={(filtro) => {
            setFiltros({ ...filtros, ...filtro })
          }}
        />
      </div>
    </div>
  )
}
