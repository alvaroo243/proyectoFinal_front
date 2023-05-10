import { Modal } from "antd";

class ModalCore {
  ___modal = null;

  abrirModal = function (objModal, type) {
    this.___modal = Modal[type]({
      className: "dw50 mw90",
      footer: null,
      destroyOnClose: true,
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

  actualizaModal = function (objModal) {
    if (!!this.___modal) this.___modal.update(objModal);
  };

  cerrarModal = function () {
    if (!!this.___modal) this.___modal.destroy();
  };

  constructor() {
    if (typeof ModalCore.instance === "object") return ModalCore.instance;
    ModalCore.instance = this;

    return this;
  }
}

export const modalCore = new ModalCore();
