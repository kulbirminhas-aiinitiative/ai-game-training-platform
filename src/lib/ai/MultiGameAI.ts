import { Chess } from 'chess.js';
import { ChessAIAgent } from './ChessAIAgent';

/**
 * Multi-Game AI Architecture
 * Supports Chess, Poker, Go, and Checkers with unified learning
 */

export type GameType = 'chess' | 'poker' | 'go' | 'checkers';

export interface GameState {
  gameType: GameType;
  position: string; // FEN for chess, JSON for others
  legalMoves: string[];
  isTerminal: boolean;
  evaluation?: number;
  metadata?: { [key: string]: any };
}

export interface UniversalMove {
  gameType: GameType;
  move: string;
  notation: string;
  confidence: number;
  expectedValue: number;
  alternatives: Array<{move: string; value: number}>;
}

export interface GameEngine {
  gameType: GameType;
  makeMove(state: GameState, move: string): GameState;
  getLegalMoves(state: GameState): string[];
  evaluatePosition(state: GameState): number;
  isGameOver(state: GameState): boolean;
  getResult(state: GameState): 'win' | 'loss' | 'draw';
  exportState(state: GameState): string;
  importState(stateString: string): GameState;
}

export class MultiGameAI {
  public id: string;
  public name: string;
  public supportedGames: GameType[];
  private gameSpecificKnowledge: Map<GameType, any> = new Map();
  private transferLearningNetwork: TransferLearningNetwork;
  private metaLearningController: MetaLearningController;

  constructor(
    id: string,
    name: string,
    supportedGames: GameType[] = ['chess', 'poker', 'go', 'checkers']
  ) {
    this.id = id;
    this.name = name;
    this.supportedGames = supportedGames;
    this.transferLearningNetwork = new TransferLearningNetwork();
    this.metaLearningController = new MetaLearningController();
    this.initializeGameKnowledge();
  }

  private initializeGameKnowledge(): void {
    for (const gameType of this.supportedGames) {
      this.gameSpecificKnowledge.set(gameType, this.createGameKnowledge(gameType));
    }
  }

  private createGameKnowledge(gameType: GameType): any {
    switch (gameType) {
      case 'chess':
        return {
          openingBook: new Map(),
          endgameTablebase: new Map(),
          positionEvaluations: new Map(),
          tacticalPatterns: new Map(),
        };
      case 'poker':
        return {
          handStrengths: new Map(),
          bettingPatterns: new Map(),
          opponentModels: new Map(),
          bluffingStrategies: new Map(),
        };
      case 'go':
        return {
          josekiDatabase: new Map(),
          territoryEvaluation: new Map(),
          lifeAndDeathPatterns: new Map(),
          fusekiStrategies: new Map(),
        };
      case 'checkers':
        return {
          openingMoves: new Map(),
          endgameDatabase: new Map(),
          positionValues: new Map(),
          tacticalMotifs: new Map(),
        };
      default:
        return {};
    }
  }

  public async makeMove(gameState: GameState): Promise<UniversalMove> {
    const gameEngine = this.getGameEngine(gameState.gameType);
    const legalMoves = gameEngine.getLegalMoves(gameState);
    
    if (legalMoves.length === 0) {
      throw new Error('No legal moves available');
    }

    // Use meta-learning to adapt strategy
    const adaptedStrategy = await this.metaLearningController.adaptStrategy(
      gameState.gameType, 
      gameState
    );

    // Apply transfer learning from other games
    const transferredKnowledge = this.transferLearningNetwork.getTransferredKnowledge(
      gameState.gameType,
      gameState
    );

    // Evaluate moves using game-specific and transferred knowledge
    const moveEvaluations = await this.evaluateMoves(
      gameState, 
      legalMoves, 
      adaptedStrategy,
      transferredKnowledge
    );

    // Select best move with exploration
    const selectedMove = this.selectMove(moveEvaluations, adaptedStrategy.explorationRate);

    return {
      gameType: gameState.gameType,
      move: selectedMove.move,
      notation: selectedMove.notation,
      confidence: selectedMove.confidence,
      expectedValue: selectedMove.expectedValue,
      alternatives: moveEvaluations.slice(1, 4) // Top 3 alternatives
    };
  }

