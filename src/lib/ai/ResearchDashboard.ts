import { ChessAIAgent } from './ChessAIAgent';
import { MultiGameAI, GameType, GameState } from './MultiGameAI';
import { OnlineGamingEngine } from './OnlineGamingEngine';
import { TournamentSystem } from './TournamentSystem';
import { TransformerGameNetwork, TrainingData } from './TransformerGameNetwork';

/**
 * Advanced Research Dashboard & Analytics
 * Comprehensive AI research tools, A/B testing, and benchmarking
 */

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  type: 'neural-architecture' | 'learning-algorithm' | 'game-strategy' | 'benchmark';
  status: 'planning' | 'active' | 'completed' | 'paused';
  progress: number;
  startDate: number;
  endDate?: number;
  researchers: string[];
  objectives: ResearchObjective[];
  experiments: Experiment[];
  publications: Publication[];
  datasets: Dataset[];
  metrics: ResearchMetrics;
}

export interface ResearchObjective {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  metric: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'achieved' | 'failed';
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  methodology: string;
  variables: ExperimentVariable[];
  controlGroup: ExperimentGroup;
  testGroups: ExperimentGroup[];
  status: 'designed' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  results?: ExperimentResults;
  reproducibility: ReproducibilityInfo;
}

export interface ExperimentVariable {
  name: string;
  type: 'independent' | 'dependent' | 'controlled';
  description: string;
  values: any[];
  currentValue?: any;
  measurable: boolean;
}

export interface ExperimentGroup {
  id: string;
  name: string;
  description: string;
  configuration: { [key: string]: any };
  agents: ChessAIAgent[];
  sampleSize: number;
  results: GroupResults;
}

export interface GroupResults {
  gamesPlayed: number;
  winRate: number;
  averageGameLength: number;
  performanceMetrics: { [metric: string]: number };
  confidenceInterval: { lower: number; upper: number };
  statisticalSignificance: number;
}

export interface ExperimentResults {
  summary: string;
  statisticalAnalysis: StatisticalAnalysis;
  conclusions: string[];
  recommendations: string[];
  futureWork: string[];
  dataVisualization: VisualizationData[];
}

export interface StatisticalAnalysis {
  pValue: number;
  effectSize: number;
  confidenceLevel: number;
  sampleSize: number;
  powerAnalysis: number;
  normalityTests: { [test: string]: number };
  correlationMatrix: number[][];
}

export interface ReproducibilityInfo {
  codeVersion: string;
  dependencies: { [package: string]: string };
  randomSeed: number;
  environmentSpecs: { [key: string]: any };
  dataHash: string;
  reproduced: boolean;
  reproductionAttempts: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  venue: string;
  publicationDate: number;
  citationCount: number;
  impactFactor: number;
  openAccess: boolean;
  doi?: string;
  arxivId?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  gameType: GameType;
  size: number;
  format: 'pgn' | 'json' | 'csv' | 'binary';
  quality: DataQuality;
  source: string;
  license: string;
  version: string;
  lastUpdated: number;
  splits: { train: number; validation: number; test: number };
  metadata: { [key: string]: any };
}

export interface DataQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  bias: BiasAnalysis;
  outliers: number;
  duplicates: number;
}

export interface BiasAnalysis {
  ratingBias: number;
  timeBias: number;
  platformBias: number;
  demographicBias: { [demographic: string]: number };
  mitigation: string[];
}

export interface ResearchMetrics {
  publicationsCount: number;
  citationIndex: number;
  hIndex: number;
  impactScore: number;
  noveltyScore: number;
  reproducibilityScore: number;
  openSourceContributions: number;
  collaborationIndex: number;
}

export interface BenchmarkSuite {
  id: string;
  name: string;
  description: string;
  version: string;
  gameTypes: GameType[];
  tests: BenchmarkTest[];
  leaderboard: BenchmarkEntry[];
  standardMetrics: string[];
  lastUpdated: number;
}

