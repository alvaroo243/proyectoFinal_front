import { useState } from "react";
import TresEnRaya from "./TresEnRaya/TresEnRaya";
import BotonAccion from "../../components/Buttons/BotonAccion";
import "../../styles/juegos.scss";
import BlackJack from "./BlackJack/BlackJack";

export default function Juegos() {
  const [jugarTresEnRaya, setJugarTresEnRaya] = useState(false);
  const [jugarBlackJack, setJugarBlackJack] = useState(false);
  return (
    <div id="juegos" className="fdc aic">
      <h1 className="tituloPagina">Minijuegos</h1>
      <h2>Tres en Raya</h2>
      <div className="mb2 fdc jcc aic">
        {!jugarTresEnRaya ? (
          <BotonAccion
            id="raya"
            className="w40"
            text="JUEGA AL TRES EN RAYA"
            onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
          />
        ) : (
          <>
            <TresEnRaya />
            <BotonAccion
              text="Cerrar"
              onClick={() => setJugarTresEnRaya(!jugarTresEnRaya)}
            />
          </>
        )}
      </div>
      <h2>BlackJack</h2>
      <div className="mb2 fdc jcc aic">
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
              onClick={() => setJugarBlackJack(!jugarBlackJack)}
            />
          </>
        )}
      </div>
    </div>
  );
}
