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

// Este componente lo utilizaremos para hacer una tabla, la cual tenga filtros, se renderice cuando queramos
// y tenga una paginacion simple y rapida
export default function Tabla({
    title,
    className = "m2",
    // Propiedad que utilizaremos para hacer la llamada para recoger la información de la tabla
    request: __request = {
        url: '/',
        method: 'get',
        options: {}
    },
    // La utilizaremos para la paginación de la tabla
    paginacion: __paginacion = {
        tamanoPorPagina: 10
    },
    // La utilizaremos para que aparezca el modal de Filtros 
    modalContent,
    // La utilizaremos para mostrar los nombres de las columnas que vamos a recibir
    columns = [],
    // La utilizaremos para indicar la key de cada row
    rowKey = ({ _id }) => _id,
    // La utilizaremos por si queremos hacer una busqueda en la tabla
    searchKey = "",
    // Metodo para cuando se hace una busqueda en la tabla
    onSearch = (_x) => { return _x },
    // Placeholder de el campo de busqueda
    placeholderSearch = "",
    // Filtro por defecto
    defaultFilter = {},
    // Lo utilizaremos para cuando haya un cambio en los filtros se haga una llamada al back
    filterCallback = () => { },
    // Lo mismo que el filterCallback pero cuando haya cambios en los filtros del Modal
    filterModalCallback = () => { },
    rowClassName,
    // Para indicar en los textos que aparece en la tabla, que se está buscando
    tipoDato = '',
    heightTable = '40vh',
    // Para mostrar el breadCrum
    showBreadCrum = true,
    // Por si es una tabla sin filtros
    cargarSinFiltros = false,
    // Para hacer el renderizado de la tabla
    updateRequest = null,
    setUpdateRequest,
    // Para cuando este la tabla cargada realizar una accion
    tablaCargada = (cargado) => { },
    ...options
}) {
    // Creamos los useStates
    // UseState para cuando este cargando a tabla
    const [cargando, setCargando] = useState(false);
    // UseState de la paginacion
    const [paginacion, setPaginacion] = useState({
        paginaActual: 1,
        tamanoPorPagina: 10,
        orden: null,
        ...__paginacion,
    });

    // Filtros
    const [filtrosModal, setFiltrosModal] = useState({ ...defaultFilter });
    const [filtros, setFiltros] = useState({ ...defaultFilter });

    // Datos que se muestran en la tabla
    const [dataSource, setDataSource] = useState({
        list: [],
        total: 0,
    });

    // Valor de la busqueda
    const [searchValue, setSearchValue] = useState("");

    // Cuando haya un cambio en paginacion, filtros, updateRequest o setUpdateRequest, esta función se realizará
    const peticionCallback = useCallback(async () => {
        // Hacemos una llamada al back
        return await request({
            url: __request.url,
            method: __request.method,
            options: {
                ...__request.options, // Se pone antes para que no sustituya la paginacion o filtro
                paginacion,
                filtros,
            },
            headers: { ...__request.headers },
        });
    }, [paginacion, filtros, updateRequest, setUpdateRequest]);

    // Esta función se realizará cuando haya un cambio en paginación, filtros o updateRequest
    useEffect(() => {
        // Si se puede cargar sin filtros y no hay ningun filtro aplicado será true
        const sePuedeCargar = (cargarSinFiltros && !Object.keys(filtros).length)
        // Seteamos el DataSource
        setDataSource({
            list: [],
            total: 0,
        })
        // Esta función es utilizada para procesar una función después de un tiempo determinado
        easyDebounce({
            key: "tableRenderRequest",
            // Cuando pasen 100 milisegundos se ejecutará esta función
            fnc: async () => {
                setCargando(true)

                // Si se puede cargar se cargará sin nada, sinos se hará la petición al back
                const peticion = sePuedeCargar ? { ok: true, list: [], total: 0 } : await peticionCallback()
                // Enviamos el estado de la peticion, si existe
                tablaCargada(peticion?.ok);
                // Seteamos el daata source con el resultado de la llamada, si existe
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
        // Comprobamos que existe el filtro de busqueda y que sea regex
        if (filtros[searchKey] && filtros[searchKey].$regex) setSearchValue(filtros[searchKey].$regex);
        setPaginacion({
            paginaActual: 1,
            tamanoPorPagina: 10,
            orden: null,
            ...__paginacion
        })
    }, [filtros]);

    // Creamos lo que será el modal de los Filtros
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

    // Cuando haya un cambio en los filtros del Modal, este se actualizará
    useEffect(() => {
        modalCore.actualizaModal(objModal)
    }, [filtrosModal]);

    // Devolvemos la tabla con el modal de los filtros, el breadcrum, la busqueda, y a paginacion, todo esto segun como queramos
    return (

        <div className={className}>

            <h3 className="">{title}</h3>

            <div className="">

                {/* Si existe modalContent aparecerá lo siguiente*/}
                {modalContent && (<>

                    {/* 
                        Devolvemos un badge con un tag. El badge lo que hará sera mostrar un coontador de los filtros aplicados en la Tabla.
                        Luego el tag se utiliza para iniciar el Modal de los filtros
                    */}
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

                    {/* Si searchKey existe aparecerá lo siguiente */}
                    {searchKey && (
                        <div className="fb50">
                        {/* Mostrará un tag con un campo search dentro en el cual podrás escribir y habrá un botón de busqueda al lado */}
                        <Tag
                            className=""
                            style={{ maxHeight: '40px' }}
                            color={"geekblue"}
                        >
                            <Search
                                placeholder={placeholderSearch}
                                className=""
                                allowClear
                                // Indicamos el valor que tiene el campo
                                value={searchValue}
                                // Cuando haya un cambio setearemos su value
                                onChange={(e) => {
                                    setSearchValue(e.target.value)
                                }}
                                // Cuando se busque se realizará un filtro en la busqueda del back
                                onSearch={(text) => {
                                    // Si hay algo en el campo se buscara, sinos se hara una busqueda general
                                    if (text) {
                                        setFiltros({
                                            ...filtros,
                                            // Indicamos el campo que se busca
                                            [searchKey]: {
                                                $regex: text
                                            }
                                        })
                                        setFiltrosModal({
                                            ...filtros,
                                            // Indicamos el campo que se busca
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

                    {/* Si showBreadCrum es true se mostrará lo sigiuente */}
                    {
                        showBreadCrum &&

                        <div className="fdr fb50" >
                            <div className="mt2">
                                {/* Mostrará el breadCrum */}
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
                            {/* Si existe el total de dataSource mostrara un texto indicando el total de la busqueda */}
                            {
                                Boolean(dataSource?.total) &&

                                <div className="aic bolder">

                                    <p className="">Total de {tipoDato?.toLowerCase() || title?.toLowerCase()}:</p>
                                    <p className="red">{dataSource.total ? dataSource.total : ''}</p>

                                </div>

                            }

                            {/* Si existe pero es 0 se mostrara que no se ha encontrado */}
                            {
                                !!(dataSource?.total === 0) &&
                                <div className="bolder aic">
                                    <p className="">No se han encontrato {tipoDato ? tipoDato : 'datos'}</p>
                                </div>
                            }

                        </div>

                    }


                    <div className={`tar ${showBreadCrum || searchKey?"fb50": "fb100"}`}>
                        {/* Mostrara la paginacion que se hace en la busqueda y se puede editar */}
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

                {/* Mostrará la tabla con todo aplicado y algunas propiedades para que la tabla quede bien */}
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
                            position: ['none'] // Al tener la paginacion externalizada este no se debe mostrar
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
