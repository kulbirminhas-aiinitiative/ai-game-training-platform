"use client";

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Brain } from 'lucide-react';
import Link from 'next/link';

// Chess piece unicode symbols
const pieceSymbols: { [key: string]: string } = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

export default function ChessPage() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'ai-vs-ai'>('human-vs-ai');
  const [isTraining, setIsTraining] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  // Reset game
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setAiThinking(false);
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (gameMode === 'ai-vs-ai' || aiThinking) return;

    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        });
        
        if (move) {
          setGame(new Chess(game.fen()));
          setSelectedSquare(null);
          
          // Simulate AI response
          if (!game.isGameOver()) {
            setAiThinking(true);
            setTimeout(() => {
              makeAiMove();
              setAiThinking(false);
            }, 1000);
          }
        } else {
          setSelectedSquare(square);
        }
      } catch (error) {
        setSelectedSquare(square);
      }
    } else {
      setSelectedSquare(square);
    }
  };

  // Simple AI move (random for demo)
  const makeAiMove = () => {
    const moves = game.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      game.move(randomMove);
      setGame(new Chess(game.fen()));
    }
  };

  // AI vs AI mode
  const startAiVsAi = () => {
    if (gameMode === 'ai-vs-ai' && !isTraining) {
      setIsTraining(true);
      const aiInterval = setInterval(() => {
        if (game.isGameOver()) {
          clearInterval(aiInterval);
          setIsTraining(false);
          return;
        }
        makeAiMove();
      }, 1500);
    }
  };

  // Render chess board
  const renderBoard = () => {
    const board = [];
    const boardArray = game.board();
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + (8 - row);
        const piece = boardArray[row][col];
        const isLight = (row + col) % 2 === 0;
        const isSelected = selectedSquare === square;
        const canMove = selectedSquare && game.moves({ square: selectedSquare as any }).some(move => move.includes(square));
        
        board.push(
          <div
            key={square}
            className={`
              w-16 h-16 flex items-center justify-center text-4xl cursor-pointer relative
              ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
              ${isSelected ? 'ring-4 ring-blue-500' : ''}
              ${canMove ? 'ring-2 ring-green-400' : ''}
              hover:brightness-110 transition-all
            `}
            onClick={() => handleSquareClick(square)}
          >
            {piece && (
              <span className={piece.color === 'w' ? 'text-white' : 'text-black'}>
                {pieceSymbols[piece.color + piece.type.toUpperCase()]}
              </span>
            )}
            {canMove && !piece && (
              <div className="w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
            )}
          </div>
        );
      }
    }
    
    return board;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Chess AI Training</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setGameMode(gameMode === 'human-vs-ai' ? 'ai-vs-ai' : 'human-vs-ai')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {gameMode === 'human-vs-ai' ? 'Human vs AI' : 'AI vs AI'}
            </button>
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Game Board</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={resetGame}
                    className="p-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  {gameMode === 'ai-vs-ai' && (
                    <button
                      onClick={startAiVsAi}
                      disabled={isTraining}
                      className="p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isTraining ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Chess Board */}
              <div className="flex justify-center">
                <div className="grid grid-cols-8 border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl">
                  {renderBoard()}
                </div>
              </div>
              
              {/* Game Status */}
              <div className="mt-6 text-center">
                {aiThinking && (
                  <p className="text-yellow-400 font-medium">AI is thinking...</p>
                )}
                {game.isCheckmate() && (
                  <p className="text-red-400 font-bold">Checkmate! {game.turn() === 'w' ? 'Black' : 'White'} wins!</p>
                )}
                {game.isDraw() && (
                  <p className="text-gray-400 font-bold">Game is a draw!</p>
                )}
                {!game.isGameOver() && !aiThinking && (
                  <p className="text-white">
                    {game.turn() === 'w' ? 'White' : 'Black'} to move
                    {game.inCheck() && <span className="text-red-400 ml-2">(Check!)</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Training Panel */}
          <div className="space-y-6">
            {/* Training Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Training Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Training Mode:</span>
                  <span className={`font-medium ${isTraining ? 'text-green-400' : 'text-gray-400'}`}>
                    {isTraining ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Games Played:</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Rate:</span>
                  <span className="text-green-400 font-medium">68.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg. Game Length:</span>
                  <span className="text-white font-medium">42 moves</span>
                </div>
              </div>
            </div>

            {/* AI Configuration */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Search Depth</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="5"
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Learning Rate</label>
                  <input
                    type="range"
                    min="0.001"
                    max="0.1"
                    step="0.001"
                    defaultValue="0.01"
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.001</span>
                    <span>0.1</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Exploration Rate</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.1"
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Moves */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Move History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {game.history().map((move, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-400">{Math.floor(index / 2) + 1}.</span>
                    <span className="text-white">{move}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
