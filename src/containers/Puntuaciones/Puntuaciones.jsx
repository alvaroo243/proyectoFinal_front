import { useState } from 'react';
import Tabla from '../../components/Tablas/Tabla'

export default function Puntuaciones() {

  const [filtros, setFiltros] = useState({});
  const [cargado, setCargado] = useState(false)

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
  ];

  const columnasBlackJack = [
    {
      title: "Username",
      key: "username",
      dataIndex: "username"
    },
    {
      title: "Mejor Beneficio",
      key: "blackJack",
      dataIndex: "blackJack",
      sorter: true,
      sorterId: "blackJack"
    }
  ]

  return (
    <div className='fdc aic'>
      <h1 className='tituloPagina'>Puntuaciones</h1>
      <div className='w50 bcg pd3em mb2 br10'>
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
          tablaCargada={(cargando) => {
            setCargado(true)
          }}
        />
      </div>
      <div className='w50 bcg pd3em mb2 br10'>
        {
          cargado &&
          <Tabla
            className=''
            title={"Mejores puntuaciones BlackJack"}
            showBreadCrum={false}
            columns={columnasBlackJack}
            key={"TablaBlackJack"}

            request={{
              url: "/puntuaciones/blackJack/todas",
              method: "POST"
            }}
            filterCallback={(filtro) => {
              setFiltros({ ...filtro })
            }}
            filterModalCallback={(filtro) => {
              setFiltros({ ...filtros, ...filtro })
            }}
          />
        }
      </div>
    </div>
  )
}
