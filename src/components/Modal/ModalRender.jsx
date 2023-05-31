import { Button, Modal } from "antd";
import { useState, useEffect, cloneElement } from "react";

// Componente que utilizaremos para mostrar un Modal el cual renderiza la pagina sin recargarla
// Creamos el componente
export default function ModalRender({
    objModal = {},
    tipo = 'info',
    className = "",
    // Boton con el que abriremos el Modal
    iniciador = <Button title="Abrir Modal" />,
    abrirModal: _abrirModal = false
}) {

    // Creamos el objeto de los atributos que tendrá el Modal
    const _objModal = {
        title: 'Modal',
        content: "",
        botonesCustom: true,
        ...objModal
    }

    // Creamos las constantes
    const [ modal, setModal ] = useState(null);
    const [ abierto, setAbierto ] = useState(false);

    // Cuando se inicialice o se modifique _abrirModal o abierto se realizaran las funciones asignadas
    useEffect( () => {
        // Cuando utilizamos el && nos referimos a que si es boolean y es true o si existe la variable se realizara la 
        // siguiente comprobacion que en este caso es una funcion, por lo tanto se ejecutará
        _abrirModal && abrirModal();
    }, [_abrirModal]);

    useEffect(() => {
        abierto && actualizaModal();
    }, [abierto]);

    // Metodo que utilizaremos para abrir el Modal
    const abrirModal = () => {
        // Destructuramos el objeto y cogemos botonesCustom y content
        const { botonesCustom, content } = _objModal;
        // Si botonesCustom es true editamos los botones predefinidos y hacemos para que no existan
        // En el caso de que sea true habra que poner los botones custom en el content
        if ( botonesCustom ) {
            _objModal.cancelButtonProps = { style: { display: 'none' } };
            _objModal.okButtonProps = { style: { display: 'none' } };
        }

        // Clonamos el elemento content pero añadiendole cerrarModal
        const _content = cloneElement(content, {cerrarModal});

        // Le asignamos al objModal el nuevo content
        _objModal.content = _content
        // Y indicamos como se cerrará
        _objModal.afterClose = () => cerrarModal();
        
        // Seteamos el useState del modal para que tenga el Modal creado, este Modal es una funcion definida en antd
        setModal(Modal[tipo]({
            className: "dw50 mw90",
            destroyOnClose: true,
            maskClosable: true,
            ..._objModal
        }));

        // Indicamos que el modal esta abierto seteando el useState a true
        setAbierto(true);
    }

    // Funcion con la que cerramos el Modal destruyendolo
    const cerrarModal = () => {
        if ( modal ) modal.destroy();
        setAbierto(false);
    };

    // Funcion que utilizamos para actualizar el modal
    const actualizaModal = () => {
        const { content } = _objModal;
        if ( modal ) modal.update({content: cloneElement(content, {cerrarModal})});
    }
    
    // Devolveremos, si existe el iniciador, el iniciador con un onClick que abra el Modal
    return iniciador && (

        <div className={className}>
            {cloneElement(iniciador, {onClick: abrirModal})}
        </div>
        
    );
    
};