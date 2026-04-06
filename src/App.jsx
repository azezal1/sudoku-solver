import React, { useState, useEffect, useRef } from 'react';
import { createConfetti } from './utils/confetti';

function App() {
    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
    const [initialBoard, setInitialBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
    const [solving, setSolving] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [darkMode, setDarkMode] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [stats, setStats] = useState({
        steps: 0,
        backtracks: 0,
        time: 0
    });
    const [currentCell, setCurrentCell] = useState(null);
    const [backtrackCell, setBacktrackCell] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [pencilMode, setPencilMode] = useState(false);
    const [notes, setNotes] = useState(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    const [manualTimer, setManualTimer] = useState(0);
    const [isManualMode, setIsManualMode] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [solution, setSolution] = useState(null);
    const solveRef = useRef(false);
    const startTimeRef = useRef(null);
    const manualTimerRef = useRef(null);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    // Manual timer
    useEffect(() => {
        if (isManualMode && !solving) {
            manualTimerRef.current = setInterval(() => {
                setManualTimer(prev => prev + 1);
            }, 1000);
        } else {
            if (manualTimerRef.current) {
                clearInterval(manualTimerRef.current);
            }
        }
        return () => {
            if (manualTimerRef.current) {
                clearInterval(manualTimerRef.current);
            }
        };
    }, [isManualMode, solving]);

    const validateCell = (board, row, col, num) => {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num && x !== col) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num && x !== row) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const r = startRow + i;
                const c = startCol + j;
                if (board[r][c] === num && (r !== row || c !== col)) return false;
            }
        }
        
        return true;
    };

    const findEmpty = (board) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const solveSudoku = async (board) => {
        const empty = findEmpty(board);
        
        if (!empty) return true;
        if (!solveRef.current) return false;
        
        const [row, col] = empty;
        
        for (let num = 1; num <= 9; num++) {
            if (!solveRef.current) return false;
            
            if (validateCell(board, row, col, num)) {
                board[row][col] = num;
                setBoard([...board.map(r => [...r])]);
                setCurrentCell([row, col]);
                
                setStats(prev => ({ ...prev, steps: prev.steps + 1 }));
                
                await sleep(50);
                
                if (await solveSudoku(board)) {
                    return true;
                }
                
                // Backtrack
                board[row][col] = 0;
                setBoard([...board.map(r => [...r])]);
                setBacktrackCell([row, col]);
                
                setStats(prev => ({ ...prev, backtracks: prev.backtracks + 1 }));
                
                await sleep(50);
                setBacktrackCell(null);
            }
        }
        
        return false;
    };

    const handleSolve = async () => {
        // Validate board
        let hasInvalid = false;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== 0 && !validateCell(board, i, j, board[i][j])) {
                    hasInvalid = true;
                }
            }
        }
        
        if (hasInvalid) {
            setStatus('Invalid board');
            return;
        }
        
        setSolving(true);
        solveRef.current = true;
        setStatus('Solving...');
        setStats({ steps: 0, backtracks: 0, time: 0 });
        startTimeRef.current = Date.now();
        
        const timer = setInterval(() => {
            setStats(prev => ({ ...prev, time: Math.floor((Date.now() - startTimeRef.current) / 1000) }));
        }, 1000);
        
        const boardCopy = board.map(row => [...row]);
        const solved = await solveSudoku(boardCopy);
        
        clearInterval(timer);
        setSolving(false);
        solveRef.current = false;
        setCurrentCell(null);
        
        if (solved) {
            setBoard(boardCopy);
            setStatus('Solved! 🎉');
            createConfetti();
        } else {
            setStatus('No solution');
        }
    };

    const handleClear = () => {
        solveRef.current = false;
        setSolving(false);
        setBoard(Array(9).fill(null).map(() => Array(9).fill(0)));
        setStatus('Idle');
        setCurrentCell(null);
        setBacktrackCell(null);
        setStats({ steps: 0, backtracks: 0, time: 0 });
    };

    const generatePuzzle = () => {
        const newBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        
        // Fill diagonal boxes
        for (let box = 0; box < 3; box++) {
            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const idx = Math.floor(Math.random() * nums.length);
                    newBoard[box * 3 + i][box * 3 + j] = nums[idx];
                    nums.splice(idx, 1);
                }
            }
        }
        
        // Solve
        solveSudokuSync(newBoard);
        
        // Remove cells based on difficulty
        const cellsToRemove = {
            easy: 35,
            medium: 45,
            hard: 55
        }[difficulty];
        
        let removed = 0;
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (newBoard[row][col] !== 0) {
                newBoard[row][col] = 0;
                removed++;
            }
        }
        
        setBoard(newBoard);
        setStatus('Idle');
        setStats({ steps: 0, backtracks: 0, time: 0 });
    };

    const solveSudokuSync = (board) => {
        const empty = findEmpty(board);
        if (!empty) return true;
        
        const [row, col] = empty;
        
        for (let num = 1; num <= 9; num++) {
            if (validateCell(board, row, col, num)) {
                board[row][col] = num;
                if (solveSudokuSync(board)) return true;
                board[row][col] = 0;
            }
        }
        
        return false;
    };

    const handleCellChange = (row, col, value) => {
        if (solving || initialBoard[row][col] !== 0) return;
        
        if (pencilMode && value) {
            // Toggle note
            const num = parseInt(value);
            const newNotes = notes.map(r => r.map(c => [...c]));
            const cellNotes = newNotes[row][col];
            const idx = cellNotes.indexOf(num);
            if (idx > -1) {
                cellNotes.splice(idx, 1);
            } else {
                cellNotes.push(num);
                cellNotes.sort();
            }
            setNotes(newNotes);
        } else {
            const newBoard = board.map(r => [...r]);
            const newValue = value ? parseInt(value) : 0;
            newBoard[row][col] = newValue;
            setBoard(newBoard);
            
            // Clear notes for this cell
            if (newValue !== 0) {
                const newNotes = notes.map(r => r.map(c => [...c]));
                newNotes[row][col] = [];
                setNotes(newNotes);
            }
            
            // Check if mistake in manual mode
            if (isManualMode && newValue !== 0 && solution) {
                if (solution[row][col] !== newValue) {
                    setMistakes(prev => prev + 1);
                }
                
                // Check if puzzle is complete
                checkPuzzleComplete(newBoard);
            }
        }
    };

    const handleCellClick = (row, col) => {
        if (solving) return;
        setSelectedCell([row, col]);
    };

    const handleNumberPadClick = (num) => {
        if (!selectedCell || solving) return;
        const [row, col] = selectedCell;
        handleCellChange(row, col, num.toString());
    };

    const handleClearCell = () => {
        if (!selectedCell || solving) return;
        const [row, col] = selectedCell;
        handleCellChange(row, col, '');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const checkPuzzleComplete = (currentBoard) => {
        // Check if all cells filled
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] === 0) return;
            }
        }
        
        // Check if correct
        let isCorrect = true;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] !== solution[i][j]) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }
        
        if (isCorrect) {
            setIsManualMode(false);
            setStatus('Solved! 🎉');
            createConfetti();
            
            // Calculate score
            const timeScore = Math.max(0, 1000 - manualTimer);
            const mistakesPenalty = mistakes * 50;
            const hintsPenalty = hintsUsed * 30;
            const finalScore = Math.max(0, timeScore - mistakesPenalty - hintsPenalty);
            
            setTimeout(() => {
                alert(`PUZZLE COMPLETE!\n\nTime: ${formatTime(manualTimer)}\nMistakes: ${mistakes}\nHints: ${hintsUsed}\nScore: ${finalScore}`);
            }, 500);
        }
    };

    const isCellInvalid = (row, col) => {
        const value = board[row][col];
        if (value === 0) return false;
        return !validateCell(board, row, col, value);
    };

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo">SUDOKU SOLVER</div>
                        <span className="header-badge">BACKTRACKING</span>
                    </div>
                    <div className="header-right">
                        <button 
                            className="theme-toggle"
                            onClick={() => setDarkMode(!darkMode)}
                            title="Toggle theme"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="stats-bar">
                <div className="stats-content">
                    <div className="stat-item">
                        <span className="stat-label">Steps</span>
                        <span className="stat-value">{stats.steps}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Backtracks</span>
                        <span className="stat-value">{stats.backtracks}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Time</span>
                        <span className="stat-value">{stats.time}s</span>
                    </div>
                </div>
            </div>

            <main className="container">
                <div className="layout">
                    <div className="grid-section">
                        <div className="grid-wrapper">
                            <div className={`sudoku-grid ${solving ? 'solving' : ''}`}>
                                {board.map((row, i) => 
                                    row.map((cell, j) => {
                                        const cellIndex = i * 9 + j;
                                        const isCurrent = currentCell && currentCell[0] === i && currentCell[1] === j;
                                        const isBacktrack = backtrackCell && backtrackCell[0] === i && backtrackCell[1] === j;
                                        const isSelected = selectedCell && selectedCell[0] === i && selectedCell[1] === j;
                                        const isInvalid = isCellInvalid(i, j);
                                        
                                        return (
                                            <input
                                                key={cellIndex}
                                                type="text"
                                                inputMode="none"
                                                className={`cell ${isCurrent ? 'current' : ''} ${isBacktrack ? 'backtrack' : ''} ${isSelected ? 'selected' : ''} ${isInvalid ? 'invalid' : ''}`}
                                                value={cell || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^[1-9]$/.test(val)) {
                                                        handleCellChange(i, j, val);
                                                    }
                                                }}
                                                onClick={() => handleCellClick(i, j)}
                                                maxLength={1}
                                                disabled={solving}
                                                readOnly={window.innerWidth <= 768}
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>
                        
                        <div className="difficulty-selector">
                            {['easy', 'medium', 'hard'].map(diff => (
                                <button
                                    key={diff}
                                    className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
                                    onClick={() => setDifficulty(diff)}
                                    disabled={solving}
                                >
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Number Pad for Mobile */}
                        <div className="number-pad">
                            <div className="number-pad-grid">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        className="number-btn"
                                        onClick={() => handleNumberPadClick(num)}
                                        disabled={!selectedCell || solving}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    className="number-btn clear-btn"
                                    onClick={handleClearCell}
                                    disabled={!selectedCell || solving}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="control-panel">
                        <h2 className="panel-title">
                            <span className="panel-icon">▶</span>
                            CONTROLS
                        </h2>
                        
                        <div className="button-group">
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSolve}
                                disabled={solving}
                            >
                                {solving ? 'SOLVING...' : 'SOLVE'}
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                onClick={handleClear}
                            >
                                CLEAR
                            </button>
                            <button 
                                className="btn btn-success" 
                                onClick={generatePuzzle}
                                disabled={solving}
                            >
                                GENERATE
                            </button>
                        </div>

                        <div className="status-group">
                            <label className="control-label">STATUS</label>
                            <div className={`status-display ${solving ? 'solving' : ''} ${status.includes('Solved') ? 'solved' : ''} ${status.includes('Invalid') || status.includes('No solution') ? 'error' : ''}`}>
                                {status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>BACKTRACKING ALGORITHM • REACT + VITE</p>
            </footer>
        </div>
    );
}

export default App;
