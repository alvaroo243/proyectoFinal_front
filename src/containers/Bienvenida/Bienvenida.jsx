import { useEffect } from 'react'
import { request } from '../../utils/request';

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
