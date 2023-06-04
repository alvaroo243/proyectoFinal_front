import Entrada from '../../components/Inputs/Entrada'
import EntradaRangoFechas from '../../components/Inputs/EntradaRangoFechas'
import EntradaSelect from '../../components/Inputs/EntradaSelect'

// Este componente lo utilizará la vista de Administración de usuarios para aplicar los filtros a la tabla
export default function FiltrosUsuarios({
    filtros,
    setFiltros
}) {

    // Creamos el listado que tendra el select de roles
    const listadoRoles = [
        {
            key: "admin",
            label: "Admin",
            value: "ADMIN"
        },
        {
            key: "user",
            label: "User",
            value: "USER"
        }
    ]

    // Devolvemos todos Inpust que tendrá el modal para hacer la busqueda
  return (
    <div>
        <div>
            <Entrada 
                label={"Nombre"}
                value={filtros.name}
                onChange={(value) => {
                    if (!value) {
                        delete filtros.name
                        return setFiltros({...filtros})
                    }

                    return setFiltros({...filtros, name: value})
                }}
                className='mb2'
            />
            <Entrada 
                label={"Username"}
                value={filtros.username}
                onChange={(value) => {
                    if (!value) {
                        delete filtros.username
                        return setFiltros({...filtros})
                    }

                    return setFiltros({...filtros, username: value})
                }}
                className='mb2'
            />
            <EntradaSelect
                label={"Email"}
                selected={filtros.email}
                request={{
                    url: "/usuarios/email",
                    method: "POST",
                    options: {
                        filtros: filtros
                    },
                    // Indicamos el formato del select
                    formato: {
                        key: '_id',
                        label: 'email',
                        value: 'email'
                    }
                }}
                onChange={(value) => {
                    if (!value) {
                        delete filtros.email
                        return setFiltros({...filtros})
                    }

                    return setFiltros({...filtros, email: value})
                }}
            />
            <EntradaRangoFechas 
                label={"Creado"}
                values={filtros.creado}
                onChange={(value) => {
                    if (!value) {
                        delete filtros.creado
                        return setFiltros({...filtros})
                    }

                    return setFiltros({...filtros, creado: value})
                }}
                // Indicamo los parametros que pasaremos
                params={['$gte', '$lte']}
            />
            <EntradaSelect
                label={"Rol"}
                selected={filtros.role}
                listado={listadoRoles}
                onChange={(value) => {
                    if (!value) {
                        delete filtros.role
                        return setFiltros({...filtros})
                    }

                    return setFiltros({...filtros, role: value })
                }}
            />
        </div>
    </div>
  )
}
