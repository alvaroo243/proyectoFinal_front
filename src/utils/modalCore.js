import { Modal } from "antd";
import '../styles/styles.scss'

// Esta es una clase basica que utilizaremos para mostrar un Modal
class ModalCore {
  ___modal = null;

  // Función con la que abriremos el modal
  abrirModal = function (objModal, type) {
    // Le asignamos a nuestro modal un modal nuevo del tipo indicado
    this.___modal = Modal[type]({
      className: "red",
      footer: null,
      destroyOnClose: true,
      // Esto se utiliza para cuando clicas fuera del modal, que este se cierre
      maskClosable: true,
      onCancel: () => {
        console.log("Cancelado Modal");
      },
      onOk: () => {
        console.log("Aceptado Modal");
      },
      ...objModal,
    });
  };

  // Función para actualizar el modal
  actualizaModal = function (objModal) {
    if (!!this.___modal) this.___modal.update(objModal);
  };

  // Función para cerrar el modal
  cerrarModal = function () {
    if (!!this.___modal) this.___modal.destroy();
  };

  // Constructor del ModalCore
  constructor() {
    if (typeof ModalCore.instance === "object") return ModalCore.instance;
    ModalCore.instance = this;

    return this;
  }
}

export const modalCore = new ModalCore();
