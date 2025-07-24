import { ChessAIAgent } from './ChessAIAgent';
import { GameType, GameState } from './MultiGameAI';

/**
 * Real-Time Online Gaming Integration
 * Connects AI agents to live chess platforms and tournaments
 */

export interface OnlinePlatform {
  id: string;
  name: string;
  url: string;
  apiEndpoint?: string;
  requiresAuth: boolean;
  supportedGameTypes: GameType[];
  features: PlatformFeature[];
}

export interface PlatformFeature {
  name: string;
  description: string;
  enabled: boolean;
}

export interface OnlineGame {
  gameId: string;
  platform: string;
  gameType: GameType;
  timeControl: TimeControl;
  players: OnlinePlayer[];
  currentState: GameState;
  moveHistory: OnlineMove[];
  status: 'waiting' | 'active' | 'completed' | 'aborted';
  result?: GameResult;
  startTime: number;
  endTime?: number;
}

export interface OnlinePlayer {
  id: string;
  username: string;
  rating: number;
  isAI: boolean;
  aiAgent?: ChessAIAgent;
  country?: string;
  title?: string;
  status: 'online' | 'offline' | 'playing';
}

export interface OnlineMove {
  moveNumber: number;
  player: string;
  move: string;
  timeUsed: number;
  timeRemaining: number;
  evaluation?: number;
  annotation?: string;
  timestamp: number;
}

export interface TimeControl {
  type: 'blitz' | 'rapid' | 'classical' | 'bullet' | 'correspondence';
  initialTime: number; // seconds
  increment: number; // seconds per move
  description: string;
}

export interface GameResult {
  winner: string | null;
  result: '1-0' | '0-1' | '1/2-1/2';
  termination: 'checkmate' | 'resignation' | 'time' | 'draw' | 'abort';
  finalPosition: string;
}

export interface TournamentInfo {
  id: string;
  name: string;
  platform: string;
  format: 'swiss' | 'round-robin' | 'knockout' | 'arena';
  timeControl: TimeControl;
  participants: OnlinePlayer[];
  rounds: TournamentRound[];
  status: 'upcoming' | 'active' | 'completed';
  startTime: number;
  endTime?: number;
  prizes?: string[];
}

export interface TournamentRound {
  roundNumber: number;
  pairings: TournamentPairing[];
  startTime: number;
  completed: boolean;
}

export interface TournamentPairing {
  gameId: string;
  white: OnlinePlayer;
  black: OnlinePlayer;
  result?: GameResult;
}

export class OnlineGamingEngine {
  private platforms: Map<string, OnlinePlatform> = new Map();
  private activeGames: Map<string, OnlineGame> = new Map();
  private gameHistory: OnlineGame[] = [];
  private tournaments: Map<string, TournamentInfo> = new Map();
  private connectionStatus: Map<string, boolean> = new Map();

  constructor() {
    this.initializePlatforms();
  }

  private initializePlatforms(): void {
    // Chess.com integration
    this.platforms.set('chess.com', {
      id: 'chess.com',
      name: 'Chess.com',
      url: 'https://chess.com',
      apiEndpoint: 'https://api.chess.com/pub',
      requiresAuth: false,
      supportedGameTypes: ['chess'],
      features: [
        { name: 'Live Games', description: 'Play live games', enabled: true },
        { name: 'Tournaments', description: 'Join tournaments', enabled: true },
        { name: 'Analysis', description: 'Game analysis', enabled: true },
        { name: 'Puzzles', description: 'Tactical puzzles', enabled: true }
      ]
    });

    // Lichess integration
    this.platforms.set('lichess', {
      id: 'lichess',
      name: 'Lichess',
      url: 'https://lichess.org',
      apiEndpoint: 'https://lichess.org/api',
      requiresAuth: true,
      supportedGameTypes: ['chess'],
      features: [
        { name: 'Live Games', description: 'Play live games', enabled: true },
        { name: 'Tournaments', description: 'Join tournaments', enabled: true },
        { name: 'Studies', description: 'Create studies', enabled: true },
        { name: 'Analysis Board', description: 'Analysis tools', enabled: true },
        { name: 'Broadcasts', description: 'Follow broadcasts', enabled: true }
      ]
    });

    // Chess24 integration
    this.platforms.set('chess24', {
      id: 'chess24',
      name: 'Chess24',
      url: 'https://chess24.com',
      requiresAuth: true,
      supportedGameTypes: ['chess'],
      features: [
        { name: 'Live Games', description: 'Play live games', enabled: true },
        { name: 'Training', description: 'Training courses', enabled: true },
        { name: 'Tournaments', description: 'Premium tournaments', enabled: true }
      ]
    });

    // Internet Chess Club (ICC)
    this.platforms.set('icc', {
      id: 'icc',
      name: 'Internet Chess Club',
      url: 'https://chessclub.com',
      requiresAuth: true,
      supportedGameTypes: ['chess'],
      features: [
        { name: 'Live Games', description: 'Professional play', enabled: true },
        { name: 'Lectures', description: 'GM lectures', enabled: true },
        { name: 'Tournaments', description: 'High-level tournaments', enabled: true }
      ]
    });
  }

