import React, { Component } from 'react';
import Phaser from 'phaser';
import Tetris from './Tetris';

class Juego extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: null
    };

    this.containerRef = React.createRef();
  }

  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      parent: this.containerRef.current,
      width: 240,
      height: 480,
      backgroundColor: '#f0f0f0',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      },
      scene: {
        create: this.createScene.bind(this),
        update: this.updateScene.bind(this)
      }
    };
    const game = new Phaser.Game(config);
    this.setState({ game });
  }

  componentWillUnmount() {
    this.state.game.destroy();
  }

  createScene() {
    this.tetris = new Tetris({
      scene: this,
      container: this.containerRef.current,
      boardWidth: 10,
      boardHeight: 20,
      tileSize: 24,
      speed: 500
    });
  }

  updateScene(time, delta) {
    this.tetris.update(time);
  }

  render() {
    return (
      <div>
        <h1>Tetris</h1>
        <div ref={this.containerRef}></div>
      </div>
    );
  }
}

export default Juego;