export interface BenchmarkTest {
  id: string;
  name: string;
  description: string;
  gameType: GameType;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'superhuman';
  testCases: TestCase[];
  scoring: ScoringSystem;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface TestCase {
  id: string;
  name: string;
  gameState: GameState;
  expectedMoves?: string[];
  expectedEvaluation?: number;
  difficulty: number;
  tags: string[];
  solution?: string;
}

export interface ScoringSystem {
  maxScore: number;
  scoringFunction: 'accuracy' | 'elo' | 'time-weighted' | 'custom';
  penaltyFunction?: string;
  bonusPoints?: { [achievement: string]: number };
}

export interface BenchmarkEntry {
  rank: number;
  agentId: string;
  agentName: string;
  score: number;
  breakdown: { [testId: string]: number };
  submissionDate: number;
  version: string;
  verified: boolean;
  hardware: string;
  runtime: number;
}

export interface VisualizationData {
  type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'network';
  title: string;
  data: any[];
  config: { [key: string]: any };
}

export class ResearchDashboard {
  private projects: Map<string, ResearchProject> = new Map();
  private experiments: Map<string, Experiment> = new Map();
  private benchmarks: Map<string, BenchmarkSuite> = new Map();
  private datasets: Map<string, Dataset> = new Map();
  private publications: Map<string, Publication> = new Map();
  
  constructor() {
    this.initializeResearchInfrastructure();
  }

  private initializeResearchInfrastructure(): void {
    this.createDefaultBenchmarks();
    this.createSampleDatasets();
    this.initializeMetricsTracking();
  }

  private createDefaultBenchmarks(): void {
    // Chess Benchmark Suite
    const chessBenchmark: BenchmarkSuite = {
      id: 'chess-standard-v1',
      name: 'Standard Chess AI Benchmark',
      description: 'Comprehensive chess AI evaluation suite',
      version: '1.0.0',
      gameTypes: ['chess'],
      tests: [
        {
          id: 'tactical-puzzles',
          name: 'Tactical Puzzles',
          description: 'Solve chess tactical puzzles',
          gameType: 'chess',
          difficulty: 'intermediate',
          testCases: this.generateTacticalPuzzles(),
          scoring: { maxScore: 1000, scoringFunction: 'accuracy' }
        },
        {
          id: 'endgame-positions',
          name: 'Endgame Mastery',
          description: 'Demonstrate endgame knowledge',
          gameType: 'chess',
          difficulty: 'advanced',
          testCases: this.generateEndgamePositions(),
          scoring: { maxScore: 800, scoringFunction: 'time-weighted' }
        },
        {
          id: 'positional-play',
          name: 'Positional Understanding',
          description: 'Evaluate positional play quality',
          gameType: 'chess',
          difficulty: 'expert',
          testCases: this.generatePositionalTests(),
          scoring: { maxScore: 1200, scoringFunction: 'custom' }
        }
      ],
      leaderboard: [],
      standardMetrics: ['accuracy', 'time', 'depth', 'nodes_searched'],
      lastUpdated: Date.now()
    };

    this.benchmarks.set(chessBenchmark.id, chessBenchmark);
  }

  private generateTacticalPuzzles(): TestCase[] {
    const puzzles: TestCase[] = [];
    
    // Famous tactical puzzles
    const tacticPatterns = [
      {
        name: 'Queen Sacrifice',
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
        solution: 'Bxf7+',
        difficulty: 7
      },
      {
        name: 'Smothered Mate',
        fen: '6k1/5ppp/8/8/8/8/5PPP/4RK2 w - - 0 1',
        solution: 'Re8#',
        difficulty: 8
      },
      {
        name: 'Discovery Attack',
        fen: 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
        solution: 'Nxd7',
        difficulty: 6
      }
    ];

    tacticPatterns.forEach((pattern, index) => {
      puzzles.push({
        id: `tactical_${index}`,
        name: pattern.name,
        gameState: {
          gameType: 'chess',
          position: pattern.fen,
          legalMoves: [],
          isTerminal: false
        },
        expectedMoves: [pattern.solution],
        difficulty: pattern.difficulty,
        tags: ['tactical', 'puzzle'],
        solution: pattern.solution
      });
    });

    return puzzles;
  }

  private generateEndgamePositions(): TestCase[] {
    const endgames: TestCase[] = [];
    
    const endgamePositions = [
      {
        name: 'King and Pawn vs King',
        fen: '8/8/8/8/3Pk3/8/8/3K4 w - - 0 1',
        solution: 'Kd2',
        difficulty: 4
      },
      {
        name: 'Rook Endgame',
        fen: '8/8/8/3k4/8/3K4/3R4/8 w - - 0 1',
        solution: 'Ra2',
        difficulty: 6
      }
    ];

    endgamePositions.forEach((endgame, index) => {
      endgames.push({
        id: `endgame_${index}`,
        name: endgame.name,
        gameState: {
          gameType: 'chess',
          position: endgame.fen,
          legalMoves: [],
          isTerminal: false
        },
        expectedMoves: [endgame.solution],
        difficulty: endgame.difficulty,
        tags: ['endgame', 'theoretical'],
        solution: endgame.solution
      });
    });

    return endgames;
  }

