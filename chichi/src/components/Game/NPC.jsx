/**
 * NPC Component for "Protocol: Reunion"
 * 
 * Reusable component for all NPCs (Bat, Delice the Cat, Nienie).
 * Uses colored divs as placeholders until real sprites are added.
 */

import React from 'react';
import './NPC.css';

// NPC type configurations
const NPC_CONFIGS = {
  bat: {
    name: 'Bat',
    emoji: '🦇',
    color: '#2d1b4e',
    accentColor: '#9370db',
    size: { width: 45, height: 40 },
    decoration: '🎀', // Pink bow
  },
  delice: {
    name: 'Delice',
    emoji: '🐱',
    color: '#1a4a3a',
    accentColor: '#7fffd4',
    size: { width: 50, height: 45 },
    decoration: '✨', // Ghost spirit glow
    isGhost: true,
  },
  nienie: {
    name: 'Nienie',
    emoji: '😴',
    color: '#2a5a4a',
    accentColor: '#98d4bb',
    size: { width: 60, height: 70 },
    decoration: '👖', // Sleeping in jeans
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

  const { name, emoji, color, accentColor, size, decoration, isGhost } = config;

  return (
    <div
      className={`npc npc-${type} ${glowing ? 'glowing' : ''} ${isGhost ? 'ghost' : ''} ${sleeping ? 'sleeping' : ''}`}
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
      <div className="npc-sprite">
        {/* Main body */}
        <div className="npc-body">
          <span className="npc-emoji">{emoji}</span>
        </div>
        
        {/* Decoration (bow, sparkle, etc.) */}
        {decoration && (
          <span className="npc-decoration">{decoration}</span>
        )}
        
        {/* Interaction indicator */}
        {onClick && (
          <div className="npc-interact-hint">!</div>
        )}
      </div>
      
      {/* NPC name label */}
      <div className="npc-label" style={{ color: accentColor }}>
        {name}
      </div>
    </div>
  );
};

export default NPC;
