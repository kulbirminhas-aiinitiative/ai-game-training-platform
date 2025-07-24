"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Spade, Heart, Diamond, Club } from 'lucide-react';
import Link from 'next/link';

// Card suits and values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface Card {
  suit: string;
  value: string;
  color: 'red' | 'black';
}

interface Player {
  id: number;
  name: string;
  chips: number;
  hand: Card[];
  folded: boolean;
  currentBet: number;
  isAI: boolean;
}

export default function PokerPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(0);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [gamePhase, setGamePhase] = useState<'preflop' | 'flop' | 'turn' | 'river' | 'showdown'>('preflop');
  const [isTraining, setIsTraining] = useState(false);
  
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'You', chips: 1000, hand: [], folded: false, currentBet: 0, isAI: false },
    { id: 2, name: 'AI Agent 1', chips: 1000, hand: [], folded: false, currentBet: 0, isAI: true },
    { id: 3, name: 'AI Agent 2', chips: 1000, hand: [], folded: false, currentBet: 0, isAI: true },
    { id: 4, name: 'AI Agent 3', chips: 1000, hand: [], folded: false, currentBet: 0, isAI: true },
  ]);

  // Create a deck of cards
  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        deck.push({
          suit,
          value,
          color: suit === '♥' || suit === '♦' ? 'red' : 'black'
        });
      });
    });
    return shuffleDeck(deck);
  };

  // Shuffle deck
  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Deal cards
  const dealCards = () => {
    const deck = createDeck();
    const newPlayers = players.map(player => ({
      ...player,
      hand: [deck.pop()!, deck.pop()!],
      folded: false,
      currentBet: 0
    }));
    
    setPlayers(newPlayers);
    setCommunityCards([]);
    setPot(0);
    setGamePhase('preflop');
    setCurrentPlayer(0);
    setGameStarted(true);
  };

  // Handle player actions
  const handleAction = (action: 'fold' | 'call' | 'raise', raiseAmount?: number) => {
    const newPlayers = [...players];
    const player = newPlayers[currentPlayer];
    
    switch (action) {
      case 'fold':
        player.folded = true;
        break;
      case 'call':
        const callAmount = Math.max(...players.map(p => p.currentBet)) - player.currentBet;
        player.chips -= callAmount;
        player.currentBet += callAmount;
        setPot(prev => prev + callAmount);
        break;
      case 'raise':
        if (raiseAmount) {
          player.chips -= raiseAmount;
          player.currentBet += raiseAmount;
          setPot(prev => prev + raiseAmount);
        }
        break;
    }
    
    setPlayers(newPlayers);
    
    // Move to next player
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (newPlayers[nextPlayer].folded && newPlayers.filter(p => !p.folded).length > 1) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }
    setCurrentPlayer(nextPlayer);
  };

  // Simulate AI action
  const simulateAIAction = () => {
    const actions = ['fold', 'call', 'raise'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const raiseAmount = randomAction === 'raise' ? Math.floor(Math.random() * 100) + 50 : undefined;
    
    setTimeout(() => {
      handleAction(randomAction as any, raiseAmount);
    }, 1000);
  };

  // Auto-play AI turns
  useEffect(() => {
    if (gameStarted && players[currentPlayer]?.isAI && !players[currentPlayer]?.folded) {
      simulateAIAction();
    }
  }, [currentPlayer, gameStarted]);

  // Revenue card component
  const Card = ({ card, hidden = false }: { card?: Card; hidden?: boolean }) => (
    <div className={`
      w-16 h-24 rounded-lg border-2 flex items-center justify-center font-bold text-sm
      ${hidden 
        ? 'bg-blue-900 border-blue-700' 
        : 'bg-white border-gray-300'
      } ${card?.color === 'red' ? 'text-red-600' : 'text-black'}
    `}>
      {hidden ? '?' : card && (
        <div className="text-center">
          <div className="text-xs">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900">
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Spade className="h-8 w-8 text-green-400" />
            <h1 className="text-2xl font-bold text-white">Poker AI Training</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isTraining 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isTraining ? 'Stop Training' : 'Start Training'}
            </button>
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-green-800/30 backdrop-blur-sm border border-green-700 rounded-2xl p-8">
              {/* Community Cards */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Community Cards</h3>
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2, 3, 4].map(index => (
                    <Card
                      key={index}
                      card={communityCards[index]}
                      hidden={!communityCards[index]}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-yellow-400">Pot: ${pot}</span>
                </div>
              </div>

              {/* Players */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`
                      bg-gray-800/50 rounded-xl p-4 border-2 transition-all
                      ${currentPlayer === index && !player.folded 
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
                        : 'border-gray-600'
                      }
                      ${player.folded ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="text-center">
                      <h4 className={`font-semibold mb-2 ${
                        player.isAI ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {player.name}
                      </h4>
                      <div className="flex justify-center space-x-1 mb-3">
                        {player.hand.map((card, cardIndex) => (
                          <Card
                            key={cardIndex}
                            card={card}
                            hidden={player.isAI && gameStarted}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-300">
                        <div>Chips: ${player.chips}</div>
                        <div>Bet: ${player.currentBet}</div>
                        {player.folded && (
                          <div className="text-red-400 font-semibold">FOLDED</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game Controls */}
              <div className="text-center space-y-4">
                {!gameStarted ? (
                  <button
                    onClick={dealCards}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Deal Cards
                  </button>
                ) : (
                  <div className="flex justify-center space-x-4">
                    {!players[currentPlayer]?.isAI && !players[currentPlayer]?.folded && (
                      <>
                        <button
                          onClick={() => handleAction('fold')}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Fold
                        </button>
                        <button
                          onClick={() => handleAction('call')}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => handleAction('raise', 100)}
                          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                        >
                          Raise $100
                        </button>
                      </>
                    )}
                    <button
                      onClick={dealCards}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      New Hand
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Training Panel */}
          <div className="space-y-6">
            {/* Training Metrics */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Training Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Hands Played:</span>
                  <span className="text-white font-medium">8,492</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Rate:</span>
                  <span className="text-green-400 font-medium">72.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg. Pot Size:</span>
                  <span className="text-white font-medium">$234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Bluff Success:</span>
                  <span className="text-blue-400 font-medium">45.8%</span>
                </div>
              </div>
            </div>

            {/* AI Strategy */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Strategy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Aggression Level</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="65"
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bluff Frequency</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    defaultValue="20"
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Never</span>
                    <span>Often</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Risk Tolerance</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="40"
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hand Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Hand Strength:</span>
                  <span className="text-green-400 font-medium">Strong</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Pot Odds:</span>
                  <span className="text-white font-medium">3.2:1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Outs:</span>
                  <span className="text-white font-medium">9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Win Probability:</span>
                  <span className="text-blue-400 font-medium">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
