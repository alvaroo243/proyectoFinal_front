import { useEffect } from 'react'
import { request } from '../../utils/request';
import TresEnRaya from '../../components/Phaser/TresEnRaya';

// Vista de bienvenida
export default function Bienvenida() {

    useEffect(() => {
        (async () => {
          const {ok, list} = await request({
            url: "/prueba"
          })
          console.log( list );
        })()  
      }, [])

  return (
    <>
        <div>¡¡Bienvenido!!</div>
    </>
  )
}
