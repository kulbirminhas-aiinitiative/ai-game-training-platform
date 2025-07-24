import { Chess } from 'chess.js';

export interface LearningParameters {
  learningRate: number;
  explorationRate: number;
  discountFactor: number;
  memorySize: number;
  batchSize: number;
  updateFrequency: number;
  temperature: number;
}

export interface GameState {
  fen: string;
  evaluation: number;
  depth: number;
  bestMove: string | null;
  timeUsed: number;
}

export interface AgentMemory {
  position: string; // FEN notation
  move: string;
  reward: number;
  nextPosition: string;
  gameOutcome: 'win' | 'loss' | 'draw';
  evaluation: number;
}

export interface AgentKnowledge {
  openingBook: Map<string, { move: string; frequency: number; winRate: number }>;
  positionEvaluations: Map<string, number>;
  tacticPatterns: Map<string, { pattern: string; solution: string; frequency: number }>;
  endgameTablebase: Map<string, { bestMove: string; evaluation: number }>;
  literature: {
    booksStudied: string[];
    masterGamesAnalyzed: number;
    openingTheory: Map<string, { eco: string; keyIdeas: string[]; masterFrequency: number }>;
    endgameStudies: Map<string, { technique: string; difficulty: string; mastery: number }>;
  };
  onlineExperience: {
    gamesPlayed: number;
    platforms: string[];
    winRate: { [platform: string]: number };
    averageOpponentRating: number;
    learningsFromGames: string[];
  };
}

export interface AgentStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  averageDepth: number;
  averageThinkingTime: number;
  positionsAnalyzed: number;
  learningProgress: number[];
  eloRating: number;
  lastUpdated: Date;
}

export class ChessAIAgent {
  public id: string;
  public name: string;
  public learningParams: LearningParameters;
  public memory: AgentMemory[] = [];
  public knowledge: AgentKnowledge;
  public stats: AgentStats;
  private neuralWeights: number[][];

  constructor(
    id: string,
    name: string,
    learningParams: LearningParameters,
    initialElo: number = 1500
  ) {
    this.id = id;
    this.name = name;
    this.learningParams = learningParams;
    
    // Initialize knowledge base
    this.knowledge = {
      openingBook: new Map(),
      positionEvaluations: new Map(),
      tacticPatterns: new Map(),
      endgameTablebase: new Map(),
      literature: {
        booksStudied: [],
        masterGamesAnalyzed: 0,
        openingTheory: new Map(),
        endgameStudies: new Map(),
      },
      onlineExperience: {
        gamesPlayed: 0,
        platforms: [],
        winRate: {},
        averageOpponentRating: 1500,
        learningsFromGames: [],
      },
    };

    // Initialize stats
    this.stats = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      averageDepth: 4,
      averageThinkingTime: 1000,
      positionsAnalyzed: 0,
      learningProgress: [],
      eloRating: initialElo,
      lastUpdated: new Date(),
    };

    // Initialize simple neural network weights (position evaluation)
    this.neuralWeights = this.initializeWeights();
    
