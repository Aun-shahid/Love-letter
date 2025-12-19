/**
 * Player Component for "Protocol: Reunion"
 * 
 * The controllable character (Chichi).
 * Uses LPC sprite sheets from the chichi assets folder.
 */

import React from 'react';
import useGameStore from '../../store/useGameStore';
import './Player.css';

// Import sprite sheets
import walkSprite from '../../assets/chichi/standard/walk.png';
import idleSprite from '../../assets/chichi/standard/idle.png';

const Player = () => {
  const { playerPosition, playerFacing, isPlayerMoving } = useGameStore();

  // Determine which sprite sheet to use
  const currentSprite = isPlayerMoving ? walkSprite : idleSprite;

  return (
    <div
      className={`player ${isPlayerMoving ? 'walking' : 'idle'} facing-${playerFacing}`}
      style={{
        left: `${playerPosition.x}px`,
        top: `${playerPosition.y}px`,
      }}
    >
      <div 
        className="player-sprite"
        style={{ backgroundImage: `url(${currentSprite})` }}
      />
      <div className="player-label">Chichi</div>
    </div>
  );
};

export default Player;
