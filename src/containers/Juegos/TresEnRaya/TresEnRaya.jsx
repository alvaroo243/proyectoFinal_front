import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { useUsuarioContext } from "../../../context/UsuarioContext";
import { request } from "../../../utils/request";
import { easyDebounce } from "../../../utils/debounce";

// Componente que utilizaremos para mostrar el juego TresEnRaya
export default function TresEnRaya({

}) {
    // Lo utilizamos para hacer una referencia y que asi se muestre en un div
    const gameRef = useRef(null);
    // Cogemos el context del usuario
    const [usuario, setUsuario] = useUsuarioContext()

    // Creamos las variables dinamicas necesarias
    let persona = "";
    let ordenador = "";
    let celdas
    let estadoJuego
    let turno = usuario.name
    let cargando = false
    let contadorVictorias = 0
    let alertaTexto = ""
    let alertaVisible = false
    let ganador = false

    // Función que utilizaremos para hacer una llamada al back y que actualice el marcador si ha habido un record
    const actualizarMarcador = async () => {
        const { ok } = await request({
            url: "/puntuaciones/tresEnRaya",
            method: "POST",
            options: {
                puntuacion: contadorVictorias
            }
        })
        ganador = false

        if (ok) console.log("Nuevo Record");
    }

    // Función que utilizaremos para determinar si comenzará primero la maquina o el jugador
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

    // Fución que utilizaremos para determinar en que celdas podemos aplicar nuestra ficha
    const obtenerCeldasDisponibles = () => {
        const arregloCeldas = celdas.getChildren();
        // Filtramos por las celdad que su atributo ocupada es false
        // Con getData lo que hacemos es coger aributos que tiene la celda indicandoles el nombre que le hemos dado al atributo
        return arregloCeldas.filter((celda) => !celda.getData('ocupada'));
    }


    // Función que utilizaremos para que la maquina juegue
    // Haciendolo asi la maquina la mayoria de veces jugará muy al azar y igual que te puede hacer una buena jugada
    // te puede hacer una que no tenga sentido, pero es lo que tiene el random
    const seleccionarCeldaAleatoria = () => {
        // Obtenemos las celdas disponibles
        const celdasDisponibles = obtenerCeldasDisponibles();

        // Si hay celdas disponibles
        if (celdasDisponibles.length > 0) {
            // Cogemos un numero aleatorio entre las celdas disponibles
            const indiceAleatorio = Math.floor(Math.random() * celdasDisponibles.length);
            // Elegimos la celda
            const celdaOrdenador = celdasDisponibles[indiceAleatorio];
            // Ponemos la ficha de la maquina en la celda elegida y indicamos que esta ocupada por la maquina
            celdaOrdenador.setTexture(`player${ordenador}`).setScale(0.1).setDepth(2)
            // Con setData lo que hacemos es aplicarle un atributo si no lo tiene, y si lo tiene lo edita
            celdaOrdenador.setData('ocupada', true)
            celdaOrdenador.setData('jugador', ordenador)
            // Hacemos que se actualice el estadoJuego
            convertirCeldasAEstadoJuego()
            // Devolvemos la celda
            return celdasDisponibles[indiceAleatorio];
        } else {
            return null; // Si no hay celdas disponibles, devuelve null o maneja este caso según tu lógica
        }
    }

    // Esta función la utilizaremos para actualizar el estadoJuego, el cual nos va servir para multiples comprobaciones
    const convertirCeldasAEstadoJuego = () => {
        // Por cada celda que este ocupada determinaremos por quien esta ocupada en el estadoJuego
        celdas.getChildren().forEach((celda, indice) => {
            const ocupada = celda.getData('ocupada');
            estadoJuego[indice] = ocupada ? celda.getData('jugador') : '';
        });
    }


    // Funcion que utilizaremos para determinar si hay un ganador
    const verificarGanador = (jugador) => {
        if (ganador) return false
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

        // Por cada combinacion comprobamos que haya o no un jugador que tenga la combinación correcta
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

    // Función que utilizaremos para inicializar las celdas
    const inicializar = (add) => {
        // Limpiamos las celdas
        if (celdas) celdas.clear(true, true)
        // Pasamos ganador a false
        ganador = false
        // Creamos de nuevo las celdas
        celdas = add.group()
        // Indicamos las coordenadas en las que estarán las celdas
        const posX = 150;
        const posY = 200;
        // La separacion de cada celda
        const separacion = 100;
        // Creamos todas las celdas
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // En cada celda le metemos un sprite que lo que hace es crear un bloque el cual utilizaremos 
                // para añadirle imagenes
                const celda = add
                    .sprite(posX + i * separacion, posY + j * separacion, "celda")
                    .setScale(2);
                // Añadimos la celda al grupo de celdas
                celdas.add(celda);
            }
        }
        // Pasamos a la siguiente función
        comienzo()
    }

    // Función que utilizaremos para inicializar demás variables
    const comienzo = () => {
        // Hacemos la eleccion de quien comenzará la partida
        eleccionJugadorInicial()

        // Hacemos que las celdas se han interactivas
        celdas.getChildren().forEach((celda) => {
            hacerCeldaInteractiva(celda)
        });
        // Reiniciamo el estadoJuego
        estadoJuego = [
            '', '', '',
            '', '', '',
            '', '', ''
        ]

        // Esperamos a que se muestre el mensaje de lo que a ocurrido en la partida
        if (alertaVisible) {
            cargando = true
            easyDebounce({
                key: "mensajePartidaTER",
                fnc: () => {
                    alertaTexto = "";
                    alertaVisible = false;
                    cargando = false
                }
            }, 1000)
        }


        // Si la maquina comieza la partida
        if (ordenador === "X") {
            // Indicamos el turno
            turno = "PC"
            // Hacemos un timeOut que puede variar segun si hay una alerta o no
            easyDebounce({
                key: "seleccionarCeldaInicioPC",
                fnc: () => {
                    // Seleccionamos la celda cuando pasa el tiempo
                    seleccionarCeldaAleatoria()
                    // Hacemos otro timeOut para el cambio de turno
                    easyDebounce(() => {
                        turno = usuario.name
                    }, 100)
                }
            }, alertaVisible ? 2000 : 1000)
        }
    }

    // Función que utilizaremos para hacer que cada celda sea interactiva
    const hacerCeldaInteractiva = (celda) => {
        // Hacemos que sea interactiva
        celda.setInteractive();
        // Cuando se clicke encima de la celda
        celda.on("pointerdown", () => {
            // Verificar si la celda ya está ocupada
            if (!celda.getData("ocupada") && turno === usuario.name && cargando === false) {
                // Obtener el jugador actual (X o O)
                celda.setTexture(`player${persona}`).setScale(0.1).setDepth(2)

                // Marcar la celda como ocupada
                celda.setData("ocupada", true);
                celda.setData("jugador", persona)
                // Actualizamos el estadoJuego
                convertirCeldasAEstadoJuego()
                // Verificamos si hay ganador
                if (verificarGanador(persona) || obtenerCeldasDisponibles().length === 0) return
                // Cambiamos ek turno
                turno = "PC"
                // Cambiamos cargando a true
                cargando = true
                // Creamos un timeOut en el que esperaremos a que la maquina haga su siguiente movimiento
                easyDebounce({
                    key: "seleccionarCeldaPC",
                    fnc: () => {
                        seleccionarCeldaAleatoria()
                        // Creamos un timeOut para que pase de turno a el del jugador
                        easyDebounce(() => {
                            turno = usuario.name
                            cargando = false
                        }, 100)
                    }
                }, 1500)
            }
        })
    }



    // UseEffect con el que iniciaremos el juego cuando se muestre por pantalla
    useEffect(() => {
        // Creamos la configuración básica del juego
        const config = {
            // Tipo de renderizado
            type: Phaser.AUTO,
            // Donde se muestra el juego
            parent: gameRef.current,
            // Tamaño del lienzo
            width: 500,
            height: 500,
            // Escenas del juego
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };

        // Creamos el juego
        const game = new Phaser.Game(config);

        // Función donde hacemos la precarga de recursos como en este caso imagenes
        function preload() {
            this.load.image("tile", "/img/mando.png");
            this.load.image("bg", "/img/juegos/tresEnRaya/imagen_fondo_TresEnRaya.jpg");
            this.load.image("playerX", "/img/juegos/tresEnRaya/x.png");
            this.load.image("playerO", "/img/juegos/tresEnRaya/o.png");
            this.load.image("tablero", "/img/juegos/tresEnRaya/tablero.jpg");
            this.load.image("trofeo", "/img/juegos/tresEnRaya/trofeo.png");
        }

        // Función en la que creamos los elementos básicos que tendrá el juego cuando se inicie el juego
        function create() {
            // Creamos el add
            const add = this.add
            // Crear el tablero del tres en raya
            add.image(250, 50, "tile").setScale(0.1).setDepth(2);
            add.image(250, 250, "bg").setScale(1, 1.5).setDepth(0);
            add.image(250, 300, "tablero").setScale(0.5).setDepth(1);
            add.image(450, 50, "trofeo").setScale(0.1).setDepth(3);
            this.rectanguloTurno = add.rectangle(250, 120, 200, 40);
            this.textoTurno = add.text(160, 110, `Turno de: ${turno}`, { color: "black", fontFamily: "Arial" })
            this.puntuaje = add.text(400, 40, contadorVictorias, { fontSize: "3em", fontFamily: "Arial", color: "black" });
            this.rectanguloAlerta = add.rectangle(250, 300, 300, 125).setDepth(99)
            this.alerta = add.text(120, 280, "", { fontSize: "4em", color: "black", fontFamily: "Arial" }).setDepth(99)


            // Agregar el resto de elementos del juego (por ejemplo, celdas, jugadores)
            return inicializar(add)
        }

        // Función con la que actualizaremos el juego segun los casos en los que se encuentre
        async function update() {

            const add = this.add
            // Con el setFillStyle podemos cambiar el color del rectangulo
            this.rectanguloTurno.setFillStyle(turno === usuario.name ? 0xff8888 : 0xffffff)
            this.textoTurno.setText(`Turno de: ${turno}`)
            this.rectanguloAlerta.setVisible(alertaVisible)
            this.alerta.setText(alertaTexto)

            // Verificamos si el ganador es X
            if (verificarGanador('X')) {
                // Indicamos que hay ganador
                ganador = true
                console.log(`¡Ha ganado ${turno}!`);
                // Si ha ganador el jugador
                if (turno === usuario.name) {
                    // Ampliamos el contador de victoras
                    contadorVictorias++
                    this.rectanguloAlerta.setFillStyle(0xffff00)
                    alertaVisible = true;
                    alertaTexto = "¡Has ganado!"
                    this.alerta.setText("¡Has ganado!")
                    this.puntuaje.setText(contadorVictorias)
                } else {
                    this.rectanguloAlerta.setFillStyle(0xff0000)
                    alertaVisible = true;
                    alertaTexto = "Has perdido"
                    this.puntuaje.setText(0)
                    // Hacemos que el contador de victorias se reinicie
                    contadorVictorias = 0
                }
                // Cada partida que haya un ganador se llamará al back para comprobar si es un record o no
                await actualizarMarcador()
                return inicializar(add)
            } else if (verificarGanador('O')) { // Verificamos si el ganador es O
                // similiar a lo de antes
                ganador = true
                console.log(`¡Ha ganado ${turno}!`);
                if (turno === usuario.name) {
                    contadorVictorias++
                    this.rectanguloAlerta.setFillStyle(0xffff00)
                    alertaVisible = true;
                    alertaTexto = "¡Has ganado!"
                    this.puntuaje.setText(contadorVictorias)
                } else {
                    this.rectanguloAlerta.setFillStyle(0xff0000)
                    alertaVisible = true;
                    alertaTexto = "Has perdido"
                    this.puntuaje.setText(0)
                    contadorVictorias = 0
                }
                await actualizarMarcador();
                return inicializar(add)
            }

            // Si no hay ninguna celda disponible
            if (obtenerCeldasDisponibles().length === 0) {
                if (ganador) return
                // Si no hay ganador es empate
                console.log("Empate");
                this.rectanguloAlerta.setFillStyle(0xffa500)
                alertaVisible = true;
                alertaTexto = "Hay empate"
                // Reiniciamos
                return inicializar(add)
            }
        }

        return () => {
            game.destroy(); // Limpiar el juego cuando el componente se desmonte
        };
    }, []);

    return <div ref={gameRef} />
};

