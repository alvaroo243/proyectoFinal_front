import { useUsuarioContext } from "./context/UsuarioContext";
import { compruebaToken } from "./utils/login";
import { useCallback, useEffect } from "react";
import { resolvePermisos } from "./utils/utils";

// Este componente lo utilizaremos para si necesita estar autorizado para acceder a la vista elegida
// le deje acceder o no si existe el usuario y el token
export default function RequiereAuth({
    accesos = {},
    children
}) {
    // Cogemos el usuarioContext
    const [ usuario, setUsuario ] = useUsuarioContext()
    // Cogemos el token actual
    const token = localStorage.getItem('minijuegostoken')

    // Obtenemos los datos del usuario a traves del token, cuando se inicia la pagina o cuando hay un cambio en el token
    const comprobarTokenAlmacenado = useCallback(() => {
        if ( !usuario && token ){

            return compruebaToken(token)
            .then(({ok, user}) => {
                let expiracion = user?.exp;
                // Si se ha excedido la fecha de expiracion se hace logout
                if ( expiracion && (+expiracion * 1000) <= Date.now()) return window.location = '/login?logout';
                // Si todo ha ido bien se setea el usuarioContext sinos logout
                if ( ok ) setUsuario(user);
                else return window.location = '/login?logout';
            })
            .catch(err => {
                return window.location = '/login?logout'
            });
    
        }
    }, [token])

    // Creamos un useEffect para cuando cargue la pagina
    useEffect(() => {
        comprobarTokenAlmacenado()
    }, [])

    // Si no hay token, redirigimos a login
    if (!token) return window.location = '/login?logout';

    // Miramos los permisos del usuario
    if ( usuario && !resolvePermisos(usuario, accesos) ) return window.location = '/';

    // Si todo esta bien devolvemos la vista
    return usuario && children;
};
