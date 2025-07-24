import Link from "next/link";
import { Crown, Spade, Brain, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">AI Game Training Platform</h1>
          </div>
          <nav className="flex space-x-6">
            <Link href="/training" className="text-gray-300 hover:text-white transition-colors">
              Training Dashboard
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Train AI Agents to Master
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"> Games</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI training platform for chess and poker. Watch agents learn, adapt, and improve through 
            reinforcement learning and fine-tuning techniques.
          </p>
        </div>

        {/* Game Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Chess Card */}
          <Link href="/chess" className="group">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <Crown className="h-12 w-12 text-purple-400 group-hover:text-purple-300" />
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-white">Chess</h3>
                  <p className="text-gray-400">Strategic AI Training</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Train AI agents to master chess through deep reinforcement learning. 
                Watch as they develop opening strategies, tactical combinations, and endgame techniques.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-400 font-medium">Start Training →</span>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">3 Agents Active</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Poker Card */}
          <Link href="/poker" className="group">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <Spade className="h-12 w-12 text-blue-400 group-hover:text-blue-300" />
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-white">Poker</h3>
                  <p className="text-gray-400">Probabilistic AI Learning</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Develop poker AI that masters bluffing, pot odds calculation, and opponent modeling. 
                Advanced neural networks learn complex betting patterns and psychological strategies.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-400 font-medium">Start Training →</span>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">2 Agents Learning</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gray-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Training</h3>
            <p className="text-gray-400">
              Advanced reinforcement learning algorithms with customizable hyperparameters and training strategies.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
            <p className="text-gray-400">
              Real-time performance tracking, learning curves, and detailed game analysis with interactive charts.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Gameplay</h3>
            <p className="text-gray-400">
              Play against trained AI agents, watch agent vs agent matches, and analyze game replays.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-12 border border-purple-500/30">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Train AI Champions?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your journey into AI game training. Choose your game, configure your agents, and watch them evolve into masters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/training"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Open Training Dashboard
            </Link>
            <Link
              href="/chess"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start with Chess
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 AI Game Training Platform. Built with Next.js and AI excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
