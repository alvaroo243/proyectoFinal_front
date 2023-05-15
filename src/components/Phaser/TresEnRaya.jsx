import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const TresEnRaya = () => {
    const gameRef = useRef(null);

    function obtenerJugadorActual(celdas) {
        // Utilizamos una variable para llevar un seguimiento del jugador actual
        let jugadorActual = 'X'; // Asignamos 'X' como jugador inicial
      
        // Almacenamos el estado del juego en algún lugar (por ejemplo, un arreglo o una matriz)
        // y determinamos si es el turno del jugador 'X' o 'O' en función de la cantidad de movimientos realizados
        
        // Aquí se asume que existe una variable llamada `estadoJuego` que almacena el estado actual del juego
        const totalMovimientos = celdas.children.iterate(celda => celda !== '').length;
        
        // Determinamos el jugador actual en función de la cantidad de movimientos realizados
        if (totalMovimientos % 2 === 0) {
          jugadorActual = 'X';
        } else {
          jugadorActual = 'O';
        }
      
        return jugadorActual;
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
                update: update
            }
        };

        const game = new Phaser.Game(config);

        function preload() {
            // Precargar los recursos necesarios (por ejemplo, imágenes)
            this.load.image('tile', '/img/mando.png');
            this.load.image('bg', '/img/imagen_fondo.jpg')
            // this.load.image('playerX', 'ruta_a_tu_sprite_X.png');
            // this.load.image('playerO', 'ruta_a_tu_sprite_O.png');

        }

        function create() {
            // Crear el tablero del tres en raya
            this.add.image(250, 50, 'tile').setScale(0.1).setDepth(2)
            this.add.image(250, 250, 'bg').setScale(1.5, 2.5).setDepth(0)
            // Agregar el resto de elementos del juego (por ejemplo, celdas, jugadores)
            const celdas = this.add.group();
            const posX = 150;
            const posY = 200;
            const separacion = 100;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const celda = this.add.sprite(posX + i * separacion, posY + j * separacion, 'celda');
                    celdas.add(celda);
                }
            }

            celdas.children.iterate((celda) => {
                celda.setInteractive();
                celda.on('pointerdown', () => {
                  // Verificar si la celda ya está ocupada
                  if (!celda.getData('ocupada')) {
                    // Obtener el jugador actual (X o O)
                    const jugadorActual = obtenerJugadorActual(celdas); // Implementa tu propia lógica para determinar el jugador actual
            
                    // Cambiar la imagen de la celda según el jugador actual
                    if (jugadorActual === 'X') {
                    //   celda.setTexture('imagenX');
                    } else {
                    //   celda.setTexture('imagenO');
                    }
                    console.log( jugadorActual );
            
                    // Marcar la celda como ocupada
                    celda.setData('ocupada', true);
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