  private async evaluateMoves(
    gameState: GameState,
    legalMoves: string[],
    strategy: AdaptedStrategy,
    transferredKnowledge: TransferredKnowledge
  ): Promise<Array<{move: string; notation: string; value: number; confidence: number; expectedValue: number}>> {
    const gameEngine = this.getGameEngine(gameState.gameType);
    const evaluations = [];

    for (const move of legalMoves) {
      const newState = gameEngine.makeMove(gameState, move);
      
      // Base game evaluation
      let value = gameEngine.evaluatePosition(newState);
      
      // Apply game-specific knowledge
      value += this.applyGameSpecificKnowledge(gameState.gameType, newState);
      
      // Apply transferred knowledge
      value += transferredKnowledge.getPositionBonus(newState);
      
      // Apply meta-learning adjustments
      value = strategy.adjustEvaluation(value, newState);

      evaluations.push({
        move,
        notation: this.getMoveNotation(gameState.gameType, move),
        value,
        confidence: this.calculateConfidence(value, strategy),
        expectedValue: value
      });
    }

    return evaluations.sort((a, b) => b.value - a.value);
  }

  private selectMove(
    evaluations: Array<{move: string; value: number; confidence: number}>,
    explorationRate: number
  ): {move: string; notation: string; confidence: number; expectedValue: number} {
    if (Math.random() < explorationRate && evaluations.length > 1) {
      // Exploration: select from top 3 moves with probability based on value
      const topMoves = evaluations.slice(0, Math.min(3, evaluations.length));
      const totalValue = topMoves.reduce((sum, eval) => sum + Math.max(0, eval.value), 0);
      
      let random = Math.random() * totalValue;
      for (const moveEval of topMoves) {
        random -= Math.max(0, moveEval.value);
        if (random <= 0) {
          return moveEval as any;
        }
      }
    }
    
    // Exploitation: select best move
    return evaluations[0] as any;
  }

  private applyGameSpecificKnowledge(gameType: GameType, gameState: GameState): number {
    const knowledge = this.gameSpecificKnowledge.get(gameType);
    if (!knowledge) return 0;

    switch (gameType) {
      case 'chess':
        return this.applyChessKnowledge(knowledge, gameState);
      case 'poker':
        return this.applyPokerKnowledge(knowledge, gameState);
      case 'go':
        return this.applyGoKnowledge(knowledge, gameState);
      case 'checkers':
        return this.applyCheckersKnowledge(knowledge, gameState);
      default:
        return 0;
    }
  }

  private applyChessKnowledge(knowledge: any, gameState: GameState): number {
    let bonus = 0;
    
    // Opening book bonus
    if (knowledge.openingBook.has(gameState.position)) {
      bonus += knowledge.openingBook.get(gameState.position).value * 0.1;
    }
    
    // Position evaluation bonus
    if (knowledge.positionEvaluations.has(gameState.position)) {
      bonus += knowledge.positionEvaluations.get(gameState.position) * 0.05;
    }
    
    return bonus;
  }

  private applyPokerKnowledge(knowledge: any, gameState: GameState): number {
    // Implement poker-specific knowledge application
    return 0;
  }

  private applyGoKnowledge(knowledge: any, gameState: GameState): number {
    // Implement Go-specific knowledge application
    return 0;
  }

  private applyCheckersKnowledge(knowledge: any, gameState: GameState): number {
    // Implement checkers-specific knowledge application
    return 0;
  }

  private calculateConfidence(value: number, strategy: AdaptedStrategy): number {
    // Calculate confidence based on evaluation certainty and strategy
    const baseConfidence = Math.min(Math.abs(value) / 1000, 1.0);
    return baseConfidence * strategy.confidenceMultiplier;
  }

  private getMoveNotation(gameType: GameType, move: string): string {
    // Convert internal move representation to standard notation
    switch (gameType) {
      case 'chess':
        return move; // Assuming move is already in algebraic notation
      case 'poker':
        return move; // e.g., "fold", "call", "raise 100"
      case 'go':
        return move; // e.g., "D4", "pass"
      case 'checkers':
        return move; // e.g., "1-5", "5x14"
      default:
        return move;
    }
  }

