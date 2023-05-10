import React from 'react'
import Entrada from '../../components/Inputs/Entrada'

export default function FiltrosUsuarios({
    filtros,
    setFiltros
}) {
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

                    return setFiltros({...filtros, name: username})
                }}
                className='mb2'
            />
            
        </div>
    </div>
  )
}
