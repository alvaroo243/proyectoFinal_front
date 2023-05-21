import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useUsuarioContext } from "../../../context/UsuarioContext";
import { request } from "../../../utils/request";
import { convertLegacyProps } from "antd/es/button/button";

export default function BlackJack({

}) {
    const gameRef = useRef(null);

    let baraja
    let contadorJugador
    let contadorBanca
    let cartasJugador = []
    let cartasBanca = []
    let cartaJugador = null
    let cartaBanca = null
    let separacionCartasJugador = 0
    let separacionCartasBanca = 0
    let presupuestoInicial = 1000
    let apareceApuesta = true
    let apuesta = 1000
    let tiposApuestas = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 30000, 40000, 50000]
    let indexApuestas = 0
    let presupuesto = presupuestoInicial
    let plantado = false
    let maximoBanca = false
    let mensajePartida = null
    let timer = 0

    const [usuario, setUsuario] = useUsuarioContext()

    const generarNecesario = (ths) => {
        const add = ths.add
        ths.contApuesta = add.rectangle(250, 250, 250, 150, 0xffffff).setDepth(98)
        ths.presupuestoText = add.text(150, 200, `Presupuesto actual: ${presupuesto}`, { color: "green", fontFamily: "Arial" }).setDepth(99)
        ths.apuestaRect = add.rectangle(225, 250, 150, 30, 0x808080).setStrokeStyle(2, 0x000000).setDepth(99)
        ths.apuestaText = add.text(208, 242, apuesta, { color: "white", fontFamily: "Arial" }).setDepth(99)
        ths.botonSubir = add.rectangle(325, 235, 40, 25, 0x808199).setDepth(99)
        ths.botonBajar = add.rectangle(325, 265, 40, 25, 0x808199).setDepth(99)
        ths.imagenSubir = add.image(325, 235, 'arriba').setDepth(99)
        ths.imagenBajar = add.image(325, 265, 'abajo').setDepth(99)
        ths.imagenSubir.setScale(ths.botonSubir.width / ths.imagenSubir.width)
        ths.imagenBajar.setScale(ths.botonBajar.width / (ths.imagenBajar.width + 300))
        ths.botonSubir.setInteractive()
        ths.botonBajar.setInteractive()
        ths.botonSubir.on("pointerdown", () => {
            if ((indexApuestas + 1) <= (tiposApuestas.length - 1)) {
                if (tiposApuestas[indexApuestas + 1] <= presupuesto) {
                    indexApuestas++
                    apuesta = tiposApuestas[indexApuestas]
                }
            }
        })
        ths.botonBajar.on("pointerdown", () => {
            if ((indexApuestas - 1) >= 0) {
                indexApuestas--
                apuesta = tiposApuestas[indexApuestas]
            }
        })
        ths.botonApostar = add.rectangle(250, 300, 100, 30, 0xff0000).setDepth(99)
        ths.botonApostar.setInteractive()
        ths.botonApostar.on("pointerdown", () => {
            apareceApuesta = !apareceApuesta
            jugar()
        })
        ths.apostarText = add.text(220, 290, "¡Apostar!", { color: "white", fontFamily: "Arial" }).setDepth(99)
        // Juego
        ths.botonPedir = add.rectangle(140, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonPedir.setInteractive()
        ths.botonPedir.on("pointerdown", () => {
            if (!plantado) {
                repartirCartaJugador()
            }
        })
        ths.pedirText = add.text(120, 240, "Pedir", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.botonDoblar = add.rectangle(250, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonDoblar.setInteractive()
        ths.botonDoblar.on("pointerdown", () => {
            if (!plantado && presupuesto >= apuesta * 2) {
                apuesta = apuesta * 2
                repartirCartaJugador()
                plantado = true
            }
        })
        ths.doblarText = add.text(225, 240, "Doblar", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.botonPlantarse = add.rectangle(360, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonPlantarse.setInteractive()
        ths.botonPlantarse.on("pointerdown", () => {
            if (!plantado) {
                plantado = true
            }
        })
        ths.plantarseText = add.text(325, 240, "Plantarse", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.textoApuesta = add.text(200, 200, "", { color: "white", fontFamily: "Arial" }).setDepth(2)
    }

    const generarBaraja = () => {
        baraja = []
        contadorJugador = 0
        contadorBanca = 0
        cartasJugador = []
        cartasBanca = []
        separacionCartasJugador = 0
        separacionCartasBanca = 0
        apareceApuesta = true
        apuesta = 1000
        indexApuestas = 0
        plantado = false
        maximoBanca = false
        mensajePartida = null

        const palos = ['pica', 'corazon', 'diamante', 'trebol'];
        const numeros = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        for (const palo of palos) {
            for (const numero of numeros) {
                const card = {
                    palo,
                    numero,
                    // Agrega la propiedad 'image' con la ruta de la imagen correspondiente a esta carta
                };

                baraja.push(card);
            }
        }
    }

    const eliminarCartas = () => {
        cartasJugador.map(carta => {
            carta.rect.destroy()
            carta.img.destroy()
            carta.texto.destroy()
        })
        cartasBanca.map(carta => {
            carta.rect.destroy()
            carta.img.destroy()
            carta.texto.destroy()
        })
    }

    const mostrarApostar = (ths) => {
        if (apareceApuesta) {
            ths.contApuesta.setVisible(true)
            ths.presupuestoText.setText(`Presupuesto actual: ${presupuesto}`)
            ths.apuestaText.setText(apuesta)
            ths.apostarText.setText("¡Apostar!")
            ths.apuestaRect.setVisible(true)
            ths.botonSubir.setVisible(true)
            ths.imagenSubir.setVisible(true)
            ths.botonBajar.setVisible(true)
            ths.imagenBajar.setVisible(true)
            ths.botonApostar.setVisible(true)
        } else {
            ths.contApuesta.setVisible(false)
            ths.presupuestoText.setText("")
            ths.apuestaText.setText("")
            ths.apostarText.setText("")
            ths.apuestaRect.setVisible(false)
            ths.botonSubir.setVisible(false)
            ths.imagenSubir.setVisible(false)
            ths.botonBajar.setVisible(false)
            ths.imagenBajar.setVisible(false)
            ths.botonApostar.setVisible(false)
        }
    }

    const mostrarJuego = (ths) => {
        if (apareceApuesta) {
            ths.botonPedir.setVisible(false)
            ths.pedirText.setText("")
            ths.botonDoblar.setVisible(false)
            ths.doblarText.setText("")
            ths.botonPlantarse.setVisible(false)
            ths.plantarseText.setText("")
            ths.textoApuesta.setText("")
        } else {
            ths.botonPedir.setVisible(true)
            ths.pedirText.setText("Pedir")
            ths.botonDoblar.setVisible(true)
            ths.doblarText.setText("Doblar")
            ths.botonPlantarse.setVisible(true)
            ths.plantarseText.setText("Plantarse")
            ths.textoApuesta.setText(`Apuesta: ${apuesta}`)
        }
    }

    const jugar = () => {
        repartirCartaJugador()
        repartirCartaBanca()
    }

    const repartirCartaJugador = () => {
        const randomIndex = Math.floor(Math.random() * baraja.length);
        const carta = baraja.splice(randomIndex, 1)[0];
        contadorJugador = sumarContador(carta.numero, contadorJugador)
        cartaJugador = carta
        return carta;
    }

    const repartirCartaBanca = () => {
        const randomIndex = Math.floor(Math.random() * baraja.length);
        const carta = baraja.splice(randomIndex, 1)[0];
        contadorBanca = sumarContador(carta.numero, contadorBanca)
        cartaBanca = carta
        return carta;
    }

    const sumarContador = (numero, contador) => {
        switch (numero) {
            case '2':
                contador += 2
                break;
            case '3':
                contador += 3
                break;
            case '4':
                contador += 4
                break;
            case '5':
                contador += 5
                break;
            case '6':
                contador += 6
                break;
            case '7':
                contador += 7
                break;
            case '8':
                contador += 8
                break;
            case '9':
                contador += 9
                break;
            case '10':
                contador += 10
                break;
            case 'J':
                contador += 10
                break;
            case 'Q':
                contador += 10
                break;
            case 'K':
                contador += 10
                break;
            case 'A':
                if (contador + 11 > 21) {
                    contador++
                } else {
                    contador += 11
                }
                break;
            default:
                break;
        }

        return contador
    }

    const mostrarCartaJugador = (add) => {
        const rect = add.rectangle((130 + separacionCartasJugador), 400, 50, 70, 0xffffff)
        const img = add.image((130 + separacionCartasJugador), 385, cartaJugador.palo).setScale(0.05)
        let texto
        if (cartaJugador.numero != 10) {
            texto = add.text((125 + separacionCartasJugador), 400, cartaJugador.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        } else {
            texto = add.text((120 + separacionCartasJugador), 400, cartaJugador.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        }
        separacionCartasJugador += 60
        cartaJugador = null
        cartasJugador.push({ rect: rect, img: img, texto: texto })
    }

    const mostrarCartaBanca = (add) => {
        const rect = add.rectangle((130 + separacionCartasBanca), 100, 50, 70, 0xffffff)
        const img = add.image((130 + separacionCartasBanca), 85, cartaBanca.palo).setScale(0.05)
        let texto
        if (cartaBanca.numero != 10) {
            texto = add.text((125 + separacionCartasBanca), 100, cartaBanca.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        } else {
            texto = add.text((120 + separacionCartasBanca), 100, cartaBanca.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        }
        separacionCartasBanca += 60
        cartaBanca = null
        cartasBanca.push({ rect: rect, img: img, texto: texto })
    }

    const comprobarPartida = () => {
        if (!mensajePartida) {
            if (contadorJugador > 21) {
                mensajePartida = "Has perdido"
                if (presupuesto >= 2000) return presupuesto -= apuesta
                return
            }
            if (contadorBanca > 21) {
                mensajePartida = `Ha ganado ${usuario.name}`
                return presupuesto += apuesta
            }
            if (plantado && contadorBanca >= 17 && contadorBanca <= 21 && !maximoBanca) {
                return maximoBanca = true
            }
            if (contadorJugador === 21) {
                plantado = true
                if (maximoBanca) {
                    if (contadorBanca === 21) {
                        return mensajePartida = "Empate"
                    } else {
                        if (cartasJugador.length === 2) {
                            presupuesto += apuesta * 3
                            return mensajePartida = "BLACKJACK"
                        } else {
                            presupuesto += apuesta
                            return mensajePartida = `Ha ganado ${usuario.name}`
                        }
                    }
                }
            }
            if (maximoBanca && plantado) {
                if (contadorBanca > contadorJugador) {
                    return mensajePartida = "Has perdido"
                } else {
                    return mensajePartida = `Ha ganado ${usuario.name}`
                }
            }
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
            this.load.image("fondo", "/img/juegos/blackJack/fondo_blackjack.png");
            this.load.image("pica", "/img/juegos/blackJack/pica.png")
            this.load.image("diamante", "/img/juegos/blackJack/diamante.png")
            this.load.image("trebol", "/img/juegos/blackJack/trebol.png")
            this.load.image("corazon", "/img/juegos/blackJack/corazon.png")
            this.load.image("arriba", "/img/juegos/blackJack/flecha_arriba.png")
            this.load.image("abajo", "/img/juegos/blackJack/flecha_abajo.png")
        }

        function create() {
            const add = this.add
            add.image(0, 0, "fondo").setOrigin(0).setScale(1, 1.4)
            generarNecesario(this)
            generarBaraja()
        }

        async function update(time) {

            const add = this.add
            mostrarApostar(this)
            mostrarJuego(this)
            if (cartaJugador) mostrarCartaJugador(add)
            if (cartaBanca) {
                if (timer === 0) {
                    mostrarCartaBanca()
                    timer = time;
                } else if (time - timer >= 2000) {
                    mostrarCartaBanca()
                    timer = 0;
                }
            }
            if (plantado) {
                if (!maximoBanca) {
                    repartirCartaBanca()
                }
            }
            comprobarPartida()
            if (mensajePartida) {
                console.log(mensajePartida);
                setTimeout(() => {
                    generarBaraja()
                }, 2000)
            }
        }

        return () => {
            game.destroy(); // Limpiar el juego cuando el componente se desmonte
        };
    }, []);

    return <div ref={gameRef} />
};

