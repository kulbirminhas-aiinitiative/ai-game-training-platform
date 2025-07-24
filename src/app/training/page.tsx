"use client";

import { useState } from 'react';
import { ArrowLeft, Play, Pause, Settings, Brain, TrendingUp, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const performanceData = [
  { session: 1, chess: 45, poker: 32 },
  { session: 2, chess: 52, poker: 38 },
  { session: 3, chess: 61, poker: 45 },
  { session: 4, chess: 68, poker: 52 },
  { session: 5, chess: 72, poker: 58 },
  { session: 6, chess: 78, poker: 64 },
  { session: 7, chess: 82, poker: 68 },
  { session: 8, chess: 85, poker: 72 },
];

const trainingTimeData = [
  { name: 'Chess', value: 65, color: '#8b5cf6' },
  { name: 'Poker', value: 35, color: '#06b6d4' },
];

const recentGames = [
  { id: 1, game: 'Chess', opponent: 'Stockfish 8', result: 'Win', duration: '00:23:45', timestamp: '2 hours ago' },
  { id: 2, game: 'Poker', opponent: 'AI Agent 2', result: 'Win', duration: '00:18:32', timestamp: '3 hours ago' },
  { id: 3, game: 'Chess', opponent: 'AI Agent 1', result: 'Loss', duration: '00:31:12', timestamp: '4 hours ago' },
  { id: 4, game: 'Poker', opponent: 'Human Player', result: 'Win', duration: '00:25:48', timestamp: '5 hours ago' },
];

export default function TrainingPage() {
  const [selectedAgent, setSelectedAgent] = useState('chess-agent-1');
  const [isTraining, setIsTraining] = useState(false);

  const agents = [
    { id: 'chess-agent-1', name: 'Chess Master v1', game: 'Chess', status: 'active', winRate: 85 },
    { id: 'chess-agent-2', name: 'Chess Master v2', game: 'Chess', status: 'training', winRate: 78 },
    { id: 'poker-agent-1', name: 'Poker Pro v1', game: 'Poker', status: 'active', winRate: 72 },
    { id: 'poker-agent-2', name: 'Poker Pro v2', game: 'Poker', status: 'paused', winRate: 68 },
  ];

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
            <h1 className="text-2xl font-bold text-white">AI Training Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isTraining 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isTraining ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isTraining ? 'Stop Training' : 'Start Training'}</span>
            </button>
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Agents</p>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-green-400 text-sm">+1 this week</p>
              </div>
              <Brain className="h-12 w-12 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Training Hours</p>
                <p className="text-3xl font-bold text-white">2,847</p>
                <p className="text-blue-400 text-sm">+156 today</p>
              </div>
              <Activity className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Games Played</p>
                <p className="text-3xl font-bold text-white">15,429</p>
                <p className="text-yellow-400 text-sm">+432 today</p>
              </div>
              <TrendingUp className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Win Rate</p>
                <p className="text-3xl font-bold text-white">76%</p>
                <p className="text-green-400 text-sm">+3% this week</p>
              </div>
              <Zap className="h-12 w-12 text-green-400" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Training Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Performance Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="session" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chess" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Chess Win Rate (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="poker" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    name="Poker Win Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Selection and Configuration */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Agent Configuration</h3>
              
              {/* Agent Selector */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Select Agent</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} - {agent.game} (Win Rate: {agent.winRate}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Training Parameters */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Learning Rate</label>
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
                  <label className="block text-gray-300 text-sm font-medium mb-2">Batch Size</label>
                  <input
                    type="range"
                    min="16"
                    max="512"
                    step="16"
                    defaultValue="64"
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>16</span>
                    <span>512</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Exploration Rate</label>
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
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Network Depth</label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    defaultValue="8"
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2</span>
                    <span>20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Agent Status</h3>
              <div className="space-y-3">
                {agents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{agent.name}</p>
                      <p className="text-gray-400 text-xs">{agent.game}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        agent.status === 'active' ? 'bg-green-400' :
                        agent.status === 'training' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-400">{agent.winRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Time Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Training Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trainingTimeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trainingTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {trainingTimeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-300 text-sm">{item.name}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Games */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Games</h3>
              <div className="space-y-3">
                {recentGames.map(game => (
                  <div key={game.id} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{game.game}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        game.result === 'Win' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {game.result}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">vs {game.opponent}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{game.duration}</span>
                      <span>{game.timestamp}</span>
                    </div>
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