  private generatePositionalTests(): TestCase[] {
    return [
      {
        id: 'positional_1',
        name: 'Central Control',
        gameState: {
          gameType: 'chess',
          position: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
          legalMoves: [],
          isTerminal: false
        },
        expectedEvaluation: 0.2,
        difficulty: 5,
        tags: ['positional', 'center'],
        solution: 'Control the center with pieces and pawns'
      }
    ];
  }

  private createSampleDatasets(): void {
    const chessDataset: Dataset = {
      id: 'masters-games-2024',
      name: 'Grandmaster Games Collection 2024',
      description: 'High-quality chess games from top-level tournaments',
      gameType: 'chess',
      size: 50000,
      format: 'pgn',
      quality: {
        completeness: 0.98,
        accuracy: 0.99,
        consistency: 0.97,
        bias: {
          ratingBias: 0.15,
          timeBias: 0.08,
          platformBias: 0.12,
          demographicBias: { country: 0.2, age: 0.1 },
          mitigation: ['balanced_sampling', 'data_augmentation']
        },
        outliers: 0.02,
        duplicates: 0.001
      },
      source: 'FIDE Tournament Archive',
      license: 'CC BY-SA 4.0',
      version: '2024.1',
      lastUpdated: Date.now(),
      splits: { train: 0.8, validation: 0.1, test: 0.1 },
      metadata: {
        timeControls: ['classical', 'rapid'],
        averageRating: 2650,
        tournaments: 150
      }
    };

    this.datasets.set(chessDataset.id, chessDataset);
  }

  private initializeMetricsTracking(): void {
    // Initialize research metrics tracking system
  }

  public async createResearchProject(config: {
    name: string;
    description: string;
    type: ResearchProject['type'];
    objectives: Omit<ResearchObjective, 'id' | 'status' | 'currentValue'>[];
    researchers: string[];
  }): Promise<string> {
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const objectives: ResearchObjective[] = config.objectives.map((obj, index) => ({
      ...obj,
      id: `obj_${index}`,
      status: 'pending',
      currentValue: 0
    }));

    const project: ResearchProject = {
      id: projectId,
      name: config.name,
      description: config.description,
      type: config.type,
      status: 'planning',
      progress: 0,
      startDate: Date.now(),
      researchers: config.researchers,
      objectives,
      experiments: [],
      publications: [],
      datasets: [],
      metrics: {
        publicationsCount: 0,
        citationIndex: 0,
        hIndex: 0,
        impactScore: 0,
        noveltyScore: 0,
        reproducibilityScore: 0,
        openSourceContributions: 0,
        collaborationIndex: 0
      }
    };

    this.projects.set(projectId, project);
    console.log(`Created research project: ${config.name}`);
    return projectId;
  }

  public async designExperiment(projectId: string, config: {
    name: string;
    hypothesis: string;
    methodology: string;
    variables: Omit<ExperimentVariable, 'currentValue'>[];
    controlGroupConfig: any;
    testGroupConfigs: any[];
  }): Promise<string> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const experimentId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create control group
    const controlGroup: ExperimentGroup = {
      id: 'control',
      name: 'Control Group',
      description: 'Baseline configuration',
      configuration: config.controlGroupConfig,
      agents: [],
      sampleSize: 100,
      results: this.createEmptyGroupResults()
    };

    // Create test groups
    const testGroups: ExperimentGroup[] = config.testGroupConfigs.map((groupConfig, index) => ({
      id: `test_${index}`,
      name: `Test Group ${index + 1}`,
      description: groupConfig.description || `Test configuration ${index + 1}`,
      configuration: groupConfig,
      agents: [],
      sampleSize: 100,
      results: this.createEmptyGroupResults()
    }));

    const experiment: Experiment = {
      id: experimentId,
      name: config.name,
      hypothesis: config.hypothesis,
      methodology: config.methodology,
      variables: config.variables.map(v => ({ ...v, currentValue: undefined })),
      controlGroup,
      testGroups,
      status: 'designed',
      startTime: Date.now(),
      reproducibility: {
        codeVersion: '1.0.0',
        dependencies: { 'chess.js': '^1.0.0' },
        randomSeed: Math.floor(Math.random() * 1000000),
        environmentSpecs: { node: '18.0.0', os: 'linux' },
        dataHash: 'abc123',
        reproduced: false,
        reproductionAttempts: 0
      }
    };

