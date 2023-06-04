import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useUsuarioContext } from "../../../context/UsuarioContext";
import { request } from "../../../utils/request";
import { easyDebounce } from "../../../utils/debounce";

// Este componente lo utilizaremos para mostrar el juego de BlackJackz
export default function BlackJack({

}) {
    // Lo utilizamos para hacer una referencia y que asi se muestre en un div
    const gameRef = useRef(null);

    // Creamos las variables dinamicas que utilizaremos durante el juego
    let baraja
    let contadorJugador = 0
    let contadorBanca = 0
    let cartasJugador = []
    let cartasBanca = []
    let cartaJugador = null
    let cartaBanca = null
    let separacionCartasJugador = 0
    let separacionCartasBanca = 0
    let presupuestoInicial = 1000
    let apareceApuesta = true
    let apuesta = 1000
    // Creamos un array de tamaño 50 que por cada index lo multiplique por 1000 y lo guarde
    // Asi lo que hacemos es crear un array con 50 numeros los cuales van de 1000 a 50000 de 1000 en 1000
    let tiposApuestas = Array.from({ length: 50 }, (x, index) => (index + 1) * 1000);
    let indexApuestas = 0
    let presupuesto = presupuestoInicial
    let plantado = false
    let maximoBanca = false
    let mensajePartida = null
    let cargando = false
    let empate = false
    let intervaloSubir;
    let intervaloBajar;

    // Funcion que hace una llamada para saber los beneficios que has tenido durante partidas pasadas
    const cogerBeneficios = async () => {
        const { ok, puntuacion } = await request({
            url: "/puntuaciones/blackJack",
            method: "GET"
        })

        if (!ok) return 0

        return puntuacion
    }

    // Funcion en la que haremos una llamada al back para actualizar los beneficios
    const updateBeneficios = async () => {
        const { ok } = await request({
            url: "/puntuaciones/blackJack",
            method: "POST",
            options: {
                // Restamos 1000 ya que siempre se le añade 1000 a los beneficios para que siempre se pueda apostar por lo menos 1000
                presupuesto: (presupuesto - 1000)
            }
        })

        if (!ok) console.log("No se ha podido guardar la partida");
    }

    // Cogemos el context del usuario
    const [usuario, setUsuario] = useUsuarioContext()

    // Funcion en la que recogeremos el this de el juego y crearemo todas las variables necesarias
    const generarNecesario = (ths) => {
        // Creamos el add para añadir cada elemento el juego
        const add = ths.add
        // Los rectangle seran como contenedores en los que meteremos texto y demás
        // setDepth lo que hace es indicar el z-index de el elemento
        ths.contApuesta = add.rectangle(250, 250, 250, 150, 0xffffff).setDepth(98)
        // Los text son textos que podemos modificar y poner como queramos
        ths.presupuestoText = add.text(150, 200, `Presupuesto actual: ${presupuesto}`, { color: "green", fontFamily: "Arial" }).setDepth(99)
        // setStrokeStyle se utiliza para el borde del rectangulo
        ths.apuestaRect = add.rectangle(225, 250, 150, 30, 0x808080).setStrokeStyle(2, 0x000000).setDepth(99)
        ths.apuestaText = add.text(208, 242, apuesta, { color: "white", fontFamily: "Arial" }).setDepth(99)
        ths.botonSubir = add.rectangle(325, 235, 40, 25, 0x808199).setDepth(99)
        ths.botonBajar = add.rectangle(325, 265, 40, 25, 0x808199).setDepth(99)
        // Los image añaden las imagenes que hayamos cargado en el preload
        ths.imagenSubir = add.image(325, 235, 'arriba').setDepth(99)
        ths.imagenBajar = add.image(325, 265, 'abajo').setDepth(99)
        // Con el setScale indicamos el tamaño en escala de la imagen
        // En este aso lo que hacemos es para que queden ajustadas las imagenes de dentro de los rectangulos de subir y bajar
        ths.imagenSubir.setScale(ths.botonSubir.width / ths.imagenSubir.width)
        ths.imagenBajar.setScale(ths.botonBajar.width / (ths.imagenBajar.width + 300))
        // setInteractive lo utilizamos para que el elemento al que se lo añadamos reciba acciones y se puedan tratar
        // como en el siguiente caso que tratamos un poiinterdown 
        // Esto puede tener un parecido con el .addEventListener()
        ths.botonSubir.setInteractive()
        ths.botonBajar.setInteractive()
        // Cuando hacemos click en el boton de subir creamos un intervalo de tiempo mientras no se suelte el click
        // el cual hara que suba la apuesta 
        ths.botonSubir.on("pointerdown", () => {
            intervaloSubir = setInterval(() => {
                if ((indexApuestas + 1) <= (tiposApuestas.length - 1)) {
                    if (tiposApuestas[indexApuestas + 1] <= presupuesto) {
                        indexApuestas++;
                        apuesta = tiposApuestas[indexApuestas];
                    }
                }
            }, 43); // Intervalo de ejecución en milisegundos
        });

        // Cuando se suelta el click parara de subir
        ths.botonSubir.on("pointerup", () => {
            // Borramos el intervalo de tiempo
            clearInterval(intervaloSubir);
        });

        // Cuando el raton sale fuera del boton, para de subir
        ths.botonSubir.on("pointerout", () => {
            clearInterval(intervaloSubir);
        })

        // Lo mismo pero bajar la apuesta
        ths.botonBajar.on("pointerdown", () => {
            intervaloBajar = setInterval(() => {
                if ((indexApuestas - 1) >= 0) {
                    indexApuestas--;
                    apuesta = tiposApuestas[indexApuestas];
                }
            }, 43); // Intervalo de ejecución en milisegundos
        });

        ths.botonBajar.on("pointerup", () => {
            clearInterval(intervaloBajar);
        });

        ths.botonBajar.on("pointerout", () => {
            clearInterval(intervaloBajar);
        })

        ths.botonApostar = add.rectangle(250, 300, 100, 30, 0xff0000).setDepth(99)
        ths.botonApostar.setInteractive()
        // Cuando clickemos en apuesta comenzará el juego
        ths.botonApostar.on("pointerdown", () => {
            // Para que desaparezca el contenedor de apuesta
            apareceApuesta = !apareceApuesta
            jugar()
        })
        ths.apostarText = add.text(220, 290, "¡Apostar!", { color: "white", fontFamily: "Arial" }).setDepth(99)
        // Juego
        ths.botonPedir = add.rectangle(140, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonPedir.setInteractive()
        ths.botonPedir.on("pointerdown", () => {
            // Si aun no se ha plantado el jugador ni ha terminado la partida y se ha apretado el boton de repartir
            // se repartira una carta al jugador
            if (!plantado && !mensajePartida) {
                repartirCartaJugador()
            }
        })
        ths.pedirText = add.text(120, 240, "Pedir", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.botonDoblar = add.rectangle(250, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonDoblar.setInteractive()
        ths.botonDoblar.on("pointerdown", () => {
            // Si se apreta el boton de doblar, aun no se a plantado el jugador, ni ha terminado la partida, y tiene 
            // suficiente presupuesto se duplicará la apuesta, se le repartirá una carta al jugador y automaticamente
            // el jugador se plantará
            if (!plantado && presupuesto >= apuesta * 2 && !mensajePartida) {
                apuesta = apuesta * 2
                repartirCartaJugador()
                plantado = true
            }
        })
        ths.doblarText = add.text(225, 240, "Doblar", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.botonPlantarse = add.rectangle(360, 250, 100, 30, 0x808199).setStrokeStyle(2, 0x000000)
        ths.botonPlantarse.setInteractive()
        ths.botonPlantarse.on("pointerdown", () => {
            // Si aun no se ha plantado el jugador ni ha terminado la partida el jugador se plantara al clickar Plantarse
            if (!plantado && !mensajePartida) {
                plantado = true
            }
        })
        ths.plantarseText = add.text(325, 240, "Plantarse", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.textoApuesta = add.text(200, 200, "", { color: "white", fontFamily: "Arial" }).setDepth(2)
        ths.contadorBanca = add.text(150, 20, "", { color: "white", fontFamily: "Arial", fontSize: "2em" }).setDepth(2)
        ths.contadorJugador = add.text(150, 450, "", { color: "white", fontFamily: "Arial", fontSize: "2em" }).setDepth(2)
    }

    // Cada vez que se inicie una partida se realizará esta función
    const generarBaraja = () => {
        // Eliminamos las cartas repartidas
        eliminarCartas()
        // Reiniciamos las variables por si se han modificado
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
        empate = false

        // Creamos los tipos de cartas que van a haber
        const palos = ['pica', 'corazon', 'diamante', 'trebol'];
        const numeros = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        // Recorremos los palos y los numeros para crear la baraja con todas sus cartas
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

    // Funcion que utilizareos para borar visualmennte las cartas del jugador y de la banca
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

    // Función que utilizaremos para mostrar o no el contenedor de apostar
    const mostrarApostar = (ths) => {
        if (apareceApuesta) {
            // Con setVisible lo que hacemos es indicarle si queremos que sea visible o no el elemento
            ths.contApuesta.setVisible(true)
            // Con el setText editamos el texto del elemento text
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

    // Función que utilizaremos para mostrar o no el juego
    const mostrarJuego = (ths) => {
        if (apareceApuesta) {
            ths.botonPedir.setVisible(false)
            ths.pedirText.setText("")
            ths.botonDoblar.setVisible(false)
            ths.doblarText.setText("")
            ths.botonPlantarse.setVisible(false)
            ths.plantarseText.setText("")
            ths.textoApuesta.setText("")
            ths.contadorBanca.setText("")
            ths.contadorJugador.setText("")
        } else {
            ths.botonPedir.setVisible(true)
            ths.pedirText.setText("Pedir")
            ths.botonDoblar.setVisible(true)
            ths.doblarText.setText("Doblar")
            ths.botonPlantarse.setVisible(true)
            ths.plantarseText.setText("Plantarse")
            ths.textoApuesta.setText(`Apuesta: ${apuesta}`)
            ths.contadorBanca.setText(`Contador cartas: ${contadorBanca}`)
            ths.contadorJugador.setText(`Contador cartas: ${contadorJugador}`)
        }
    }

    // Al principio se repartirá una carta al jugador y otra a la banca
    const jugar = () => {
        repartirCartaJugador()
        repartirCartaBanca()
    }

    // Funcion que utilizamos para repartir una carta al Jugador
    const repartirCartaJugador = () => {
        // Cogemos un numero random
        const randomIndex = Math.floor(Math.random() * baraja.length);
        // Cogemos la carta random, eliminandola de la baraja
        const carta = baraja.splice(randomIndex, 1)[0];
        // Sumamos al contador del jugador la carta nueva
        contadorJugador = sumarContador(carta.numero, contadorJugador)
        // Indicamos la ultima carta cogida por el jugador
        cartaJugador = carta
        return carta;
    }

    // Función que utilizamos para repartirr una carta a la Banca
    const repartirCartaBanca = () => {
        // Mismo codigo que con el Jugador
        const randomIndex = Math.floor(Math.random() * baraja.length);
        const carta = baraja.splice(randomIndex, 1)[0];
        contadorBanca = sumarContador(carta.numero, contadorBanca)
        cartaBanca = carta
        return carta;
    }

    // Función que utilizamos para sumar la carta al contador que nos pasen
    const sumarContador = (numero, contador) => {
        // Segun el numero que sea se sumara un numero u otro
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
                // A es como un comodin que cuando el contador supera 10 A suma 1, si es menor igual a 10 suma 11
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

    // Función que utilizaremos para mostrar visualmente la nueva carta del Jugador
    const mostrarCartaJugador = (add) => {
        const rect = add.rectangle((130 + separacionCartasJugador), 400, 50, 70, 0xffffff)
        const img = add.image((130 + separacionCartasJugador), 385, cartaJugador.palo).setScale(0.05)
        let texto
        if (cartaJugador.numero != 10) {
            texto = add.text((125 + separacionCartasJugador), 400, cartaJugador.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        } else {
            texto = add.text((120 + separacionCartasJugador), 400, cartaJugador.numero, { color: "black", fontFamily: "Arial", fontSize: "2em" })
        }
        // Vamos aumentando la separacion
        separacionCartasJugador += 60
        // Volvemos a poner a null la carta del jugador
        cartaJugador = null
        // Guardamos las cartas en un array para luego borrarlas y tambien para saber cuantas tiene el jugador
        cartasJugador.push({ rect: rect, img: img, texto: texto })
    }

    // Función que utilizaremos para mostrar visualmente la nueva carta de la Banca
    const mostrarCartaBanca = (add) => {
        // Lo mismo que con el jugador lo que pasa es que cartasBanca solo la utilizaremos para borrar las cartas
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

    // Función en la que comprobaremos el estado de la partida constantemente por si hay un ganador o un empate
    const comprobarPartida = () => {
        // Si se ha plantado el jugador, el maximoBanca es falso y la Banca ha llegado a su maximo se convertira a true maximoBanca
        if (plantado && contadorBanca >= 17 && !maximoBanca) {
            return maximoBanca = true
        }
        // Si aun no hay ganador o empate
        if (!mensajePartida) {
            // Si el jugador tiene 21 se planta
            if (contadorJugador === 21) {
                plantado = true
                // Si la banca ha llegado al maximo
                if (maximoBanca) {
                    // Si tiene 21 Empate
                    if (contadorBanca === 21) {
                        empate = true
                        return mensajePartida = "Empate"
                    } else {
                        // Sinos y el jugador tiene solo dos cartas es BlackJack
                        if (cartasJugador.length === 2) {
                            presupuesto += apuesta * 3
                            return mensajePartida = "BLACKJACK"
                        } else {
                            // Sinos es una victoria normal
                            presupuesto += apuesta
                            return mensajePartida = `Ha ganado ${usuario.name}`
                        }
                    }
                }
            }
            // Si el jugador supera 21 pierde
            if (contadorJugador > 21) {
                presupuesto -= apuesta
                // Hacemos que el jugador siempre tenga al menos 1000 de presupuesto
                if (presupuesto < 1000) presupuesto = 1000
                return mensajePartida = "Has perdido"
            }
            // Si la banca supera 21 y el jugador no tiene 21 victoria normal
            if (contadorBanca > 21) {
                mensajePartida = `Ha ganado ${usuario.name}`
                maximoBanca = true
                return presupuesto += apuesta
            }
            // Si el jugador se ha plantado y la banca ha llegado al maximo
            if (plantado && maximoBanca) {
                // Si tienen el mismo numero empate
                if (contadorBanca === contadorJugador) {
                    empate = true
                    return mensajePartida = "Empate"
                }
                // Si la banca tiene mas numeros que el jugador, el jugador pierde
                if (contadorBanca > contadorJugador) {
                    presupuesto -= apuesta
                    // Hacemos que el jugador siempre tenga al menos 1000 de presupuesto
                    if (presupuesto < 1000) presupuesto = 1000
                    return mensajePartida = "Has perdido"
                } else {
                    // Sinos gana el jugador
                    presupuesto += apuesta
                    return mensajePartida = `Ha ganado ${usuario.name}`
                }
            }
        }
    }

    // Hacemos un useEffect para cuando aparzca el juego por pantalla se empiecen a procesar sus funciones
    useEffect(() => {
        // Hacemos la configuración basica del juego
        const config = {
            // Tipo de renderizado
            type: Phaser.AUTO,
            // Donde se muestra el juego
            parent: gameRef.current,
            // Tamaño de el lienzo del juego
            width: 500,
            height: 500,
            // Escenas del juego
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };

        // Creamos el juego con su configuración
        const game = new Phaser.Game(config);

        // Función en la que haremos una precarga de recursos como imagenes por ejemplo
        function preload() {
            this.load.image("fondo", "/img/juegos/blackJack/fondo_blackjack.png");
            this.load.image("pica", "/img/juegos/blackJack/pica.png")
            this.load.image("diamante", "/img/juegos/blackJack/diamante.png")
            this.load.image("trebol", "/img/juegos/blackJack/trebol.png")
            this.load.image("corazon", "/img/juegos/blackJack/corazon.png")
            this.load.image("arriba", "/img/juegos/blackJack/flecha_arriba.png")
            this.load.image("abajo", "/img/juegos/blackJack/flecha_abajo.png")
        }

        // Función en la que crearemos el juego, esta función solo se ejecutará al principio del juego
        async function create() {
            const add = this.add
            add.image(0, 0, "fondo").setOrigin(0).setScale(1, 1.4)
            generarNecesario(this)
            generarBaraja()
            const beneficio = await cogerBeneficios()
            presupuesto += beneficio
        }

        // Función en la que realizaremos funciones para que se actualice el juego, esta función se ejecutara constantemente por si hay algun cambio
        async function update() {

            const add = this.add
            // Si no esta cargando y no hay un ganador o un empate
            if (!cargando && !mensajePartida) {
                // Comprobara si tiene que mostrar la apuesta o el juego, y el estado de la partida
                mostrarApostar(this)
                mostrarJuego(this)
                comprobarPartida()
                // Si hay una carta nueva del jugador la mostrará
                if (cartaJugador) mostrarCartaJugador(add)
                // Si se ha plantado el jugador y no hay ni ganador ni empate
                if (plantado && !mensajePartida) {
                    // Si la banca no ha llegado al máximo se repartirá cartas a la Banca con un tiempo de espera de 1 segundo
                    if (!maximoBanca) {
                        // Esta variable la cambiamos para que no se realicen otras acciones mientras la espera del timeout
                        cargando = true
                        easyDebounce(() => {
                            repartirCartaBanca()
                            cargando = false
                        }, 1000)
                    }
                }
                // Si la banca tiene una nueva carta, esta se mostrará
                if (cartaBanca) mostrarCartaBanca(add)
            }
            // Si hay un ganador o un empate
            if (mensajePartida) {
                // Si no se esta cargando
                if (!cargando) {
                    // Se mostrará el mensaje de si has ganado, has perdido o ha habido empate
                    console.log(mensajePartida);
                    const textoPartida = add.text(170, 240, mensajePartida, { color: "black", fontFamily: "Arial", fontSize: "2em" }).setDepth(5)
                    const rectPartida = add.rectangle(250, 250, 200, 100, 0xFFDD33).setDepth(4)
                    // Ponemos que esta cargando
                    cargando = true
                    // Si no hay empate hacemos llamada al back
                    if (!empate) {
                        await updateBeneficios()
                    }
                    // Hacemos el timeout para que de tiempo a ver lo que ha pasado en la partida
                    easyDebounce({
                        key: "mensajePartidaBlackJack",
                        fnc: () => {
                            // Cuando ha pasado el tiempo borramos el mensaje y generamos todo de nuevo
                            // Tambien indicamos que ya no hay nada cargando
                            textoPartida.destroy()
                            rectPartida.destroy()
                            generarBaraja()
                            cargando = false
                        }
                    }, 3000)
                }
            }
        }

        return () => {
            game.destroy(); // Limpiar el juego cuando el componente se desmonte
        };
    }, []);

    return <div ref={gameRef} />
};