    // Load basic opening principles
    this.initializeOpeningBook();
  }

  private initializeWeights(): number[][] {
    const layers = [64, 128, 64, 1]; // Input: 64 squares, Hidden layers, Output: evaluation
    const weights: number[][] = [];
    
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights: number[] = [];
      for (let j = 0; j < layers[i] * layers[i + 1]; j++) {
        layerWeights.push((Math.random() - 0.5) * 2); // Random weights between -1 and 1
      }
      weights.push(layerWeights);
    }
    
    return weights;
  }

  private initializeOpeningBook(): void {
    // Initialize with basic opening principles
    const openingMoves = [
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'e4', frequency: 100, winRate: 0.52 },
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'd4', frequency: 80, winRate: 0.54 },
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', move: 'Nf3', frequency: 60, winRate: 0.51 },
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', move: 'e5', frequency: 90, winRate: 0.48 },
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', move: 'c5', frequency: 70, winRate: 0.49 },
    ];

    openingMoves.forEach(opening => {
      this.knowledge.openingBook.set(opening.fen, {
        move: opening.move,
        frequency: opening.frequency,
        winRate: opening.winRate
      });
    });
  }

  public async makeMove(chess: Chess): Promise<{ move: string; evaluation: number; thinkingTime: number }> {
    const startTime = Date.now();
    
    const currentFen = chess.fen();
    const legalMoves = chess.moves();
    
    if (legalMoves.length === 0) {
      throw new Error('No legal moves available');
    }

    let bestMove: string;
    let evaluation: number;

    // Check opening book first
    const openingMove = this.knowledge.openingBook.get(currentFen);
    if (openingMove && Math.random() < (1 - this.learningParams.explorationRate)) {
      bestMove = openingMove.move;
      evaluation = this.evaluatePosition(chess);
    } else {
      // Use minimax with alpha-beta pruning
      const result = this.minimax(chess, this.stats.averageDepth, -Infinity, Infinity, chess.turn() === 'w');
      bestMove = result.move || legalMoves[0];
      evaluation = result.evaluation;
    }

    // Apply exploration (random move sometimes)
    if (Math.random() < this.learningParams.explorationRate) {
      bestMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const thinkingTime = Date.now() - startTime;
    
    // Update statistics
    this.stats.positionsAnalyzed++;
    this.stats.averageThinkingTime = (this.stats.averageThinkingTime + thinkingTime) / 2;
    
    return { move: bestMove, evaluation, thinkingTime };
  }

  private minimax(chess: Chess, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { move: string | null; evaluation: number } {
    if (depth === 0 || chess.isGameOver()) {
      return { move: null, evaluation: this.evaluatePosition(chess) };
    }

    const moves = chess.moves();
    let bestMove: string | null = null;

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      
      for (const move of moves) {
        chess.move(move);
        const eval_result = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        
        if (eval_result.evaluation > maxEval) {
          maxEval = eval_result.evaluation;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, eval_result.evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { move: bestMove, evaluation: maxEval };
    } else {
      let minEval = Infinity;
      
      for (const move of moves) {
        chess.move(move);
        const eval_result = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        
        if (eval_result.evaluation < minEval) {
          minEval = eval_result.evaluation;
          bestMove = move;
        }
        
        beta = Math.min(beta, eval_result.evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { move: bestMove, evaluation: minEval };
    }
  }

  private evaluatePosition(chess: Chess): number {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -10000 : 10000;
    }
    
    if (chess.isDraw()) {
      return 0;
    }

    let evaluation = 0;
    const board = chess.board();

    // Piece values
    const pieceValues: { [key: string]: number } = {
      'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
    };

    // Material evaluation
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = board[rank][file];
        if (square) {
          const pieceValue = pieceValues[square.type] || 0;
          evaluation += square.color === 'w' ? pieceValue : -pieceValue;
          
          // Position-based bonuses
          evaluation += this.getPositionalValue(square.type, square.color, rank, file);
        }
      }
    }

    // Add mobility bonus
    const whiteMoves = chess.turn() === 'w' ? chess.moves().length : 0;
    chess.load(chess.fen().replace(' w ', ' b '));
    const blackMoves = chess.turn() === 'b' ? chess.moves().length : 0;
    chess.load(chess.fen().replace(' b ', ' w '));
    
    evaluation += (whiteMoves - blackMoves) * 5;

    return evaluation;
  }

  private getPositionalValue(piece: string, color: string, rank: number, file: number): number {
    // Simple position tables for better play
    const centerBonus = Math.max(0, 3 - Math.abs(3.5 - rank)) + Math.max(0, 3 - Math.abs(3.5 - file));
    
    switch (piece) {
      case 'p':
        return color === 'w' ? rank * 10 : (7 - rank) * 10; // Pawns advance
      case 'n':
      case 'b':
        return centerBonus * 5; // Knights and bishops like the center
      case 'k':
        // King safety in early game, activity in endgame
        return this.isEndgame() ? centerBonus * 3 : -centerBonus * 5;
      default:
        return 0;
    }
  }

  private isEndgame(): boolean {
    // Simple endgame detection
    return this.stats.gamesPlayed > 0; // Placeholder - could be more sophisticated
  }

  public recordGameResult(outcome: 'win' | 'loss' | 'draw', gameMemory: AgentMemory[]): void {
    // Update statistics
    this.stats.gamesPlayed++;
    switch (outcome) {
      case 'win':
        this.stats.wins++;
        break;
      case 'loss':
        this.stats.losses++;
        break;
      case 'draw':
        this.stats.draws++;
        break;
    }

    // Update ELO rating (simplified)
    const winRate = this.stats.wins / this.stats.gamesPlayed;
    this.stats.eloRating = 1500 + (winRate - 0.5) * 400;
    
    // Store game memory for learning
    this.memory.push(...gameMemory);
    
    // Limit memory size
    if (this.memory.length > this.learningParams.memorySize) {
      this.memory = this.memory.slice(-this.learningParams.memorySize);
    }

    // Learn from the game
    this.learnFromGame(gameMemory, outcome);
    
    // Update learning progress
    this.stats.learningProgress.push(this.stats.eloRating);
    if (this.stats.learningProgress.length > 100) {
      this.stats.learningProgress = this.stats.learningProgress.slice(-100);
    }
    
    this.stats.lastUpdated = new Date();
  }

  private learnFromGame(gameMemory: AgentMemory[], outcome: 'win' | 'loss' | 'draw'): void {
    const outcomeReward = outcome === 'win' ? 1 : outcome === 'loss' ? -1 : 0;
    
    // Update position evaluations based on game outcome
    gameMemory.forEach((memory, index) => {
      const discountedReward = outcomeReward * Math.pow(this.learningParams.discountFactor, gameMemory.length - index);
      
      // Update position evaluation
      const currentEval = this.knowledge.positionEvaluations.get(memory.position) || 0;
      const newEval = currentEval + this.learningParams.learningRate * (discountedReward - currentEval);
      this.knowledge.positionEvaluations.set(memory.position, newEval);
      
      // Update opening book
      if (index < 10) { // First 10 moves are considered opening
        const openingEntry = this.knowledge.openingBook.get(memory.position);
        if (openingEntry && openingEntry.move === memory.move) {
          openingEntry.frequency++;
          openingEntry.winRate = (openingEntry.winRate + (outcomeReward + 1) / 2) / 2;
        } else {
          this.knowledge.openingBook.set(memory.position, {
            move: memory.move,
            frequency: 1,
            winRate: (outcomeReward + 1) / 2
          });
        }
      }
    });

    // Update neural network weights (simplified gradient descent)
    this.updateNeuralWeights(gameMemory, outcomeReward);
  }

  private updateNeuralWeights(gameMemory: AgentMemory[], reward: number): void {
    // Simplified neural network weight update
    const learningRate = this.learningParams.learningRate;
    
    // Update weights based on game outcome (placeholder implementation)
    for (let layer = 0; layer < this.neuralWeights.length; layer++) {
      for (let weight = 0; weight < this.neuralWeights[layer].length; weight++) {
        this.neuralWeights[layer][weight] += learningRate * reward * (Math.random() - 0.5) * 0.01;
      }
    }
  }

  public adjustLearningParameters(newParams: Partial<LearningParameters>): void {
    this.learningParams = { ...this.learningParams, ...newParams };
  }

  public getKnowledgeSnapshot(): {
    openingBookSize: number;
    positionEvaluationsSize: number;
    memorySize: number;
    averagePositionEval: number;
  } {
    const positionEvals = Array.from(this.knowledge.positionEvaluations.values());
    const averageEval = positionEvals.length > 0 
      ? positionEvals.reduce((sum, evaluation) => sum + evaluation, 0) / positionEvals.length 
      : 0;

    return {
      openingBookSize: this.knowledge.openingBook.size,
      positionEvaluationsSize: this.knowledge.positionEvaluations.size,
      memorySize: this.memory.length,
      averagePositionEval: averageEval,
    };
  }

  public exportKnowledge(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      learningParams: this.learningParams,
      knowledge: {
        openingBook: Array.from(this.knowledge.openingBook.entries()),
        positionEvaluations: Array.from(this.knowledge.positionEvaluations.entries()),
        tacticPatterns: Array.from(this.knowledge.tacticPatterns.entries()),
        endgameTablebase: Array.from(this.knowledge.endgameTablebase.entries()),
      },
      stats: this.stats,
      neuralWeights: this.neuralWeights,
    });
  }

  public importKnowledge(knowledgeData: string): void {
    try {
      const data = JSON.parse(knowledgeData);
      
      this.learningParams = data.learningParams;
      this.stats = data.stats;
      this.neuralWeights = data.neuralWeights;
      
      // Restore knowledge maps
      this.knowledge.openingBook = new Map(data.knowledge.openingBook);
      this.knowledge.positionEvaluations = new Map(data.knowledge.positionEvaluations);
      this.knowledge.tacticPatterns = new Map(data.knowledge.tacticPatterns);
      this.knowledge.endgameTablebase = new Map(data.knowledge.endgameTablebase);
      
      // Restore literature and online experience if available
      if (data.knowledge.literature) {
        this.knowledge.literature = {
          ...data.knowledge.literature,
          openingTheory: new Map(data.knowledge.literature.openingTheory),
          endgameStudies: new Map(data.knowledge.literature.endgameStudies),
        };
      }
      
      if (data.knowledge.onlineExperience) {
        this.knowledge.onlineExperience = data.knowledge.onlineExperience;
      }
      
    } catch (error) {
      console.error('Failed to import knowledge:', error);
    }
  }

  /**
   * Learn from chess literature and books
   */
  public learnFromBook(bookTitle: string, bookData: {
    games: Array<{ moves: string[]; result: string; rating?: number }>;
    openings: Array<{ name: string; eco: string; moves: string[]; keyIdeas: string[] }>;
    endgames: Array<{ position: string; technique: string; difficulty: string }>;
  }): void {
    console.log(`📚 ${this.name} is studying "${bookTitle}"`);
    
    // Add book to studied list
    if (!this.knowledge.literature.booksStudied.includes(bookTitle)) {
      this.knowledge.literature.booksStudied.push(bookTitle);
    }
    
    // Learn from master games
    this.knowledge.literature.masterGamesAnalyzed += bookData.games.length;
    
    for (const game of bookData.games) {
      this.analyzeGameForLearning(game.moves, game.result, game.rating);
    }
    
    // Learn opening theory
    for (const opening of bookData.openings) {
      this.knowledge.literature.openingTheory.set(opening.name, {
        eco: opening.eco,
        keyIdeas: opening.keyIdeas,
        masterFrequency: 0 // Will be updated as we see it in games
      });
      
      // Add to opening book with higher weight for book moves
      const chess = new Chess();
      for (const move of opening.moves) {
        const position = chess.fen();
        const existing = this.knowledge.openingBook.get(position) || { move, frequency: 0, winRate: 0.5 };
        existing.frequency += 10; // Higher weight for book moves
        this.knowledge.openingBook.set(position, existing);
        
        if (!chess.move(move)) break;
      }
    }
    
    // Learn endgame studies
    for (const endgame of bookData.endgames) {
      this.knowledge.literature.endgameStudies.set(endgame.position, {
        technique: endgame.technique,
        difficulty: endgame.difficulty,
        mastery: 0.1 // Start with low mastery, improve through practice
      });
    }
    
    console.log(`✅ Finished studying "${bookTitle}" - Knowledge expanded!`);
  }

  /**
   * Record online game experience
   */
  public recordOnlineGame(platform: string, opponent: string, opponentRating: number, result: 'win' | 'loss' | 'draw', moves: string[], learnings: string[]): void {
    console.log(`🌐 Recording online game on ${platform} vs ${opponent} (${opponentRating}): ${result}`);
    
    // Update online experience
    this.knowledge.onlineExperience.gamesPlayed++;
    
    if (!this.knowledge.onlineExperience.platforms.includes(platform)) {
      this.knowledge.onlineExperience.platforms.push(platform);
    }
    
    // Update win rate for platform
    const currentWinRate = this.knowledge.onlineExperience.winRate[platform] || 0.5;
    const games = this.knowledge.onlineExperience.gamesPlayed;
    const resultValue = result === 'win' ? 1 : result === 'loss' ? 0 : 0.5;
    
    this.knowledge.onlineExperience.winRate[platform] = 
      (currentWinRate * (games - 1) + resultValue) / games;
    
    // Update average opponent rating
    this.knowledge.onlineExperience.averageOpponentRating = 
      (this.knowledge.onlineExperience.averageOpponentRating * (games - 1) + opponentRating) / games;
    
    // Store learnings from the game
    this.knowledge.onlineExperience.learningsFromGames.push(...learnings);
    
    // Analyze the game for tactical and strategic insights
    this.analyzeGameForLearning(moves, result, opponentRating);
    
    console.log(`📊 Online experience updated: ${this.knowledge.onlineExperience.gamesPlayed} games, ${(this.knowledge.onlineExperience.winRate[platform] * 100).toFixed(1)}% win rate on ${platform}`);
  }

  /**
   * Analyze a game for learning opportunities
   */
  private analyzeGameForLearning(moves: string[], result: string, opponentRating?: number): void {
    const chess = new Chess();
    const gameValue = result === 'win' ? 1 : result === 'loss' ? 0 : 0.5;
    
    // Analyze each position in the game
    for (let i = 0; i < moves.length; i++) {
      const position = chess.fen();
      const move = moves[i];
      
      // Update position evaluations based on game outcome
      const currentEval = this.knowledge.positionEvaluations.get(position) || 0;
      const weight = opponentRating ? Math.min(opponentRating / 2000, 1) : 0.5;
      const newEval = currentEval * 0.9 + (gameValue - 0.5) * weight * 0.1;
      
      this.knowledge.positionEvaluations.set(position, newEval);
      
      // Learn opening moves
      if (i < 15) {
        const existing = this.knowledge.openingBook.get(position) || { move, frequency: 0, winRate: 0.5 };
        existing.frequency++;
        existing.winRate = (existing.winRate * (existing.frequency - 1) + gameValue) / existing.frequency;
        this.knowledge.openingBook.set(position, existing);
      }
      
      // Learn endgame positions (when few pieces remain)
      if (this.countPieces(chess) <= 10) {
        const evaluation = this.evaluatePosition(chess);
        this.knowledge.endgameTablebase.set(position, {
          bestMove: move,
          evaluation
        });
      }
      
      if (!chess.move(move)) break;
    }
  }

  /**
   * Get knowledge summary for display
   */
  public getKnowledgeSummary(): {
    totalKnowledge: number;
    literature: {
      booksStudied: number;
      masterGamesAnalyzed: number;
      openingTheoryKnown: number;
      endgameStudies: number;
    };
    onlineExperience: {
      gamesPlayed: number;
      platforms: string[];
      overallWinRate: number;
      averageOpponentRating: number;
      uniqueLearnings: number;
    };
  } {
    const platformWinRates = Object.values(this.knowledge.onlineExperience.winRate);
    const overallWinRate = platformWinRates.length > 0 
      ? platformWinRates.reduce((a, b) => a + b, 0) / platformWinRates.length 
      : 0.5;

    return {
      totalKnowledge: 
        this.knowledge.openingBook.size + 
        this.knowledge.positionEvaluations.size + 
        this.knowledge.tacticPatterns.size + 
        this.knowledge.endgameTablebase.size +
        this.knowledge.literature.masterGamesAnalyzed +
        this.knowledge.onlineExperience.gamesPlayed,
      literature: {
        booksStudied: this.knowledge.literature.booksStudied.length,
        masterGamesAnalyzed: this.knowledge.literature.masterGamesAnalyzed,
        openingTheoryKnown: this.knowledge.literature.openingTheory.size,
        endgameStudies: this.knowledge.literature.endgameStudies.size,
      },
      onlineExperience: {
        gamesPlayed: this.knowledge.onlineExperience.gamesPlayed,
        platforms: this.knowledge.onlineExperience.platforms,
        overallWinRate,
        averageOpponentRating: this.knowledge.onlineExperience.averageOpponentRating,
        uniqueLearnings: this.knowledge.onlineExperience.learningsFromGames.length,
      }
    };
  }

  /**
   * Apply knowledge from literature during move selection
   */
  private applyLiteratureKnowledge(chess: Chess): string | null {
    const position = chess.fen();
    
    // Check if this position matches known opening theory
    for (const [openingName, theory] of this.knowledge.literature.openingTheory) {
      // This is a simplified check - in practice, you'd need more sophisticated pattern matching
      if (this.knowledge.openingBook.has(position)) {
        const bookMove = this.knowledge.openingBook.get(position)!;
        console.log(`📖 Using ${openingName} theory: ${bookMove.move}`);
        return bookMove.move;
      }
    }
    
    // Check for endgame study positions
    const studyMove = this.knowledge.literature.endgameStudies.get(position);
    if (studyMove && studyMove.mastery > 0.5) {
      console.log(`♔ Applying endgame study: ${studyMove.technique}`);
      return this.knowledge.endgameTablebase.get(position)?.bestMove || null;
    }
    
    return null;
  }

  private countPieces(chess: Chess): number {
    const board = chess.board();
    let count = 0;
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        if (board[rank][file]) count++;
      }
    }
    
    return count;
  }
}