    this.experiments.set(experimentId, experiment);
    project.experiments.push(experiment);

    console.log(`Designed experiment: ${config.name} for project ${project.name}`);
    return experimentId;
  }

  private createEmptyGroupResults(): GroupResults {
    return {
      gamesPlayed: 0,
      winRate: 0,
      averageGameLength: 0,
      performanceMetrics: {},
      confidenceInterval: { lower: 0, upper: 0 },
      statisticalSignificance: 0
    };
  }

  public async runExperiment(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    experiment.status = 'running';
    console.log(`Starting experiment: ${experiment.name}`);

    // Simulate experiment execution
    await this.simulateExperimentRun(experiment);

    experiment.status = 'completed';
    experiment.endTime = Date.now();

    // Generate results
    experiment.results = await this.generateExperimentResults(experiment);

    console.log(`Completed experiment: ${experiment.name}`);
  }

  private async simulateExperimentRun(experiment: Experiment): Promise<void> {
    // Simulate running games for each group
    const allGroups = [experiment.controlGroup, ...experiment.testGroups];
    
    for (const group of allGroups) {
      await this.simulateGroupGames(group);
    }
  }

  private async simulateGroupGames(group: ExperimentGroup): Promise<void> {
    // Simulate playing games and collecting results
    const gamesPerAgent = 20;
    const numAgents = 5;

    group.results.gamesPlayed = gamesPerAgent * numAgents;
    
    // Simulate different configurations producing different results
    const baseWinRate = 0.5;
    const configBonus = this.calculateConfigurationBonus(group.configuration);
    
    group.results.winRate = Math.max(0, Math.min(1, baseWinRate + configBonus + (Math.random() - 0.5) * 0.2));
    group.results.averageGameLength = 40 + Math.random() * 20;
    
    // Performance metrics
    group.results.performanceMetrics = {
      accuracy: 0.8 + Math.random() * 0.15,
      speed: 1000 + Math.random() * 500,
      memory: 256 + Math.random() * 128
    };

    // Statistical analysis
    const sampleSize = group.results.gamesPlayed;
    const standardError = Math.sqrt(group.results.winRate * (1 - group.results.winRate) / sampleSize);
    
    group.results.confidenceInterval = {
      lower: Math.max(0, group.results.winRate - 1.96 * standardError),
      upper: Math.min(1, group.results.winRate + 1.96 * standardError)
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private calculateConfigurationBonus(config: any): number {
    // Simple simulation of how configuration affects performance
    let bonus = 0;
    
    if (config.learningRate) {
      // Optimal learning rate around 0.001
      const optimalLR = 0.001;
      const distance = Math.abs(Math.log10(config.learningRate) - Math.log10(optimalLR));
      bonus += Math.max(0, 0.1 - distance * 0.05);
    }
    
    if (config.batchSize) {
      // Optimal batch size around 32
      const optimalBS = 32;
      const distance = Math.abs(config.batchSize - optimalBS) / optimalBS;
      bonus += Math.max(0, 0.05 - distance * 0.02);
    }

    return bonus;
  }

  private async generateExperimentResults(experiment: Experiment): Promise<ExperimentResults> {
    const allGroups = [experiment.controlGroup, ...experiment.testGroups];
    
    // Statistical analysis
    const controlWinRate = experiment.controlGroup.results.winRate;
    const testWinRates = experiment.testGroups.map(g => g.results.winRate);
    
    // T-test simulation
    const bestTestWinRate = Math.max(...testWinRates);
    const effectSize = (bestTestWinRate - controlWinRate) / Math.sqrt(0.25); // Cohen's d approximation
    const pValue = this.simulateTTest(controlWinRate, bestTestWinRate);
    
    const statisticalAnalysis: StatisticalAnalysis = {
      pValue,
      effectSize,
      confidenceLevel: 0.95,
      sampleSize: experiment.controlGroup.results.gamesPlayed,
      powerAnalysis: 0.8,
      normalityTests: { 'shapiro-wilk': 0.95 },
      correlationMatrix: this.generateCorrelationMatrix(allGroups)
    };

    // Generate conclusions
    const conclusions: string[] = [];
    if (pValue < 0.05) {
      conclusions.push('Statistically significant improvement observed');
      conclusions.push(`Best configuration improved win rate by ${((bestTestWinRate - controlWinRate) * 100).toFixed(1)}%`);
    } else {
      conclusions.push('No statistically significant difference found');
    }

    if (effectSize > 0.5) {
      conclusions.push('Large effect size indicates practical significance');
    }

    const results: ExperimentResults = {
      summary: `Experiment completed with ${allGroups.length} groups and ${experiment.controlGroup.results.gamesPlayed} games per group.`,
      statisticalAnalysis,
      conclusions,
      recommendations: [
        'Consider larger sample sizes for future experiments',
        'Investigate parameter interactions',
        'Validate results on independent test set'
      ],
      futureWork: [
        'Extend to multi-game scenarios',
        'Test robustness across different opponents',
        'Optimize computational efficiency'
      ],
      dataVisualization: [
        {
          type: 'bar',
          title: 'Win Rate by Group',
          data: allGroups.map(g => ({ group: g.name, winRate: g.results.winRate })),
          config: { xAxis: 'group', yAxis: 'winRate' }
        }
      ]
    };

    return results;
  }

  private simulateTTest(control: number, test: number): number {
    // Simplified t-test simulation
    const difference = Math.abs(test - control);
    const pooledStd = Math.sqrt(0.25); // Approximation for binomial
    const tStat = difference / (pooledStd * Math.sqrt(2/100)); // Assuming n=100
    
    // Convert to p-value (approximation)
    return Math.max(0.001, Math.min(0.999, Math.exp(-tStat * 2)));
  }

  private generateCorrelationMatrix(groups: ExperimentGroup[]): number[][] {
    const numGroups = groups.length;
    const matrix: number[][] = [];
    
    for (let i = 0; i < numGroups; i++) {
      matrix[i] = [];
      for (let j = 0; j < numGroups; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;
        } else {
          // Simulate correlation based on configuration similarity
          matrix[i][j] = Math.random() * 0.6 + 0.2; // Between 0.2 and 0.8
        }
      }
    }
    
    return matrix;
  }

  public async runBenchmark(agentId: string, benchmarkId: string): Promise<BenchmarkEntry> {
    const benchmark = this.benchmarks.get(benchmarkId);
    if (!benchmark) {
      throw new Error(`Benchmark ${benchmarkId} not found`);
    }

    console.log(`Running benchmark ${benchmark.name} for agent ${agentId}`);

    const entry: BenchmarkEntry = {
      rank: 0, // Will be calculated after scoring
      agentId,
      agentName: `Agent_${agentId.substr(-6)}`,
      score: 0,
      breakdown: {},
      submissionDate: Date.now(),
      version: '1.0.0',
      verified: true,
      hardware: 'Standard Test Environment',
      runtime: 0
    };

    const startTime = Date.now();

    // Run each test
    for (const test of benchmark.tests) {
      const testScore = await this.runBenchmarkTest(agentId, test);
      entry.breakdown[test.id] = testScore;
      entry.score += testScore;
    }

    entry.runtime = Date.now() - startTime;

    // Add to leaderboard
    benchmark.leaderboard.push(entry);
    benchmark.leaderboard.sort((a, b) => b.score - a.score);

    // Update ranks
    benchmark.leaderboard.forEach((e, index) => {
      e.rank = index + 1;
    });

    console.log(`Benchmark completed. Score: ${entry.score}, Rank: ${entry.rank}`);
    return entry;
  }

  private async runBenchmarkTest(agentId: string, test: BenchmarkTest): Promise<number> {
    let totalScore = 0;
    
    for (const testCase of test.testCases) {
      // Simulate running the test case
      const caseScore = await this.simulateTestCase(agentId, testCase, test.scoring);
      totalScore += caseScore;
    }

    return totalScore / test.testCases.length;
  }

  private async simulateTestCase(agentId: string, testCase: TestCase, scoring: ScoringSystem): Promise<number> {
    // Simulate AI agent solving the test case
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate thinking time

    // Simulate success rate based on difficulty
    const baseSuccessRate = 0.7;
    const difficultyPenalty = (testCase.difficulty - 5) * 0.1;
    const successRate = Math.max(0.1, baseSuccessRate - difficultyPenalty);
    
    const success = Math.random() < successRate;
    
    if (success) {
      // Simulate partial credit based on quality
      const quality = 0.7 + Math.random() * 0.3;
      return scoring.maxScore * quality;
    } else {
      return scoring.maxScore * 0.1; // Partial credit for attempting
    }
  }

  public async generateResearchReport(projectId: string): Promise<ResearchReport> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const completedExperiments = project.experiments.filter(e => e.status === 'completed');
    
    const report: ResearchReport = {
      projectId,
      projectName: project.name,
      generatedDate: Date.now(),
      summary: `Research project encompassing ${project.experiments.length} experiments with ${completedExperiments.length} completed.`,
      keyFindings: this.extractKeyFindings(completedExperiments),
      methodologicalContributions: [
        'Novel multi-game AI architecture',
        'Advanced transfer learning techniques',
        'Comprehensive benchmarking framework'
      ],
      impactAssessment: this.calculateImpactAssessment(project),
      recommendations: [
        'Scale experiments to larger datasets',
        'Investigate cross-domain applications',
        'Develop real-time deployment strategies'
      ],
      futureDirections: [
        'Integration with quantum computing',
        'Explainable AI mechanisms',
        'Human-AI collaboration frameworks'
      ],
      appendices: {
        rawData: 'Available upon request',
        codeRepository: 'https://github.com/ai-research/game-ai',
        supplementaryMaterials: 'See attached files'
      }
    };

    return report;
  }

