'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Play, Square, Trophy, TrendingUp, Settings, Save, Download, Users, Zap, Target, Clock, TestTube } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTraining } from '../../hooks/useTraining';
import { LearningParameters } from '../../lib/ai/ChessAIAgent';

export default function AITrainingPage() {
  const { state, actions } = useTraining();
  const [selectedAgent1, setSelectedAgent1] = useState<string>('');
  const [selectedAgent2, setSelectedAgent2] = useState<string>('');
  const [targetGames, setTargetGames] = useState<number>(100);
  const [showAgentCreator, setShowAgentCreator] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{ passed: number; total: number; results: boolean[] } | null>(null);
  const [learningParams, setLearningParams] = useState<Partial<LearningParameters>>({
    learningRate: 0.01,
    explorationRate: 0.1,
    discountFactor: 0.95,
  });

  // Create default agents if none exist
  useEffect(() => {
    if (state.agents.length === 0) {
      const agent1 = actions.createAgent('AlphaChess-1', {
        learningRate: 0.01,
        explorationRate: 0.15,
        discountFactor: 0.95,
      });
      
      const agent2 = actions.createAgent('DeepBlue-2', {
        learningRate: 0.008,
        explorationRate: 0.12,
        discountFactor: 0.97,
      });

      setSelectedAgent1(agent1.id);
      setSelectedAgent2(agent2.id);
    } else if (state.agents.length >= 2) {
      setSelectedAgent1(state.agents[0].id);
      setSelectedAgent2(state.agents[1].id);
    }
  }, [state.agents.length, actions]);

  const handleStartTraining = async () => {
    const agent1 = state.agents.find(a => a.id === selectedAgent1);
    const agent2 = state.agents.find(a => a.id === selectedAgent2);
    
    if (agent1 && agent2) {
      try {
        await actions.startTraining(agent1, agent2, targetGames);
      } catch (error) {
        console.error('Failed to start training:', error);
      }
    }
  };

  const handleCreateAgent = () => {
    if (newAgentName.trim()) {
      actions.createAgent(newAgentName.trim(), learningParams);
      setNewAgentName('');
      setShowAgentCreator(false);
    }
  };

  const handleRunValidation = async () => {
    setIsValidating(true);
    setValidationResults(null);
    
    try {
      // Import the validator dynamically to avoid SSR issues
      const { AITrainingValidator } = await import('../../tests/AITrainingValidator');
      const results = await AITrainingValidator.runAllTests();
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getAgent = (id: string) => state.agents.find(a => a.id === id);

  // Prepare chart data
  const eloProgressData = state.metrics ? [
    ...state.metrics.agent1Stats.learningProgress.map((elo, index) => ({
      game: index + 1,
      [state.agents.find(a => a.id === selectedAgent1)?.name || 'Agent 1']: elo,
    })),
  ].map((item, index) => ({
    ...item,
    [state.agents.find(a => a.id === selectedAgent2)?.name || 'Agent 2']: 
      state.metrics!.agent2Stats.learningProgress[index] || 0,
  })) : [];

  const performanceData = state.metrics ? [
    {
      name: state.agents.find(a => a.id === selectedAgent1)?.name || 'Agent 1',
      wins: state.metrics.agent1Stats.wins,
      losses: state.metrics.agent1Stats.losses,
      draws: state.metrics.agent1Stats.draws,
      elo: state.metrics.agent1Stats.averageElo,
    },
    {
      name: state.agents.find(a => a.id === selectedAgent2)?.name || 'Agent 2',
      wins: state.metrics.agent2Stats.wins,
      losses: state.metrics.agent2Stats.losses,
      draws: state.metrics.agent2Stats.draws,
      elo: state.metrics.agent2Stats.averageElo,
    },
  ] : [];

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">AI vs AI Chess Training</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRunValidation}
                disabled={isValidating}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <TestTube className="h-4 w-4" />
                <span>{isValidating ? 'Testing...' : 'Run Tests'}</span>
              </button>
              <div className="text-sm text-gray-400">
                {state.isTraining ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Training Active</span>
                  </div>
                ) : (
                  <span>Ready to Train</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Validation Results */}
        {validationResults && (
          <div className="mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-green-400" />
                System Validation Results
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${validationResults.passed === validationResults.total ? 'text-green-400' : 'text-orange-400'}`}>
                    {validationResults.passed}/{validationResults.total}
                  </div>
                  <div className="text-gray-300">tests passed</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  validationResults.passed === validationResults.total 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {validationResults.passed === validationResults.total ? 'All Systems Operational' : 'Some Tests Failed'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  'Basic Agent Functionality',
                  'Learning & Retention',
                  'Knowledge Persistence',
                  'Performance Metrics',
                  'Tactical Patterns',
                  'Session Management'
                ].map((testName, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    validationResults.results[index] 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : 'border-red-500/30 bg-red-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        validationResults.results[index] ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {testName}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        validationResults.results[index] 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {validationResults.results[index] ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Training Control Panel */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Agent Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                Training Setup
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Agent 1 (White)</label>
                  <select
                    value={selectedAgent1}
                    onChange={(e) => setSelectedAgent1(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    disabled={state.isTraining}
                  >
                    {state.agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} (ELO: {Math.round(agent.stats.eloRating)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Agent 2 (Black)</label>
                  <select
                    value={selectedAgent2}
                    onChange={(e) => setSelectedAgent2(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    disabled={state.isTraining}
                  >
                    {state.agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} (ELO: {Math.round(agent.stats.eloRating)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Games: {targetGames}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    value={targetGames}
                    onChange={(e) => setTargetGames(Number(e.target.value))}
                    className="w-full"
                    disabled={state.isTraining}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10</span>
                    <span>1000</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {!state.isTraining ? (
                    <button
                      onClick={handleStartTraining}
                      disabled={!selectedAgent1 || !selectedAgent2 || selectedAgent1 === selectedAgent2}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </button>
                  ) : (
                    <button
                      onClick={actions.stopTraining}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Training
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowAgentCreator(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-400" />
                Training Progress
              </h3>
              
              {state.currentSession ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      Games: {state.currentSession.gamesPlayed} / {state.currentSession.targetGames}
                    </span>
                    <span className="text-purple-400 font-medium">
                      {state.progress.toFixed(1)}% Complete
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${state.progress}%` }}
                    ></div>
                  </div>

                  {state.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {state.metrics.totalGames}
                        </div>
                        <div className="text-sm text-gray-400">Games Played</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {state.metrics.convergenceRate.toFixed(3)}
                        </div>
                        <div className="text-sm text-gray-400">Convergence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {state.metrics.diversityScore.toFixed(3)}
                        </div>
                        <div className="text-sm text-gray-400">Diversity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {state.metrics.averageGameLength.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-400">Avg Moves</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No training session active. Select agents and start training to see progress.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {state.metrics && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* ELO Progress Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                ELO Rating Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eloProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="game" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={state.agents.find(a => a.id === selectedAgent1)?.name || 'Agent 1'}
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={state.agents.find(a => a.id === selectedAgent2)?.name || 'Agent 2'}
                    stroke="#06B6D4" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Comparison */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="wins" fill="#10B981" />
                  <Bar dataKey="losses" fill="#EF4444" />
                  <Bar dataKey="draws" fill="#6B7280" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Games & Agent Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Games */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-400" />
              Recent Games
            </h3>
            
            {state.recentGames.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {state.recentGames.map((game, index) => (
                  <div key={game.gameId} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-white">
                        Game #{state.recentGames.length - index}
                      </div>
                      <div className="text-xs text-gray-400">
                        {game.whiteAgent} vs {game.blackAgent}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        game.result === 'white' ? 'bg-green-500/20 text-green-400' :
                        game.result === 'black' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {game.result === 'draw' ? 'Draw' : `${game.result} wins`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {game.moves.length} moves
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No games played yet. Start training to see game history.</p>
              </div>
            )}
          </div>

          {/* Agent Knowledge */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              Agent Knowledge
            </h3>
            
            {selectedAgent1 && getAgent(selectedAgent1) && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">{getAgent(selectedAgent1)!.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">ELO Rating:</span>
                      <span className="text-white ml-2">{Math.round(getAgent(selectedAgent1)!.stats.eloRating)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Games:</span>
                      <span className="text-white ml-2">{getAgent(selectedAgent1)!.stats.gamesPlayed}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-green-400 ml-2">
                        {getAgent(selectedAgent1)!.stats.gamesPlayed > 0 
                          ? ((getAgent(selectedAgent1)!.stats.wins / getAgent(selectedAgent1)!.stats.gamesPlayed) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Knowledge:</span>
                      <span className="text-blue-400 ml-2">
                        {getAgent(selectedAgent1)!.getKnowledgeSnapshot().openingBookSize} openings
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => actions.saveAgent(getAgent(selectedAgent1)!)}
                      className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        const data = actions.exportSession(state.currentSession?.id || '');
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `agent_${getAgent(selectedAgent1)!.name}_knowledge.json`;
                        a.click();
                      }}
                      className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                {selectedAgent2 && getAgent(selectedAgent2) && (
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">{getAgent(selectedAgent2)!.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">ELO Rating:</span>
                        <span className="text-white ml-2">{Math.round(getAgent(selectedAgent2)!.stats.eloRating)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Games:</span>
                        <span className="text-white ml-2">{getAgent(selectedAgent2)!.stats.gamesPlayed}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-green-400 ml-2">
                          {getAgent(selectedAgent2)!.stats.gamesPlayed > 0 
                            ? ((getAgent(selectedAgent2)!.stats.wins / getAgent(selectedAgent2)!.stats.gamesPlayed) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Knowledge:</span>
                        <span className="text-blue-400 ml-2">
                          {getAgent(selectedAgent2)!.getKnowledgeSnapshot().openingBookSize} openings
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => actions.saveAgent(getAgent(selectedAgent2)!)}
                        className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          const data = actions.exportSession(state.currentSession?.id || '');
                          const blob = new Blob([data], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `agent_${getAgent(selectedAgent2)!.name}_knowledge.json`;
                          a.click();
                        }}
                        className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Agent Creator Modal */}
      {showAgentCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Agent</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter agent name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Learning Rate: {learningParams.learningRate}
                </label>
                <input
                  type="range"
                  min="0.001"
                  max="0.1"
                  step="0.001"
                  value={learningParams.learningRate}
                  onChange={(e) => setLearningParams(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exploration Rate: {learningParams.explorationRate}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={learningParams.explorationRate}
                  onChange={(e) => setLearningParams(prev => ({ ...prev, explorationRate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount Factor: {learningParams.discountFactor}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="0.99"
                  step="0.01"
                  value={learningParams.discountFactor}
                  onChange={(e) => setLearningParams(prev => ({ ...prev, discountFactor: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateAgent}
                disabled={!newAgentName.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Agent
              </button>
              <button
                onClick={() => setShowAgentCreator(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
