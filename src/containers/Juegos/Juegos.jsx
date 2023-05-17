import React, { useState } from 'react'
import TresEnRaya from '../../components/Phaser/TresEnRaya'
import BotonAccion from '../../components/Buttons/BotonAccion'
import '../../styles/juegos.scss'

export default function Juegos() {
  const [jugarTresEnRaya, setJugarTresEnRaya] = useState(false)
  return (
    <div id='juegos' className='fdc aic'>
      <h1>Minijuegos</h1>
      <h2>Tres En Raya</h2>
      <div className='mb2 fdc jcc aic'>
        {!jugarTresEnRaya ?
          <BotonAccion
            className='w40'
            text='JUEGA AL TRES EN RAYA'
            onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
          />
          : <>
            <TresEnRaya/>
            <BotonAccion
              text='Cerrar'
              onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
            />
          </>
        }
      </div>
      <h2></h2>
      <div className='mb2 fdc jcc aic'>
        Nuevo juego
      </div>

    </div>
  )
}
