import { Chess } from 'chess.js';
import { ChessAIAgent } from './ChessAIAgent';

export interface ChessBook {
  title: string;
  author: string;
  games: PGNGame[];
  openings: OpeningTheory[];
  endgames: EndgameStudy[];
  tactics: TacticalPattern[];
}

export interface PGNGame {
  pgn: string;
  white: string;
  black: string;
  result: string;
  elo?: { white: number; black: number };
  event: string;
  date: string;
  moves: string[];
  annotations?: string[];
}

export interface OpeningTheory {
  name: string;
  eco: string; // Encyclopedia of Chess Openings code
  moves: string[];
  explanation: string;
  keyIdeas: string[];
  commonContinuations: string[];
  masterGames: string[]; // PGN references
}

export interface EndgameStudy {
  name: string;
  position: string; // FEN
  technique: string;
  keyMoves: string[];
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export interface TacticalPattern {
  name: string;
  type: 'fork' | 'pin' | 'skewer' | 'discovered-attack' | 'double-attack' | 'deflection' | 'decoy' | 'clearance' | 'interference';
  position: string; // FEN
  solution: string[];
  explanation: string;
  rating: number; // Difficulty rating
}

export interface OnlineGameConfig {
  platform: 'lichess' | 'chess.com' | 'fics' | 'custom';
  apiKey?: string;
  username: string;
  timeControl: {
    initial: number; // seconds
    increment: number; // seconds per move
  };
  rating?: number;
  seekRating?: { min: number; max: number };
}

export class ChessLearningEngine {
  private knowledgeBase: Map<string, ChessBook> = new Map();
  private masterDatabase: PGNGame[] = [];
  private onlineConfigs: Map<string, OnlineGameConfig> = new Map();

  constructor() {
    this.initializeDefaultKnowledge();
  }

  /**
   * Load chess literature and books into the learning system
   */
  public async loadChessBook(book: ChessBook): Promise<void> {
    console.log(`📚 Loading chess book: "${book.title}" by ${book.author}`);
    
    this.knowledgeBase.set(book.title, book);
    this.masterDatabase.push(...book.games);
    
    console.log(`✅ Loaded ${book.games.length} games, ${book.openings.length} openings, ${book.tactics.length} tactics`);
  }

  /**
   * Load PGN database for training
   */
  public async loadPGNDatabase(pgnData: string, source: string = 'database'): Promise<number> {
    console.log(`📖 Loading PGN database from ${source}...`);
    
    const games = this.parsePGNDatabase(pgnData);
    this.masterDatabase.push(...games);
    
    console.log(`✅ Loaded ${games.length} games from ${source}`);
    return games.length;
  }

  /**
   * Train agent from chess literature and master games
   */
  public async trainFromLiterature(agent: ChessAIAgent, options: {
    focusAreas?: ('openings' | 'middlegame' | 'endgames' | 'tactics')[];
    maxGames?: number;
    minRating?: number;
    timeControl?: string;
  } = {}): Promise<void> {
    console.log(`🎓 Training ${agent.name} from chess literature...`);
    
    const {
      focusAreas = ['openings', 'middlegame', 'endgames', 'tactics'],
      maxGames = 1000,
      minRating = 2000
    } = options;

    // Filter games by rating if specified
    let trainingGames = this.masterDatabase.filter(game => {
      if (minRating && game.elo) {
        return Math.min(game.elo.white, game.elo.black) >= minRating;
      }
      return true;
    }).slice(0, maxGames);

    console.log(`📊 Training on ${trainingGames.length} master games`);

    for (const area of focusAreas) {
      switch (area) {
        case 'openings':
          await this.trainOpenings(agent, trainingGames);
          break;
        case 'middlegame':
          await this.trainMiddlegame(agent, trainingGames);
          break;
        case 'endgames':
          await this.trainEndgames(agent, trainingGames);
          break;
        case 'tactics':
          await this.trainTactics(agent, trainingGames);
          break;
      }
    }

    console.log(`✅ Literature training complete for ${agent.name}`);
  }

