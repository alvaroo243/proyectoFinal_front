import TextArea from "antd/lib/input/TextArea";

// Componente que utilizaremos para escribir textos largos
// Creamos el componente
const EntradaTextArea = ({
    titulo,
    value = null,
    requerido = false,
    onChange = (valor) => {
        console.log('Entrada', valor)
    },
    ...options
}) => {

    // Devuelve un label y un TextArea
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
