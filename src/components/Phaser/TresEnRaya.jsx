import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

const TresEnRaya = () => {
  const gameRef = useRef(null);

  let persona = "";
  let ordenador = "";

  const eleccionJugadorInicial = () => {
    const random = Math.random(); // Genera un número aleatorio entre 0 y 1
    console.log("HOLA");

    if (random < 0.5) {
      persona ="X" // Si el número aleatorio es menor a 0.5, el jugador será 'X'
      ordenador ="O"
    } else {
      persona = "O" // Si el número aleatorio es mayor o igual a 0.5, el jugador será 'O'
      ordenador = "X"
    }

    return
    
  };

  const obtenerCeldasDisponibles = (celdas) => {
    const arregloCeldas = celdas.getChildren();
    return arregloCeldas.filter((celda) => !celda.getData('ocupada'));
  }
  

  const seleccionarCeldaAleatoria = (celdas) => {
    const celdasDisponibles = obtenerCeldasDisponibles(celdas);
  
    if (celdasDisponibles.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * celdasDisponibles.length);
      const celdaOrdenador = celdasDisponibles[indiceAleatorio];
      celdaOrdenador.setTexture(`player${ordenador}`).setScale(0.1).setDepth(2)
      celdaOrdenador.setData('ocupada', true)
      return celdasDisponibles[indiceAleatorio];
    } else {
      return null; // Si no hay celdas disponibles, devuelve null o maneja este caso según tu lógica
    }
  }
  

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 500,
      height: 500,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Precargar los recursos necesarios (por ejemplo, imágenes)
      this.load.image("tile", "/img/mando.png");
      this.load.image("bg", "/img/imagen_fondo.jpg");
      this.load.image("playerX", "/img/juegos/tresEnRaya/x.png");
      this.load.image("playerO", "/img/juegos/tresEnRaya/o.png");
      this.load.image("tablero", "/img/juegos/tresEnRaya/tablero.jpg");
    }

    function create() {
      // Crear el tablero del tres en raya
      this.add.image(250, 50, "tile").setScale(0.1).setDepth(2);
      this.add.image(250, 250, "bg").setScale(1.5, 2.5).setDepth(0);
      this.add.image(250, 300, "tablero").setScale(0.5).setDepth(1);
      // Agregar el resto de elementos del juego (por ejemplo, celdas, jugadores)
      eleccionJugadorInicial()
      const celdas = this.add.group();

      const posX = 150;
      const posY = 200;
      const separacion = 100;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const celda = this.add
            .sprite(posX + i * separacion, posY + j * separacion, "celda")
            .setScale(2);
          celdas.add(celda);
        }
      }

      if (ordenador === "X") {
        setTimeout(() => {
          seleccionarCeldaAleatoria(celdas)
        }, 1000)
      }

      celdas.children.iterate((celda) => {
        celda.setInteractive();
        celda.on("pointerdown", () => {
          // Verificar si la celda ya está ocupada
          if (!celda.getData("ocupada")) {
            // Obtener el jugador actual (X o O)
            console.log(persona);
            celda.setTexture(`player${persona}`).setScale(0.1).setDepth(2)

            // Marcar la celda como ocupada
            celda.setData("ocupada", true);
            setTimeout(() => {
              seleccionarCeldaAleatoria(celdas)
            }, 2000);
          }
        });
      });
    }

    function update() {
      // Lógica de actualización del juego (por ejemplo, verificar si hay un ganador)
    }

    return () => {
      game.destroy(); // Limpiar el juego cuando el componente se desmonte
    };
  }, []);

  return <div ref={gameRef} />;
};

export default TresEnRaya;
