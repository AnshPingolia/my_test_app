import { useState, useCallback, useEffect } from 'react';

// Helper to generate a unique ID for each tile to maintain React keys during animations
let tileIdCounter = 0;
const getNextId = () => `tile_${tileIdCounter++}`;

export const useGameLogic = () => {
  // Grid is stored as a 1D array of 16 items for easier mapping, or array of objects
  // Each cell: { id: string, value: number, x: number, y: number, isNew: boolean, isMerged: boolean } | null
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  const restart = useCallback(() => {
    setGrid(Array(16).fill(null));
    setScore(0);
    setGameOver(false);
    // Spawn two initial tiles
    setTimeout(() => {
        setGrid(prev => spawnRandomTile(spawnRandomTile(prev)));
    }, 50);
  }, []);

  useEffect(() => {
    restart();
  }, [restart]);

  const getEmptyCells = (currentGrid) => {
    return currentGrid
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null);
  };

  const spawnRandomTile = (currentGrid) => {
    const emptyCells = getEmptyCells(currentGrid);
    if (emptyCells.length === 0) return currentGrid;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    
    const newGrid = [...currentGrid];
    // Remove isNew/isMerged flags from existing tiles before adding the new one
    const cleanGrid = newGrid.map(cell => cell ? { ...cell, isNew: false, isMerged: false } : null);
    
    cleanGrid[randomIndex] = {
      id: getNextId(),
      value,
      x: randomIndex % 4,
      y: Math.floor(randomIndex / 4),
      isNew: true,
      isMerged: false
    };
    
    return cleanGrid;
  };

  // Matrix Transposition and Reversal helpers for movements
  const getRow = (g, r) => [g[r*4], g[r*4+1], g[r*4+2], g[r*4+3]];
  const setRow = (g, r, row) => {
      g[r*4] = row[0]; g[r*4+1] = row[1]; g[r*4+2] = row[2]; g[r*4+3] = row[3];
  };

  const getCol = (g, c) => [g[c], g[c+4], g[c+8], g[c+12]];
  const setCol = (g, c, col) => {
      g[c] = col[0]; g[c+4] = col[1]; g[c+8] = col[2]; g[c+12] = col[3];
  };

  // Core slide and merge algorithm for a 1D array of 4 items
  const slideAndMergeLine = (line) => {
    // 1. Remove nulls
    let filterNulls = line.filter(val => val !== null);
    
    // 2. Merge adjacent equals
    let pointsGained = 0;
    for (let i = 0; i < filterNulls.length - 1; i++) {
      if (filterNulls[i].value === filterNulls[i + 1].value) {
        filterNulls[i] = {
          id: filterNulls[i].id, // keep id of the one we merge into
          value: filterNulls[i].value * 2,
          isMerged: true, // Tag for CSS animation
          isNew: false
        };
        pointsGained += filterNulls[i].value;
        filterNulls.splice(i + 1, 1);
      }
    }
    
    // 3. Pad with nulls back to 4
    while (filterNulls.length < 4) {
      filterNulls.push(null);
    }
    
    return { newLine: filterNulls, pointsGain: pointsGained };
  };

  const move = useCallback((direction) => {
    if (gameOver) return;

    setGrid((prevGrid) => {
      let newGrid = [...prevGrid];
      let moved = false;
      let totalPointsGain = 0;

      // Clean up previous animation states
      newGrid = newGrid.map(cell => cell ? { ...cell, isNew: false, isMerged: false } : null);

      if (direction === 'LEFT' || direction === 'RIGHT') {
        for (let r = 0; r < 4; r++) {
          let row = getRow(newGrid, r);
          const originalValues = row.map(v => v ? v.value : null).join(',');
          
          if (direction === 'RIGHT') row.reverse();
          const { newLine, pointsGain } = slideAndMergeLine(row);
          if (direction === 'RIGHT') newLine.reverse();
          
          totalPointsGain += pointsGain;
          setRow(newGrid, r, newLine);
          
          const newValues = getRow(newGrid, r).map(v => v ? v.value : null).join(',');
          if (originalValues !== newValues) moved = true;
        }
      } else if (direction === 'UP' || direction === 'DOWN') {
        for (let c = 0; c < 4; c++) {
          let col = getCol(newGrid, c);
          const originalValues = col.map(v => v ? v.value : null).join(',');
          
          if (direction === 'DOWN') col.reverse();
          const { newLine, pointsGain } = slideAndMergeLine(col);
          if (direction === 'DOWN') newLine.reverse();
          
          totalPointsGain += pointsGain;
          setCol(newGrid, c, newLine);
          
          const newValues = getCol(newGrid, c).map(v => v ? v.value : null).join(',');
          if (originalValues !== newValues) moved = true;
        }
      }

      if (moved) {
        // Update physical x/y attributes for surviving tiles so CSS matches
        for (let i = 0; i < 16; i++) {
          if (newGrid[i]) {
            newGrid[i].x = i % 4;
            newGrid[i].y = Math.floor(i / 4);
          }
        }
        
        let targetGrid = spawnRandomTile(newGrid);
        
        // Debug output to terminal
        console.log(`Moved ${direction}`);
        console.table(
          [0, 1, 2, 3].map(r => getRow(targetGrid, r).map(c => c ? c.value : 0))
        );

        setScore(prev => prev + totalPointsGain);
        
        // Check game over
        if (getEmptyCells(targetGrid).length === 0) {
          // Check for valid merges recursively
          let possibleMerge = false;
          // Check horizontal merges
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
              if (targetGrid[r*4 + c].value === targetGrid[r*4 + c + 1].value) {
                possibleMerge = true; break;
              }
            }
          }
          // Check vertical merges
          if (!possibleMerge) {
            for (let c = 0; c < 4; c++) {
              for (let r = 0; r < 3; r++) {
                if (targetGrid[r*4 + c].value === targetGrid[(r+1)*4 + c].value) {
                  possibleMerge = true; break;
                }
              }
            }
          }
          
          if (!possibleMerge) {
            setGameOver(true);
            console.log("GAME OVER");
          }
        }
        
        return targetGrid;
      }
      return prevGrid;
    });
  }, [gameOver]);

  return { grid, score, gameOver, move, restart };
};
