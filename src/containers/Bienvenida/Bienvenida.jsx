import { useEffect } from 'react'
import { request } from '../../utils/request';
import { Link } from 'react-router-dom';

// Vista de bienvenida
export default function Bienvenida() {

  useEffect(() => {
    (async () => {
      const { ok, list } = await request({
        url: "/prueba"
      })
      console.log(list);
    })()
  }, [])

  return (
    <div className='fdc aic'>
      <h1 className='tituloPagina'>¡¡BIENVENIDO!!</h1>
      <div>
        Esta web es una pequeña pagina de minjuegos donde podrás disfrutar.
      </div>
      <hr></hr>
      <div className='fdr jcsa aic w80'>
        <div>
          <Link to={"/jugar"}>
            <img
              src='/img/juegos/Raya.png'
              width={"300px"}
            />
          </Link>
        </div>
        <div>
          <Link to={'/jugar'}>
            <img
              src='/img/juegos/black.jpg'
              width={"300px"}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
