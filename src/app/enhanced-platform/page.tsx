'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Target, 
  Zap, 
  Brain, 
  Globe, 
  BarChart3,
  Star,
  Crown,
  Medal,
  Gamepad2,
  TrendingUp,
  Clock,
  Settings
} from 'lucide-react';

import { MultiGameAI, GameType } from '@/lib/ai/MultiGameAI';
import { OnlineGamingEngine } from '@/lib/ai/OnlineGamingEngine';
import { TournamentSystem } from '@/lib/ai/TournamentSystem';
import { TransformerGameNetwork, NeuralNetworkConfig } from '@/lib/ai/TransformerGameNetwork';

interface EnhancedPlatformState {
  multiGameAI: MultiGameAI | null;
  onlineEngine: OnlineGamingEngine | null;
  tournamentSystem: TournamentSystem | null;
  neuralNetwork: TransformerGameNetwork | null;
  activeGames: any[];
  tournamentHistory: any[];
  leaderboards: Map<GameType, any>;
  achievements: any[];
  researchMetrics: ResearchMetrics;
}

interface ResearchMetrics {
  totalExperiments: number;
  knowledgeTransferRate: number;
  neuralNetworkAccuracy: number;
  onlineWinRate: number;
  tournamentVictories: number;
  innovationScore: number;
}

