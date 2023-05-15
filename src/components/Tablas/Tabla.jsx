import { FilterOutlined } from "@ant-design/icons";
import { Badge, Input, Pagination, Table, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { modalCore } from "../../utils/modalCore";
import ComponentParentRenderer from "./ComponentParentRender";
import Breadcrum from "./Breadcrum";
import { easyDebounce } from "../../utils/debounce";
import { request } from "../../utils/request";
import BotonAccion from "../Buttons/BotonAccion";

const {Search} = Input


//todo: cambiar para que el titulo pueda star vacio y que no se muestre.
export default function Tabla({
    title,
    className = "m2",
    request: __request = {
        url: '/',
        method: 'get',
        options: {}
    },
    paginacion: __paginacion = {
        tamanoPorPagina: 10
    },
    modalContent, // ({...props}) => null,
    columns = [],
    rowKey = ({ _id }) => _id,
    searchKey = "",
    onSearch = (_x) => { return _x },
    placeholderSearch = "",
    defaultFilter = {},
    filterCallback = () => { },
    filterModalCallback = () => { },
    rowClassName,
    tipoDato = '',
    heightTable = '60vh',
    showBreadCrum = true,
    cargarSinFiltros = false,
    updateRequest = null,
    setUpdateRequest,
    tablaCargada = (cargado) => { },
    ...options
}) {
    const [cargando, setCargando] = useState(false);
    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        tamanoPorPagina: 10,
        orden: null,
        ...__paginacion,
    });

    const [filtrosModal, setFiltrosModal] = useState({ ...defaultFilter });
    const [filtros, setFiltros] = useState({ ...defaultFilter });

    const [dataSource, setDataSource] = useState({
        list: [],
        total: 0,
    });

    const [searchValue, setSearchValue] = useState("");


    const peticionCallback = useCallback(async () => {
        return await request({
            url: __request.url,
            method: __request.method,
            options: {
                ...__request.options, // se pone antes para que no sustituya la paginacion o filtro
                paginacion,
                filtros,
            },
            headers: { ...__request.headers },
        });
    }, [paginacion, filtros, updateRequest, setUpdateRequest]);

    useEffect(() => {
        const sePuedeCargar = (cargarSinFiltros && !Object.keys(filtros).length)
        setDataSource({
            list: [],
            total: 0,
        })
        easyDebounce({
            key: "tableRenderRequest",
            fnc: async () => {
                setCargando(true)

                const peticion = sePuedeCargar ? { ok: true, list: [], total: 0 } : await peticionCallback()
                tablaCargada(peticion?.ok);
                peticion.ok && setDataSource({
                    list: peticion.list,
                    total: peticion.total,
                })
                filterCallback();

                setCargando(false)

            },
        }, 100)
    }, [paginacion, filtros, updateRequest]);

    // Limpia los totales al cambiar los filtros
    // Limpia la paginacion al cambiar los filtros
    useEffect(() => {
        // Comprobamos que exise el filtro de busqueda y que sea regex
        if (filtros[searchKey] && filtros[searchKey].$regex) setSearchValue(filtros[searchKey].$regex);
        setPaginacion({
            paginaActual: 1,
            tamanoPorPagina: 10,
            orden: null,
            ...__paginacion
        })
    }, [filtros]);

    const objModal = {
        title: <h3>Filtros</h3>,
        content: (
            <div className="fdc aic w100">
                <ComponentParentRenderer
                    render={modalContent}
                    setFiltros={setFiltrosModal}
                    filtros={filtrosModal}
                />
                <div className="asr">
                    <BotonAccion
                        text="Aceptar"
                        onClick={() => {
                            if (filtrosModal[searchKey]) {
                                searchKey = filtrosModal[searchKey];
                            }
                            setFiltros({ ...filtrosModal });
                            filterModalCallback({ ...filtrosModal });
                            return modalCore.cerrarModal()
                        }}
                    />
                    <BotonAccion
                        text="Cancelar"
                        type="default"
                        onClick={() => {
                            return modalCore.cerrarModal()
                        }}
                    />
                </div>
            </div>
        )
    };

    useEffect(() => {
        modalCore.actualizaModal(objModal)
    }, [filtrosModal]);

    return (

        <div className={className}>

            <h1 className="">{title}</h1>

            <div className="">

                {modalContent && (<>

                    <Badge count={Object.keys(filtros).length}>
                        <Tag
                            className="w100 pointer"
                            style={{ maxHeight: '40px' }}
                            color={"blue"}
                            icon={<FilterOutlined />}
                            onClick={() => {
                                modalCore.abrirModal(objModal, 'confirm')
                            }}
                        >
                            Filtros
                        </Tag>
                    </Badge>

                </>)
                }


            </div>

            <div className="fdc tabla">

                <div className="fdr aic">

                    {searchKey && (
                        <div className="fb50">
                        <Tag
                            className=""
                            style={{ maxHeight: '40px' }}
                            color={"geekblue"}
                        >
                            <Search
                                placeholder={placeholderSearch}
                                className=""
                                allowClear
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value)
                                }}
                                onSearch={(text) => {
                                    if (text) {
                                        setFiltros({
                                            ...filtros,
                                            [searchKey]: {
                                                $regex: text
                                            }
                                        })
                                        setFiltrosModal({
                                            ...filtros,
                                            [searchKey]: {
                                                $regex: text
                                            }
                                        })
                                    } else {
                                        setFiltrosModal({});
                                        setFiltros({})
                                    }

                                }}

                            />
                        </Tag>
                        </div>
                    )}

                    {
                        showBreadCrum &&

                        <div className="fdr fb50" >
                            <div className="mt2">
                                <Breadcrum
                                    json={filtros}
                                    jsonDefault={defaultFilter}
                                    onChange={(breadcrum) => {
                                        filterModalCallback({ ...breadcrum });
                                        setFiltrosModal({ ...breadcrum });
                                        return setFiltros({ ...breadcrum });
                                    }}
                                />
                            </div>
                            {
                                Boolean(dataSource?.total) &&

                                <div className="aic bolder">

                                    <p className="">Total de {tipoDato?.toLowerCase() || title?.toLowerCase()}:</p>
                                    <p className="red">{dataSource.total ? dataSource.total : ''}</p>

                                </div>

                            }

                            {
                                !!(dataSource?.total === 0) &&
                                <div className="bolder aic">
                                    <p className="">No se han encontrato {tipoDato ? tipoDato : 'datos'}</p>
                                </div>
                            }

                        </div>

                    }


                    <div className="tar fb50">
                        <Pagination
                            total={dataSource.total}
                            current={paginacion.paginaActual}
                            pageSize={paginacion.tamanoPorPagina}
                            showSizeChanger
                            onChange={(page, pageSize) => {

                                setPaginacion({
                                    ...paginacion,
                                    paginaActual: page,
                                    tamanoPorPagina: pageSize
                                })

                            }}
                        />
                    </div>
                </div>


                <div className="fdc row">
                    <Table
                        style={{ overflowY: 'auto', height: heightTable }}
                        dataSource={dataSource.list}
                        rowKey={rowKey}
                        rowClassName={rowClassName} // Aquí le ponemos los colores a las columnas de acuerdo al caso.
                        columns={columns}
                        height={heightTable}
                        showHeader={true}
                        sticky={true}
                        offsetHeader={120}
                        loading={cargando}
                        pagination={{
                            current: paginacion.paginaActual,
                            pageSize: paginacion.tamanoPorPagina,
                            position: ['none'] // al tener la paginacion externalizada este no se debe mostrar
                        }}
                        onChange={(pagination, _filter, sort) => {

                            const orden = sort.column ? {
                                order: sort.order,
                                sorterId: sort.column.sorterId ?? sort.column.dataIndex
                            } : null;

                            setPaginacion({
                                ...paginacion,
                                paginaActual: pagination.current,
                                tamanoPorPagina: pagination.pageSize,
                                orden: orden
                            });

                        }}
                        {...options}
                    >

                    </Table>

                </div>


            </div>





        </div>

    );

};
