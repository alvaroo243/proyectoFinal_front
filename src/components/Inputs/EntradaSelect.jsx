import { Select } from 'antd'
import { useState } from 'react'
import { request } from '../../utils/request';

// Componente que utilizaremos para elegir una opción entre tantas que nos proporcionará una lista
// Creamos el componente
export default function EntradaSelect({
    label,
    // En esta propiedad pasaremos el listado que mostrará el select
    listado = [],
    className = "w100 mb2",
    // Esta será el campo que se seleccionará primero si se le indica alguno
    selected,
    allowClear = true,
    // Esta será por si queremos que se pueda buscar en el select
    showSearch = true,
    // Esta será para hacer una llamada que se le indique para asi coger automaticamente la lista que le devuelva 
    // la llamada
    request: _request = {
        url: ''
    },
    onChange = (valor) => console.log( "EntradaSelect", valor ),
    ...options
}) {

    // Creamos un useState de el listado que recogeremos en el request
    const [listaRequest, setListaRequest] = useState([]);

    // Devolvemos un label y un Select
  return (
    <>
        <label className='labelEntradas'>{label}</label>

        <Select 
            // Esta propiedad la utilizaremos para filtrar en el select, es decir, buscar una opcion
            filterOption={(search, { label }) => label && label.toLowerCase().includes(search.toLowerCase())}
            // Value del seleccionado predefinido
            defaultValue={selected}
            // Muestra el seleccionado predefinido si hay alguno
            placeholder={selected || "-"}
            className={className}
            // Si hay un listadoRequest lo mostrará, si no lo hay mostrará el listado normal
            options={listaRequest.length? listaRequest : listado}
            showSearch={showSearch}
            allowClear={allowClear}
            // Cuando se haga click para desplegar la vista se ejecutará el onClick
            onClick={async () => {
                // Si se ha pasado un request y no hay aun listaRequest cargada
                if (_request.url && !listaRequest.length) {
                    // Cogemos los datos pasados en el request
                    const {url, method = 'GET', options = {}, formato = {
                        key: 'key',
                        label: 'label',
                        value: 'value'
                    }} = _request;

                    // Hacemos una llamada al back para recoger la lista
                    const {ok, list = []} = await request({
                        url: url,
                        method: method,
                        options: options
                    })

                    // Si no ha ido bien la llamada hará un return sin nada
                    if (!ok) return

                    // Sinos seteara listaRequest con la lista que el back devolvió y con el formato correspondiente
                    const {key, label, value} = formato;
                    return setListaRequest(list.map(elem => {
                        return {
                            key: elem[key],
                            label: elem[label],
                            value: elem[value]
                        }
                    }))
                }
            }}
            onChange={(value, option) => onChange(value, option)}
            {...options}
        />
    </>
  )
}