  private getGameEngine(gameType: GameType): GameEngine {
    switch (gameType) {
      case 'chess':
        return new ChessGameEngine();
      case 'poker':
        return new PokerGameEngine();
      case 'go':
        return new GoGameEngine();
      case 'checkers':
        return new CheckersGameEngine();
      default:
        throw new Error(`Unsupported game type: ${gameType}`);
    }
  }

  public async learnFromGame(
    gameType: GameType,
    gameHistory: GameState[],
    result: 'win' | 'loss' | 'draw'
  ): Promise<void> {
    // Update game-specific knowledge
    await this.updateGameKnowledge(gameType, gameHistory, result);
    
    // Update transfer learning network
    await this.transferLearningNetwork.updateFromGame(gameType, gameHistory, result);
    
    // Update meta-learning controller
    await this.metaLearningController.updateFromGame(gameType, gameHistory, result);
  }

  private async updateGameKnowledge(
    gameType: GameType,
    gameHistory: GameState[],
    result: 'win' | 'loss' | 'draw'
  ): Promise<void> {
    const knowledge = this.gameSpecificKnowledge.get(gameType);
    if (!knowledge) return;

    const resultValue = result === 'win' ? 1 : result === 'loss' ? -1 : 0;

    for (let i = 0; i < gameHistory.length; i++) {
      const state = gameHistory[i];
      const remainingMoves = gameHistory.length - i;
      const discountedValue = resultValue * Math.pow(0.95, remainingMoves);

      // Update position evaluations
      const currentEval = knowledge.positionEvaluations.get(state.position) || 0;
      const newEval = currentEval * 0.9 + discountedValue * 0.1;
      knowledge.positionEvaluations.set(state.position, newEval);
    }
  }

  public getKnowledgeTransferReport(): KnowledgeTransferReport {
    return {
      supportedGames: this.supportedGames,
      transferConnections: this.transferLearningNetwork.getConnections(),
      metaLearningStats: this.metaLearningController.getStats(),
      knowledgeSize: this.getTotalKnowledgeSize(),
      transferEfficiency: this.calculateTransferEfficiency()
    };
  }

  private getTotalKnowledgeSize(): number {
    let total = 0;
    for (const [gameType, knowledge] of this.gameSpecificKnowledge) {
      total += this.getKnowledgeSize(knowledge);
    }
    return total;
  }

  private getKnowledgeSize(knowledge: any): number {
    let size = 0;
    for (const [key, value] of Object.entries(knowledge)) {
      if (value instanceof Map) {
        size += (value as Map<any, any>).size;
      }
    }
    return size;
  }

  private calculateTransferEfficiency(): number {
    return this.transferLearningNetwork.getTransferEfficiency();
  }
}

// Supporting Classes

class TransferLearningNetwork {
  private crossGamePatterns: Map<string, CrossGamePattern> = new Map();
  private transferHistory: TransferEvent[] = [];

  public getTransferredKnowledge(gameType: GameType, gameState: GameState): TransferredKnowledge {
    return new TransferredKnowledge(this.crossGamePatterns, gameType, gameState);
  }

  public async updateFromGame(
    gameType: GameType, 
    gameHistory: GameState[], 
    result: 'win' | 'loss' | 'draw'
  ): Promise<void> {
    // Extract patterns that might transfer to other games
    const patterns = this.extractTransferablePatterns(gameType, gameHistory);
    
    for (const pattern of patterns) {
      const existing = this.crossGamePatterns.get(pattern.id) || new CrossGamePattern(pattern.id);
      existing.addEvidence(gameType, pattern.evidence, result);
      this.crossGamePatterns.set(pattern.id, existing);
    }
  }

  private extractTransferablePatterns(gameType: GameType, gameHistory: GameState[]): Pattern[] {
    // Extract high-level strategic patterns that could apply across games
    const patterns: Pattern[] = [];
    
    // Example patterns: "early aggression", "piece development", "territory control"
    patterns.push({
      id: 'strategic_tempo',
      evidence: this.analyzeTempoControl(gameHistory),
      confidence: 0.8
    });
    
    patterns.push({
      id: 'resource_management',
      evidence: this.analyzeResourceManagement(gameHistory),
      confidence: 0.7
    });
    
    return patterns;
  }

