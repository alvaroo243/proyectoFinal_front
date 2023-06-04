import { useState } from 'react'
import Tabla from '../../components/Tablas/Tabla'
import FiltrosUsuarios from './FiltrosUsuarios'
import dayjs from 'dayjs';
import { generadorCuando } from '../../utils/generador';
import BotonAccion from '../../components/Buttons/BotonAccion';
import { request } from '../../utils/request';

// Este componente lo utilizaremo para la Administración de usuarios que tendrán los admins
export default function AdministrarUsuarios() {

    // Creamos los useStates necesarios
    const [filtros, setFiltros] = useState({});
    const [updateRequest, setUpdateRequest] = useState(true);

    // Creamos el filtro que tendrá por defecto la tabla
    const defaultFilter = {
        $gte: dayjs().startOf('day').unix(),
        $lte: dayjs().endOf('day').unix()
    }

    // Creamos las columnas que tendrá la tabla
    const columns = [
        {
            // Titulo de la columna
            title: "Nombre",
            // Key de la columna
            key: "name",
            // Nombre por el que realizará la busqueda en el back
            dataIndex: "name",
            // Indica si se puede ordenar por este atributo
            sorter: true,
            // Indica el nombre de el atributo por el que se ordenará
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
            // Cuando se renderice la columna se realizara lo que se le indique
            // En este caso pasamos de el formato ts a el formato str para que se vea ciertamente la fecha
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
            // Aqui renderizamos para que si es user aparezca un boton con el que podemo eliminar el usuario
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

    // Devolvemos la tabla con todo lo necesario para que funcione correctamente y se vea como queremos
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