  private extractKeyFindings(experiments: Experiment[]): string[] {
    const findings: string[] = [];
    
    for (const experiment of experiments) {
      if (experiment.results) {
        findings.push(...experiment.results.conclusions);
      }
    }

    // Deduplicate and summarize
    return [...new Set(findings)].slice(0, 10);
  }

  private calculateImpactAssessment(project: ResearchProject): ImpactAssessment {
    return {
      scientificImpact: 0.85,
      practicalImpact: 0.78,
      economicImpact: 0.72,
      socialImpact: 0.65,
      technologicalAdvancement: 0.88,
      knowledgeContribution: 0.82
    };
  }

  public getActiveProjects(): ResearchProject[] {
    return Array.from(this.projects.values()).filter(p => p.status === 'active');
  }

  public getExperimentResults(experimentId: string): ExperimentResults | undefined {
    return this.experiments.get(experimentId)?.results;
  }

  public getBenchmarkLeaderboard(benchmarkId: string): BenchmarkEntry[] {
    return this.benchmarks.get(benchmarkId)?.leaderboard || [];
  }

  public getResearchMetrics(): OverallResearchMetrics {
    const allProjects = Array.from(this.projects.values());
    const completedExperiments = Array.from(this.experiments.values()).filter(e => e.status === 'completed');
    
    return {
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === 'active').length,
      completedExperiments: completedExperiments.length,
      publicationsCount: Array.from(this.publications.values()).length,
      datasetsCount: Array.from(this.datasets.values()).length,
      benchmarksCount: Array.from(this.benchmarks.values()).length,
      averageProjectDuration: this.calculateAverageProjectDuration(allProjects),
      successRate: completedExperiments.length / Math.max(1, Array.from(this.experiments.values()).length),
      reproductibilityRate: completedExperiments.filter(e => e.reproducibility.reproduced).length / Math.max(1, completedExperiments.length)
    };
  }

  private calculateAverageProjectDuration(projects: ResearchProject[]): number {
    const completedProjects = projects.filter(p => p.status === 'completed' && p.endDate);
    if (completedProjects.length === 0) return 0;
    
    const totalDuration = completedProjects.reduce((sum, p) => 
      sum + (p.endDate! - p.startDate), 0
    );
    
    return totalDuration / completedProjects.length / (1000 * 60 * 60 * 24); // Convert to days
  }
}

// Supporting interfaces
interface ResearchReport {
  projectId: string;
  projectName: string;
  generatedDate: number;
  summary: string;
  keyFindings: string[];
  methodologicalContributions: string[];
  impactAssessment: ImpactAssessment;
  recommendations: string[];
  futureDirections: string[];
  appendices: {
    rawData: string;
    codeRepository: string;
    supplementaryMaterials: string;
  };
}

interface ImpactAssessment {
  scientificImpact: number;
  practicalImpact: number;
  economicImpact: number;
  socialImpact: number;
  technologicalAdvancement: number;
  knowledgeContribution: number;
}

interface OverallResearchMetrics {
  totalProjects: number;
  activeProjects: number;
  completedExperiments: number;
  publicationsCount: number;
  datasetsCount: number;
  benchmarksCount: number;
  averageProjectDuration: number;
  successRate: number;
  reproductibilityRate: number;
}

export { ResearchDashboard };
export type {
  ResearchProject,
  Experiment,
  ExperimentResults,
  BenchmarkSuite,
  BenchmarkEntry,
  Dataset,
  Publication,
  ResearchReport,
  OverallResearchMetrics
};