  private analyzeTempoControl(gameHistory: GameState[]): any {
    // Analyze tempo and initiative patterns
    return { tempoShifts: gameHistory.length * 0.1 };
  }

  private analyzeResourceManagement(gameHistory: GameState[]): any {
    // Analyze resource utilization patterns
    return { efficiency: Math.random() };
  }

  public getConnections(): Array<{from: GameType; to: GameType; strength: number}> {
    const connections = [];
    const games: GameType[] = ['chess', 'poker', 'go', 'checkers'];
    
    for (const game1 of games) {
      for (const game2 of games) {
        if (game1 !== game2) {
          connections.push({
            from: game1,
            to: game2,
            strength: this.calculateTransferStrength(game1, game2)
          });
        }
      }
    }
    
    return connections;
  }

  private calculateTransferStrength(from: GameType, to: GameType): number {
    // Calculate how much knowledge transfers between games
    const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
      chess: { poker: 0.3, go: 0.5, checkers: 0.8 },
      poker: { chess: 0.3, go: 0.2, checkers: 0.2 },
      go: { chess: 0.5, poker: 0.2, checkers: 0.4 },
      checkers: { chess: 0.8, poker: 0.2, go: 0.4 }
    };
    
    return compatibilityMatrix[from]?.[to] || 0;
  }

  public getTransferEfficiency(): number {
    // Calculate overall transfer learning efficiency
    return this.transferHistory.reduce((sum, event) => sum + event.efficiency, 0) / 
           Math.max(this.transferHistory.length, 1);
  }
}

class MetaLearningController {
  private learningHistory: LearningEvent[] = [];
  private adaptationStrategies: Map<GameType, AdaptationStrategy> = new Map();

  public async adaptStrategy(gameType: GameType, gameState: GameState): Promise<AdaptedStrategy> {
    const baseStrategy = this.getBaseStrategy(gameType);
    const adaptations = this.calculateAdaptations(gameType, gameState);
    
    return {
      explorationRate: baseStrategy.explorationRate * adaptations.explorationMultiplier,
      learningRate: baseStrategy.learningRate * adaptations.learningMultiplier,
      confidenceMultiplier: adaptations.confidenceMultiplier,
      adjustEvaluation: (value, state) => value * adaptations.evaluationMultiplier
    };
  }

  private getBaseStrategy(gameType: GameType): AdaptationStrategy {
    return this.adaptationStrategies.get(gameType) || {
      explorationRate: 0.1,
      learningRate: 0.01,
      adaptationSpeed: 0.1
    };
  }

  private calculateAdaptations(gameType: GameType, gameState: GameState): AdaptationFactors {
    // Analyze recent performance and adapt accordingly
    const recentEvents = this.learningHistory
      .filter(event => event.gameType === gameType)
      .slice(-10);
    
    const averagePerformance = recentEvents.reduce((sum, event) => sum + event.performance, 0) / 
                               Math.max(recentEvents.length, 1);
    
    return {
      explorationMultiplier: averagePerformance < 0.5 ? 1.5 : 0.8, // Explore more if performing poorly
      learningMultiplier: averagePerformance < 0.3 ? 2.0 : 1.0, // Learn faster if struggling
      confidenceMultiplier: Math.max(0.5, averagePerformance),
      evaluationMultiplier: 1.0 + (averagePerformance - 0.5) * 0.2
    };
  }

  public async updateFromGame(
    gameType: GameType, 
    gameHistory: GameState[], 
    result: 'win' | 'loss' | 'draw'
  ): Promise<void> {
    const performance = result === 'win' ? 1 : result === 'loss' ? 0 : 0.5;
    
    this.learningHistory.push({
      gameType,
      performance,
      gameLength: gameHistory.length,
      timestamp: Date.now()
    });
    
    // Keep only recent history
    if (this.learningHistory.length > 1000) {
      this.learningHistory = this.learningHistory.slice(-500);
    }
  }

