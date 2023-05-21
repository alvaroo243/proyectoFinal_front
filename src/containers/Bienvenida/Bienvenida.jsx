import { useEffect } from 'react'
import { request } from '../../utils/request';

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
    <div className='fdc aic'>
      <h1>¡¡BIENVENIDO!!</h1>
      <div>
        Esta web es una pequeña pagina de minjuegos que podrás disfrutar
      </div>
    </div>
  )
}
