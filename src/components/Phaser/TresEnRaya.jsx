import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useUsuarioContext } from "../../context/UsuarioContext";
import { request } from "../../utils/request";

export default function TresEnRaya({

}) {
    const gameRef = useRef(null);
    const [usuario, setUsuario] = useUsuarioContext()

    let persona = "";
    let ordenador = "";
    let celdas
    let estadoJuego
    let turno = usuario.name
    let cargando = false
    let contadorVictorias = 0

    const actualizarMarcador = async () => {
        const {ok} = await request({
            url: "/puntuaciones/tresEnRaya",
            method: "POST",
            options: {
                puntuacion: contadorVictorias
            }
        })

        contadorVictorias = 0

        if(ok) console.log( "Nuevo Record" );
    }

    const eleccionJugadorInicial = () => {
        const random = Math.random(); // Genera un número aleatorio entre 0 y 1

        if (random < 0.5) {
            persona = "X" // Si el número aleatorio es menor a 0.5, el jugador será 'X'
            ordenador = "O"
        } else {
            persona = "O" // Si el número aleatorio es mayor o igual a 0.5, el jugador será 'O'
            ordenador = "X"
        }

        return

    };

    const obtenerCeldasDisponibles = () => {
        const arregloCeldas = celdas.getChildren();
        return arregloCeldas.filter((celda) => !celda.getData('ocupada'));
    }


    const seleccionarCeldaAleatoria = () => {
        const celdasDisponibles = obtenerCeldasDisponibles();

        if (celdasDisponibles.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * celdasDisponibles.length);
            const celdaOrdenador = celdasDisponibles[indiceAleatorio];
            celdaOrdenador.setTexture(`player${ordenador}`).setScale(0.1).setDepth(2)
            celdaOrdenador.setData('ocupada', true)
            celdaOrdenador.setData('jugador', ordenador)
            convertirCeldasAEstadoJuego()
            return celdasDisponibles[indiceAleatorio];
        } else {
            return null; // Si no hay celdas disponibles, devuelve null o maneja este caso según tu lógica
        }
    }

    function convertirCeldasAEstadoJuego() {
        celdas.getChildren().forEach((celda, indice) => {
            const ocupada = celda.getData('ocupada');
            estadoJuego[indice] = ocupada ? celda.getData('jugador') : '';
        });
    }


    function verificarGanador(jugador) {
        const combinacionesGanadoras = [
            // Combinaciones horizontales
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // Combinaciones verticales
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // Combinaciones diagonales
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combinacion of combinacionesGanadoras) {
            const [a, b, c] = combinacion;
            if (
                estadoJuego[a] === jugador &&
                estadoJuego[b] === jugador &&
                estadoJuego[c] === jugador
            ) {
                return true;
            }
        }

        return false;
    }

    const inicializar = (add) => {
        if(celdas) celdas.clear(true, true)
        celdas = add.group()
        const posX = 150;
        const posY = 200;
        const separacion = 100;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const celda = add
                    .sprite(posX + i * separacion, posY + j * separacion, "celda")
                    .setScale(2);
                celdas.add(celda);
            }
        }
        comienzo()
    }

    const comienzo = () => {
        eleccionJugadorInicial()
        celdas.getChildren().forEach((celda) => {
            hacerCeldaInteractiva(celda)
            // Aquí puedes agregar cualquier otra lógica para reiniciar las propiedades de la celda, como cambiar la imagen o el color
        });
        estadoJuego = [
            '', '', '',
            '', '', '',
            '', '', ''
        ]
        

        if (ordenador === "X") {
            turno = "PC"
            cargando = true
            setTimeout(() => {
                seleccionarCeldaAleatoria()
                setTimeout(() => {
                    turno = usuario.name
                    cargando = false
                }, 100)
            }, 1000)
        }
    }

    const hacerCeldaInteractiva = (celda) => {
            celda.setInteractive();
            celda.on("pointerdown", () => {
                // Verificar si la celda ya está ocupada
                if (!celda.getData("ocupada") && !cargando) {
                    // Obtener el jugador actual (X o O)
                    celda.setTexture(`player${persona}`).setScale(0.1).setDepth(2)

                    // Marcar la celda como ocupada
                    celda.setData("ocupada", true);
                    celda.setData("jugador", persona)
                    convertirCeldasAEstadoJuego()
                    if (verificarGanador(persona) || obtenerCeldasDisponibles().length === 0) return 
                    turno = "PC"
                    cargando = true
                    setTimeout(() => {
                        seleccionarCeldaAleatoria()
                        setTimeout(() => {
                            turno = usuario.name
                            cargando = false
                        }, 100)
                    }, 1500);
                }
            })
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
            this.load.image("trofeo", "/img/juegos/tresEnRaya/trofeo.png");
        }

        function create() {
            const add = this.add
            // Crear el tablero del tres en raya
            add.image(250, 50, "tile").setScale(0.1).setDepth(2);
            add.image(250, 250, "bg").setScale(1.5, 2.5).setDepth(0);
            add.image(250, 300, "tablero").setScale(0.5).setDepth(1);
            add.image(450, 50, "trofeo").setScale(0.1).setDepth(3);
            this.puntuaje = add.text(400, 40, ""+contadorVictorias).setScale(2);
            
            // Agregar el resto de elementos del juego (por ejemplo, celdas, jugadores)
            inicializar(add)
        }

        async function update () {

            const add = this.add
            let rect = add.rectangle(250, 120, 200, 40, turno===usuario.name?0xff8888 :0xffffff);
            let text = add.text(160, 110, `Turno de: ${turno}`, { fill: '#000000' });
            
            text.setMask(rect.createGeometryMask())
            // Lógica de actualización del juego (por ejemplo, verificar si hay un ganador)

            if (verificarGanador('X')) {
                console.log(`¡Ha ganado ${turno}!`);
                if (turno === usuario.name) {
                    contadorVictorias++
                    this.puntuaje.setText(contadorVictorias)
                } else {
                    this.puntuaje.setText(0)
                    await actualizarMarcador()
                }
                return inicializar(add)
            } else if (verificarGanador('O')) {
                console.log(`¡Ha ganado ${turno}!`);
                if (turno === usuario.name) {
                    contadorVictorias++
                    this.puntuaje.setText(contadorVictorias)
                } else {
                    this.puntuaje.setText(0)
                    await actualizarMarcador()
                }   
                return inicializar(add)
            }

            if (obtenerCeldasDisponibles().length === 0) {
                console.log("Empate");
                return inicializar(add)
            }
        }

        return () => {
            game.destroy(); // Limpiar el juego cuando el componente se desmonte
        };
    }, []);

    return <div ref={gameRef} />
};

