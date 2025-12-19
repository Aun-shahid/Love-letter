/**
 * Cat Component for "Protocol: Reunion"
 * 
 * Delice the Cat NPC.
 * Uses LPC sprite sheets from the delice assets folder.
 * Same format as Player component.
 * 
 * Can be clicked to pet, triggering purr sound and love emoji.
 */

import React, { useState } from 'react';
import './Cat.css';

// Import sprite sheet
import catIdleSprite from '../../assets/CatPackFree/Idle.png';

const Cat = ({ position, visible = true }) => {
  const [showLoveEmoji, setShowLoveEmoji] = useState(false);

  if (!visible) {
    return null;
  }

  const handleCatClick = () => {
    // Show love emoji temporarily when clicked (for visual feedback)
    setShowLoveEmoji(true);
    setTimeout(() => setShowLoveEmoji(false), 1500);
  };

  return (
    <div
      className="cat idle facing-down"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'pointer'
      }}
      onClick={handleCatClick}
    >
      <div 
        className="cat-sprite"
        style={{ backgroundImage: `url(${catIdleSprite})` }}
      />
      {showLoveEmoji && <div className="cat-love-emoji">💕</div>}
      <div className="cat-label">Delice</div>
    </div>
  );
};

export default Cat;