  /**
   * Train agent from opening theory
   */
  private async trainOpenings(agent: ChessAIAgent, games: PGNGame[]): Promise<void> {
    console.log('📖 Learning opening theory...');
    
    // Extract opening moves from master games
    const openingStats = new Map<string, { frequency: number; winRate: number; avgRating: number }>();
    
    for (const game of games) {
      const chess = new Chess();
      const moves = game.moves.slice(0, 15); // First 15 moves
      
      let winValue = 0.5; // Draw
      if (game.result === '1-0') winValue = 1; // White wins
      if (game.result === '0-1') winValue = 0; // Black wins
      
      const avgRating = game.elo ? (game.elo.white + game.elo.black) / 2 : 2000;
      
      for (let i = 0; i < moves.length; i++) {
        const move = chess.move(moves[i]);
        if (!move) break;
        
        const position = chess.fen();
        const existing = openingStats.get(position) || { frequency: 0, winRate: 0, avgRating: 0 };
        
        existing.frequency++;
        existing.winRate = (existing.winRate * (existing.frequency - 1) + winValue) / existing.frequency;
        existing.avgRating = (existing.avgRating * (existing.frequency - 1) + avgRating) / existing.frequency;
        
        openingStats.set(position, existing);
      }
    }

    // Update agent's opening book with master game statistics
    for (const [position, stats] of openingStats) {
      if (stats.frequency >= 5) { // Only include positions played at least 5 times
        const chess = new Chess(position);
        const legalMoves = chess.moves();
        
        if (legalMoves.length > 0) {
          // Find the most common continuation
          const bestMove = this.findBestMoveFromDatabase(position, games);
          if (bestMove) {
            agent.knowledge.openingBook.set(position, {
              move: bestMove,
              frequency: stats.frequency,
              winRate: stats.winRate
            });
          }
        }
      }
    }

    console.log(`📚 Learned ${openingStats.size} opening positions`);
  }

  /**
   * Train tactical patterns
   */
  private async trainTactics(agent: ChessAIAgent, games: PGNGame[]): Promise<void> {
    console.log('⚔️ Learning tactical patterns...');
    
    const tacticalPositions: TacticalPattern[] = [];
    
    // Extract tactical positions from games
    for (const game of games) {
      const tactics = this.extractTacticalPositions(game);
      tacticalPositions.push(...tactics);
    }

    // Add tactical patterns from books
    for (const book of this.knowledgeBase.values()) {
      tacticalPositions.push(...book.tactics);
    }

    // Train agent on tactical patterns
    for (const pattern of tacticalPositions) {
      agent.knowledge.tacticPatterns.set(pattern.position, {
        pattern: pattern.name,
        solution: pattern.solution.join(' '),
        frequency: 1
      });
    }

    console.log(`🎯 Learned ${tacticalPositions.length} tactical patterns`);
  }

  /**
   * Train middlegame strategy
   */
  private async trainMiddlegame(agent: ChessAIAgent, games: PGNGame[]): Promise<void> {
    console.log('🏰 Learning middlegame strategy...');
    
    // Analyze middlegame positions (moves 16-40)
    for (const game of games) {
      const chess = new Chess();
      const moves = game.moves.slice(15, 40); // Middlegame moves
      
      // Skip to middlegame
      for (let i = 0; i < 15 && i < game.moves.length; i++) {
        chess.move(game.moves[i]);
      }
      
      // Analyze middlegame positions
      for (const move of moves) {
        const position = chess.fen();
        const evaluation = this.evaluatePosition(chess);
        
        // Store position evaluation
        agent.knowledge.positionEvaluations.set(position, evaluation);
        
        chess.move(move);
      }
    }

    console.log('🎭 Middlegame strategy training complete');
  }

