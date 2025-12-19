/**
 * Furniture Component - Interactive furniture with open/close states
 * 
 * Handles wardrobes, cupboards, and bedside tables
 * Uses pixelinterior_BR_v1.1 sprite sheets
 */

import React from 'react';
import './Furniture.css';

const Furniture = ({ type, position, isOpen, onClick, scale = 1.8 }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  // Different furniture types have different sprite configurations
  const getFurnitureClass = () => {
    switch (type) {
      case 'wardrobe':
        return isOpen ? 'furniture-wardrobe open' : 'furniture-wardrobe closed';
      case 'bedside-table':
        return isOpen ? 'furniture-bedside-table open' : 'furniture-bedside-table closed';
      case 'cupboard':
        return isOpen ? 'furniture-cupboard open' : 'furniture-cupboard closed';
      case 'bed':
        return 'furniture-bed';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`furniture ${getFurnitureClass()}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick ? handleClick : undefined}
    />
  );
};

export default Furniture;