  public async connectToPlatform(platformId: string, credentials?: any): Promise<boolean> {
    const platform = this.platforms.get(platformId);
    if (!platform) {
      throw new Error(`Platform ${platformId} not found`);
    }

    try {
      // Simulate connection process
      console.log(`Connecting to ${platform.name}...`);
      
      if (platform.requiresAuth && !credentials) {
        throw new Error(`Authentication required for ${platform.name}`);
      }

      // In a real implementation, this would establish WebSocket connections
      // or HTTP API connections to the platform
      await this.simulateConnection(platform, credentials);
      
      this.connectionStatus.set(platformId, true);
      console.log(`Successfully connected to ${platform.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${platform.name}:`, error);
      this.connectionStatus.set(platformId, false);
      return false;
    }
  }

  private async simulateConnection(platform: OnlinePlatform, credentials?: any): Promise<void> {
    // Simulate authentication and connection setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (platform.requiresAuth) {
      // Validate credentials
      if (!credentials?.token && !credentials?.username) {
        throw new Error('Invalid credentials');
      }
    }

    // Set up event listeners for real-time updates
    this.setupPlatformEventListeners(platform.id);
  }

  private setupPlatformEventListeners(platformId: string): void {
    // In a real implementation, set up WebSocket listeners for:
    // - Game invitations
    // - Move updates
    // - Tournament notifications
    // - Player status changes
    console.log(`Event listeners set up for ${platformId}`);
  }

  public async seekGame(
    platformId: string,
    aiAgent: ChessAIAgent,
    preferences: GamePreferences
  ): Promise<string> {
    if (!this.connectionStatus.get(platformId)) {
      throw new Error(`Not connected to platform ${platformId}`);
    }

    const platform = this.platforms.get(platformId)!;
    const gameId = `${platformId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create game seeking request
    const seekRequest = {
      timeControl: preferences.timeControl,
      rated: preferences.rated,
      color: preferences.preferredColor || 'random',
      ratingRange: preferences.ratingRange
    };

    console.log(`Seeking game on ${platform.name} with preferences:`, seekRequest);

    // Simulate finding opponent
    const opponent = await this.findOpponent(platformId, preferences);
    
    // Create online game
    const onlineGame: OnlineGame = {
      gameId,
      platform: platformId,
      gameType: 'chess',
      timeControl: preferences.timeControl,
      players: [
        {
          id: aiAgent.id,
          username: aiAgent.name,
          rating: aiAgent.statistics.currentRating,
          isAI: true,
          aiAgent,
          status: 'online'
        },
        opponent
      ],
      currentState: {
        gameType: 'chess',
        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        legalMoves: ['e4', 'e3', 'd4', 'd3', 'Nf3', 'Nc3', 'f4', 'g3', 'h3', 'a3', 'b3', 'c3', 'h4', 'g4', 'f3', 'Nh3', 'Na3'],
        isTerminal: false
      },
      moveHistory: [],
      status: 'active',
      startTime: Date.now()
    };

    this.activeGames.set(gameId, onlineGame);

    // Start game monitoring
    this.monitorGame(gameId, aiAgent);

    return gameId;
  }

  private async findOpponent(platformId: string, preferences: GamePreferences): Promise<OnlinePlayer> {
    // Simulate finding an opponent
    await new Promise(resolve => setTimeout(resolve, 2000));

    const opponents = [
      { username: 'ChessMaster2024', rating: 1800, country: 'US', title: 'FM' },
      { username: 'TacticalNinja', rating: 1650, country: 'DE' },
      { username: 'EndgameExpert', rating: 1900, country: 'RU', title: 'IM' },
      { username: 'OpeningTheory', rating: 1750, country: 'FR' },
      { username: 'BlitzKing', rating: 2000, country: 'IN', title: 'GM' }
    ];

    const selectedOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    return {
      id: `${platformId}_${selectedOpponent.username}`,
      username: selectedOpponent.username,
      rating: selectedOpponent.rating,
      isAI: false,
      country: selectedOpponent.country,
      title: selectedOpponent.title,
      status: 'playing'
    };
  }

  private async monitorGame(gameId: string, aiAgent: ChessAIAgent): Promise<void> {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    console.log(`Monitoring game ${gameId} on ${game.platform}`);

    // Simulate game progression
    this.simulateGameProgression(gameId, aiAgent);
  }

  private async simulateGameProgression(gameId: string, aiAgent: ChessAIAgent): Promise<void> {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    const chess = require('chess.js');
    const chessGame = new chess.Chess();
    let moveNumber = 1;

    while (!chessGame.isGameOver() && game.status === 'active') {
      // Determine whose turn it is
      const isAITurn = (chessGame.turn() === 'w' && game.players[0].isAI) ||
                       (chessGame.turn() === 'b' && game.players[1].isAI);

      if (isAITurn) {
        // AI makes a move
        const currentGameState: GameState = {
          gameType: 'chess',
          position: chessGame.fen(),
          legalMoves: chessGame.moves(),
          isTerminal: chessGame.isGameOver()
        };

        const move = await aiAgent.chooseMove(currentGameState);
        const startTime = Date.now();
        
        try {
          chessGame.move(move.move);
          const timeUsed = Date.now() - startTime;

          const onlineMove: OnlineMove = {
            moveNumber: Math.floor(moveNumber / 2) + 1,
            player: aiAgent.name,
            move: move.move,
            timeUsed,
            timeRemaining: game.timeControl.initialTime - timeUsed,
            evaluation: move.evaluation,
            timestamp: Date.now()
          };

          game.moveHistory.push(onlineMove);
          game.currentState.position = chessGame.fen();
          game.currentState.legalMoves = chessGame.moves();
          game.currentState.isTerminal = chessGame.isGameOver();

          console.log(`AI played: ${move.move} (${move.evaluation?.toFixed(2)})`);
        } catch (error) {
          console.error(`Invalid move attempted: ${move.move}`);
          // In a real implementation, handle invalid moves appropriately
        }
      } else {
        // Opponent makes a move (simulated)
        await this.simulateOpponentMove(gameId, chessGame);
      }

      moveNumber++;
      
      // Add delay between moves
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Game ended
    await this.finalizeGame(gameId, chessGame);
  }

  private async simulateOpponentMove(gameId: string, chessGame: any): Promise<void> {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    // Simulate opponent thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 3000));

    const legalMoves = chessGame.moves();
    if (legalMoves.length === 0) return;

    // Select a move (weighted towards reasonable moves)
    let selectedMove;
    if (Math.random() < 0.7) {
      // 70% chance of a reasonable move
      const goodMoves = legalMoves.filter((move: string) => 
        !move.includes('h3') && !move.includes('a3') && !move.includes('h6') && !move.includes('a6')
      );
      selectedMove = goodMoves[Math.floor(Math.random() * goodMoves.length)] || legalMoves[0];
    } else {
      // 30% chance of any legal move
      selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    try {
      chessGame.move(selectedMove);
      
      const opponent = game.players.find(p => !p.isAI)!;
      const onlineMove: OnlineMove = {
        moveNumber: Math.floor(game.moveHistory.length / 2) + 1,
        player: opponent.username,
        move: selectedMove,
        timeUsed: 1000 + Math.random() * 3000,
        timeRemaining: game.timeControl.initialTime,
        timestamp: Date.now()
      };

      game.moveHistory.push(onlineMove);
      game.currentState.position = chessGame.fen();
      game.currentState.legalMoves = chessGame.moves();
      game.currentState.isTerminal = chessGame.isGameOver();

      console.log(`Opponent played: ${selectedMove}`);
    } catch (error) {
      console.error(`Error in opponent move: ${selectedMove}`);
    }
  }

  private async finalizeGame(gameId: string, chessGame: any): Promise<void> {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    game.status = 'completed';
    game.endTime = Date.now();

    // Determine result
    let result: GameResult;
    if (chessGame.isCheckmate()) {
      const winner = chessGame.turn() === 'w' ? game.players[1] : game.players[0];
      result = {
        winner: winner.username,
        result: chessGame.turn() === 'w' ? '0-1' : '1-0',
        termination: 'checkmate',
        finalPosition: chessGame.fen()
      };
    } else if (chessGame.isDraw()) {
      result = {
        winner: null,
        result: '1/2-1/2',
        termination: 'draw',
        finalPosition: chessGame.fen()
      };
    } else {
      result = {
        winner: null,
        result: '1/2-1/2',
        termination: 'abort',
        finalPosition: chessGame.fen()
      };
    }

    game.result = result;

    // Update AI agent with game result
    const aiPlayer = game.players.find(p => p.isAI);
    if (aiPlayer?.aiAgent) {
      const gameResult = result.winner === aiPlayer.username ? 'win' : 
                        result.winner === null ? 'draw' : 'loss';
      
      // Convert to game states for learning
      const gameStates: GameState[] = [];
      // This would normally reconstruct all game states from move history
      
      await aiPlayer.aiAgent.learnFromGame(gameStates, gameResult);
    }

    // Move to history
    this.gameHistory.push(game);
    this.activeGames.delete(gameId);

    console.log(`Game ${gameId} completed: ${result.result} by ${result.termination}`);
  }

  public async joinTournament(
    platformId: string,
    tournamentId: string,
    aiAgent: ChessAIAgent
  ): Promise<boolean> {
    if (!this.connectionStatus.get(platformId)) {
      throw new Error(`Not connected to platform ${platformId}`);
    }

    const tournament = await this.fetchTournamentInfo(platformId, tournamentId);
    
    // Register AI agent
    const aiPlayer: OnlinePlayer = {
      id: aiAgent.id,
      username: aiAgent.name,
      rating: aiAgent.statistics.currentRating,
      isAI: true,
      aiAgent,
      status: 'online'
    };

    tournament.participants.push(aiPlayer);
    console.log(`${aiAgent.name} joined tournament: ${tournament.name}`);

    return true;
  }

  private async fetchTournamentInfo(platformId: string, tournamentId: string): Promise<TournamentInfo> {
    // Simulate fetching tournament info
    const tournament: TournamentInfo = {
      id: tournamentId,
      name: 'Weekly Blitz Arena',
      platform: platformId,
      format: 'arena',
      timeControl: { type: 'blitz', initialTime: 300, increment: 3, description: '5+3' },
      participants: [],
      rounds: [],
      status: 'upcoming',
      startTime: Date.now() + 300000, // Starts in 5 minutes
      prizes: ['Trophy', 'Rating points', 'Achievement badge']
    };

    this.tournaments.set(tournamentId, tournament);
    return tournament;
  }

  public getActiveGames(): OnlineGame[] {
    return Array.from(this.activeGames.values());
  }

  public getGameHistory(): OnlineGame[] {
    return [...this.gameHistory];
  }

  public getPlatforms(): OnlinePlatform[] {
    return Array.from(this.platforms.values());
  }

  public getConnectionStatus(): Map<string, boolean> {
    return new Map(this.connectionStatus);
  }

  public async disconnectFromPlatform(platformId: string): Promise<void> {
    const platform = this.platforms.get(platformId);
    if (platform) {
      // Close connections and cleanup
      this.connectionStatus.set(platformId, false);
      console.log(`Disconnected from ${platform.name}`);
    }
  }

  public getOnlineStatistics(): OnlineStatistics {
    const totalGames = this.gameHistory.length;
    const wins = this.gameHistory.filter(g => 
      g.result?.winner && g.players.some(p => p.isAI && p.username === g.result?.winner)
    ).length;
    const draws = this.gameHistory.filter(g => g.result?.result === '1/2-1/2').length;
    const losses = totalGames - wins - draws;

    const averageGameLength = this.gameHistory.reduce((sum, game) => 
      sum + game.moveHistory.length, 0) / Math.max(totalGames, 1);

    const platformStats = new Map<string, PlatformStats>();
    for (const game of this.gameHistory) {
      const existing = platformStats.get(game.platform) || { games: 0, wins: 0, draws: 0, losses: 0 };
      existing.games++;
      if (game.result?.winner && game.players.some(p => p.isAI && p.username === game.result?.winner)) {
        existing.wins++;
      } else if (game.result?.result === '1/2-1/2') {
        existing.draws++;
      } else {
        existing.losses++;
      }
      platformStats.set(game.platform, existing);
    }

    return {
      totalGames,
      wins,
      draws,
      losses,
      winRate: totalGames > 0 ? wins / totalGames : 0,
      averageGameLength,
      platformStats: Object.fromEntries(platformStats),
      activePlatforms: Array.from(this.connectionStatus.entries())
        .filter(([_, connected]) => connected)
        .map(([platform, _]) => platform)
    };
  }
}

// Supporting interfaces
interface GamePreferences {
  timeControl: TimeControl;
  rated: boolean;
  preferredColor?: 'white' | 'black' | 'random';
  ratingRange?: { min: number; max: number };
}

interface OnlineStatistics {
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  averageGameLength: number;
  platformStats: { [platform: string]: PlatformStats };
  activePlatforms: string[];
}

interface PlatformStats {
  games: number;
  wins: number;
  draws: number;
  losses: number;
}

export {
  OnlineGamingEngine
};

export type {
  OnlinePlatform,
  OnlineGame,
  OnlinePlayer,
  OnlineMove,
  TimeControl,
  GameResult,
  TournamentInfo,
  GamePreferences,
  OnlineStatistics,
  PlatformStats
};
