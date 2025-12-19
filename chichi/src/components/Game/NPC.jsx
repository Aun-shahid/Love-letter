/**
 * NPC Component for "Protocol: Reunion"
 * 
 * Reusable component for all NPCs (Bat, Delice the Cat, Nienie).
 */

import React from 'react';
import './NPC.css';

import deliceImage from '../../assets/delice/delice.png';

const NPC_CONFIGS = {
  bat: {
    name: 'Bat',
    emoji: '🦇',
    color: '#2d1b4e',
    accentColor: '#9370db',
    size: { width: 45, height: 40 },
    decoration: '🎀',
    useImage: false,
  },
  delice: {
    name: 'Delice',
    emoji: '🐱',
    color: '#1a4a3a',
    accentColor: '#7fffd4',
    size: { width: 64, height: 64 },
    decoration: '✨',
    useSprite: true,
    spriteSheet: deliceImage,
  },
  nienie: {
    name: 'Nienie',
    emoji: '😴',
    color: '#2a5a4a',
    accentColor: '#98d4bb',
    size: { width: 60, height: 70 },
    decoration: '👖',
    useImage: false,
  },
};

const NPC = ({ 
  type, 
  position, 
  visible = true, 
  onClick,
  glowing = false,
  sleeping = false,
}) => {
  const config = NPC_CONFIGS[type];

  if (!config || !visible) {
    return null;
  }

  const { name, emoji, color, accentColor, size, decoration, useSprite, spriteSheet, useImage, image } = config;

  return (
    <div
      className={`npc npc-${type} ${glowing ? 'glowing' : ''} ${sleeping ? 'sleeping' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        '--npc-color': color,
        '--npc-accent': accentColor,
      }}
      onClick={onClick}
    >
      {useSprite && spriteSheet ? (
        <>
          <div 
            className="delice-sprite"
            style={{ backgroundImage: `url(${spriteSheet})` }}
          />
          {decoration && (
            <span className="npc-decoration">{decoration}</span>
          )}
          {onClick && (
            <div className="npc-interact-hint">!</div>
          )}
        </>
      ) : useImage && image ? (
        <div className="npc-sprite">
          <div className="npc-body npc-image-body">
            <img src={image} alt={name} className="npc-image" />
          </div>
          {decoration && (
            <span className="npc-decoration">{decoration}</span>
          )}
          {onClick && (
            <div className="npc-interact-hint">!</div>
          )}
        </div>
      ) : (
        <div className="npc-sprite">
          <div className="npc-body">
            <span className="npc-emoji">{emoji}</span>
          </div>
          {decoration && (
            <span className="npc-decoration">{decoration}</span>
          )}
          {onClick && (
            <div className="npc-interact-hint">!</div>
          )}
        </div>
      )}
      
      <div className="npc-label" style={{ color: accentColor }}>
        {name}
      </div>
    </div>
  );
};

export default NPC;