  /**
   * Train endgame technique
   */
  private async trainEndgames(agent: ChessAIAgent, games: PGNGame[]): Promise<void> {
    console.log('👑 Learning endgame technique...');
    
    // Load endgame studies from books
    const endgameStudies: EndgameStudy[] = [];
    for (const book of this.knowledgeBase.values()) {
      endgameStudies.push(...book.endgames);
    }

    // Train on endgame studies
    for (const study of endgameStudies) {
      const chess = new Chess(study.position);
      
      // Find best moves in endgame positions
      for (const move of study.keyMoves) {
        const beforePosition = chess.fen();
        chess.move(move);
        const afterPosition = chess.fen();
        
        agent.knowledge.endgameTablebase.set(beforePosition, {
          bestMove: move,
          evaluation: this.evaluateEndgame(chess)
        });
      }
    }

    console.log(`♔ Learned ${endgameStudies.length} endgame studies`);
  }

  /**
   * Configure online gameplay
   */
  public configureOnlinePlay(agentId: string, config: OnlineGameConfig): void {
    console.log(`🌐 Configuring online play for agent ${agentId} on ${config.platform}`);
    this.onlineConfigs.set(agentId, config);
  }

  /**
   * Enable agent to play online games
   */
  public async playOnlineGame(agent: ChessAIAgent, options: {
    platform?: 'lichess' | 'chess.com' | 'fics';
    timeControl?: { initial: number; increment: number };
    rated?: boolean;
  } = {}): Promise<string> {
    const config = this.onlineConfigs.get(agent.id);
    if (!config) {
      throw new Error(`No online configuration found for agent ${agent.id}`);
    }

    const { platform = 'lichess', timeControl = { initial: 600, increment: 5 }, rated = true } = options;
    
    console.log(`🎮 ${agent.name} seeking online game on ${platform}...`);
    
    // This would integrate with actual chess platforms
    switch (platform) {
      case 'lichess':
        return await this.playLichessGame(agent, config, timeControl, rated);
      case 'chess.com':
        return await this.playChessComGame(agent, config, timeControl, rated);
      case 'fics':
        return await this.playFICSGame(agent, config, timeControl, rated);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Lichess.org integration
   */
  private async playLichessGame(
    agent: ChessAIAgent, 
    config: OnlineGameConfig, 
    timeControl: { initial: number; increment: number },
    rated: boolean
  ): Promise<string> {
    console.log(`♞ Connecting to Lichess.org...`);
    
    // Mock implementation - in real world, this would use Lichess API
    const gameId = `lichess_${Date.now()}`;
    
    // Simulate online game
    const result = await this.simulateOnlineGame(agent, {
      platform: 'lichess',
      opponent: 'Human Player',
      timeControl,
      rated
    });

    console.log(`🏁 Lichess game ${gameId} completed: ${result.result}`);
    
    // Update agent's rating based on online performance
    if (rated) {
      this.updateOnlineRating(agent, result);
    }

    return gameId;
  }

  /**
   * Chess.com integration
   */
  private async playChessComGame(
    agent: ChessAIAgent, 
    config: OnlineGameConfig, 
    timeControl: { initial: number; increment: number },
    rated: boolean
  ): Promise<string> {
    console.log(`♛ Connecting to Chess.com...`);
    
    // Mock implementation - in real world, this would use Chess.com API
    const gameId = `chesscom_${Date.now()}`;
    
    const result = await this.simulateOnlineGame(agent, {
      platform: 'chess.com',
      opponent: 'Human Player',
      timeControl,
      rated
    });

    console.log(`🏁 Chess.com game ${gameId} completed: ${result.result}`);
    
    if (rated) {
      this.updateOnlineRating(agent, result);
    }

    return gameId;
  }

  /**
   * FICS (Free Internet Chess Server) integration
   */
  private async playFICSGame(
    agent: ChessAIAgent, 
    config: OnlineGameConfig, 
    timeControl: { initial: number; increment: number },
    rated: boolean
  ): Promise<string> {
    console.log(`⚡ Connecting to FICS...`);
    
    // Mock implementation - in real world, this would use FICS telnet protocol
    const gameId = `fics_${Date.now()}`;
    
    const result = await this.simulateOnlineGame(agent, {
      platform: 'fics',
      opponent: 'Human Player',
      timeControl,
      rated
    });

    console.log(`🏁 FICS game ${gameId} completed: ${result.result}`);
    
    if (rated) {
      this.updateOnlineRating(agent, result);
    }

    return gameId;
  }

  /**
   * Simulate online game for demonstration
   */
  private async simulateOnlineGame(agent: ChessAIAgent, gameInfo: {
    platform: string;
    opponent: string;
    timeControl: { initial: number; increment: number };
    rated: boolean;
  }): Promise<{ result: 'win' | 'loss' | 'draw'; moves: string[]; duration: number }> {
    const startTime = Date.now();
    const chess = new Chess();
    const moves: string[] = [];
    
    // Simulate game against human opponent
    while (!chess.isGameOver() && moves.length < 100) {
      if (chess.turn() === 'w') {
        // Agent's turn
        const moveResult = await agent.makeMove(chess);
        chess.move(moveResult.move);
        moves.push(moveResult.move);
      } else {
        // Simulate human opponent move
        const legalMoves = chess.moves();
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        chess.move(randomMove);
        moves.push(randomMove);
      }
      
      // Add small delay to simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const duration = Date.now() - startTime;
    let result: 'win' | 'loss' | 'draw' = 'draw';
    
    if (chess.isCheckmate()) {
      result = chess.turn() === 'b' ? 'win' : 'loss';
    }

    return { result, moves, duration };
  }

  /**
   * Update agent's online rating based on game results
   */
  private updateOnlineRating(agent: ChessAIAgent, gameResult: { result: 'win' | 'loss' | 'draw' }): void {
    const ratingChange = gameResult.result === 'win' ? 25 : gameResult.result === 'loss' ? -25 : 0;
    agent.stats.eloRating += ratingChange;
    
    console.log(`📈 ${agent.name} rating updated: ${agent.stats.eloRating} (${ratingChange >= 0 ? '+' : ''}${ratingChange})`);
  }

  // Helper methods
  private parsePGNDatabase(pgnData: string): PGNGame[] {
    // Parse PGN format and extract games
    const games: PGNGame[] = [];
    const gameBlocks = pgnData.split(/\n\s*\n/);
    
    for (const block of gameBlocks) {
      if (block.trim().length === 0) continue;
      
      const game = this.parseSinglePGN(block);
      if (game) {
        games.push(game);
      }
    }
    
    return games;
  }

  private parseSinglePGN(pgn: string): PGNGame | null {
    // Simple PGN parser - would be more sophisticated in production
    const lines = pgn.split('\n');
    const headers: { [key: string]: string } = {};
    let movesText = '';
    
    for (const line of lines) {
      if (line.startsWith('[') && line.endsWith(']')) {
        const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      } else if (line.trim() && !line.startsWith('[')) {
        movesText += line + ' ';
      }
    }
    
    const moves = this.extractMovesFromPGN(movesText);
    
    return {
      pgn,
      white: headers.White || 'Unknown',
      black: headers.Black || 'Unknown',
      result: headers.Result || '*',
      elo: headers.WhiteElo && headers.BlackElo ? {
        white: parseInt(headers.WhiteElo),
        black: parseInt(headers.BlackElo)
      } : undefined,
      event: headers.Event || 'Unknown',
      date: headers.Date || 'Unknown',
      moves,
    };
  }

  private extractMovesFromPGN(movesText: string): string[] {
    // Extract actual moves from PGN notation
    const moves: string[] = [];
    const tokens = movesText.split(/\s+/);
    
    for (const token of tokens) {
      if (token.match(/^\d+\./)) continue; // Skip move numbers
      if (token.match(/^[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](\+|#)?$/) || 
          token.match(/^O-O(-O)?(\+|#)?$/)) {
        moves.push(token.replace(/[+#]$/, '')); // Remove check/mate symbols
      }
    }
    
    return moves;
  }

  private findBestMoveFromDatabase(position: string, games: PGNGame[]): string | null {
    const moveStats = new Map<string, { count: number; winRate: number }>();
    
    for (const game of games) {
      const chess = new Chess();
      
      for (const move of game.moves) {
        if (chess.fen() === position) {
          const existing = moveStats.get(move) || { count: 0, winRate: 0 };
          existing.count++;
          
          let winValue = 0.5;
          if (game.result === '1-0') winValue = chess.turn() === 'w' ? 1 : 0;
          if (game.result === '0-1') winValue = chess.turn() === 'b' ? 1 : 0;
          
          existing.winRate = (existing.winRate * (existing.count - 1) + winValue) / existing.count;
          moveStats.set(move, existing);
          break;
        }
        
        chess.move(move);
      }
    }
    
    // Return most played move with highest win rate
    let bestMove = null;
    let bestScore = 0;
    
    for (const [move, stats] of moveStats) {
      const score = stats.count * stats.winRate;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return bestMove;
  }

  private extractTacticalPositions(game: PGNGame): TacticalPattern[] {
    // Extract tactical positions from games
    // This would use more sophisticated analysis in production
    return [];
  }

  private evaluatePosition(chess: Chess): number {
    // Basic position evaluation
    let score = 0;
    const board = chess.board();
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece) {
          const pieceValue = this.getPieceValue(piece.type);
          score += piece.color === 'w' ? pieceValue : -pieceValue;
        }
      }
    }
    
    return score;
  }

  private evaluateEndgame(chess: Chess): number {
    // Endgame-specific evaluation
    return this.evaluatePosition(chess);
  }

  private getPieceValue(piece: string): number {
    const values: { [key: string]: number } = {
      'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
    };
    return values[piece] || 0;
  }

  private initializeDefaultKnowledge(): void {
    // Initialize with basic chess knowledge
    console.log('📚 Initializing default chess knowledge...');
    
    // Add basic opening principles
    const basicOpenings: OpeningTheory[] = [
      {
        name: 'Italian Game',
        eco: 'C50',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
        explanation: 'Control the center and develop pieces quickly',
        keyIdeas: ['Control center', 'Quick development', 'King safety'],
        commonContinuations: ['Be7', 'f5', 'Nf6'],
        masterGames: []
      },
      {
        name: 'Queen\'s Gambit',
        eco: 'D06',
        moves: ['d4', 'd5', 'c4'],
        explanation: 'Offer a pawn to control the center',
        keyIdeas: ['Central control', 'Pawn structure', 'Piece activity'],
        commonContinuations: ['dxc4', 'e6', 'c6'],
        masterGames: []
      }
    ];

    // Create default book
    const defaultBook: ChessBook = {
      title: 'Default Chess Knowledge',
      author: 'AI Training System',
      games: [],
      openings: basicOpenings,
      endgames: [],
      tactics: []
    };

    this.knowledgeBase.set('default', defaultBook);
  }

  /**
   * Get learning statistics
   */
  public getLearningStats(): {
    booksLoaded: number;
    gamesInDatabase: number;
    openingPositions: number;
    tacticalPatterns: number;
    endgameStudies: number;
  } {
    let openingPositions = 0;
    let tacticalPatterns = 0;
    let endgameStudies = 0;

    for (const book of this.knowledgeBase.values()) {
      openingPositions += book.openings.length;
      tacticalPatterns += book.tactics.length;
      endgameStudies += book.endgames.length;
    }

    return {
      booksLoaded: this.knowledgeBase.size,
      gamesInDatabase: this.masterDatabase.length,
      openingPositions,
      tacticalPatterns,
      endgameStudies
    };
  }
}
