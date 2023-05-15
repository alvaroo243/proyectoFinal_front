
import TextArea from "antd/lib/input/TextArea";

const EntradaTextArea = ({
    titulo,
    value = null,
    requerido = false,
    onChange = (valor) => {
        console.log('Entrada', valor)
    },
    ...options
}) => {

    return (
        <>
            <label className="labelEntradas">{titulo}</label>

            <TextArea
                className="mb2"
                value={value}
                onChange={(event) => {
                    return onChange(event.currentTarget.value)
                }}
                {...options}
            />

        </>
    );

};


export { EntradaTextArea };
