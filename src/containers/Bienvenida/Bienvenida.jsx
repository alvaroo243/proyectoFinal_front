import { useEffect } from 'react'
import { request } from '../../utils/request';
import { Link } from 'react-router-dom';

// Este componente lo gastaremos para mostrar la vista de Bienvenida
export default function Bienvenida() {

  return (
    <div className='fdc aic'>
      <h1 className='tituloPagina'>¡¡BIENVENIDO!!</h1>
      <div>
        Esta web es una pequeña pagina de minjuegos donde podrás disfrutar.
      </div>
      <hr></hr>
      <div className='fdr jcsa aic w80'>
        <div>
          {/* Hacemos un linck a la pagina de juegos, para cuando se haga click en la imagen */}
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
