/**
 * UIButton Component - Pixel art buttons using FreeUi assets
 * 
 * Provides clickable buttons with pixel art styling
 */

import React from 'react';
import './UIButton.css';

const UIButton = ({ 
  type = 'classical', // 'classical', 'version1', 'version2', 'version3', 'version4'
  icon = '🔊', 
  onClick, 
  className = '',
  style = {},
  title = ''
}) => {
  return (
    <button 
      className={`ui-button ${type} ${className}`}
      onClick={onClick}
      style={style}
      title={title}
    >
      <div className="ui-button-bg" />
      <span className="ui-button-icon">{icon}</span>
    </button>
  );
};

export default UIButton;
