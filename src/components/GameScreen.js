import React, { useEffect, useRef } from 'react';
import './GameScreen.css';
import Tile from './Tile';
import { useGameLogic } from '../hooks/useGameLogic';

const GameScreen = () => {
  const { grid, score, gameOver, move, restart } = useGameLogic();
  const touchStartRef = useRef(null);

  // Handle Keyboard Arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling
      }
      switch (e.key) {
        case 'ArrowUp': move('UP'); break;
        case 'ArrowDown': move('DOWN'); break;
        case 'ArrowLeft': move('LEFT'); break;
        case 'ArrowRight': move('RIGHT'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Handle Swipes
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;
    
    // Minimum threshold for a detected swipe
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) move('RIGHT');
        else move('LEFT');
      } else {
        if (dy > 0) move('DOWN');
        else move('UP');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      className="game-container" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
    >
      <div className="header">
        <div className="title-section">
          <h1>NodeShift</h1>
          <p className="subtitle">Hyper-Casual Logic Puzzle</p>
        </div>
        <div className="score-section">
          <div className="score-box">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score}</span>
          </div>
          <button className="reset-button" onClick={restart}>Restart</button>
        </div>
      </div>
      
      {gameOver && <div className="game-over-overlay">Game Over!</div>}

      <div className="grid-container">
        {/* Render 16 empty background cells */}
        {Array(16).fill(0).map((_, i) => (
          <div key={`bg-${i}`} className="grid-cell"></div>
        ))}
        
        {/* Render actual tiles floating above the background */}
        {grid.map((cell) => {
          if (!cell) return null;
          return (
            <Tile 
              key={cell.id} 
              value={cell.value} 
              x={cell.x} 
              y={cell.y} 
              isNew={cell.isNew} 
              isMerged={cell.isMerged} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameScreen;
