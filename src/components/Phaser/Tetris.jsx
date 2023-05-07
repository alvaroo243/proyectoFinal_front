import React, { Component } from 'react';
import * as Phaser from 'phaser';

class Tetris extends Component {
  constructor(props) {
    super(props);

    // Configuración de Tetris
    this.config = {
      type: Phaser.AUTO,
      width: 640,
      height: 960,
      backgroundColor: '#000',
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update,
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      parent: 'tetris-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    // Opciones adicionales de Tetris
    this.options = {
      tileSize: 32,
      boardWidth: 10,
      boardHeight: 20,
      tetrominos: [
        { name: 'I', shape: [[1, 1, 1, 1]] },
        { name: 'J', shape: [[1, 1, 1], [0, 0, 1]] },
        { name: 'L', shape: [[1, 1, 1], [1, 0, 0]] },
        { name: 'O', shape: [[1, 1], [1, 1]] },
        { name: 'S', shape: [[0, 1, 1], [1, 1, 0]] },
        { name: 'T', shape: [[1, 1, 1], [0, 1, 0]] },
        { name: 'Z', shape: [[1, 1, 0], [0, 1, 1]] },
      ],
    };
  }

  componentDidMount() {
    this.game = new Phaser.Game(this.config);
  }

  preload() {
    // Carga de recursos del juego
    this.load.image('background', 'https://i.imgur.com/fZMxjoo.png');
    this.options.tetrominos.forEach((tetromino) => {
      this.load.image(tetromino.name, `https://i.imgur.com/u8OYzI5.png`);
    });
  }

  create() {
    // Inicialización del juego
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    this.score = 0;
    this.gameOver = false;

    this.board = [];
    for (let i = 0; i < this.options.boardHeight; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.options.boardWidth; j++) {
        this.board[i][j] = null;
      }
    }

    this.activeTetromino = null;
    this.nextTetromino = this.getRandomTetromino();
    this.createTetromino();

    this.createScoreText();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    // Actualización del juego
    if (!this.gameOver) {
      if (this.activeTetromino) {
        if (this.cursors.left.isDown) {
          this.moveTetrominoLeft();
        } else if (this.cursors.right.isDown) {
          this.moveTetromino
        } else if (this.cursors.down.isDown) {
          this.moveTetrominoDown();
        } else if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
          this.dropTetromino();
        }
        if (this.time.now - this.activeTetromino.lastMoveTime > 1000) {
          this.moveTetrominoDown();
        }
      }
    }
  }

  getRandomTetromino() {
    // Obtener una figura aleatoria
    return this.options.tetrominos[Math.floor(Math.random() * this.options.tetrominos.length)];
  }

  createTetromino() {
    // Crear una nueva figura
    const tetromino = this.nextTetromino;
    this.nextTetromino = this.getRandomTetromino();

    this.activeTetromino = {
      name: tetromino.name,
      shape: tetromino.shape,
      x: Math.floor(this.options.boardWidth / 2) - Math.ceil(tetromino.shape[0].length / 2),
      y: 0,
      lastMoveTime: 0,
    };

    if (this.checkCollision()) {
      this.gameOver = true;
      this.showGameOverText();
    } else {
      this.drawTetromino();
    }
  }

  drawTetromino() {
    // Dibujar la figura actual en el tablero
    this.activeTetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const tileX = this.activeTetromino.x + x;
          const tileY = this.activeTetromino.y + y;
          const tile = this.add.sprite(tileX * this.options.tileSize, tileY * this.options.tileSize, this.activeTetromino.name);
          tile.setOrigin(0);
          this.physics.add.existing(tile);
          tile.body.setImmovable();
          tile.body.allowGravity = false;
        }
      });
    });
  }

  moveTetrominoDown() {
    // Mover la figura hacia abajo
    this.activeTetromino.y++;
    if (this.checkCollision()) {
      this.activeTetromino.y--;
      this.freezeTetromino();
    } else {
      this.activeTetromino.lastMoveTime = this.time.now;
      this.redrawTetromino();
    }
  }

  moveTetrominoLeft() {
    // Mover la figura hacia la izquierda
    this.activeTetromino.x--;
    if (this.checkCollision()) {
      this.activeTetromino.x++;
    } else {
      this.redrawTetromino();
    }
  }

  moveTetrominoRight() {
    // Mover la figura hacia la derecha
    this.activeTetromino.x++;
    if (this.checkCollision()) {
      this.activeTetromino.x--;
    } else {
      this.redrawTetromino();
    }
  }

  dropTetromino() {
    // Caída rápida de la figura
    while (!this.checkCollision()) {
      this.activeTetromino.y++;
    }
    this.activeTetromino.y--;
    this.freezeTetromino();
  }

      rotateTetromino() {
        // Rotar la figura
        const previousShape = this.activeTetromino.shape;
        this.activeTetromino.shape = this.activeTetromino.shape[0].map((_, index) => this.activeTetromino.shape.map(row => row[index]).reverse());
        if (this.checkCollision()) {
          this.activeTetromino.shape = previousShape;
        } else {
          this.redrawTetromino();
        }
      }
    
      checkCollision() {
        // Comprobar si la figura colisiona con otra o con el borde del tablero
        const { boardWidth, boardHeight } = this.options;
        return this.activeTetromino.shape.some((row, y) => {
          return row.some((value, x) => {
            if (value) {
              const tileX = this.activeTetromino.x + x;
              const tileY = this.activeTetromino.y + y;
              return tileX < 0 || tileX >= boardWidth || tileY >= boardHeight || this.grid[tileY][tileX];
            }
            return false;
          });
        });
      }
    
      freezeTetromino() {
        // Fijar la figura en su posición actual y crear una nueva figura
        this.activeTetromino.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              const tileX = this.activeTetromino.x + x;
              const tileY = this.activeTetromino.y + y;
              this.grid[tileY][tileX] = this.add.sprite(tileX * this.options.tileSize, tileY * this.options.tileSize, this.activeTetromino.name);
              this.grid[tileY][tileX].setOrigin(0);
              this.physics.add.existing(this.grid[tileY][tileX]);
              this.grid[tileY][tileX].body.setImmovable();
              this.grid[tileY][tileX].body.allowGravity = false;
            }
          });
        });
        this.checkRows();
        this.createTetromino();
      }
    
      redrawTetromino() {
        // Dibujar la figura en su nueva posición
        this.activeTetromino.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              const tileX = this.activeTetromino.x + x;
              const tileY = this.activeTetromino.y + y;
              this.grid[tileY][tileX].setPosition(tileX * this.options.tileSize, tileY * this.options.tileSize);
            }
          });
        });
      }
    
      checkRows() {
        // Comprobar si alguna fila está completa y eliminarla
        let rowsToClear = [];
        for (let y = 0; y < this.options.boardHeight; y++) {
          let rowIsComplete = true;
          for (let x = 0; x < this.options.boardWidth; x++) {
            if (!this.grid[y][x]) {
              rowIsComplete = false;
              break;
            }
          }
          if (rowIsComplete) {
            rowsToClear.push(y);
          }
        }
        rowsToClear.forEach(y => {
          this.grid[y].forEach(tile => {
            tile.destroy();
          });
          this.grid.splice(y, 1);
          this.grid.unshift(Array(this.options.boardWidth).fill(null));
        });
        this.updateScore(rowsToClear.length)
      }
          updateScore(rowsCleared) {
            // Actualizar la puntuación
            this.score += rowsCleared ** 2 * 10;
            this.scoreText.setText(`Score: ${this.score}`);
          }
        
          update(time) {
            // Actualizar el juego
            if (time > this.lastUpdateTime + this.options.speed) {
              this.moveDown();
              this.lastUpdateTime = time;
            }
          }
        
          moveLeft() {
            // Mover la figura a la izquierda
            this.activeTetromino.x--;
            if (this.checkCollision()) {
              this.activeTetromino.x++;
            } else {
              this.redrawTetromino();
            }
          }
        
          moveRight() {
            // Mover la figura a la derecha
            this.activeTetromino.x++;
            if (this.checkCollision()) {
              this.activeTetromino.x--;
            } else {
              this.redrawTetromino();
            }
          }
        
          moveDown() {
            // Mover la figura hacia abajo
            this.activeTetromino.y++;
            if (this.checkCollision()) {
              this.activeTetromino.y--;
              this.freezeTetromino();
            } else {
              this.redrawTetromino();
            }
          }
        
          render() {
            return (
              <div>
                <div ref={this.containerRef}></div>
                <div>{`Score: ${this.score}`}</div>
              </div>
            );
          }
        }
        

        export default Tetris