/**
 * GameCanvas Component - Main Game Container
 * 
 * Acts as the main wrapper for all game scenes.
 * Handles act transitions and provides the game viewport.
 */

import React from 'react';
import useGameStore from '../../store/useGameStore';
import ActOne from '../Scenes/ActOne';
import './GameCanvas.css';

const GameCanvas = () => {
  const { currentAct, gameStarted, startGame, resetGame } = useGameStore();

  // Start screen
  if (!gameStarted) {
    return (
      <div className="game-start-screen">
        <div className="start-content">
          <h1 className="game-title">Protocol: Reunion</h1>
          <p className="game-subtitle">A Love Letter in Pixels</p>
          
          <div className="start-decoration">
            <span className="heart">💕</span>
            <span className="char chichi">🎀</span>
            <span className="distance">~ ∞ ~</span>
            <span className="char nienie">🌸</span>
            <span className="heart">💕</span>
          </div>

          <button className="start-button" onClick={startGame}>
            Begin Journey
          </button>

          <p className="start-hint">
            For Chichi, with all my love.<br />
            Happy 2nd Anniversary! 🎉
          </p>
        </div>

        {/* Floating decorations */}
        <div className="floating-elements">
          <span className="float-item" style={{ '--delay': '0s', '--x': '10%' }}>🍂</span>
          <span className="float-item" style={{ '--delay': '1s', '--x': '30%' }}>🦇</span>
          <span className="float-item" style={{ '--delay': '2s', '--x': '50%' }}>✨</span>
          <span className="float-item" style={{ '--delay': '0.5s', '--x': '70%' }}>🐱</span>
          <span className="float-item" style={{ '--delay': '1.5s', '--x': '90%' }}>🌸</span>
        </div>
      </div>
    );
  }

  // Render current act
  const renderCurrentAct = () => {
    switch (currentAct) {
      case 1:
        return <ActOne />;
      case 2:
        // ActTwo placeholder - will be implemented in Part 2
        return (
          <div className="act-placeholder">
            <h2>Act 2: The Void</h2>
            <p>Coming soon... 🌙</p>
            <button onClick={resetGame}>Return to Start</button>
          </div>
        );
      case 3:
        // ActThree placeholder - will be implemented in Part 3
        return (
          <div className="act-placeholder">
            <h2>Act 3: The Reunion</h2>
            <p>Coming soon... 🏖️</p>
            <button onClick={resetGame}>Return to Start</button>
          </div>
        );
      default:
        return <ActOne />;
    }
  };

  return (
    <div className="game-canvas">
      {renderCurrentAct()}
      
      {/* Debug controls (remove in production) */}
      <div className="debug-panel">
        <span>Act: {currentAct}</span>
        <button onClick={resetGame} className="debug-btn">Reset</button>
      </div>
    </div>
  );
};

export default GameCanvas;
