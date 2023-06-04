import { useState } from "react";
import TresEnRaya from "./TresEnRaya/TresEnRaya";
import BotonAccion from "../../components/Buttons/BotonAccion";
import "../../styles/juegos.scss";
import BlackJack from "./BlackJack/BlackJack";

// Componente que utilizaremos para mostrar la vista de Juegos
export default function Juegos() {
  // Creamos los useStates para mostrar los diferentes juegos
  const [jugarTresEnRaya, setJugarTresEnRaya] = useState(false);
  const [jugarBlackJack, setJugarBlackJack] = useState(false);

  // Devolvemos la vista de juegos
  return (
    <div id="juegos" className="fdc aic">
      <h1 className="tituloPagina">Minijuegos</h1>
      <h2>Tres en Raya</h2>
      <div className="mb2 fdc jcc aic">
        {/* Si es false se mostrará el boton de Jugar al tres en raya */}
        {!jugarTresEnRaya ? (
          <BotonAccion
            id="raya"
            className="w40"
            text="JUEGA AL TRES EN RAYA"
            onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
          />
        ) : (
          // Sinos se mostrará el tres en raya y el boton de cerrar
          <>
            <TresEnRaya />
            <BotonAccion
              text="Cerrar"
              danger
              onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
            />
          </>
        )}
      </div>
      <h2>BlackJack</h2>
      <div className="mb2 fdc jcc aic">
        {/* Lo mismo pero con el BlakJack */}
        {!jugarBlackJack ? (
          <BotonAccion
            id="black"
            className="w40"
            text="JUEGA AL BLACKJACK"
            onClick={() => setJugarBlackJack(!jugarBlackJack)}
          />
        ) : (
          <>
            <BlackJack />
            <BotonAccion
              text="Cerrar"
              danger
              onClick={() => setJugarBlackJack(!jugarBlackJack)}
            />
          </>
        )}
      </div>
    </div>
  );
}
