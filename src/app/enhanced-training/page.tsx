'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Globe, Trophy, Brain, Target, Users, Download, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChessBook {
  title: string;
  author: string;
  games: any[];
  openings: any[];
  endgames: any[];
  tactics: any[];
}

interface OnlinePlatform {
  name: string;
  icon: string;
  configured: boolean;
  gamesPlayed: number;
  winRate: number;
}

export default function EnhancedAITraining() {
  const [selectedAgent, setSelectedAgent] = useState('agent1');
  const [literatureLoading, setLiteratureLoading] = useState(false);
  const [onlineGaming, setOnlineGaming] = useState(false);
  const [knowledgeStats, setKnowledgeStats] = useState({
    totalKnowledge: 0,
    literature: {
      booksStudied: 0,
      masterGamesAnalyzed: 0,
      openingTheoryKnown: 0,
      endgameStudies: 0,
    },
    onlineExperience: {
      gamesPlayed: 0,
      platforms: [] as string[],
      overallWinRate: 0,
      averageOpponentRating: 1500,
      uniqueLearnings: 0,
    }
  });

  const [onlinePlatforms, setOnlinePlatforms] = useState<OnlinePlatform[]>([
    { name: 'Lichess', icon: '♞', configured: false, gamesPlayed: 0, winRate: 0.5 },
    { name: 'Chess.com', icon: '♛', configured: false, gamesPlayed: 0, winRate: 0.5 },
    { name: 'FICS', icon: '⚡', configured: false, gamesPlayed: 0, winRate: 0.5 },
  ]);

  const [bookLibrary] = useState<ChessBook[]>([
    {
      title: "My System",
      author: "Aron Nimzowitsch",
      games: Array(50).fill(null),
      openings: Array(25).fill(null),
      endgames: Array(10).fill(null),
      tactics: Array(30).fill(null)
    },
    {
      title: "The Art of Attack in Chess",
      author: "Vladimir Vukovic",
      games: Array(75).fill(null),
      openings: Array(15).fill(null),
      endgames: Array(5).fill(null),
      tactics: Array(45).fill(null)
    },
    {
      title: "Dvoretsky's Endgame Manual",
      author: "Mark Dvoretsky",
      games: Array(100).fill(null),
      openings: Array(5).fill(null),
      endgames: Array(200).fill(null),
      tactics: Array(50).fill(null)
    },
    {
      title: "The Complete Chess Course",
      author: "Fred Reinfeld",
      games: Array(150).fill(null),
      openings: Array(40).fill(null),
      endgames: Array(30).fill(null),
      tactics: Array(80).fill(null)
    }
  ]);

  const [trainingHistory, setTrainingHistory] = useState([
    { session: 'Literature Study 1', knowledge: 1200, rating: 1800, games: 50 },
    { session: 'Online Practice 1', knowledge: 1350, rating: 1825, games: 75 },
    { session: 'Master Games Analysis', knowledge: 1500, rating: 1850, games: 100 },
    { session: 'Online Tournament', knowledge: 1650, rating: 1880, games: 125 },
    { session: 'Endgame Studies', knowledge: 1800, rating: 1905, games: 150 },
    { session: 'Current Session', knowledge: 1950, rating: 1925, games: 175 }
  ]);

  const loadChessBook = async (book: ChessBook) => {
    setLiteratureLoading(true);
    
    // Simulate loading book
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setKnowledgeStats(prev => ({
      ...prev,
      totalKnowledge: prev.totalKnowledge + book.games.length + book.openings.length + book.tactics.length + book.endgames.length,
      literature: {
        ...prev.literature,
        booksStudied: prev.literature.booksStudied + 1,
        masterGamesAnalyzed: prev.literature.masterGamesAnalyzed + book.games.length,
        openingTheoryKnown: prev.literature.openingTheoryKnown + book.openings.length,
        endgameStudies: prev.literature.endgameStudies + book.endgames.length,
      }
    }));
    
    setLiteratureLoading(false);
  };

  const playOnlineGames = async (platform: string, gameCount: number) => {
    setOnlineGaming(true);
    
    const platformIndex = onlinePlatforms.findIndex(p => p.name === platform);
    if (platformIndex !== -1) {
      // Simulate online games
      for (let i = 0; i < gameCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const winRate = 0.4 + Math.random() * 0.4; // Simulate improving win rate
        const opponentRating = 1400 + Math.random() * 800;
        
        setOnlinePlatforms(prev => {
          const updated = [...prev];
          updated[platformIndex] = {
            ...updated[platformIndex],
            gamesPlayed: updated[platformIndex].gamesPlayed + 1,
            winRate: (updated[platformIndex].winRate * updated[platformIndex].gamesPlayed + (Math.random() > 0.5 ? 1 : 0)) / (updated[platformIndex].gamesPlayed + 1)
          };
          return updated;
        });
        
        setKnowledgeStats(prev => ({
          ...prev,
          totalKnowledge: prev.totalKnowledge + 2,
          onlineExperience: {
            ...prev.onlineExperience,
            gamesPlayed: prev.onlineExperience.gamesPlayed + 1,
            platforms: prev.onlineExperience.platforms.includes(platform) 
              ? prev.onlineExperience.platforms 
              : [...prev.onlineExperience.platforms, platform],
            averageOpponentRating: (prev.onlineExperience.averageOpponentRating * prev.onlineExperience.gamesPlayed + opponentRating) / (prev.onlineExperience.gamesPlayed + 1),
            uniqueLearnings: prev.onlineExperience.uniqueLearnings + Math.floor(Math.random() * 3),
          }
        }));
      }
    }
    
    setOnlineGaming(false);
  };

  const configurePlatform = (platform: string) => {
    setOnlinePlatforms(prev => 
      prev.map(p => 
        p.name === platform 
          ? { ...p, configured: true }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Enhanced AI Chess Training Platform
          </h1>
          <p className="text-slate-300 text-lg">
            Advanced Learning with Literature, Experience, and Online Play
          </p>
        </div>

        {/* Agent Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Agent Selection & Knowledge Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{knowledgeStats.totalKnowledge.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Knowledge Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{knowledgeStats.literature.booksStudied}</div>
                <div className="text-sm text-slate-400">Books Studied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{knowledgeStats.onlineExperience.gamesPlayed}</div>
                <div className="text-sm text-slate-400">Online Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{knowledgeStats.onlineExperience.platforms.length}</div>
                <div className="text-sm text-slate-400">Platforms</div>
              </div>
            </div>

            <div className="mb-4">
              <Label>Select Agent</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">Magnus AI - Literature Scholar</SelectItem>
                  <SelectItem value="agent2">Kasparov AI - Online Warrior</SelectItem>
                  <SelectItem value="agent3">Fischer AI - Master Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="literature" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="literature" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Literature
            </TabsTrigger>
            <TabsTrigger value="online" className="data-[state=active]:bg-blue-600">
              <Globe className="w-4 h-4 mr-2" />
              Online Play
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-green-600">
              <Target className="w-4 h-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-yellow-600">
              <Trophy className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Literature Learning Tab */}
          <TabsContent value="literature" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Book Library */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Chess Literature Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookLibrary.map((book, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-purple-300">{book.title}</h3>
                          <p className="text-sm text-slate-400">by {book.author}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => loadChessBook(book)}
                          disabled={literatureLoading}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {literatureLoading ? 'Loading...' : 'Study'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-blue-300">{book.games.length} Master Games</div>
                        <div className="text-green-300">{book.openings.length} Openings</div>
                        <div className="text-yellow-300">{book.tactics.length} Tactics</div>
                        <div className="text-red-300">{book.endgames.length} Endgames</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Knowledge Progress */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Literature Knowledge Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Master Games Analyzed</span>
                      <span>{knowledgeStats.literature.masterGamesAnalyzed}/1000</span>
                    </div>
                    <Progress 
                      value={(knowledgeStats.literature.masterGamesAnalyzed / 1000) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Opening Theory</span>
                      <span>{knowledgeStats.literature.openingTheoryKnown}/200</span>
                    </div>
                    <Progress 
                      value={(knowledgeStats.literature.openingTheoryKnown / 200) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Endgame Studies</span>
                      <span>{knowledgeStats.literature.endgameStudies}/300</span>
                    </div>
                    <Progress 
                      value={(knowledgeStats.literature.endgameStudies / 300) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-slate-700/50 rounded">
                    <h4 className="font-semibold mb-2">Recent Literature Insights</h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      <div>• Learned Nimzo-Indian Defense principles</div>
                      <div>• Mastered King & Pawn vs King endgame</div>
                      <div>• Improved tactical pattern recognition</div>
                      <div>• Studied Capablanca's positional style</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Online Play Tab */}
          <TabsContent value="online" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Configuration */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Online Chess Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {onlinePlatforms.map((platform, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.icon}</span>
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            <div className="flex gap-2">
                              <Badge variant={platform.configured ? "default" : "secondary"}>
                                {platform.configured ? "Configured" : "Not Configured"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {!platform.configured && (
                          <Button
                            size="sm"
                            onClick={() => configurePlatform(platform.name)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Configure
                          </Button>
                        )}
                      </div>
                      
                      {platform.configured && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Games Played:</span>
                              <span className="ml-2 font-semibold">{platform.gamesPlayed}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Win Rate:</span>
                              <span className="ml-2 font-semibold text-green-400">
                                {(platform.winRate * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => playOnlineGames(platform.name, 5)}
                              disabled={onlineGaming}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              {onlineGaming ? 'Playing...' : 'Play 5 Games'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => playOnlineGames(platform.name, 10)}
                              disabled={onlineGaming}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Tournament (10)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Online Experience Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Online Experience Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-slate-700/50 rounded">
                      <div className="text-xl font-bold text-blue-400">
                        {knowledgeStats.onlineExperience.gamesPlayed}
                      </div>
                      <div className="text-sm text-slate-400">Total Games</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded">
                      <div className="text-xl font-bold text-green-400">
                        {Math.round(knowledgeStats.onlineExperience.averageOpponentRating)}
                      </div>
                      <div className="text-sm text-slate-400">Avg Opponent Rating</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Platform Performance</h4>
                    {onlinePlatforms.filter(p => p.gamesPlayed > 0).map((platform, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          {platform.name}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">{(platform.winRate * 100).toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">{platform.gamesPlayed} games</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-slate-700/50 rounded">
                    <h4 className="font-semibold mb-2">Recent Online Learnings</h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      <div>• Adapted to blitz time pressure</div>
                      <div>• Learned from 2100+ rated opponents</div>
                      <div>• Improved opening repertoire</div>
                      <div>• Analyzed opponent playing styles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Training Programs Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Master Training Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border border-slate-600 rounded p-3">
                      <h4 className="font-semibold text-purple-300 mb-2">Phase 1: Literature Study</h4>
                      <p className="text-sm text-slate-400 mb-2">Study classic chess books and master games</p>
                      <Progress value={75} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs">
                        <span>4/5 Books Completed</span>
                        <span>325 Games Analyzed</span>
                      </div>
                    </div>

                    <div className="border border-slate-600 rounded p-3">
                      <h4 className="font-semibold text-blue-300 mb-2">Phase 2: Online Experience</h4>
                      <p className="text-sm text-slate-400 mb-2">Gain real-world playing experience</p>
                      <Progress value={45} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs">
                        <span>2/3 Platforms Active</span>
                        <span>{knowledgeStats.onlineExperience.gamesPlayed} Games Played</span>
                      </div>
                    </div>

                    <div className="border border-slate-600 rounded p-3">
                      <h4 className="font-semibold text-yellow-300 mb-2">Phase 3: Tournament Training</h4>
                      <p className="text-sm text-slate-400 mb-2">Compete against other AI agents</p>
                      <Progress value={20} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs">
                        <span>1/5 Tournaments</span>
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Start Comprehensive Training
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Training Focus Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-3 flex-col">
                      <BookOpen className="w-6 h-6 mb-2 text-purple-400" />
                      <span>Openings</span>
                      <span className="text-xs text-slate-400">Theory & Practice</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-3 flex-col">
                      <Target className="w-6 h-6 mb-2 text-red-400" />
                      <span>Tactics</span>
                      <span className="text-xs text-slate-400">Pattern Recognition</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-3 flex-col">
                      <Users className="w-6 h-6 mb-2 text-green-400" />
                      <span>Middlegame</span>
                      <span className="text-xs text-slate-400">Strategy & Plans</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-3 flex-col">
                      <Trophy className="w-6 h-6 mb-2 text-yellow-400" />
                      <span>Endgames</span>
                      <span className="text-xs text-slate-400">Technique & Theory</span>
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Custom Training Session</h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Time Control</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select time control" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blitz">Blitz (5+0)</SelectItem>
                            <SelectItem value="rapid">Rapid (15+10)</SelectItem>
                            <SelectItem value="classical">Classical (30+30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Number of Games</Label>
                        <Input type="number" defaultValue="10" className="bg-slate-700 border-slate-600" />
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Start Custom Training
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Knowledge & Rating Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trainingHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="knowledge" orientation="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="rating" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '6px'
                        }} 
                      />
                      <Line 
                        yAxisId="knowledge" 
                        type="monotone" 
                        dataKey="knowledge" 
                        stroke="#a855f7" 
                        strokeWidth={2}
                        name="Knowledge Points"
                      />
                      <Line 
                        yAxisId="rating" 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="ELO Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Knowledge Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { category: 'Openings', value: knowledgeStats.literature.openingTheoryKnown },
                      { category: 'Tactics', value: knowledgeStats.onlineExperience.uniqueLearnings },
                      { category: 'Endgames', value: knowledgeStats.literature.endgameStudies },
                      { category: 'Games', value: knowledgeStats.literature.masterGamesAnalyzed / 10 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '6px'
                        }} 
                      />
                      <Bar dataKey="value" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Comprehensive Performance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3 text-purple-400">Literature Mastery</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{knowledgeStats.literature.booksStudied}</div>
                      <div className="text-sm text-slate-400">Books Completed</div>
                      <div className="text-lg">{knowledgeStats.literature.masterGamesAnalyzed}</div>
                      <div className="text-sm text-slate-400">Master Games Analyzed</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3 text-blue-400">Online Experience</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{knowledgeStats.onlineExperience.gamesPlayed}</div>
                      <div className="text-sm text-slate-400">Games Played</div>
                      <div className="text-lg">{Math.round(knowledgeStats.onlineExperience.averageOpponentRating)}</div>
                      <div className="text-sm text-slate-400">Avg Opponent Rating</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3 text-green-400">Overall Progress</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{knowledgeStats.totalKnowledge.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">Knowledge Points</div>
                      <div className="text-lg">{trainingHistory[trainingHistory.length - 1].rating}</div>
                      <div className="text-sm text-slate-400">Current ELO Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