  public getStats(): MetaLearningStats {
    const gameStats = new Map<GameType, { games: number; avgPerformance: number }>();
    
    for (const event of this.learningHistory) {
      const existing = gameStats.get(event.gameType) || { games: 0, avgPerformance: 0 };
      existing.games++;
      existing.avgPerformance = (existing.avgPerformance * (existing.games - 1) + event.performance) / existing.games;
      gameStats.set(event.gameType, existing);
    }
    
    return {
      totalGames: this.learningHistory.length,
      gameStats: Object.fromEntries(gameStats),
      adaptationEfficiency: this.calculateAdaptationEfficiency()
    };
  }

  private calculateAdaptationEfficiency(): number {
    // Calculate how quickly the agent adapts to new situations
    if (this.learningHistory.length < 20) return 0.5;
    
    const recent = this.learningHistory.slice(-10);
    const older = this.learningHistory.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, e) => sum + e.performance, 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + e.performance, 0) / older.length;
    
    return Math.max(0, recentAvg - olderAvg + 0.5); // Normalize to 0-1 range
  }
}

// Game Engine Implementations

class ChessGameEngine implements GameEngine {
  public gameType: GameType = 'chess';

  public makeMove(state: GameState, move: string): GameState {
    const chess = new Chess(state.position);
    chess.move(move);
    
    return {
      gameType: 'chess',
      position: chess.fen(),
      legalMoves: chess.moves(),
      isTerminal: chess.isGameOver(),
      evaluation: this.evaluatePosition({...state, position: chess.fen()})
    };
  }

  public getLegalMoves(state: GameState): string[] {
    const chess = new Chess(state.position);
    return chess.moves();
  }

  public evaluatePosition(state: GameState): number {
    const chess = new Chess(state.position);
    
    // Basic material evaluation
    const pieces = chess.board().flat().filter(p => p);
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    
    let evaluation = 0;
    for (const piece of pieces) {
      if (piece) {
        const value = pieceValues[piece.type as keyof typeof pieceValues] || 0;
        evaluation += piece.color === 'w' ? value : -value;
      }
    }
    
    return evaluation;
  }

  public isGameOver(state: GameState): boolean {
    const chess = new Chess(state.position);
    return chess.isGameOver();
  }

  public getResult(state: GameState): 'win' | 'loss' | 'draw' {
    const chess = new Chess(state.position);
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? 'loss' : 'win';
    }
    return 'draw';
  }

  public exportState(state: GameState): string {
    return JSON.stringify(state);
  }

  public importState(stateString: string): GameState {
    return JSON.parse(stateString);
  }
}

class PokerGameEngine implements GameEngine {
  public gameType: GameType = 'poker';

  public makeMove(state: GameState, move: string): GameState {
    // Implement poker game logic
    return {
      gameType: 'poker',
      position: state.position, // Update based on move
      legalMoves: this.getLegalMoves(state),
      isTerminal: false, // Update based on game state
      evaluation: 0 // Implement poker evaluation
    };
  }

  public getLegalMoves(state: GameState): string[] {
    // Return legal poker actions: fold, call, raise, etc.
    return ['fold', 'call', 'raise_small', 'raise_big', 'all_in'];
  }

  public evaluatePosition(state: GameState): number {
    // Implement poker hand evaluation
    return 0;
  }

  public isGameOver(state: GameState): boolean {
    // Check if poker hand is complete
    return false;
  }

  public getResult(state: GameState): 'win' | 'loss' | 'draw' {
    return 'draw';
  }

  public exportState(state: GameState): string {
    return JSON.stringify(state);
  }

  public importState(stateString: string): GameState {
    return JSON.parse(stateString);
  }
}

class GoGameEngine implements GameEngine {
  public gameType: GameType = 'go';

  public makeMove(state: GameState, move: string): GameState {
    // Implement Go game logic
    return {
      gameType: 'go',
      position: state.position,
      legalMoves: this.getLegalMoves(state),
      isTerminal: false,
      evaluation: 0
    };
  }

  public getLegalMoves(state: GameState): string[] {
    // Return legal Go moves
    const moves = [];
    for (let i = 1; i <= 19; i++) {
      for (let j = 1; j <= 19; j++) {
        moves.push(`${String.fromCharCode(64 + i)}${j}`);
      }
    }
    moves.push('pass');
    return moves;
  }

  public evaluatePosition(state: GameState): number {
    return 0;
  }

  public isGameOver(state: GameState): boolean {
    return false;
  }

