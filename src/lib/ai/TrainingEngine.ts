import { Chess } from 'chess.js';
import { ChessAIAgent, AgentMemory, LearningParameters } from './ChessAIAgent';
import { ChessLearningEngine, ChessBook, OnlineGameConfig } from './ChessLearningEngine';

export interface TrainingSession {
  id: string;
  agent1: ChessAIAgent;
  agent2: ChessAIAgent;
  startTime: Date;
  endTime?: Date;
  gamesPlayed: number;
  targetGames: number;
  currentGame?: Chess;
  isRunning: boolean;
  results: GameResult[];
}

export interface GameResult {
  gameId: string;
  whiteAgent: string;
  blackAgent: string;
  result: 'white' | 'black' | 'draw';
  moves: string[];
  fen: string;
  pgn: string;
  duration: number;
  whiteEvaluation: number;
  blackEvaluation: number;
  timestamp: Date;
}

export interface TrainingMetrics {
  sessionId: string;
  totalGames: number;
  agent1Stats: {
    wins: number;
    losses: number;
    draws: number;
    averageElo: number;
    learningProgress: number[];
  };
  agent2Stats: {
    wins: number;
    losses: number;
    draws: number;
    averageElo: number;
    learningProgress: number[];
  };
  convergenceRate: number;
  diversityScore: number;
  averageGameLength: number;
  totalTrainingTime: number;
}

export class ChessTrainingEngine {
  private activeSessions: Map<string, TrainingSession> = new Map();
  private gameHistory: GameResult[] = [];
  private maxHistorySize: number = 10000;
  private learningEngine: ChessLearningEngine;

  constructor() {
    this.learningEngine = new ChessLearningEngine();
  }

  public async startTrainingSession(
    agent1: ChessAIAgent,
    agent2: ChessAIAgent,
    targetGames: number = 100,
    sessionId?: string
  ): Promise<string> {
    const id = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: TrainingSession = {
      id,
      agent1,
      agent2,
      startTime: new Date(),
      gamesPlayed: 0,
      targetGames,
      isRunning: true,
      results: [],
    };

    this.activeSessions.set(id, session);
    
    // Start the training loop
    this.runTrainingLoop(session);
    
    return id;
  }

