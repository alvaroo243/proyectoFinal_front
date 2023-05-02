import { BulbOutlined, DashboardOutlined, FireOutlined, UnorderedListOutlined, UsergroupDeleteOutlined, UserOutlined,CheckOutlined, ColumnWidthOutlined, FileSearchOutlined, FileAddOutlined } from '@ant-design/icons';
import { lazy } from 'react';

const ListadoComparador = lazy(()=> import('./containers/Comparativas/ListadoComparador/ListadoComparador'));
const Gas = lazy(()=> import('./containers/Contratacion/Gas/Gas'));
const Luz = lazy(()=> import('./containers/Contratacion/Luz/Luz'));
const ContratoMultiple = lazy(() => import('./containers/Contratacion/ContratoMultiple'));
const SimuladorPotencia = lazy(()=> import('./containers/Utilidades/SimuladorPotencia'));
const Comparador = lazy(()=> import('./containers/Comparativas/Comparador/Comparador'));
const Comisionado = lazy(()=> import('./containers/Utilidades/Comisionado'));
const Validadores = lazy(()=> import('./containers/Utilidades/Validadores'));

export const subruta = [
    { 
        key: 'subruta', 
        nombre: 'Subruta', 
        render: <h3>Subruta</h3>,
        accesos: {
            // permitido: {
            //     usuarios: [775]
            // },
            // restringido: {
            //     condiciones: [(usuario)=>{ return usuario.username.substring(0,4) !== 'sub-' }],
            //     usuarios: [775]
            // },
        }
    },
]

export const subrutasContratacion = [
    { 
        key: 'luz', 
        nombre: 'Luz', 
        render: <Luz />,
        icon: <BulbOutlined />,
    },
    { 
        key: 'gas', 
        nombre: 'Gas', 
        render: <Gas />,
        icon: <FireOutlined />,
    },
    { 
        key: 'contratoMultiple', 
        nombre: 'Multicontrato CCPP', 
        render: <ContratoMultiple />,
        icon: <FileAddOutlined />,
    },
];

export const subrutasUtilidades = [
    {
        key: 'simuladorPotencia',
        icon : <DashboardOutlined />,
        nombre: 'Simulador Potencia',
        render: <SimuladorPotencia />,
    },
    {
        key: 'Validadores',
        icon : <CheckOutlined  />,
        nombre: 'Validadores',
        render: <Validadores />,
    },
    {
        key: 'comisionado',
        icon : <FileSearchOutlined />,
        nombre: 'Consultar Comisionado',
        render: <Comisionado />,
        accesos : {
            // permitido: {
            //     usuarios: [170],
            // },
            restringido: {
                condiciones: [(usuario)=>{ return (!usuario.proveedor?.consultar_comisionado || usuario.principal) }],
                // usuarios: [170],
            }, 
        }
    }
]


export const subrutasComparativas = [
    {
        key: 'comparador',
        icon : <ColumnWidthOutlined />,
        nombre: 'Comparador',
        render: <Comparador />,
    },
    {
        key: 'listadoComparador',
        nombre: 'Listado de comparativas',
        render: <ListadoComparador />,
        icon: <UnorderedListOutlined />
    },
]

export const subrutasTutoriales = [

    { 
        key: 'operativaGeneral#link', 
        nombre: 'Operativa General', 
        onClick: () => {return window.open('https://sites.google.com/ganaenergia.com/colaboradores/p%C3%A1gina-de-inicio')}
    },
    { 
        key: 'operativaLiquidaciones#link', 
        nombre: 'Operativa Liquidaciones', 
        onClick: () => {
            return window.open('https://sites.google.com/ganaenergia.com/liquidaciones/p%C3%A1gina-de-inicio')
        },
        accesos: {
            restringido: {
                condiciones: [(usuario) => {return usuario.principal}]
            }
        }
    }
]