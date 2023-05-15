import { Select } from 'antd'
import React, { useState } from 'react'
import { request } from '../../utils/request';

export default function EntradaSelect({
    label,
    listado = [],
    className = "w100 mb2",
    selected,
    multiple = false,
    allowClear = true,
    showSearch = true,
    request: _request = {
        url: ''
    },
    onChange = (valor) => console.log( "EntradaSelect", valor ),
    ...options
}) {

    const [listaRequest, setListaRequest] = useState([]);

    const prop = {};
    if (multiple) prop.mode = "multiple"

  return (
    <>
        <label className='labelEntradas'>{label}</label>

        <Select 
            {...prop}
            filterOption={(search, { label }) => label && label.toLowerCase().includes(search.toLowerCase())}
            defaultValue={selected}
            placeholder={selected || "-"}
            className={className}
            options={listaRequest.length? listaRequest : listado}
            showSearch={showSearch}
            allowClear={allowClear}
            onClick={async () => {
                if (_request.url && !listaRequest.length) {
                    const {url, method = 'GET', options = {}, formato = {
                        key: 'key',
                        label: 'label',
                        value: 'value'
                    }} = _request;

                    const {ok, list = []} = await request({
                        url: url,
                        method: method,
                        options: options
                    })

                    if (!ok) return

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