  private async runTrainingLoop(session: TrainingSession): Promise<void> {
    while (session.isRunning && session.gamesPlayed < session.targetGames) {
      try {
        // Alternate who plays white
        const whiteAgent = session.gamesPlayed % 2 === 0 ? session.agent1 : session.agent2;
        const blackAgent = session.gamesPlayed % 2 === 0 ? session.agent2 : session.agent1;
        
        const gameResult = await this.playGame(whiteAgent, blackAgent);
        session.results.push(gameResult);
        session.gamesPlayed++;
        
        // Add to global history
        this.gameHistory.push(gameResult);
        if (this.gameHistory.length > this.maxHistorySize) {
          this.gameHistory = this.gameHistory.slice(-this.maxHistorySize);
        }

        // Log progress every 10 games
        if (session.gamesPlayed % 10 === 0) {
          console.log(`Training Session ${session.id}: ${session.gamesPlayed}/${session.targetGames} games completed`);
          console.log(`Agent 1 ELO: ${session.agent1.stats.eloRating}, Agent 2 ELO: ${session.agent2.stats.eloRating}`);
        }

        // Brief pause between games for stability
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error in training session ${session.id}:`, error);
        session.isRunning = false;
      }
    }
    
    session.endTime = new Date();
    session.isRunning = false;
    console.log(`Training Session ${session.id} completed!`);
  }

  private async playGame(whiteAgent: ChessAIAgent, blackAgent: ChessAIAgent): Promise<GameResult> {
    const chess = new Chess();
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now();
    
    const gameMemory: { white: AgentMemory[]; black: AgentMemory[] } = {
      white: [],
      black: []
    };

    let moveCount = 0;
    const maxMoves = 300; // Prevent infinite games

    while (!chess.isGameOver() && moveCount < maxMoves) {
      try {
        const currentAgent = chess.turn() === 'w' ? whiteAgent : blackAgent;
        const currentColor = chess.turn();
        
        // Get the move from the current agent
        const moveResult = await currentAgent.makeMove(chess);
        
        // Record the position before making the move
        const beforePosition = chess.fen();
        
        // Make the move
        const move = chess.move(moveResult.move);
        if (!move) {
          console.error(`Invalid move: ${moveResult.move} in position: ${beforePosition}`);
          break;
        }
        
        const afterPosition = chess.fen();
        
        // Store memory for learning
        const memory: AgentMemory = {
          position: beforePosition,
          move: moveResult.move,
          reward: 0, // Will be updated based on game outcome
          nextPosition: afterPosition,
          gameOutcome: 'draw', // Will be updated
          evaluation: moveResult.evaluation,
        };
        
        if (currentColor === 'w') {
          gameMemory.white.push(memory);
        } else {
          gameMemory.black.push(memory);
        }
        
        moveCount++;
        
      } catch (error) {
        console.error(`Error during move ${moveCount}:`, error);
        break;
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Determine game result
    let result: 'white' | 'black' | 'draw';
    let whiteOutcome: 'win' | 'loss' | 'draw';
    let blackOutcome: 'win' | 'loss' | 'draw';

    if (chess.isCheckmate()) {
      if (chess.turn() === 'b') {
        result = 'white';
        whiteOutcome = 'win';
        blackOutcome = 'loss';
      } else {
        result = 'black';
        whiteOutcome = 'loss';
        blackOutcome = 'win';
      }
    } else {
      result = 'draw';
      whiteOutcome = 'draw';
      blackOutcome = 'draw';
    }

    // Update memory with final game outcomes
    gameMemory.white.forEach(memory => {
      memory.gameOutcome = whiteOutcome;
      memory.reward = whiteOutcome === 'win' ? 1 : whiteOutcome === 'loss' ? -1 : 0;
    });
    
    gameMemory.black.forEach(memory => {
      memory.gameOutcome = blackOutcome;
      memory.reward = blackOutcome === 'win' ? 1 : blackOutcome === 'loss' ? -1 : 0;
    });

    // Let agents learn from the game
    whiteAgent.recordGameResult(whiteOutcome, gameMemory.white);
    blackAgent.recordGameResult(blackOutcome, gameMemory.black);

    const gameResult: GameResult = {
      gameId,
      whiteAgent: whiteAgent.name,
      blackAgent: blackAgent.name,
      result,
      moves: chess.history(),
      fen: chess.fen(),
      pgn: chess.pgn(),
      duration,
      whiteEvaluation: whiteAgent.stats.eloRating,
      blackEvaluation: blackAgent.stats.eloRating,
      timestamp: new Date(),
    };

    return gameResult;
  }

  public stopTrainingSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (session && session.isRunning) {
      session.isRunning = false;
      session.endTime = new Date();
      return true;
    }
    return false;
  }

  public getTrainingMetrics(sessionId: string): TrainingMetrics | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const agent1Results = session.results.filter(r => 
      (r.whiteAgent === session.agent1.name && r.result === 'white') ||
      (r.blackAgent === session.agent1.name && r.result === 'black') ||
      r.result === 'draw'
    );

    const agent2Results = session.results.filter(r => 
      (r.whiteAgent === session.agent2.name && r.result === 'white') ||
      (r.blackAgent === session.agent2.name && r.result === 'black') ||
      r.result === 'draw'
    );

    const agent1Wins = agent1Results.filter(r => 
      (r.whiteAgent === session.agent1.name && r.result === 'white') ||
      (r.blackAgent === session.agent1.name && r.result === 'black')
    ).length;

    const agent2Wins = agent2Results.filter(r => 
      (r.whiteAgent === session.agent2.name && r.result === 'white') ||
      (r.blackAgent === session.agent2.name && r.result === 'black')
    ).length;

    const draws = session.results.filter(r => r.result === 'draw').length;

    const averageGameLength = session.results.length > 0 
      ? session.results.reduce((sum, game) => sum + game.moves.length, 0) / session.results.length
      : 0;

    const totalTrainingTime = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime()
      : Date.now() - session.startTime.getTime();

    // Calculate convergence rate (how much the ELO ratings are stabilizing)
    const recentProgress1 = session.agent1.stats.learningProgress.slice(-10);
    const recentProgress2 = session.agent2.stats.learningProgress.slice(-10);
    const convergenceRate = this.calculateConvergenceRate(recentProgress1, recentProgress2);

    // Calculate diversity score (variety in game outcomes and lengths)
    const diversityScore = this.calculateDiversityScore(session.results);

    return {
      sessionId,
      totalGames: session.gamesPlayed,
      agent1Stats: {
        wins: agent1Wins,
        losses: session.gamesPlayed - agent1Wins - draws,
        draws: draws,
        averageElo: session.agent1.stats.eloRating,
        learningProgress: session.agent1.stats.learningProgress,
      },
      agent2Stats: {
        wins: agent2Wins,
        losses: session.gamesPlayed - agent2Wins - draws,
        draws: draws,
        averageElo: session.agent2.stats.eloRating,
        learningProgress: session.agent2.stats.learningProgress,
      },
      convergenceRate,
      diversityScore,
      averageGameLength,
      totalTrainingTime,
    };
  }

  private calculateConvergenceRate(progress1: number[], progress2: number[]): number {
    if (progress1.length < 2 || progress2.length < 2) return 0;
    
    const variance1 = this.calculateVariance(progress1);
    const variance2 = this.calculateVariance(progress2);
    
    // Lower variance indicates better convergence
    return Math.max(0, 1 - (variance1 + variance2) / 2000); // Normalized to 0-1
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private calculateDiversityScore(results: GameResult[]): number {
    if (results.length === 0) return 0;
    
    const outcomes = results.map(r => r.result);
    const uniqueOutcomes = new Set(outcomes).size;
    const maxOutcomes = 3; // white, black, draw
    
    const lengths = results.map(r => r.moves.length);
    const lengthVariance = this.calculateVariance(lengths);
    
    // Combine outcome diversity and length diversity
    const outcomeDiversity = uniqueOutcomes / maxOutcomes;
    const lengthDiversity = Math.min(1, lengthVariance / 1000); // Normalize
    
    return (outcomeDiversity + lengthDiversity) / 2;
  }

  public getActiveSessionIds(): string[] {
    return Array.from(this.activeSessions.keys()).filter(id => 
      this.activeSessions.get(id)?.isRunning
    );
  }

  public getSessionStatus(sessionId: string): TrainingSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  public getRecentGames(limit: number = 10): GameResult[] {
    return this.gameHistory.slice(-limit);
  }

  public exportTrainingData(sessionId: string): string {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    return JSON.stringify({
      session: {
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        gamesPlayed: session.gamesPlayed,
        targetGames: session.targetGames,
      },
      agent1Knowledge: session.agent1.exportKnowledge(),
      agent2Knowledge: session.agent2.exportKnowledge(),
      results: session.results,
      metrics: this.getTrainingMetrics(sessionId),
    });
  }

  public createAgent(
    name: string,
    learningParams?: Partial<LearningParameters>,
    initialElo: number = 1500
  ): ChessAIAgent {
    const defaultParams: LearningParameters = {
      learningRate: 0.01,
      explorationRate: 0.1,
      discountFactor: 0.95,
      memorySize: 10000,
      batchSize: 32,
      updateFrequency: 10,
      temperature: 1.0,
    };

    const finalParams = { ...defaultParams, ...learningParams };
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    return new ChessAIAgent(agentId, name, finalParams, initialElo);
  }

  public saveAgentToStorage(agent: ChessAIAgent): void {
    if (typeof window !== 'undefined') {
      const knowledgeData = agent.exportKnowledge();
      localStorage.setItem(`chess_agent_${agent.id}`, knowledgeData);
    }
  }

  public loadAgentFromStorage(agentId: string): ChessAIAgent | null {
    if (typeof window !== 'undefined') {
      const knowledgeData = localStorage.getItem(`chess_agent_${agentId}`);
      if (knowledgeData) {
        const data = JSON.parse(knowledgeData);
        const agent = new ChessAIAgent(data.id, data.name, data.learningParams, data.stats.eloRating);
        agent.importKnowledge(knowledgeData);
        return agent;
      }
    }
    return null;
  }

  public listStoredAgents(): string[] {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith('chess_agent_')).map(key => key.replace('chess_agent_', ''));
    }
    return [];
  }

  /**
   * Load chess literature for agent learning
   */
  public async loadChessBook(book: ChessBook): Promise<void> {
    await this.learningEngine.loadChessBook(book);
  }

  /**
   * Load PGN database for training
   */
  public async loadPGNDatabase(pgnData: string, source: string = 'database'): Promise<number> {
    return await this.learningEngine.loadPGNDatabase(pgnData, source);
  }

  /**
   * Train agent from chess literature
   */
  public async trainFromLiterature(
    agent: ChessAIAgent, 
    options: {
      focusAreas?: ('openings' | 'middlegame' | 'endgames' | 'tactics')[];
      maxGames?: number;
      minRating?: number;
      timeControl?: string;
    } = {}
  ): Promise<void> {
    console.log(`📚 Starting literature training for ${agent.name}...`);
    await this.learningEngine.trainFromLiterature(agent, options);
    
    // Save updated agent knowledge
    this.saveAgentToStorage(agent);
  }

  /**
   * Configure agent for online play
   */
  public configureOnlinePlay(agent: ChessAIAgent, config: OnlineGameConfig): void {
    this.learningEngine.configureOnlinePlay(agent.id, config);
  }

  /**
   * Enable agent to play online games
   */
  public async playOnlineGame(
    agent: ChessAIAgent, 
    options: {
      platform?: 'lichess' | 'chess.com' | 'fics';
      timeControl?: { initial: number; increment: number };
      rated?: boolean;
      numberOfGames?: number;
    } = {}
  ): Promise<string[]> {
    const { numberOfGames = 1, ...gameOptions } = options;
    const gameIds: string[] = [];
    
    console.log(`🌐 ${agent.name} starting ${numberOfGames} online game(s)...`);
    
    for (let i = 0; i < numberOfGames; i++) {
      try {
        const gameId = await this.learningEngine.playOnlineGame(agent, gameOptions);
        gameIds.push(gameId);
        
        // Add delay between games
        if (i < numberOfGames - 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error(`Failed to play online game ${i + 1}:`, error);
      }
    }
    
    // Save updated agent with online experience
    this.saveAgentToStorage(agent);
    
    return gameIds;
  }

  /**
   * Get literature training session for agents
   */
  public async startLiteratureTrainingSession(
    agents: ChessAIAgent[],
    trainingPlan: {
      books: ChessBook[];
      pgnDatabases: { data: string; source: string }[];
      focusAreas: ('openings' | 'middlegame' | 'endgames' | 'tactics')[];
      rounds: number;
    }
  ): Promise<string> {
    const sessionId = `literature_session_${Date.now()}`;
    console.log(`📖 Starting literature training session: ${sessionId}`);
    
    // Load all books and databases
    for (const book of trainingPlan.books) {
      await this.loadChessBook(book);
    }
    
    for (const db of trainingPlan.pgnDatabases) {
      await this.loadPGNDatabase(db.data, db.source);
    }
    
    // Train each agent from literature
    for (const agent of agents) {
      await this.trainFromLiterature(agent, {
        focusAreas: trainingPlan.focusAreas,
        maxGames: 1000,
        minRating: 2000
      });
    }
    
    // Run training games between literature-trained agents
    if (agents.length >= 2) {
      for (let round = 0; round < trainingPlan.rounds; round++) {
        console.log(`🎭 Literature training round ${round + 1}/${trainingPlan.rounds}`);
        
        for (let i = 0; i < agents.length; i++) {
          for (let j = i + 1; j < agents.length; j++) {
            await this.playGame(agents[i], agents[j]); // Literature training games
          }
        }
      }
    }
    
    console.log(`✅ Literature training session ${sessionId} completed`);
    return sessionId;
  }

  /**
   * Create a comprehensive training program
   */
  public async createMasterTrainingProgram(
    agent: ChessAIAgent,
    program: {
      phase1: { books: ChessBook[]; games: number };
      phase2: { onlinePlatforms: string[]; gamesPerPlatform: number };
      phase3: { tournamentRounds: number; opponents: ChessAIAgent[] };
    }
  ): Promise<void> {
    console.log(`🎓 Starting Master Training Program for ${agent.name}`);
    
    // Phase 1: Literature Study
    console.log('📚 Phase 1: Literature Study');
    for (const book of program.phase1.books) {
      await this.loadChessBook(book);
    }
    
    await this.trainFromLiterature(agent, {
      focusAreas: ['openings', 'middlegame', 'endgames', 'tactics'],
      maxGames: program.phase1.games,
      minRating: 2200
    });
    
    // Phase 2: Online Experience
    console.log('🌐 Phase 2: Online Experience');
    for (const platform of program.phase2.onlinePlatforms) {
      this.configureOnlinePlay(agent, {
        platform: platform as 'lichess' | 'chess.com' | 'fics',
        username: `${agent.name}_bot`,
        timeControl: { initial: 600, increment: 5 }
      });
      
      await this.playOnlineGame(agent, {
        platform: platform as 'lichess' | 'chess.com' | 'fics',
        numberOfGames: program.phase2.gamesPerPlatform,
        rated: true
      });
    }
    
    // Phase 3: Tournament Play
    console.log('🏆 Phase 3: Tournament Training');
    for (let round = 0; round < program.phase3.tournamentRounds; round++) {
      console.log(`Tournament Round ${round + 1}/${program.phase3.tournamentRounds}`);
      
      for (const opponent of program.phase3.opponents) {
        const result = await this.playGame(agent, opponent);
        console.log(`${agent.name} vs ${opponent.name}: ${result.result}`);
      }
    }
    
    console.log(`🎉 Master Training Program completed for ${agent.name}!`);
    console.log(`Final Rating: ${agent.stats.eloRating}`);
    console.log(`Knowledge Summary:`, agent.getKnowledgeSummary());
  }

  /**
   * Get learning engine statistics
   */
  public getLearningStats() {
    return this.learningEngine.getLearningStats();
  }
}