  public getResult(state: GameState): 'win' | 'loss' | 'draw' {
    return 'draw';
  }

  public exportState(state: GameState): string {
    return JSON.stringify(state);
  }

  public importState(stateString: string): GameState {
    return JSON.parse(stateString);
  }
}

class CheckersGameEngine implements GameEngine {
  public gameType: GameType = 'checkers';

  public makeMove(state: GameState, move: string): GameState {
    // Implement checkers game logic
    return {
      gameType: 'checkers',
      position: state.position,
      legalMoves: this.getLegalMoves(state),
      isTerminal: false,
      evaluation: 0
    };
  }

  public getLegalMoves(state: GameState): string[] {
    // Return legal checker moves
    return ['1-5', '2-6', '3-7']; // Simplified
  }

  public evaluatePosition(state: GameState): number {
    return 0;
  }

  public isGameOver(state: GameState): boolean {
    return false;
  }

  public getResult(state: GameState): 'win' | 'loss' | 'draw' {
    return 'draw';
  }

  public exportState(state: GameState): string {
    return JSON.stringify(state);
  }

  public importState(stateString: string): GameState {
    return JSON.parse(stateString);
  }
}

// Supporting Types

interface TransferredKnowledge {
  getPositionBonus(gameState: GameState): number;
}

class TransferredKnowledge {
  constructor(
    private patterns: Map<string, CrossGamePattern>,
    private gameType: GameType,
    private currentState: GameState
  ) {}

  public getPositionBonus(gameState: GameState): number {
    let bonus = 0;
    
    for (const [patternId, pattern] of this.patterns) {
      if (pattern.appliesTo(this.gameType, gameState)) {
        bonus += pattern.getBonus(this.gameType);
      }
    }
    
    return bonus;
  }
}

class CrossGamePattern {
  private evidence: Map<GameType, Array<{data: any; result: 'win' | 'loss' | 'draw'}>> = new Map();

  constructor(public id: string) {}

  public addEvidence(gameType: GameType, evidence: any, result: 'win' | 'loss' | 'draw'): void {
    if (!this.evidence.has(gameType)) {
      this.evidence.set(gameType, []);
    }
    this.evidence.get(gameType)!.push({ data: evidence, result });
  }

  public appliesTo(gameType: GameType, gameState: GameState): boolean {
    return this.evidence.has(gameType) && this.evidence.get(gameType)!.length > 0;
  }

  public getBonus(gameType: GameType): number {
    const gameEvidence = this.evidence.get(gameType);
    if (!gameEvidence) return 0;
    
    const winRate = gameEvidence.filter(e => e.result === 'win').length / gameEvidence.length;
    return (winRate - 0.5) * 0.1; // Small bonus/penalty based on historical success
  }
}

interface Pattern {
  id: string;
  evidence: any;
  confidence: number;
}

interface AdaptedStrategy {
  explorationRate: number;
  learningRate: number;
  confidenceMultiplier: number;
  adjustEvaluation: (value: number, state: GameState) => number;
}

interface AdaptationStrategy {
  explorationRate: number;
  learningRate: number;
  adaptationSpeed: number;
}

interface AdaptationFactors {
  explorationMultiplier: number;
  learningMultiplier: number;
  confidenceMultiplier: number;
  evaluationMultiplier: number;
}

interface LearningEvent {
  gameType: GameType;
  performance: number;
  gameLength: number;
  timestamp: number;
}

interface TransferEvent {
  fromGame: GameType;
  toGame: GameType;
  efficiency: number;
  timestamp: number;
}

interface MetaLearningStats {
  totalGames: number;
  gameStats: { [gameType: string]: { games: number; avgPerformance: number } };
  adaptationEfficiency: number;
}

interface KnowledgeTransferReport {
  supportedGames: GameType[];
  transferConnections: Array<{from: GameType; to: GameType; strength: number}>;
  metaLearningStats: MetaLearningStats;
  knowledgeSize: number;
  transferEfficiency: number;
}

export {
  MultiGameAI,
  TransferLearningNetwork,
  MetaLearningController,
  ChessGameEngine,
  PokerGameEngine,
  GoGameEngine,
  CheckersGameEngine
};
