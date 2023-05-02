import { BookOutlined, PoweroffOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { usuarioContextValue } from './context/UsuarioContext';


export default function Layout({
    menu: _menu,
    children
}) {

    const usuario = usuarioContextValue();

    const navigate = useNavigate();
    const location = useLocation();
    const navegacion = location.pathname.split('/');
    const paginaActual = (navegacion[navegacion.length-1]);

    const menu = [
        {
            key: '',
            label: <img className='menuPadding' style={{width:"160px"}} />,
        }, 
        ..._menu,
        {
            key: "logout#link",
            label: (
                <div>
                    <PoweroffOutlined className='red'/>
                    <span
                        className='white'
                        // children={ usuario.name.toUpperCase() }
                    />
                </div>
            ),
            onClick: () => {window.location = '/login?logout'},
            style:{  marginLeft: "auto"  }
        }
    ]
    
    return (
        <>
            <header
                className="heaPriWra"
            >
                <Menu 
                    theme='dark'
                    mode="horizontal"
                    items={menu}
                    selectedKeys={[paginaActual]}
                    onClick={(item)=>{

                        if ( item.key === paginaActual ) return;
                        if ( item.key.includes('#link')) return;
                        // remplazamos el rc-menu-more porque antd lo añade cuando estamos en version movil
                        const url = (item.keyPath.reverse()).join('/').replace('rc-menu-more/','');
                        return navigate(`/${url}`, { replace: false });
                    }}
                />
            </header>
            <main className=''>
                {children}
            </main>
        </>
    );
    
};