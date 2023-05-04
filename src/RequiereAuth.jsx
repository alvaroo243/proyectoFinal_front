import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsuarioContext } from "./context/UsuarioContext";
import { compruebaToken } from "./utils/login";

export default function RequiereAuth({
    accesos = {},
    children
}) {

    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ usuario, setUsuario ] = useUsuarioContext()

    const navigate = useNavigate();
    // Prioriza el token de la url y no se si esto es correcto
    let token = searchParams.get("token") ?? localStorage.getItem('token');
    const isExterno = searchParams.get("token") ? true : false;
    
    if ( isExterno ) {
        setSearchParams({});
        localStorage.setItem('token', token);
    }

    // Obtenemos los datos del usuario a traves del token
    if ( !usuario && token ){

        // Usamos promise para obtener los resultados de la funcion cuando se resuelva
        // ya que la funcion RequiereAuth no puede ser async y la funcion compruebaToken lo es
        const promiseCompruebaToken = Promise.resolve( compruebaToken(token) );

        promiseCompruebaToken.then((datosPromesa) => {
            
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

    // Si el token ha expirado, redirigimos a login
    if ( jwtExp.exp * 1000 < Date.now() ) return window.location = '/login?logout';
    if ( !token ) return window.location = '/login?logout';
    
    // if ( usuario && !resolvePermisos(usuario, accesos) ) return window.location = '/';

    return usuario && children;
};
