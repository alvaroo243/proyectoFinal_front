import { Suspense, lazy } from "react";
import { UsuarioProvider, useUsuarioContext } from "./src/context/UsuarioContext";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import PaginaNoEncontrada from "./src/containers/PaginaNoEncontrada";
import RequiereAuth from "./src/RequiereAuth";
import Layout from "./src/Layout"

const Login = lazy(() => import('./src/containers/Login/Login'))

// Creamos el componente Router
const Router = () => {
    // Cogemos la funcion con la cual vamos a navegar a traves de vistas
    const navegar = useNavigate()
    // Cogemos el useContext de usuario
    const [usuario, setUsuario] = useUsuarioContext()

    const rutas = [
        {
            direccion: "*",
            render: <PaginaNoEncontrada />
        },
        {
            direccion: "/",
            render: "Hola",
            layout: true
        },
        {
            direccion: "/login",
            render: <Login />,
            menuRender: {
                label: "Login",
                key: "login"
            },
            layout: true
        }
    ]
    
     // Se filta las rutas que estan en el menu, luego pasa un objeto de los menus mas sus accesos
    // Por ultimo los que tienen submenus se miran sus accesos y luego el del menu principal

    // const menuItems = rutas
    // .filter(__ruta => __ruta.menuRender )
    // .map(__ruta => {
    //     return {
    //         ...__ruta.menuRender,
    //         accesos: __ruta.accesos
    //     }
    // }).filter(_menu => {
    //     if ( _menu.children ) _menu.children = _menu.children.filter(_submenu => resolvePermisos(usuario,_submenu.accesos))
    //     return resolvePermisos(usuario,_menu.accesos)
    // });

    const menuItems = rutas.filter(_ruta => _ruta.menuRender).map(_ruta => {
        return {..._ruta.menuRender}
    })

    return <Routes>
        {rutas.map( (ruta, index) =>{

            const cargaAutenticacion = (contenido, accesos = {})=> ruta.autenticado? <RequiereAuth accesos={accesos}>{contenido}</RequiereAuth> : contenido
            const cargaLayout = (contenido) => ruta.layout? <Layout menu={menuItems} >{contenido}</Layout>: contenido
            const HTMLElement = cargaAutenticacion( cargaLayout( ruta.render ), ruta.accesos )

            return <Route
                key={index}
                path={ruta.direccion}
                exact
                element={ HTMLElement }
            />
        })}
    </Routes>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <UsuarioProvider>
        <BrowserRouter>
            <Suspense >
                <Router />
            </Suspense>
        </BrowserRouter>
    </UsuarioProvider>
)