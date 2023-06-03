import { LogoutOutlined } from '@ant-design/icons';
import { Calendar, Menu } from 'antd';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usuarioContextValue } from './context/UsuarioContext';

// En este componente lo que hacemos es crear el menu de superior para las rutas de las vistas 
export default function Layout({
    menu: _menu,
    children
}) {

    const usuario = usuarioContextValue();

    const navigate = useNavigate();
    const location = useLocation();
    const navegacion = location.pathname.split('/');
    const paginaActual = (navegacion[navegacion.length - 1]);

    const menu = [
        {
            key: '',
            label: <img className='menuPadding' style={{ width: "40px" }} src='./img/mando.png' />,
        },
        ..._menu,
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
            onClick: () => { window.location = '/login?logout' },
            style: { marginLeft: "auto" }
        }
    ]

    return (
        <>
            <header className='vh5'>
                <Menu
                    theme='dark'
                    mode="horizontal"
                    items={menu}
                    selectedKeys={[paginaActual]}
                    onClick={(item) => {

                        if (item.key === paginaActual) return;
                        if (item.key.includes('#link')) return;
                        // remplazamos el rc-menu-more porque antd lo añade cuando estamos en version movil
                        const url = (item.keyPath.reverse()).join('/').replace('rc-menu-more/', '');
                        return navigate(`/${url}`, { replace: false });
                    }}
                />
            </header>
            <main className='mvh85'>
                {children}
            </main>
            <footer className='vh20 fdr jcc aic jcse'>
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