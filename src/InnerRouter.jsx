import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { usuarioContextValue } from "./context/UsuarioContext";
import { resolvePermisos } from "./utils/utils";

export default function InnerRouter({
    routes: __rutas,
}) {

    const usuario = usuarioContextValue();
    const { opcion } = useParams();
    const __InnerRouter = useMemo(()=>{

        const existeRuta = __rutas.find(ruta => ruta.key === opcion)
        if ( !existeRuta ) return <h3>Pagina no encontrada!</h3>

        if ( usuario && !resolvePermisos(usuario, existeRuta.accesos) ) return window.location = '/';
        return existeRuta.render

    },[opcion])

    return (
        
        <div
            className="main-innerRouter fdc jcc aic"
        >   
            { __InnerRouter }
        </div>
        
    );
    
};