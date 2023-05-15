import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const TresEnRaya = () => {
    const gameRef = useRef(null);

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
            this.add.image(250, 50, 'tile').setScale(0.1).setDepth(1)
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
                    console.log("CLICK");
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
