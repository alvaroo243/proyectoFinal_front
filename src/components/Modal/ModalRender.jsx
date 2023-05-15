import { Button, Modal } from "antd";
import { useState, useEffect, cloneElement } from "react";

export default function ModalRender({
    objModal = {},
    tipo = 'info',
    className = "",
    iniciador = <Button title="Abrir Modal" />,
    abrirModal: _abrirModal = false
}) {
    const _objModal = {
        title: 'Modal',
        content: "",
        botonesCustom: true,
        ...objModal
    }

    const [ modal, setModal ] = useState(null);
    const [ abierto, setAbierto ] = useState(false);

    useEffect( () => {
        _abrirModal && abrirModal();
    }, [_abrirModal]);

    useEffect(() => {
        abierto && actualizaModal();
    }, [abierto]);

    const abrirModal = () => {
        const { botonesCustom, content } = _objModal;
        if ( botonesCustom ) {
            _objModal.cancelButtonProps = { style: { display: 'none' } };
            _objModal.okButtonProps = { style: { display: 'none' } };
        }

        const _content = cloneElement(content, {cerrarModal});

        _objModal.content = _content
        _objModal.afterClose = () => cerrarModal();
        
        setModal(Modal[tipo]({
            className: "dw50 mw90",
            destroyOnClose: true,
            maskClosable: true,
            ..._objModal
        }));

        setAbierto(true);
    }

    const cerrarModal = () => {
        if ( modal ) modal.destroy();
        setAbierto(false);
    };

    const actualizaModal = () => {
        const { content } = _objModal;
        if ( modal ) modal.update({content: cloneElement(content, {cerrarModal})});
    }
    
    return iniciador && (

        <div className={className}>
            {cloneElement(iniciador, {onClick: abrirModal})}
        </div>
        
    );
    
};