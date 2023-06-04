
// Creamos las variables para futuras validaciones
export const validadorNumeros = /^[0-9.,]*$/

export const validadorLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÀÈÌÒÙàèìòù\u00f1\u00d1., ]*$/

export const validadorEmail = /\S+@\S+\.\S+/

// Esta funcion la utilizaremos para comprobar los roles de los usuarios y los accesos que tienen
export const resolvePermisos = (usuario, accesos = {}) => {
    if (!usuario) return false
    if (!accesos.roles) return true

    // Si encuentra el rol del usuario en los accesos devuelve true
    const tieneAcceso = accesos.roles.find(rol => rol === usuario.role)

    if(tieneAcceso) return true

    return false
}   