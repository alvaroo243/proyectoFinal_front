import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsuarioContext } from "./context/UsuarioContext";
import { compruebaToken } from "./utils/login";

export default function RequiereAuth({
    accesos = {},
    children
}) {
    const [ usuario, setUsuario ] = useUsuarioContext()
    const token = localStorage.getItem('minijuegostoken')

    // Obtenemos los datos del usuario a traves del token
    if ( !usuario && token ){

        return compruebaToken(token)
        .then((datosPromesa) => {
            
            let { ok, getLogin } = datosPromesa;
            
            let expiracion = getLogin?.exp;
            if ( expiracion && (+expiracion * 1000) < Date.now()) return window.location = '/login?logout';

            if ( ok ) setUsuario(getLogin);
            else return window.location = '/login?logout';
        });

    }

    // Si no hay token o usuario, redirigimos a login
    if ( !usuario && !token) return window.location = '/login?logout';

    // Validamos el token para comprobar si ha expirado
    let jwtExp = JSON.parse(window.atob(token.split('.')[1]));
    console.log( jwtExp );

    // Si el token ha expirado, redirigimos a login
    if ( jwtExp.exp * 1000 < Date.now() ) return window.location = '/login?logout';
    console.log( "A TOMAR POR CULO" );
    if ( !token ) return window.location = '/login?logout';
    
    // if ( usuario && !resolvePermisos(usuario, accesos) ) return window.location = '/';

    return usuario && children;
};
