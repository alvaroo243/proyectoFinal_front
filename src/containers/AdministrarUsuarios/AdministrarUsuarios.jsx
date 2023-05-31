import { useState } from 'react'
import Tabla from '../../components/Tablas/Tabla'
import FiltrosUsuarios from './FiltrosUsuarios'
import dayjs from 'dayjs';
import { generadorCuando } from '../../utils/generador';
import BotonAccion from '../../components/Buttons/BotonAccion';
import { request } from '../../utils/request';

export default function AdministrarUsuarios() {

    const [filtros, setFiltros] = useState({});
    const [updateRequest, setUpdateRequest] = useState(true);

    const defaultFilter = {
        $gte: dayjs().startOf('day').unix(),
        $lte: dayjs().endOf('day').unix()
    }

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
            render: (fecha) =>(fecha && generadorCuando(fecha * 1000, 'DD/MM/YYYY').str)
        },
        {
            title: "Rol",
            key: "role",
            dataIndex: "role",
            sorter: true,
            sorterId: "role"
        },
        {
            title: "Acciones",
            key: "acciones",
            dataIndex: "acciones",
            render: (option, elem) => {
                if (elem.username === "admin") return
                return <>
                    <BotonAccion 
                        text='Eliminar'
                        danger
                        onClick={async () => {
                            const {ok} = await request({
                                url: `/usuarios/eliminar/${elem._id}`,
                                method: "DELETE"
                            })
                            return setUpdateRequest(!updateRequest)
                        }}
                    />
                </>
            }
        }
    ]

  return (
    <div className='fdc aic'>
        <h1 className='tituloPagina'>Zona de Administracion de Usuarios</h1>
        <Tabla
        className='bcg br10 pd3em m2'
            tipoDato='usuarios'
            columns={columns}
            modalContent={({...props}) => <FiltrosUsuarios {...props}/> }
            defaultFilter={{creado: defaultFilter}}
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
            updateRequest={updateRequest}
            setUpdateRequest={setUpdateRequest}
        />
    </div>
  )
}
