import { ChessAIAgent } from '../lib/ai/ChessAIAgent';
import { ChessTrainingEngine } from '../lib/ai/TrainingEngine';
import { ChessLearningEngine } from '../lib/ai/ChessLearningEngine';
import { chessLiteratureLibrary, getMasterGamesPGN, createMasterTrainingProgram } from '../lib/data/chessLiterature';

/**
 * Enhanced AI Chess Training Demo
 * Demonstrates literature learning, online play, and comprehensive training
 */

async function runEnhancedTrainingDemo() {
  console.log('🚀 Starting Enhanced AI Chess Training Demo');
  console.log('=' .repeat(60));

  // Initialize the training system
  const trainingEngine = new ChessTrainingEngine();
  const learningEngine = new ChessLearningEngine();

  // Create AI agents with different specializations
  const agents = [
    new ChessAIAgent('magnus_ai', 'Magnus AI - Literature Scholar', {
      learningRate: 0.1,
      explorationRate: 0.3,
      discountFactor: 0.95,
      memorySize: 50000,
      batchSize: 32,
      updateFrequency: 100,
      temperature: 1.0
    }, 1800),
    
    new ChessAIAgent('kasparov_ai', 'Kasparov AI - Online Warrior', {
      learningRate: 0.15,
      explorationRate: 0.25,
      discountFactor: 0.9,
      memorySize: 75000,
      batchSize: 64,
      updateFrequency: 50,
      temperature: 0.8
    }, 1750),
    
    new ChessAIAgent('fischer_ai', 'Fischer AI - Master Student', {
      learningRate: 0.12,
      explorationRate: 0.2,
      discountFactor: 0.92,
      memorySize: 60000,
      batchSize: 48,
      updateFrequency: 75,
      temperature: 0.9
    }, 1775)
  ];

  console.log(`\n📋 Created ${agents.length} AI agents:`);
  agents.forEach(agent => {
    console.log(`  • ${agent.name} (Rating: ${agent.stats.eloRating})`);
  });

  // Phase 1: Literature Study
  console.log('\n📚 PHASE 1: LITERATURE STUDY');
  console.log('-' .repeat(40));

  // Load chess books into the learning engine
  console.log('\n📖 Loading chess literature...');
  for (const book of chessLiteratureLibrary.slice(0, 3)) {
    await trainingEngine.loadChessBook(book);
    console.log(`✅ Loaded "${book.title}" by ${book.author}`);
    console.log(`   📊 ${book.games.length} games, ${book.openings.length} openings, ${book.tactics.length} tactics`);
  }

  // Load PGN database
  console.log('\n💾 Loading master games database...');
  const masterPGN = getMasterGamesPGN();
  const gamesLoaded = await trainingEngine.loadPGNDatabase(masterPGN, 'Master Games Collection');
  console.log(`✅ Loaded ${gamesLoaded} master games from PGN database`);

  // Train agents from literature
  console.log('\n🎓 Training agents from chess literature...');
  for (const agent of agents) {
    console.log(`\n📚 Training ${agent.name}...`);
    
    await trainingEngine.trainFromLiterature(agent, {
      focusAreas: ['openings', 'middlegame', 'endgames', 'tactics'],
      maxGames: 200,
      minRating: 2000
    });

    // Demonstrate individual book learning
    const sampleBook = chessLiteratureLibrary[0]; // "My System"
    agent.learnFromBook(sampleBook.title, {
      games: sampleBook.games.slice(0, 20),
      openings: sampleBook.openings,
      endgames: sampleBook.endgames
    });

    const knowledge = agent.getKnowledgeSummary();
    console.log(`📊 ${agent.name} Knowledge Summary:`);
    console.log(`   📚 Books Studied: ${knowledge.literature.booksStudied}`);
    console.log(`   🎯 Master Games: ${knowledge.literature.masterGamesAnalyzed}`);
    console.log(`   ♞ Opening Theory: ${knowledge.literature.openingTheoryKnown}`);
    console.log(`   👑 Endgame Studies: ${knowledge.literature.endgameStudies}`);
  }

  // Phase 2: Online Experience Simulation
  console.log('\n\n🌐 PHASE 2: ONLINE EXPERIENCE');
  console.log('-' .repeat(40));

  // Configure online play for agents
  console.log('\n⚙️ Configuring online platforms...');
  const platforms = ['lichess', 'chess.com', 'fics'];
  
  for (const agent of agents) {
    for (const platform of platforms) {
      trainingEngine.configureOnlinePlay(agent, {
        platform: platform as 'lichess' | 'chess.com' | 'fics',
        username: `${agent.name.toLowerCase().replace(/\s+/g, '_')}_bot`,
        timeControl: { initial: 600, increment: 5 }, // 10+5 games
        rating: agent.stats.eloRating
      });
    }
    console.log(`✅ Configured online play for ${agent.name}`);
  }

  // Simulate online games
  console.log('\n🎮 Simulating online games...');
  for (const agent of agents.slice(0, 2)) { // Limit to 2 agents for demo
    console.log(`\n🌐 ${agent.name} playing online...`);
    
    // Play games on different platforms
    for (const platform of platforms.slice(0, 2)) { // Limit to 2 platforms
      const gameIds = await trainingEngine.playOnlineGame(agent, {
        platform: platform as 'lichess' | 'chess.com' | 'fics',
        numberOfGames: 3,
        rated: true
      });
      
      console.log(`  ${platform}: Played ${gameIds.length} games`);
      
      // Simulate recording game experience
      agent.recordOnlineGame(
        platform,
        'Human Opponent',
        1800 + Math.floor(Math.random() * 400),
        Math.random() > 0.5 ? 'win' : 'loss',
        ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], // Sample moves
        ['Learned to handle time pressure', 'Improved tactical vision']
      );
    }

    const onlineStats = agent.getKnowledgeSummary().onlineExperience;
    console.log(`📊 ${agent.name} Online Stats:`);
    console.log(`   🎮 Games Played: ${onlineStats.gamesPlayed}`);
    console.log(`   🏆 Win Rate: ${(onlineStats.overallWinRate * 100).toFixed(1)}%`);
    console.log(`   📈 Avg Opponent Rating: ${onlineStats.averageOpponentRating}`);
  }

  // Phase 3: Literature-Enhanced Training Games
  console.log('\n\n🎯 PHASE 3: ENHANCED TRAINING SESSIONS');
  console.log('-' .repeat(40));

  // Create comprehensive training program
  console.log('\n🎓 Starting Master Training Program...');
  const masterProgram = createMasterTrainingProgram();
  
  // Run a literature training session
  const literatureSession = await trainingEngine.startLiteratureTrainingSession(
    agents,
    {
      books: chessLiteratureLibrary.slice(0, 2),
      pgnDatabases: [{ data: masterPGN, source: 'Masters Database' }],
      focusAreas: ['openings', 'tactics', 'endgames'],
      rounds: 2
    }
  );
  
  console.log(`✅ Literature training session completed: ${literatureSession}`);

  // Run comprehensive master training for one agent
  console.log(`\n🏆 Running Master Training Program for ${agents[0].name}...`);
  await trainingEngine.createMasterTrainingProgram(agents[0], {
    phase1: { books: chessLiteratureLibrary.slice(0, 2), games: 100 },
    phase2: { onlinePlatforms: ['lichess'], gamesPerPlatform: 5 },
    phase3: { tournamentRounds: 2, opponents: agents.slice(1) }
  });

  // Phase 4: Analysis and Results
  console.log('\n\n📊 PHASE 4: ANALYSIS & RESULTS');
  console.log('-' .repeat(40));

  console.log('\n🏅 Final Agent Ratings and Knowledge:');
  agents.forEach((agent, index) => {
    const knowledge = agent.getKnowledgeSummary();
    console.log(`\n${index + 1}. ${agent.name}`);
    console.log(`   📈 ELO Rating: ${agent.stats.eloRating}`);
    console.log(`   🧠 Total Knowledge: ${knowledge.totalKnowledge.toLocaleString()}`);
    console.log(`   📚 Literature Knowledge:`);
    console.log(`      • Books Studied: ${knowledge.literature.booksStudied}`);
    console.log(`      • Master Games: ${knowledge.literature.masterGamesAnalyzed}`);
    console.log(`      • Opening Theory: ${knowledge.literature.openingTheoryKnown}`);
    console.log(`      • Endgame Studies: ${knowledge.literature.endgameStudies}`);
    console.log(`   🌐 Online Experience:`);
    console.log(`      • Games Played: ${knowledge.onlineExperience.gamesPlayed}`);
    console.log(`      • Platforms: ${knowledge.onlineExperience.platforms.join(', ')}`);
    console.log(`      • Win Rate: ${(knowledge.onlineExperience.overallWinRate * 100).toFixed(1)}%`);
    console.log(`      • Avg Opponent: ${knowledge.onlineExperience.averageOpponentRating}`);
  });

  // Learning engine statistics
  console.log('\n📈 Learning Engine Statistics:');
  const learningStats = trainingEngine.getLearningStats();
  console.log(`   📚 Books Loaded: ${learningStats.booksLoaded}`);
  console.log(`   🎮 Games in Database: ${learningStats.gamesInDatabase}`);
  console.log(`   ♞ Opening Positions: ${learningStats.openingPositions}`);
  console.log(`   ⚔️ Tactical Patterns: ${learningStats.tacticalPatterns}`);
  console.log(`   👑 Endgame Studies: ${learningStats.endgameStudies}`);

  // Demonstrate head-to-head competition
  console.log('\n⚔️ HEAD-TO-HEAD COMPETITION');
  console.log('-' .repeat(40));
  
  console.log('\n🥊 Literature-trained agents compete:');
  const finalSession = await trainingEngine.startTrainingSession(
    agents[0], // Magnus AI - Literature Scholar
    agents[1], // Kasparov AI - Online Warrior
    5 // 5 games
  );

  // Wait for a few games to complete
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const sessionStatus = trainingEngine.getSessionStatus(finalSession);
  console.log(`📊 Competition Results (${sessionStatus.gamesPlayed} games completed):`);
  console.log(`   ${agents[0].name}: ${sessionStatus.results.filter(r => r.winner === agents[0].id).length} wins`);
  console.log(`   ${agents[1].name}: ${sessionStatus.results.filter(r => r.winner === agents[1].id).length} wins`);
  console.log(`   Draws: ${sessionStatus.results.filter(r => r.result === 'draw').length}`);

  console.log('\n🎉 ENHANCED AI TRAINING DEMO COMPLETED!');
  console.log('=' .repeat(60));
  console.log('\n✨ Key Achievements:');
  console.log('   📚 Agents learned from classic chess literature');
  console.log('   🌐 Simulated online gaming experience');
  console.log('   🧠 Knowledge retention and application');
  console.log('   📊 Comprehensive performance tracking');
  console.log('   🏆 Multi-phase training programs');
  console.log('\n💡 The AI agents can now:');
  console.log('   • Study chess books and master games');
  console.log('   • Play online against human opponents');
  console.log('   • Retain and apply learned knowledge');
  console.log('   • Adapt strategies based on experience');
  console.log('   • Measure and track learning progress');
  
  return {
    agents,
    trainingEngine,
    learningEngine,
    finalResults: {
      sessionId: finalSession,
      learningStats
    }
  };
}

// Export the demo function
export { runEnhancedTrainingDemo };

// Run demo if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runEnhancedTrainingDemo()
    .then((results) => {
      console.log('\n🎯 Demo completed successfully!');
      console.log(`📊 Final session: ${results.finalResults.sessionId}`);
    })
    .catch((error) => {
      console.error('❌ Demo failed:', error);
    });
}
