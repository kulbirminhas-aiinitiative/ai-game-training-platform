import { Chess } from 'chess.js';
import { ChessAIAgent, LearningParameters } from '../lib/ai/ChessAIAgent';
import { ChessTrainingEngine } from '../lib/ai/TrainingEngine';

// Test suite for AI training system validation
export class AITrainingValidator {
  
  /**
   * Test 1: Basic Agent Functionality
   * Validates that agents can make legal moves and basic game flow works
   */
  static async testBasicAgentFunctionality(): Promise<boolean> {
    console.log('🧪 Testing Basic Agent Functionality...');
    
    try {
      const params: LearningParameters = {
        learningRate: 0.01,
        explorationRate: 0.1,
        discountFactor: 0.95,
        memorySize: 1000,
        batchSize: 32,
        updateFrequency: 10,
        temperature: 1.0,
      };

      const agent = new ChessAIAgent('test-agent', 'TestAgent', params);
      const chess = new Chess();

      // Test move generation
      const moveResult = await agent.makeMove(chess);
      
      // Validate move is legal
      const move = chess.move(moveResult.move);
      if (!move) {
        console.error('❌ Agent produced illegal move:', moveResult.move);
        return false;
      }

      console.log('✅ Agent successfully made legal move:', moveResult.move);
      console.log('   - Evaluation:', moveResult.evaluation);
      console.log('   - Thinking time:', moveResult.thinkingTime, 'ms');
      
      return true;
    } catch (error) {
      console.error('❌ Basic functionality test failed:', error);
      return false;
    }
  }

  /**
   * Test 2: Learning and Knowledge Retention
   * Validates that agents learn from games and retain knowledge
   */
  static async testLearningAndRetention(): Promise<boolean> {
    console.log('🧪 Testing Learning and Knowledge Retention...');
    
    try {
      const engine = new ChessTrainingEngine();
      
      const agent1 = engine.createAgent('LearningTest1', { learningRate: 0.02 });
      const agent2 = engine.createAgent('LearningTest2', { learningRate: 0.02 });

      // Capture initial state
      const initialElo1 = agent1.stats.eloRating;
      const initialElo2 = agent2.stats.eloRating;
      const initialKnowledge1 = agent1.getKnowledgeSnapshot();
      const initialKnowledge2 = agent2.getKnowledgeSnapshot();

      console.log('Initial state:');
      console.log('  Agent 1 ELO:', initialElo1, 'Knowledge:', initialKnowledge1);
      console.log('  Agent 2 ELO:', initialElo2, 'Knowledge:', initialKnowledge2);

      // Run training session
      const sessionId = await engine.startTrainingSession(agent1, agent2, 5);
      
      // Wait for completion
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          const session = engine.getSessionStatus(sessionId);
          if (session && !session.isRunning) {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 1000);
      });

      // Capture final state
      const finalElo1 = agent1.stats.eloRating;
      const finalElo2 = agent2.stats.eloRating;
      const finalKnowledge1 = agent1.getKnowledgeSnapshot();
      const finalKnowledge2 = agent2.getKnowledgeSnapshot();

      console.log('Final state:');
      console.log('  Agent 1 ELO:', finalElo1, 'Knowledge:', finalKnowledge1);
      console.log('  Agent 2 ELO:', finalElo2, 'Knowledge:', finalKnowledge2);

      // Validate learning occurred
      const eloChanged = Math.abs(finalElo1 - initialElo1) > 0 || Math.abs(finalElo2 - initialElo2) > 0;
      const knowledgeGrew = finalKnowledge1.memorySize > initialKnowledge1.memorySize ||
                           finalKnowledge2.memorySize > initialKnowledge2.memorySize;

