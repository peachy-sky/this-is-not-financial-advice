import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameScene from './game/GameScene.js';
import UIScene from './game/UIScene.js';
import HUD from './game/ui/HUD.jsx';
import EndScreen from './game/ui/EndScreen.jsx';

export default function App() {
  const gameRef = useRef(null);
  const phaserRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'end'

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#e8d8c0',
      parent: gameRef.current,
      scene: [GameScene, UIScene],
      callbacks: {
        preBoot: (game) => {
          game.registry.set('setGameState', setGameState);
          game.registry.set('setPhase', setPhase);
        },
      },
    };

    phaserRef.current = new Phaser.Game(config);

    const handleResize = () => {
      if (phaserRef.current) {
        phaserRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      phaserRef.current?.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={gameRef} style={{ position: 'absolute', inset: 0 }} />
      {gameState && phase === 'playing' && <HUD state={gameState} />}
      {phase === 'end' && gameState && (
        <EndScreen
          state={gameState}
          onRestart={() => {
            setPhase('playing');
            phaserRef.current?.scene.getScene('GameScene')?.restartGame();
          }}
        />
      )}
    </div>
  );
}
