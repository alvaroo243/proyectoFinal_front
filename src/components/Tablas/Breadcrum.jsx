import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, EditOutlined, RetweetOutlined } from "@ant-design/icons";
import { Input, message, Tag } from "antd";
import { useState } from "react";
import LimpiarBoton from "../Buttons/LimpiarBoton";

// Componente que utilizaremos para mostrar la llamada que se hace a mongoDb para filtrar el boton de Default y el de Limpiar
export default function Breadcrum({
    json = {},
    jsonDefault = {},
    onChange = () => { console.log('cambiado breadcrum') }
}) {

    // Convertimos a Json el filtro que se utilice
    const strJson = JSON.stringify(json);
    // Convertimos a Json el filtro por defecto
    const strJsonDefault = JSON.stringify(jsonDefault);

    // Creamos los useStates
    const [editando, setEditando] = useState(false);
    const [breadcrum, setBreadcrum] = useState(null);

    // Esta funcion la utilizaremos para parsear el filtro que mandemos a JSON para que mongo lo pueda leer
    const enviaBreadcrum = () => {

        try {
            if (!!JSON.parse(breadcrum)) onChange(JSON.parse(breadcrum));
        } catch (err) {
            message.warning('Debe tener un formato breadcrum');
        }

        setBreadcrum(null)
        return setEditando(!editando)
    }

    // Esta función la utilizaremos para que se copie el breadcrum al clipboard
    const copyClipboard = () => {
        let __message = 'Copiado';
        try {
            navigator.clipboard.writeText(strJson)
        } catch (error) {
            __message = "No se pudo copiar por falta de permisos en el navegador";
        }

        return message.info(__message);

    }

    // Devolveremos un Tag  que variara segun si esta cargando o no, y a parte un boton de Default(si hay default) y de Limpiar
    return (

        <div aria-label="breadcrum" className="mb2">
            {/* Tag para mostrar el Breadcrum */}
            {/* Si se esta editando aparedera cargando, sinos aparecera el breadcrum con un boton de editar y de copiar */}
            <Tag>

                {editando
                    ? (
                        <>
                            <small className="pl2 pr2">
                                <i>
                                    <span>Breadcrum: </span>
                                    <Input
                                        size="small"
                                        style={{ width: 'auto', height: "20px" }}
                                        onChange={(event) => {
                                            return setBreadcrum(event.currentTarget.value)
                                        }}
                                        onKeyDown={event => {
                                            if (event.code === "Enter" || event.code === "NumpadEnter") {
                                                return enviaBreadcrum()
                                            };
                                        }}
                                    />
                                </i>
                            </small>
                            <CheckCircleOutlined
                                onClick={enviaBreadcrum}
                            />
                            <CloseCircleOutlined
                                onClick={() => {
                                    return setEditando(!editando)
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <EditOutlined onClick={() => {
                                setEditando(!editando);
                            }} />
                            <small className="pl2 pr2">
                                <i style={{ whiteSpace: "break-spaces" }}>
                                    <span>Breadcrum: </span>
                                    <span>{strJson}</span>
                                </i>
                            </small>
                            <CopyOutlined
                                onClick={copyClipboard}
                            />
                        </>
                    )
                }

            </Tag>
            {/* Si existe default aparecera el boton de Default para aplicar el filtro por defecto */}
            {strJsonDefault !== '{}' && (
                <Tag
                    className="pointer"
                    color={"volcano"}
                    onClick={() => {
                        onChange({ ...jsonDefault })
                    }}
                >
                    Default <RetweetOutlined />
                </Tag>
            )}
            {/* Si hay algun filtro aplicado aparecerá el boton de limipiar que borrara todo tipo de filtro que haya aplicado */}
            {strJson !== '{}' && (
                <LimpiarBoton
                    onClick={() => { return onChange({}) }}
                />
            )}
        </div>

    );

};


