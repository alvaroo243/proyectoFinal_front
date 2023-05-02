import { useContext, useState } from "react";
import { createContext } from "react";

// Mediante este context, lo que se hace es una variable global, la cual va a ser usuario
// para asi poder acceder a ella desde cualquier componente

const UsuarioContext = createContext(null);
export const useUsuarioContext = () => useContext(UsuarioContext)

export const usuarioContextValue = ()=>{
    const [ usuario ] = useContext(UsuarioContext)
    return usuario
}

export const UsuarioProvider = ({children}) => {
    const [ usuario, setUsuario ] = useState(null);
    return <UsuarioContext.Provider 
        value={[usuario, setUsuario]}
        children={children}
    />
};