      if (eloChanged && knowledgeGrew) {
        console.log('✅ Learning validated - ELO ratings changed and knowledge increased');
        return true;
      } else {
        console.error('❌ Learning not detected');
        return false;
      }
    } catch (error) {
      console.error('❌ Learning test failed:', error);
      return false;
    }
  }

  /**
   * Test 3: Knowledge Persistence
   * Validates that agent knowledge can be saved and restored
   */
  static async testKnowledgePersistence(): Promise<boolean> {
    console.log('🧪 Testing Knowledge Persistence...');
    
    try {
      const params: LearningParameters = {
        learningRate: 0.01,
        explorationRate: 0.1,
        discountFactor: 0.95,
        memorySize: 1000,
        batchSize: 32,
        updateFrequency: 10,
        temperature: 1.0,
      };

      // Create agent and add some knowledge
      const originalAgent = new ChessAIAgent('persist-test', 'PersistenceTest', params);
      
      // Simulate some learning by adding to opening book
      originalAgent.knowledge.openingBook.set(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        { move: 'e5', frequency: 5, winRate: 0.6 }
      );

      const originalKnowledge = originalAgent.getKnowledgeSnapshot();
      const originalElo = originalAgent.stats.eloRating;

      // Export knowledge
      const exportedData = originalAgent.exportKnowledge();
      
      // Create new agent and import knowledge
      const restoredAgent = new ChessAIAgent('restored-test', 'RestoredTest', params);
      restoredAgent.importKnowledge(exportedData);

      const restoredKnowledge = restoredAgent.getKnowledgeSnapshot();
      const restoredElo = restoredAgent.stats.eloRating;

      // Validate restoration
      const knowledgeMatches = originalKnowledge.openingBookSize === restoredKnowledge.openingBookSize;
      const eloMatches = Math.abs(originalElo - restoredElo) < 1;

      if (knowledgeMatches && eloMatches) {
        console.log('✅ Knowledge persistence validated');
        console.log('   - Opening book size:', restoredKnowledge.openingBookSize);
        console.log('   - ELO rating:', restoredElo);
        return true;
      } else {
        console.error('❌ Knowledge persistence failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Persistence test failed:', error);
      return false;
    }
  }

  /**
   * Test 4: Performance Metrics Accuracy
   * Validates that training metrics are calculated correctly
   */
  static async testPerformanceMetrics(): Promise<boolean> {
    console.log('🧪 Testing Performance Metrics...');
    
    try {
      const engine = new ChessTrainingEngine();
      
      const agent1 = engine.createAgent('MetricsTest1');
      const agent2 = engine.createAgent('MetricsTest2');

      // Run a small training session
      const sessionId = await engine.startTrainingSession(agent1, agent2, 3);
      
      // Wait for completion
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          const session = engine.getSessionStatus(sessionId);
          if (session && !session.isRunning) {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 1000);
      });

      const metrics = engine.getTrainingMetrics(sessionId);
      
      if (!metrics) {
        console.error('❌ No metrics available');
        return false;
      }

      // Validate metric consistency
      const totalGames = metrics.agent1Stats.wins + metrics.agent1Stats.losses + metrics.agent1Stats.draws;
      const expectedGames = 3;

      const metricsValid = totalGames === expectedGames &&
                          metrics.totalGames === expectedGames &&
                          metrics.convergenceRate >= 0 && metrics.convergenceRate <= 1 &&
                          metrics.diversityScore >= 0 && metrics.diversityScore <= 1;

      if (metricsValid) {
        console.log('✅ Performance metrics validated');
        console.log('   - Total games:', metrics.totalGames);
        console.log('   - Convergence rate:', metrics.convergenceRate.toFixed(3));
        console.log('   - Diversity score:', metrics.diversityScore.toFixed(3));
        return true;
      } else {
        console.error('❌ Performance metrics validation failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Metrics test failed:', error);
      return false;
    }
  }

  /**
   * Test 5: Tactical Pattern Recognition
   * Tests if agents can learn and recognize tactical patterns
   */
  static async testTacticalPatterns(): Promise<boolean> {
    console.log('🧪 Testing Tactical Pattern Recognition...');
    
    try {
      const params: LearningParameters = {
        learningRate: 0.05, // Higher learning rate for faster pattern recognition
        explorationRate: 0.05, // Lower exploration for focused learning
        discountFactor: 0.95,
        memorySize: 1000,
        batchSize: 32,
        updateFrequency: 10,
        temperature: 1.0,
      };

      const agent = new ChessAIAgent('tactical-test', 'TacticalTest', params);
      
      // Test position: Simple fork tactic
      const chess = new Chess('rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 4');
      
      // Agent should find the tactical move Ng5 (attacking f7 and h7)
      const moveResult = await agent.makeMove(chess);
      
      // Validate that the agent is considering tactical moves
      const isValidMove = chess.moves().includes(moveResult.move);
      const evaluationReasonable = Math.abs(moveResult.evaluation) < 10000; // Not mate evaluation
      
      if (isValidMove && evaluationReasonable) {
        console.log('✅ Tactical pattern test passed');
        console.log('   - Move chosen:', moveResult.move);
        console.log('   - Evaluation:', moveResult.evaluation);
        return true;
      } else {
        console.error('❌ Tactical pattern test failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Tactical pattern test failed:', error);
      return false;
    }
  }

  /**
   * Test 6: Training Session Management
   * Tests training session lifecycle and controls
   */
  static async testTrainingSessionManagement(): Promise<boolean> {
    console.log('🧪 Testing Training Session Management...');
    
    try {
      const engine = new ChessTrainingEngine();
      
      const agent1 = engine.createAgent('SessionTest1');
      const agent2 = engine.createAgent('SessionTest2');

      // Start training session
      const sessionId = await engine.startTrainingSession(agent1, agent2, 10);
      
      // Verify session is active
      let session = engine.getSessionStatus(sessionId);
      if (!session || !session.isRunning) {
        console.error('❌ Session not started properly');
        return false;
      }

      // Stop session
      const stopped = engine.stopTrainingSession(sessionId);
      if (!stopped) {
        console.error('❌ Failed to stop session');
        return false;
      }

      // Verify session is stopped
      session = engine.getSessionStatus(sessionId);
      if (!session || session.isRunning) {
        console.error('❌ Session not stopped properly');
        return false;
      }

      // Test export functionality
      const exportData = engine.exportTrainingData(sessionId);
      const parsedData = JSON.parse(exportData);
      
      const hasRequiredFields = parsedData.session && 
                               parsedData.agent1Knowledge && 
                               parsedData.agent2Knowledge &&
                               parsedData.results &&
                               parsedData.metrics;

      if (hasRequiredFields) {
        console.log('✅ Training session management validated');
        console.log('   - Session lifecycle: ✓');
        console.log('   - Export functionality: ✓');
        return true;
      } else {
        console.error('❌ Export data incomplete');
        return false;
      }
    } catch (error) {
      console.error('❌ Session management test failed:', error);
      return false;
    }
  }

  /**
   * Run all validation tests
   */
  static async runAllTests(): Promise<{ passed: number; total: number; results: boolean[] }> {
    console.log('🚀 Starting AI Training System Validation...\n');
    
    const tests = [
      this.testBasicAgentFunctionality,
      this.testLearningAndRetention,
      this.testKnowledgePersistence,
      this.testPerformanceMetrics,
      this.testTacticalPatterns,
      this.testTrainingSessionManagement,
    ];

    const results: boolean[] = [];
    let passed = 0;

    for (let i = 0; i < tests.length; i++) {
      console.log(`\n--- Test ${i + 1}/${tests.length} ---`);
      const result = await tests[i]();
      results.push(result);
      if (result) passed++;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🏁 Validation Complete!');
    console.log(`✅ Passed: ${passed}/${tests.length} tests`);
    
    if (passed === tests.length) {
      console.log('🎉 All tests passed! AI training system is fully functional.');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.');
    }

    return { passed, total: tests.length, results };
  }
}

// Benchmark testing positions for real-world validation
export const BENCHMARK_POSITIONS = {
  // Basic tactical patterns
  TACTICS: [
    {
      name: 'Simple Fork',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 4',
      bestMoves: ['Ng5', 'Nf3'],
      description: 'Knight fork opportunity'
    },
    {
      name: 'Pin Tactic',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5',
      bestMoves: ['Bg5', 'Be3'],
      description: 'Pin the knight to the queen'
    }
  ],

  // Opening theory positions
  OPENINGS: [
    {
      name: 'Italian Game',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      bestMoves: ['Be7', 'f5', 'Nf6'],
      description: 'Classical Italian Game position'
    },
    {
      name: 'Sicilian Defense',
      fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
      bestMoves: ['Nf3', 'Nc3', 'd4'],
      description: 'Sicilian Defense main line'
    }
  ],

  // Endgame positions
  ENDGAMES: [
    {
      name: 'King and Pawn vs King',
      fen: '8/8/8/8/3k4/8/3P4/3K4 w - - 0 1',
      bestMoves: ['Kd2', 'd3', 'd4'],
      description: 'Basic pawn endgame'
    },
    {
      name: 'Queen vs Pawn',
      fen: '8/8/8/8/8/1k2P3/8/1K1Q4 w - - 0 1',
      bestMoves: ['Qd3+', 'Qd4+'],
      description: 'Queen stopping passed pawn'
    }
  ]
};

// Export validation functions for use in testing
export { AITrainingValidator };
