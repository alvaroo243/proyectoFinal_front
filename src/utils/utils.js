export const validadorNumeros = /^[0-9.,]*$/

export const validadorLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÀÈÌÒÙàèìòù\u00f1\u00d1., ]*$/

export const validadorEmail = /\S+@\S+\.\S+/


export const resolvePermisos = (usuario, accesos = {}) => {
    if (!usuario) return false
    if (!accesos.roles) return true

    const tieneAcceso = accesos.roles.find(rol => rol === usuario.role)

    if(tieneAcceso) return true

    return false
}   