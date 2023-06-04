import { useState } from "react";
import Tabla from "../../components/Tablas/Tabla";
import BotonAccion from "../../components/Buttons/BotonAccion";
import { modalCore } from "../../utils/modalCore";
import { generadorCuando } from "../../utils/generador";
import { request } from "../../utils/request";

// Este componente lo utilizaremos para la vista de Buscar
export default function Buscar() {

  // UseStates
  const [filtros, setFiltros] = useState({});


  // Buscaremos la puntuacion de el jugador seleccionado
  const puntuacionesJugador = async (username) => {
    const puntuaciones = await request({
      url: "/puntuaciones",
      method: "POST",
      options: {
        username: username,
      },
    });
    return puntuaciones
  };

  // Creamos las columnas de la zona de busqueda
  const columns = [
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
      render: (option, elem) => {
        return (
          <>
            <BotonAccion
              text={option}
              type=""
              onClick={async () => {
                const puntuaciones = await puntuacionesJugador(elem.username)
                elem.puntuaciones = puntuaciones
                modalCore.abrirModal(objModal(elem), "info");
              }}
            />
          </>
        );
      },
      sorter: true,
      sorterId: "username",
    },
  ];

  // Creamos el modal que mostrará la información de los jugadores
  const objModal = (user) => {
    return {
      title: <h3 className={user.color ? user.color : "black"}>{user.name}</h3>,
      content: (
        <div className="fdc w100">
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Cuenta creada el: </strong>
            {user.creado
              ? generadorCuando(user.creado * 1000, "DD/MM/YYYY").str
              : "Indefinido"}
          </div>
          <div>
            <strong>Biografía: </strong>
            {user.biografia}
          </div>
          <div className="fdr">
            <strong>Puntuaciones: </strong>
            <div>
              {user.puntuaciones?.tresEnRaya !== undefined && (
                <div>
                  - Tres en Raya: {user.puntuaciones.tresEnRaya}
                </div>
              )}
              {user.puntuaciones?.blackJack !== undefined && (
                <div>
                  - BlackJack: {user.puntuaciones.blackJack}
                </div>
              )}
            </div>
          </div>
          <div className="asr">
            <BotonAccion
              text="Aceptar"
              onClick={() => {
                return modalCore.cerrarModal();
              }}
            />
          </div>
        </div>
      ),
    };
  };

  // Devolvemos la tabla con su campo de busqueda y su paginacin y sin breadcrum
  return (
    <div className="fdc aic">
      <h1 className="tituloPagina">Buscar</h1>
      <Tabla
        className="w50 bcg pd3em br10"
        onSearch={Text}
        searchKey="username"
        placeholderSearch="Username"
        showBreadCrum={false}
        columns={columns}
        filterCallback={(filtro) => {
          setFiltros({ ...filtro });
        }}
        filterModalCallback={(filtro) => {
          setFiltros({ ...filtros, ...filtro });
        }}
        request={{
          url: "/usuarios/busqueda",
          method: "POST",
        }}
      />
    </div>
  );
}
