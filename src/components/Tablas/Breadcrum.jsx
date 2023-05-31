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

    const enviaBreadcrum = () => {

        try {
            if (!!JSON.parse(breadcrum)) onChange(JSON.parse(breadcrum));
        } catch (err) {
            message.warning('Debe tener un formato breadcrum');
        }

        setBreadcrum(null)
        return setEditando(!editando)
    }

    const copyClipboard = () => {
        let __message = 'Copiado';
        try {
            navigator.clipboard.writeText(strJson)
        } catch (error) {
            __message = "No se pudo copiar por falta de permisos en el navegador";
        }

        return message.info(__message);

    }

    // Devolveremos un Tag si esta cargando y tres Tags si no esta cargando segun los casos
    return (

        <div aria-label="breadcrum" className="mb2">
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
            {strJson !== '{}' && (
                <LimpiarBoton
                    onClick={() => { return onChange({}) }}
                />
            )}
        </div>

    );

};


