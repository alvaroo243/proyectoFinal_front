import { useUsuarioContext } from "./context/UsuarioContext";
import { compruebaToken } from "./utils/login";
import { useCallback, useEffect } from "react";

export default function RequiereAuth({
    accesos = {},
    children
}) {
    const [ usuario, setUsuario ] = useUsuarioContext()
    const token = localStorage.getItem('minijuegostoken')

    // Obtenemos los datos del usuario a traves del token
    const comprobarTokenAlmacenado = useCallback(() => {
        if ( !usuario && token ){

            return compruebaToken(token)
            .then(({ok, user}) => {
                let expiracion = user?.exp;
                if ( expiracion && (+expiracion * 1000) <= Date.now()) return window.location = '/login?logout';
    
                if ( ok ) setUsuario(user);
                else return window.location = '/login?logout';
            })
            .catch(err => {
                return window.location = '/login?logout'
            });
    
        }
    }, [token])

    useEffect(() => {
        comprobarTokenAlmacenado()
    }, [])

    // Si no hay token, redirigimos a login
    if (!token) return window.location = '/login?logout';


    // if ( usuario && !resolvePermisos(usuario, accesos) ) return window.location = '/';

    return usuario && children;
};
