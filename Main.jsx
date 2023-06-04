import { Suspense, lazy } from "react";
import { UsuarioProvider, useUsuarioContext } from "./src/context/UsuarioContext";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './src/styles/styles.scss'
import { resolvePermisos } from "./src/utils/utils";

// Importamos las vistas con lazy para que no se realice el import hasta que no sea necesario
const PaginaNoEncontrada = lazy(() => import('./src/containers/PaginaNoEncontrada'))
const Login = lazy(() => import('./src/containers/Login/Login'))
const RequiereAuth = lazy(() => import('./src/RequiereAuth'))
const Layout = lazy(() => import('./src/Layout'))
const Bienvenida = lazy(() => import('./src/containers/Bienvenida/Bienvenida'))
const Registro = lazy(() => import('./src/containers/Registro/Registro'))
const Buscar = lazy(() => import('./src/containers/Buscar/Buscar'))
const AdministrarUsuarios = lazy(() => import('./src/containers/AdministrarUsuarios/AdministrarUsuarios'))
const VerPerfil = lazy(() => import('./src/containers/Perfil/VerPerfil'))
const Juegos = lazy(() => import('./src/containers/Juegos/Juegos'))
const Puntuaciones = lazy(() => import('./src/containers/Puntuaciones/Puntuaciones'))


// Creamos el componente Router
const Router = () => {
    // Cogemos la funcion con la cual vamos a navegar a traves de vistas cuando se termine un procedimiento
    const navegar = useNavigate()
    // Cogemos el useContext de usuario
    const [usuario, setUsuario] = useUsuarioContext()

    // Array con todas las rutas
    const rutas = [
        {
            direccion: "*",
            render: <PaginaNoEncontrada />
        },
        {
            direccion: "/",
            render: <Bienvenida />,
            layout: true,
            autenticado: true,
            accesos: {
                roles: [
                    "ADMIN",
                    "USER"
                ]
            }
        },
        {
            direccion: "/login",
            render: <Login 
                onFinish={(_usuario) => {
                    setUsuario(_usuario)
                    return navegar('/', {replace: true})
                }}
            />
        },
        {
            direccion: "/registro",
            render: <Registro 
                onFinish={() => navegar('/login', {replace: true})}
            />
        },
        {
            // Dirección de la vista
            direccion: "/jugar",
            // Que mostrará cuando renderice
            render: <Juegos />,
            // Si necesita autenticacion para acceder
            autenticado: true,
            // Si aparecerá el layout en la vista
            layout: true,
            // Como saldrá en el menu
            menuRender: {
                label: "Jugar",
                key: "jugar"
            },
            // Los accesos que tendrá
            accesos: {
                roles: [
                    "ADMIN",
                    "USER"
                ]
            }
        },
        {
            direccion: "/puntuaciones",
            render: <Puntuaciones />,
            autenticado: true,
            layout: true,
            menuRender: {
                label: "Puntuaciones",
                key: "puntuaciones"
            },
            accesos: {
                roles: [
                    "ADMIN",
                    "USER"
                ]
            }
        },
        {
            direccion: "/buscar",
            render: <Buscar />,
            autenticado: true,
            layout: true,
            menuRender: {
                label: "Buscar",
                key: "buscar",
                // icon: 
                // className: 
            },
            accesos: {
                roles: [
                    "ADMIN",
                    "USER"
                ]
            }
        },
        {
            direccion: "/administrarUsuarios",
            render: <AdministrarUsuarios />,
            autenticado: true,
            layout: true,
            menuRender: {
                label: "Administrar Usuarios",
                key: "administrarUsuarios"
            },
            accesos: {
                roles: [
                    "ADMIN"
                ]
            }
        },
        {
            direccion:"/miperfil",
            render: <VerPerfil />,
            autenticado: true,
            layout: true,
            menuRender: {
                label: "Mi Perfil",
                key: "miperfil"
            },
            accesos: {
                roles: [
                    "ADMIN",
                    "USER"
                ]
            }
        }
    ]
    
    // Se filtran las rutas que estan en el menu, luego pasa un objeto de los menus mas sus accesos
    // Por ultimo los que tienen submenus se miran sus accesos y luego el del menu principal

    const menuItems = rutas
    .filter(_ruta => _ruta.menuRender )
    .map(_ruta => {
        return {
            ..._ruta.menuRender,
            accesos: _ruta.accesos
        }
    }).filter(_menu => {
        if ( _menu.children ) _menu.children = _menu.children.filter(_submenu => resolvePermisos(usuario,_submenu.accesos))
        return resolvePermisos(usuario,_menu.accesos)
    });

    return <Routes>
        {/* Hacemos un mapeo de las rutas */}
        {rutas.map( (ruta, index) =>{
            // Por cada ruta se mirara si hace falta autenticacion para acceder a ella o si esta en el menu Layout

            // Si es true se necesitara haber loggeado
            const cargaAutenticacion = (contenido, accesos = {})=> ruta.autenticado? <RequiereAuth accesos={accesos}>{contenido}</RequiereAuth> : contenido
            // Si es true estara en el menu sinos no
            const cargaLayout = (contenido) => ruta.layout? <Layout menu={menuItems} >{contenido}</Layout>: contenido
            // Miramos si cada item necesita o no autenticacion
            const HTMLElement = cargaAutenticacion( cargaLayout( ruta.render ), ruta.accesos )

            // Creamos las rutas
            return <Route
                key={index}
                path={ruta.direccion}
                exact
                element={ HTMLElement }
            />
        })}
    </Routes>
}


// Creamos el DOM principal donde se cargaran todas las vistas
// En este lo que hacemos es coger el elemento root creado en index.html y le asignamos como a root del DOM
ReactDOM.createRoot(document.getElementById('root')).render(
// Hacemos que este renderice el useContext de usuario para asi poder acceder desde cualquier vista
    <UsuarioProvider>
{/* // Luego creamos el browserRouter que es una parte esencial para que funcionen las rutas en nuestro proyecto de React */}
        <BrowserRouter>
{/* // Creamos un Suspense el cual no es esencial ya que es solo para que aparezca lo que tu quieras mientras hay una gran 
// carga en la pagina */}
            <Suspense fallback={
                <div className="fdc jcc aic vw100 vh100"> 
                    <img src="/img/cargando.gif" style={{width: "10em"}}/> 
                </div>
            } >
{/* // Por ultimo implementamos el componente Router el cual hemos creado antes */}
                <Router />
            </Suspense>
        </BrowserRouter>
    </UsuarioProvider>
)