import React from 'react';
import './Tile.css';

const Tile = ({ value, x, y, isNew, isMerged }) => {
  // Pass x and y to CSS variables for dynamic positioning
  const tileStyle = {
    '--tile-color': `var(--color-${value <= 2048 ? value : 'super'})`,
    '--x': x,
    '--y': y,
  };

  return (
    <div 
      className={`tile tile-${value} ${isNew ? 'tile-new' : ''} ${isMerged ? 'tile-merged' : ''}`}
      style={tileStyle}
    >
      <div className="tile-inner">
        {value}
      </div>
    </div>
  );
};

export default Tile;
