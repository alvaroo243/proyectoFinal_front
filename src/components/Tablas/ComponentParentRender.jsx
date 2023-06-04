
// Este component parent render lo utilizaremos para coger las propiedades y el render de donde iniciamos el
// modal de filtros de cada tabla para asi pasarle las propiedades al modal
const ComponentParentRenderer = ({
    render,
    ...props
}) => render({ ...props });

export default ComponentParentRenderer;