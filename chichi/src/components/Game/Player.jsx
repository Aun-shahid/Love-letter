/**
 * Player Component for "Protocol: Reunion"
 * 
 * The controllable character (Chichi).
 * Uses colored div as placeholder until real sprites are added.
 */

import React from 'react';
import useGameStore from '../../store/useGameStore';
import './Player.css';

const Player = () => {
  const { playerPosition, playerFacing, isPlayerMoving } = useGameStore();

  return (
    <div
      className={`player ${isPlayerMoving ? 'moving' : ''}`}
      style={{
        left: `${playerPosition.x}px`,
        top: `${playerPosition.y}px`,
        transform: playerFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {/* Placeholder: Pink square for Chichi */}
      <div className="player-sprite">
        <div className="player-body" />
        <div className="player-label">Chichi</div>
      </div>
    </div>
  );
};

export default Player;
