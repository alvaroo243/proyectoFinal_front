import { LogoutOutlined } from '@ant-design/icons';
import { Calendar, Menu } from 'antd';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usuarioContextValue } from './context/UsuarioContext';

// En este componente lo que hacemos es crear el menu de superior para las rutas de las vistas 
export default function Layout({
    menu: _menu,
    children
}) {

    // Cogemos el usuarioContext
    const usuario = usuarioContextValue();

    // Creamos un navigate con el que navegaremos de pagina en pagina
    const navigate = useNavigate();
    // Cogemos la url actual
    const location = useLocation();
    const navegacion = location.pathname.split('/');
    const paginaActual = (navegacion[navegacion.length - 1]);

    // Creamos el menu Superior
    const menu = [
        // Este es el icono con el que se accederá al bienvenida
        {
            key: '',
            label: <img className='menuPadding' style={{ width: "40px" }} src='./img/mando.png' />,
        },
        // Demas vistas del menu
        ..._menu,
        // Boton de logout
        {
            key: "logout#link",
            label: (
                <div>
                    <LogoutOutlined className='red' />
                    <span
                        className='white'
                        children={usuario.name.toUpperCase()}
                    />
                </div>
            ),
            // Cuando se haga click sobre el se cambiara la url al logout
            onClick: () => { window.location = '/login?logout' },
            style: { marginLeft: "auto" }
        }
    ]

    // Devolvemos el header, el main y el footer, los cuales estaran en todas las vistas en las que se indique que quieren que aparezca el layout
    return (
        <>
            <header className='vh5'>
                <Menu
                    theme='dark'
                    mode="horizontal"
                    items={menu}
                    // Pagina actual
                    selectedKeys={[paginaActual]}
                    onClick={(item) => {
                        // Si es la pagina actual o es #link
                        if (item.key === paginaActual) return;
                        if (item.key.includes('#link')) return;
                        // Reemplazamos el rc-menu-more porque antd lo añade cuando estamos en versión móvil
                        const url = (item.keyPath.reverse()).join('/').replace('rc-menu-more/', '');
                        // Navegamos a la url
                        return navigate(`/${url}`, { replace: false });
                    }}
                />
            </header>
            <main className='mvh85'>
                {/* Devolvemos el main */}
                {children}
            </main>
            <footer className='vh20 fdr jcc aic jcse'>
                {/* Devolvemos el footer con diferentes enlaces */}
                <div className='mb2'>
                        <Link
                            to={"https://ieslluissimarro.org/"}
                            target='_blank'
                        >
                            <img
                                src='/img/simarro.png'
                                width={"150px"}
                            />
                        </Link>
                </div>
                <div className='mb2'>
                        <Link
                            to={"https://es.react.dev/"}
                            target='_blank'
                        >
                            <img
                                src='/img/react.png'
                                width={"100px"}
                            />
                        </Link>
                </div>
                <div>
                        <Link
                            to={"https://ant.design/"}
                            target='_blank'
                        >
                            <img
                                src='/img/ant.svg'
                                width={"100px"}
                            />
                        </Link>
                </div>
            </footer>
        </>
    );

};