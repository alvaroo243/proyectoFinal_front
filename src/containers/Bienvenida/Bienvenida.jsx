import { useEffect } from 'react'
import { request } from '../../utils/request';
import Tetris from '../../components/Phaser/Tetris';
import Juego from '../../components/Phaser/Juego';

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
        <Juego />
    </>
  )
}