export default function EnhancedAITrainingPlatform() {
  const [platformState, setPlatformState] = useState<EnhancedPlatformState>({
    multiGameAI: null,
    onlineEngine: null,
    tournamentSystem: null,
    neuralNetwork: null,
    activeGames: [],
    tournamentHistory: [],
    leaderboards: new Map(),
    achievements: [],
    researchMetrics: {
      totalExperiments: 0,
      knowledgeTransferRate: 0,
      neuralNetworkAccuracy: 0,
      onlineWinRate: 0,
      tournamentVictories: 0,
      innovationScore: 0
    }
  });

  const [selectedGameType, setSelectedGameType] = useState<GameType>('chess');
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeExperiments, setActiveExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    initializeEnhancedPlatform();
  }, []);

  const initializeEnhancedPlatform = async () => {
    setIsInitializing(true);
    
    try {
      // Initialize Multi-Game AI
      const multiGameAI = new MultiGameAI('EnhancedAI_v2', 'Advanced Multi-Game AI', ['chess', 'poker', 'go', 'checkers']);
      
      // Initialize Online Gaming Engine
      const onlineEngine = new OnlineGamingEngine();
      
      // Initialize Tournament System
      const tournamentSystem = new TournamentSystem(onlineEngine);
      
      // Initialize Neural Network
      const neuralConfig: NeuralNetworkConfig = {
        gameType: 'chess',
        inputDimensions: 8 * 8 * 12, // Chess board representation
        hiddenDimensions: 512,
        outputDimensions: 4096, // Possible moves
        numLayers: 8,
        attentionHeads: 8,
        dropoutRate: 0.1,
        learningRate: 0.001,
        batchSize: 32
      };
      
      const neuralNetwork = new TransformerGameNetwork(neuralConfig);
      
      // Connect to demo platforms
      await onlineEngine.connectToPlatform('chess.com', { token: 'demo_token' });
      await onlineEngine.connectToPlatform('lichess', { username: 'AI_Demo', token: 'demo_token' });
      
      // Initialize research metrics
      const researchMetrics: ResearchMetrics = {
        totalExperiments: Math.floor(Math.random() * 50) + 100,
        knowledgeTransferRate: 0.73 + Math.random() * 0.15,
        neuralNetworkAccuracy: 0.82 + Math.random() * 0.1,
        onlineWinRate: 0.68 + Math.random() * 0.2,
        tournamentVictories: Math.floor(Math.random() * 10) + 5,
        innovationScore: 0.85 + Math.random() * 0.1
      };
      
      setPlatformState({
        multiGameAI,
        onlineEngine,
        tournamentSystem,
        neuralNetwork,
        activeGames: generateDemoGames(),
        tournamentHistory: generateTournamentHistory(),
        leaderboards: generateLeaderboards(),
        achievements: generateAchievements(),
        researchMetrics
      });
      
    } catch (error) {
      console.error('Failed to initialize enhanced platform:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const generateDemoGames = () => [
    { id: 'game1', type: 'chess', opponent: 'Stockfish 15', status: 'active', moves: 23, advantage: '+0.7' },
    { id: 'game2', type: 'poker', opponent: 'PokerBot Pro', status: 'active', hand: 'Pair of Kings', chips: 2400 },
    { id: 'game3', type: 'go', opponent: 'KataGo', status: 'completed', result: 'win', territory: '+4.5' },
    { id: 'game4', type: 'checkers', opponent: 'Chinook', status: 'active', pieces: 'W:6 B:8', advantage: '-0.3' }
  ];

  const generateTournamentHistory = () => [
    { name: 'Rapid Championship', games: 45, position: 2, prize: 'Silver Medal', date: '2024-01-15' },
    { name: 'Blitz Arena', games: 23, position: 1, prize: 'Gold Trophy', date: '2024-01-20' },
    { name: 'Multi-Game Masters', games: 67, position: 3, prize: 'Bronze Badge', date: '2024-01-25' }
  ];

  const generateLeaderboards = () => {
    const leaderboards = new Map();
    const gameTypes: GameType[] = ['chess', 'poker', 'go', 'checkers'];
    
    gameTypes.forEach(gameType => {
      leaderboards.set(gameType, {
        rank: Math.floor(Math.random() * 10) + 1,
        rating: 1800 + Math.floor(Math.random() * 400),
        games: Math.floor(Math.random() * 100) + 50,
        winRate: (0.6 + Math.random() * 0.3).toFixed(3)
      });
    });
    
    return leaderboards;
  };

  const generateAchievements = () => [
    { name: 'Multi-Game Master', description: 'Excel in 4+ different games', progress: 85, maxProgress: 100, icon: '🎯' },
    { name: 'Neural Pioneer', description: 'Train advanced neural networks', progress: 92, maxProgress: 100, icon: '🧠' },
    { name: 'Online Champion', description: 'Win 50+ online games', progress: 78, maxProgress: 100, icon: '🏆' },
    { name: 'Research Leader', description: 'Contribute to AI research', progress: 95, maxProgress: 100, icon: '🔬' }
  ];

  const startMultiGameTraining = async () => {
    if (!platformState.multiGameAI) return;
    
    const newExperiment: Experiment = {
      id: `exp_${Date.now()}`,
      name: 'Multi-Game Cross-Training',
      type: 'transfer-learning',
      status: 'running',
      progress: 0,
      startTime: Date.now(),
      games: ['chess', 'poker', 'go'],
      metrics: {
        transferEfficiency: 0,
        learningRate: 0.001,
        accuracy: 0
      }
    };
    
    setActiveExperiments(prev => [...prev, newExperiment]);
    
    // Simulate experiment progress
    const interval = setInterval(() => {
      setActiveExperiments(prev => prev.map(exp => {
        if (exp.id === newExperiment.id && exp.progress < 100) {
          const newProgress = Math.min(exp.progress + Math.random() * 10, 100);
          return {
            ...exp,
            progress: newProgress,
            metrics: {
              ...exp.metrics,
              transferEfficiency: Math.min(newProgress / 100 * 0.85, 0.85),
              accuracy: Math.min(newProgress / 100 * 0.92, 0.92)
            },
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return exp;
      }));
    }, 2000);
    
    setTimeout(() => clearInterval(interval), 30000);
  };

  const startOnlineChallenge = async () => {
    if (!platformState.onlineEngine || !platformState.multiGameAI) return;
    
    const gamePreferences = {
      timeControl: { type: 'blitz' as const, initialTime: 300, increment: 3, description: '5+3' },
      rated: true,
      preferredColor: 'random' as const
    };
    
    try {
      const gameId = await platformState.onlineEngine.seekGame('lichess', platformState.multiGameAI, gamePreferences);
      console.log('Started online game:', gameId);
      
      // Update active games
      setPlatformState(prev => ({
        ...prev,
        activeGames: [...prev.activeGames, {
          id: gameId,
          type: selectedGameType,
          opponent: 'Online Player',
          status: 'seeking',
          platform: 'Lichess'
        }]
      }));
    } catch (error) {
      console.error('Failed to start online challenge:', error);
    }
  };

  const createTournament = async () => {
    if (!platformState.tournamentSystem) return;
    
    try {
      const tournament = await platformState.tournamentSystem.simulateQuickTournament(selectedGameType);
      console.log('Created tournament:', tournament.id);
      
      setPlatformState(prev => ({
        ...prev,
        tournamentHistory: [{
          name: 'AI Demo Tournament',
          games: 6,
          status: 'active',
          participants: 4,
          date: new Date().toISOString().split('T')[0]
        }, ...prev.tournamentHistory]
      }));
    } catch (error) {
      console.error('Failed to create tournament:', error);
    }
  };

  const runNeuralNetworkExperiment = async () => {
    if (!platformState.neuralNetwork) return;
    
    const experiment: Experiment = {
      id: `neural_${Date.now()}`,
      name: 'Transformer Architecture Test',
      type: 'neural-network',
      status: 'running',
      progress: 0,
      startTime: Date.now(),
      games: [selectedGameType],
      metrics: {
        accuracy: 0,
        loss: 1.0,
        trainingTime: 0
      }
    };
    
    setActiveExperiments(prev => [...prev, experiment]);
    
    // Simulate neural network training
    const interval = setInterval(() => {
      setActiveExperiments(prev => prev.map(exp => {
        if (exp.id === experiment.id && exp.progress < 100) {
          const newProgress = Math.min(exp.progress + Math.random() * 8, 100);
          return {
            ...exp,
            progress: newProgress,
            metrics: {
              ...exp.metrics,
              accuracy: Math.min(newProgress / 100 * 0.94, 0.94),
              loss: Math.max(1.0 - newProgress / 100 * 0.85, 0.15),
              trainingTime: newProgress / 100 * 45
            },
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return exp;
      }));
    }, 1500);
    
    setTimeout(() => clearInterval(interval), 25000);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Initializing Enhanced AI Platform</h2>
          <p className="text-purple-300">Loading advanced neural networks and multi-game systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Enhanced AI Gaming Platform
          </h1>
          <p className="text-purple-300 text-lg">
            Advanced Multi-Game AI with Neural Networks, Online Integration & Tournament Systems
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{platformState.researchMetrics.totalExperiments}</div>
                <div className="text-xs text-purple-300">Experiments</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{(platformState.researchMetrics.neuralNetworkAccuracy * 100).toFixed(1)}%</div>
                <div className="text-xs text-purple-300">NN Accuracy</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{(platformState.researchMetrics.onlineWinRate * 100).toFixed(1)}%</div>
                <div className="text-xs text-purple-300">Online WR</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{platformState.researchMetrics.tournamentVictories}</div>
                <div className="text-xs text-purple-300">Tournaments</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{(platformState.researchMetrics.knowledgeTransferRate * 100).toFixed(1)}%</div>
                <div className="text-xs text-purple-300">Transfer Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{(platformState.researchMetrics.innovationScore * 100).toFixed(0)}</div>
                <div className="text-xs text-purple-300">Innovation</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Type Selector */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-purple-400" />
              Select Game Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(['chess', 'poker', 'go', 'checkers'] as GameType[]).map((gameType) => (
                <Button
                  key={gameType}
                  variant={selectedGameType === gameType ? "default" : "outline"}
                  onClick={() => setSelectedGameType(gameType)}
                  className={selectedGameType === gameType ? 
                    "bg-purple-600 text-white" : 
                    "border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                  }
                >
                  {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="multi-game" className="data-[state=active]:bg-purple-600">Multi-Game</TabsTrigger>
            <TabsTrigger value="neural" className="data-[state=active]:bg-purple-600">Neural Networks</TabsTrigger>
            <TabsTrigger value="online" className="data-[state=active]:bg-purple-600">Online Play</TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-purple-600">Tournaments</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-purple-600">Research</TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Games */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    Active Games
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {platformState.activeGames.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          {game.type}
                        </Badge>
                        <span className="text-white">{game.opponent}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          game.status === 'active' ? 'bg-green-600' : 
                          game.status === 'completed' ? 'bg-blue-600' : 'bg-yellow-600'
                        }>
                          {game.status}
                        </Badge>
                        {game.advantage && (
                          <span className={`text-sm ${game.advantage.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {game.advantage}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Leaderboards */}
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Rankings ({selectedGameType})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {platformState.leaderboards.has(selectedGameType) && (
                    <div className="space-y-4">
                      {(() => {
                        const stats = platformState.leaderboards.get(selectedGameType);
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-2xl font-bold text-white">#{stats.rank}</div>
                              <div className="text-sm text-purple-300">Global Rank</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-2xl font-bold text-white">{stats.rating}</div>
                              <div className="text-sm text-purple-300">ELO Rating</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-2xl font-bold text-white">{stats.games}</div>
                              <div className="text-sm text-purple-300">Games Played</div>
                            </div>
                            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                              <div className="text-2xl font-bold text-white">{(parseFloat(stats.winRate) * 100).toFixed(1)}%</div>
                              <div className="text-sm text-purple-300">Win Rate</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={startMultiGameTraining} className="bg-purple-600 hover:bg-purple-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Multi-Game Training
                  </Button>
                  <Button onClick={startOnlineChallenge} className="bg-blue-600 hover:bg-blue-700">
                    <Globe className="h-4 w-4 mr-2" />
                    Challenge Online Player
                  </Button>
                  <Button onClick={createTournament} className="bg-yellow-600 hover:bg-yellow-700">
                    <Trophy className="h-4 w-4 mr-2" />
                    Create Tournament
                  </Button>
                  <Button onClick={runNeuralNetworkExperiment} className="bg-green-600 hover:bg-green-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Neural Network Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multi-game" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Multi-Game AI System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Supported Games</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(['chess', 'poker', 'go', 'checkers'] as GameType[]).map((game) => (
                        <div key={game} className="p-3 bg-slate-700/50 rounded-lg text-center">
                          <div className="text-2xl mb-2">
                            {game === 'chess' && '♟️'}
                            {game === 'poker' && '🃏'}
                            {game === 'go' && '⚫'}
                            {game === 'checkers' && '🔴'}
                          </div>
                          <div className="text-white capitalize">{game}</div>
                          <div className="text-sm text-purple-300">Active</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Transfer Learning Status</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-white mb-1">
                          <span>Chess → Checkers</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-white mb-1">
                          <span>Go → Strategy Games</span>
                          <span>74%</span>
                        </div>
                        <Progress value={74} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-white mb-1">
                          <span>Poker → Risk Assessment</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-purple-500/30">
                  <Button onClick={startMultiGameTraining} className="bg-purple-600 hover:bg-purple-700 w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Cross-Game Training Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="neural" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  Transformer Neural Networks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-sm text-purple-300">Attention Heads</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white">512</div>
                      <div className="text-sm text-purple-300">Hidden Dimensions</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-sm text-purple-300">Transformer Layers</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Training Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm text-white mb-1">
                        <span>Model Accuracy</span>
                        <span>{(platformState.researchMetrics.neuralNetworkAccuracy * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={platformState.researchMetrics.neuralNetworkAccuracy * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-white mb-1">
                        <span>Convergence Rate</span>
                        <span>89.3%</span>
                      </div>
                      <Progress value={89.3} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <Button onClick={runNeuralNetworkExperiment} className="bg-orange-600 hover:bg-orange-700 w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Neural Network Training
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="online" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Online Gaming Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700/50 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Lichess</h3>
                        <Badge className="bg-green-600">Connected</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-purple-300">
                        <div>Games Played: 234</div>
                        <div>Current Rating: 1847</div>
                        <div>Win Rate: 72.4%</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Chess.com</h3>
                        <Badge className="bg-green-600">Connected</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-purple-300">
                        <div>Games Played: 189</div>
                        <div>Current Rating: 1792</div>
                        <div>Win Rate: 68.9%</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button onClick={startOnlineChallenge} className="bg-blue-600 hover:bg-blue-700 w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Challenge Random Online Player
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Tournament System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700/50 border-yellow-500/20">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{platformState.researchMetrics.tournamentVictories}</div>
                      <div className="text-sm text-purple-300">Victories</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">43</div>
                      <div className="text-sm text-purple-300">Tournaments</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <Medal className="h-8 w-8 text-bronze-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">89.3%</div>
                      <div className="text-sm text-purple-300">Top 3 Rate</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Recent Tournaments</h3>
                  {platformState.tournamentHistory.slice(0, 3).map((tournament, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{tournament.name}</div>
                        <div className="text-sm text-purple-300">{tournament.games} games • {tournament.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          #{tournament.position}
                        </Badge>
                        <Badge className="bg-yellow-600">{tournament.prize}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={createTournament} className="bg-yellow-600 hover:bg-yellow-700 w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Create New Tournament
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Active Experiments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeExperiments.length === 0 ? (
                  <div className="text-center py-8 text-purple-300">
                    No active experiments. Start a new experiment to begin research.
                  </div>
                ) : (
                  activeExperiments.map((experiment) => (
                    <Card key={experiment.id} className="bg-slate-700/50 border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white">{experiment.name}</h3>
                            <p className="text-sm text-purple-300">{experiment.type}</p>
                          </div>
                          <Badge className={
                            experiment.status === 'running' ? 'bg-blue-600' : 
                            experiment.status === 'completed' ? 'bg-green-600' : 'bg-gray-600'
                          }>
                            {experiment.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-white">
                            <span>Progress</span>
                            <span>{experiment.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={experiment.progress} className="h-2" />
                          {experiment.metrics && (
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              {Object.entries(experiment.metrics).map(([key, value]) => (
                                <div key={key} className="text-purple-300">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                  <span className="text-white">
                                    {typeof value === 'number' ? 
                                      (key.includes('Rate') || key.includes('accuracy') ? 
                                        (value * 100).toFixed(1) + '%' : 
                                        value.toFixed(3)
                                      ) : 
                                      value
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  Achievements & Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformState.achievements.map((achievement, index) => (
                  <Card key={index} className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{achievement.name}</h3>
                          <p className="text-sm text-purple-300 mb-2">{achievement.description}</p>
                          <div className="flex justify-between text-sm text-white mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                        {achievement.progress >= achievement.maxProgress && (
                          <Badge className="bg-green-600">Complete</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface Experiment {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: number;
  games: GameType[];
  metrics?: { [key: string]: any };
}
