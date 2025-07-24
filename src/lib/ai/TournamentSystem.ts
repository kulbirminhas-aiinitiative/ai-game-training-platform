import { ChessAIAgent } from './ChessAIAgent';
import { MultiGameAI, GameType, GameState } from './MultiGameAI';
import { OnlineGamingEngine, OnlineGame, TournamentInfo, TimeControl } from './OnlineGamingEngine';

/**
 * Advanced Tournament System with ELO Ladder
 * Automated tournaments, rankings, and competitive AI training
 */

export interface ELORating {
  rating: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  peak: number;
  volatility: number;
  lastUpdated: number;
  provisional: boolean; // First 20 games
}

export interface TournamentFormat {
  type: 'swiss' | 'round-robin' | 'knockout' | 'arena' | 'ladder';
  rounds: number;
  playersPerGroup?: number;
  eliminationRounds?: number;
  timePerRound?: number; // minutes
  pairingSystem: 'random' | 'rating-based' | 'swiss-system';
}

export interface TournamentConfig {
  name: string;
  description: string;
  format: TournamentFormat;
  timeControl: TimeControl;
  gameType: GameType;
  maxParticipants: number;
  entryRequirements?: EntryRequirements;
  prizes?: Prize[];
  startTime: number;
  registrationDeadline: number;
  isRated: boolean;
  visibility: 'public' | 'private' | 'invite-only';
}

export interface EntryRequirements {
  minRating?: number;
  maxRating?: number;
  requiredGames?: number;
  allowedAgentTypes?: string[];
  geographicRestriction?: string[];
}

export interface Prize {
  position: number;
  type: 'rating' | 'trophy' | 'badge' | 'title';
  value: string | number;
  description: string;
}

export interface TournamentParticipant {
  id: string;
  name: string;
  rating: number;
  agent?: ChessAIAgent | MultiGameAI;
  isAI: boolean;
  registrationTime: number;
  status: 'registered' | 'active' | 'eliminated' | 'withdrawn';
  score: number;
  tiebreaks: number[];
  matchHistory: TournamentMatch[];
}

export interface TournamentMatch {
  matchId: string;
  round: number;
  player1: TournamentParticipant;
  player2: TournamentParticipant;
  gameIds: string[];
  result: MatchResult;
  startTime: number;
  endTime?: number;
  status: 'scheduled' | 'active' | 'completed' | 'forfeited';
}

export interface MatchResult {
  score1: number; // Player 1 score
  score2: number; // Player 2 score
  games: GameResult[];
  winner?: string;
  method: 'normal' | 'forfeit' | 'timeout' | 'disqualification';
}

export interface GameResult {
  gameId: string;
  result: '1-0' | '0-1' | '1/2-1/2';
  winner?: string;
  moves: number;
  duration: number;
  termination: string;
}

export interface LadderEntry {
  playerId: string;
  playerName: string;
  rank: number;
  rating: ELORating;
  agent?: ChessAIAgent | MultiGameAI;
  isAI: boolean;
  recentGames: LadderGame[];
  achievements: Achievement[];
  joinDate: number;
  lastActive: number;
  streak: { type: 'win' | 'loss'; count: number };
}

export interface LadderGame {
  gameId: string;
  opponent: string;
  opponentRating: number;
  result: '1-0' | '0-1' | '1/2-1/2';
  ratingChange: number;
  timestamp: number;
  gameType: GameType;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'milestone' | 'special' | 'tournament';
  earned: boolean;
  earnedDate?: number;
  progress?: number;
  maxProgress?: number;
}

export interface RankingSystem {
  gameType: GameType;
  leaderboard: LadderEntry[];
  ratingDistribution: RatingDistribution;
  totalPlayers: number;
  updateFrequency: number; // minutes
  lastUpdate: number;
}

export interface RatingDistribution {
  ranges: Array<{
    min: number;
    max: number;
    count: number;
    percentage: number;
    title: string;
  }>;
  average: number;
  median: number;
  standardDeviation: number;
}

export class TournamentSystem {
  private tournaments: Map<string, Tournament> = new Map();
  private eloRatings: Map<string, ELORating> = new Map();
  private ladders: Map<GameType, RankingSystem> = new Map();
  private achievements: Map<string, Achievement[]> = new Map();
  private onlineEngine: OnlineGamingEngine;

  constructor(onlineEngine: OnlineGamingEngine) {
    this.onlineEngine = onlineEngine;
    this.initializeRankingSystems();
    this.initializeAchievements();
  }

  private initializeRankingSystems(): void {
    const gameTypes: GameType[] = ['chess', 'poker', 'go', 'checkers'];
    
    for (const gameType of gameTypes) {
      this.ladders.set(gameType, {
        gameType,
        leaderboard: [],
        ratingDistribution: this.createEmptyDistribution(),
        totalPlayers: 0,
        updateFrequency: 15, // Update every 15 minutes
        lastUpdate: Date.now()
      });
    }
  }

  private createEmptyDistribution(): RatingDistribution {
    return {
      ranges: [
        { min: 0, max: 1000, count: 0, percentage: 0, title: 'Beginner' },
        { min: 1000, max: 1200, count: 0, percentage: 0, title: 'Novice' },
        { min: 1200, max: 1400, count: 0, percentage: 0, title: 'Intermediate' },
        { min: 1400, max: 1600, count: 0, percentage: 0, title: 'Advanced' },
        { min: 1600, max: 1800, count: 0, percentage: 0, title: 'Expert' },
        { min: 1800, max: 2000, count: 0, percentage: 0, title: 'Master' },
        { min: 2000, max: 2200, count: 0, percentage: 0, title: 'Grandmaster' },
        { min: 2200, max: 3000, count: 0, percentage: 0, title: 'Super GM' }
      ],
      average: 1500,
      median: 1500,
      standardDeviation: 200
    };
  }

  private initializeAchievements(): void {
    const standardAchievements: Achievement[] = [
      {
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first game',
        icon: '🏆',
        category: 'milestone',
        earned: false
      },
      {
        id: 'win_streak_5',
        name: 'Hot Streak',
        description: 'Win 5 games in a row',
        icon: '🔥',
        category: 'performance',
        earned: false,
        maxProgress: 5
      },
      {
        id: 'rating_1600',
        name: 'Expert Level',
        description: 'Reach 1600 rating',
        icon: '⭐',
        category: 'milestone',
        earned: false
      },
      {
        id: 'tournament_winner',
        name: 'Champion',
        description: 'Win a tournament',
        icon: '🥇',
        category: 'tournament',
        earned: false
      },
      {
        id: 'games_100',
        name: 'Veteran',
        description: 'Play 100 games',
        icon: '🎯',
        category: 'milestone',
        earned: false,
        maxProgress: 100
      },
      {
        id: 'perfect_game',
        name: 'Flawless Victory',
        description: 'Win without losing material',
        icon: '💎',
        category: 'special',
        earned: false
      }
    ];

    // Initialize achievements for existing players
    // This would be done when players are registered
  }

  public async createTournament(config: TournamentConfig): Promise<string> {
    const tournamentId = `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tournament = new Tournament(tournamentId, config, this);
    this.tournaments.set(tournamentId, tournament);

    console.log(`Created tournament: ${config.name} (${tournamentId})`);
    return tournamentId;
  }

  public async registerForTournament(
    tournamentId: string,
    agent: ChessAIAgent | MultiGameAI
  ): Promise<boolean> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }

    return await tournament.registerParticipant(agent);
  }

  public async startTournament(tournamentId: string): Promise<void> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`Tournament ${tournamentId} not found`);
    }

    await tournament.start();
  }

  public getActiveTournaments(): Tournament[] {
    return Array.from(this.tournaments.values()).filter(t => 
      t.status === 'active' || t.status === 'registration'
    );
  }

  public getPlayerRating(playerId: string): ELORating {
    return this.eloRatings.get(playerId) || this.createInitialRating();
  }

  private createInitialRating(): ELORating {
    return {
      rating: 1500,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      peak: 1500,
      volatility: 100,
      lastUpdated: Date.now(),
      provisional: true
    };
  }

  public async updateRating(
    playerId: string,
    opponentId: string,
    result: '1-0' | '0-1' | '1/2-1/2',
    gameType: GameType
  ): Promise<void> {
    const playerRating = this.getPlayerRating(playerId);
    const opponentRating = this.getPlayerRating(opponentId);

    // Calculate ELO change
    const { newPlayerRating, newOpponentRating } = this.calculateELOChange(
      playerRating,
      opponentRating,
      result
    );

    // Update ratings
    this.eloRatings.set(playerId, newPlayerRating);
    this.eloRatings.set(opponentId, newOpponentRating);

    // Update ladder
    await this.updateLadder(gameType, playerId, opponentId);

    // Check achievements
    await this.checkAchievements(playerId, newPlayerRating, result);
  }

  private calculateELOChange(
    playerRating: ELORating,
    opponentRating: ELORating,
    result: '1-0' | '0-1' | '1/2-1/2'
  ): { newPlayerRating: ELORating; newOpponentRating: ELORating } {
    // Standard ELO calculation
    const K = playerRating.provisional ? 40 : 20; // K-factor
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating.rating - playerRating.rating) / 400));
    
    let actualScore: number;
    switch (result) {
      case '1-0': actualScore = 1; break;
      case '0-1': actualScore = 0; break;
      case '1/2-1/2': actualScore = 0.5; break;
    }

    const ratingChange = Math.round(K * (actualScore - expectedScore));
    const newRating = Math.max(100, playerRating.rating + ratingChange);

    const newPlayerRating: ELORating = {
      ...playerRating,
      rating: newRating,
      gamesPlayed: playerRating.gamesPlayed + 1,
      wins: playerRating.wins + (actualScore === 1 ? 1 : 0),
      draws: playerRating.draws + (actualScore === 0.5 ? 1 : 0),
      losses: playerRating.losses + (actualScore === 0 ? 1 : 0),
      peak: Math.max(playerRating.peak, newRating),
      volatility: Math.max(50, playerRating.volatility * 0.95),
      lastUpdated: Date.now(),
      provisional: playerRating.gamesPlayed < 19 // First 20 games are provisional
    };

    // Calculate opponent's rating change
    const opponentK = opponentRating.provisional ? 40 : 20;
    const opponentExpected = 1 - expectedScore;
    const opponentActual = 1 - actualScore;
    const opponentChange = Math.round(opponentK * (opponentActual - opponentExpected));
    const opponentNewRating = Math.max(100, opponentRating.rating + opponentChange);

    const newOpponentRating: ELORating = {
      ...opponentRating,
      rating: opponentNewRating,
      gamesPlayed: opponentRating.gamesPlayed + 1,
      wins: opponentRating.wins + (opponentActual === 1 ? 1 : 0),
      draws: opponentRating.draws + (opponentActual === 0.5 ? 1 : 0),
      losses: opponentRating.losses + (opponentActual === 0 ? 1 : 0),
      peak: Math.max(opponentRating.peak, opponentNewRating),
      volatility: Math.max(50, opponentRating.volatility * 0.95),
      lastUpdated: Date.now(),
      provisional: opponentRating.gamesPlayed < 19
    };

    return { newPlayerRating, newOpponentRating };
  }

  private async updateLadder(gameType: GameType, playerId: string, opponentId: string): Promise<void> {
    const ladder = this.ladders.get(gameType);
    if (!ladder) return;

    // Update leaderboard entries
    await this.refreshLeaderboard(gameType);
  }

  private async refreshLeaderboard(gameType: GameType): Promise<void> {
    const ladder = this.ladders.get(gameType);
    if (!ladder) return;

    // Get all ratings for this game type
    const entries: LadderEntry[] = [];
    
    for (const [playerId, rating] of this.eloRatings) {
      // In a real implementation, filter by game type
      const achievements = this.achievements.get(playerId) || [];
      
      entries.push({
        playerId,
        playerName: `Player_${playerId.substr(-4)}`,
        rank: 0, // Will be set after sorting
        rating,
        isAI: true, // Most entries are AI in this system
        recentGames: [],
        achievements,
        joinDate: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random join date
        lastActive: Date.now(),
        streak: { type: 'win', count: Math.floor(Math.random() * 10) }
      });
    }

    // Sort by rating
    entries.sort((a, b) => b.rating.rating - a.rating.rating);

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    ladder.leaderboard = entries;
    ladder.totalPlayers = entries.length;
    ladder.lastUpdate = Date.now();
    ladder.ratingDistribution = this.calculateRatingDistribution(entries);
  }

  private calculateRatingDistribution(entries: LadderEntry[]): RatingDistribution {
    const distribution = this.createEmptyDistribution();
    
    if (entries.length === 0) return distribution;

    const ratings = entries.map(e => e.rating.rating);
    
    // Count players in each range
    for (const entry of entries) {
      const rating = entry.rating.rating;
      for (const range of distribution.ranges) {
        if (rating >= range.min && rating < range.max) {
          range.count++;
          break;
        }
      }
    }

    // Calculate percentages
    for (const range of distribution.ranges) {
      range.percentage = (range.count / entries.length) * 100;
    }

    // Calculate statistics
    distribution.average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    distribution.median = ratings.sort((a, b) => a - b)[Math.floor(ratings.length / 2)];
    
    const variance = ratings.reduce((sum, r) => sum + Math.pow(r - distribution.average, 2), 0) / ratings.length;
    distribution.standardDeviation = Math.sqrt(variance);

    return distribution;
  }

  private async checkAchievements(
    playerId: string,
    rating: ELORating,
    result: '1-0' | '0-1' | '1/2-1/2'
  ): Promise<void> {
    const playerAchievements = this.achievements.get(playerId) || [];
    let updated = false;

    // Check various achievement conditions
    for (const achievement of playerAchievements) {
      if (achievement.earned) continue;

      switch (achievement.id) {
        case 'first_win':
          if (result === '1-0' && rating.wins === 1) {
            achievement.earned = true;
            achievement.earnedDate = Date.now();
            updated = true;
          }
          break;

        case 'rating_1600':
          if (rating.rating >= 1600) {
            achievement.earned = true;
            achievement.earnedDate = Date.now();
            updated = true;
          }
          break;

        case 'games_100':
          achievement.progress = rating.gamesPlayed;
          if (rating.gamesPlayed >= 100) {
            achievement.earned = true;
            achievement.earnedDate = Date.now();
            updated = true;
          }
          break;

        // Add more achievement checks
      }
    }

    if (updated) {
      this.achievements.set(playerId, playerAchievements);
      console.log(`Player ${playerId} earned new achievements!`);
    }
  }

  public getLadder(gameType: GameType): RankingSystem | undefined {
    return this.ladders.get(gameType);
  }

  public getPlayerAchievements(playerId: string): Achievement[] {
    return this.achievements.get(playerId) || [];
  }

  public async simulateQuickTournament(gameType: GameType = 'chess'): Promise<Tournament> {
    // Create a quick 4-player tournament for demonstration
    const config: TournamentConfig = {
      name: 'Quick Demo Tournament',
      description: 'A fast-paced demonstration tournament',
      format: {
        type: 'round-robin',
        rounds: 3,
        pairingSystem: 'rating-based'
      },
      timeControl: { type: 'blitz', initialTime: 300, increment: 3, description: '5+3' },
      gameType,
      maxParticipants: 4,
      startTime: Date.now(),
      registrationDeadline: Date.now() + 60000,
      isRated: true,
      visibility: 'public'
    };

    const tournamentId = await this.createTournament(config);
    const tournament = this.tournaments.get(tournamentId)!;

    // Create demo AI agents
    const agents = [
      new ChessAIAgent('TournamentBot1', { aggressiveness: 0.7, creativity: 0.8 }),
      new ChessAIAgent('TournamentBot2', { aggressiveness: 0.5, creativity: 0.6 }),
      new ChessAIAgent('TournamentBot3', { aggressiveness: 0.8, creativity: 0.4 }),
      new ChessAIAgent('TournamentBot4', { aggressiveness: 0.3, creativity: 0.9 })
    ];

    // Register agents
    for (const agent of agents) {
      await this.registerForTournament(tournamentId, agent);
    }

    // Start tournament
    await this.startTournament(tournamentId);

    return tournament;
  }
}

class Tournament {
  public id: string;
  public config: TournamentConfig;
  public participants: TournamentParticipant[] = [];
  public matches: TournamentMatch[] = [];
  public currentRound: number = 0;
  public status: 'registration' | 'active' | 'completed' | 'cancelled' = 'registration';
  public winner?: TournamentParticipant;
  public startTime?: number;
  public endTime?: number;

  constructor(
    id: string,
    config: TournamentConfig,
    private tournamentSystem: TournamentSystem
  ) {
    this.id = id;
    this.config = config;
  }

  public async registerParticipant(agent: ChessAIAgent | MultiGameAI): Promise<boolean> {
    if (this.status !== 'registration') {
      throw new Error('Tournament registration is closed');
    }

    if (this.participants.length >= this.config.maxParticipants) {
      return false;
    }

    const rating = this.tournamentSystem.getPlayerRating(agent.id);

    const participant: TournamentParticipant = {
      id: agent.id,
      name: agent.name,
      rating: rating.rating,
      agent,
      isAI: true,
      registrationTime: Date.now(),
      status: 'registered',
      score: 0,
      tiebreaks: [],
      matchHistory: []
    };

    this.participants.push(participant);
    console.log(`${agent.name} registered for tournament ${this.config.name}`);
    
    return true;
  }

  public async start(): Promise<void> {
    if (this.status !== 'registration') {
      throw new Error('Tournament cannot be started');
    }

    if (this.participants.length < 2) {
      throw new Error('Not enough participants');
    }

    this.status = 'active';
    this.startTime = Date.now();
    this.currentRound = 1;

    console.log(`Tournament ${this.config.name} started with ${this.participants.length} participants`);

    // Generate initial pairings
    await this.generateRoundPairings();
    
    // Start playing rounds
    await this.playTournament();
  }

  private async generateRoundPairings(): Promise<void> {
    const availableParticipants = this.participants.filter(p => p.status === 'registered' || p.status === 'active');
    
    switch (this.config.format.pairingSystem) {
      case 'random':
        this.generateRandomPairings(availableParticipants);
        break;
      case 'rating-based':
        this.generateRatingBasedPairings(availableParticipants);
        break;
      case 'swiss-system':
        this.generateSwissPairings(availableParticipants);
        break;
    }
  }

  private generateRandomPairings(participants: TournamentParticipant[]): void {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const match: TournamentMatch = {
        matchId: `${this.id}_r${this.currentRound}_m${Math.floor(i/2)}`,
        round: this.currentRound,
        player1: shuffled[i],
        player2: shuffled[i + 1],
        gameIds: [],
        result: { score1: 0, score2: 0, games: [], method: 'normal' },
        startTime: Date.now() + 1000, // Start in 1 second
        status: 'scheduled'
      };
      
      this.matches.push(match);
    }
  }

  private generateRatingBasedPairings(participants: TournamentParticipant[]): void {
    const sorted = [...participants].sort((a, b) => b.rating - a.rating);
    
    for (let i = 0; i < sorted.length - 1; i += 2) {
      const match: TournamentMatch = {
        matchId: `${this.id}_r${this.currentRound}_m${Math.floor(i/2)}`,
        round: this.currentRound,
        player1: sorted[i],
        player2: sorted[i + 1],
        gameIds: [],
        result: { score1: 0, score2: 0, games: [], method: 'normal' },
        startTime: Date.now() + 1000,
        status: 'scheduled'
      };
      
      this.matches.push(match);
    }
  }

  private generateSwissPairings(participants: TournamentParticipant[]): void {
    // Simplified Swiss system - pair players with similar scores
    const sorted = [...participants].sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.rating - a.rating;
    });

    const paired = new Set<string>();
    
    for (let i = 0; i < sorted.length; i++) {
      if (paired.has(sorted[i].id)) continue;
      
      // Find suitable opponent
      for (let j = i + 1; j < sorted.length; j++) {
        if (paired.has(sorted[j].id)) continue;
        
        // Check if they haven't played before
        const hasPlayed = sorted[i].matchHistory.some(m => 
          m.player1.id === sorted[j].id || m.player2.id === sorted[j].id
        );
        
        if (!hasPlayed) {
          const match: TournamentMatch = {
            matchId: `${this.id}_r${this.currentRound}_m${this.matches.length}`,
            round: this.currentRound,
            player1: sorted[i],
            player2: sorted[j],
            gameIds: [],
            result: { score1: 0, score2: 0, games: [], method: 'normal' },
            startTime: Date.now() + 1000,
            status: 'scheduled'
          };
          
          this.matches.push(match);
          paired.add(sorted[i].id);
          paired.add(sorted[j].id);
          break;
        }
      }
    }
  }

  private async playTournament(): Promise<void> {
    while (this.currentRound <= this.config.format.rounds && this.status === 'active') {
      const roundMatches = this.matches.filter(m => m.round === this.currentRound);
      
      console.log(`Playing round ${this.currentRound} with ${roundMatches.length} matches`);
      
      // Play all matches in parallel
      const matchPromises = roundMatches.map(match => this.playMatch(match));
      await Promise.all(matchPromises);
      
      // Update standings
      this.updateStandings();
      
      // Check if tournament is complete
      if (this.currentRound >= this.config.format.rounds) {
        await this.finalizeTournament();
        break;
      }
      
      // Prepare next round
      this.currentRound++;
      await this.generateRoundPairings();
      
      // Short break between rounds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  private async playMatch(match: TournamentMatch): Promise<void> {
    match.status = 'active';
    console.log(`Match starting: ${match.player1.name} vs ${match.player2.name}`);
    
    // Simulate game(s)
    const gameResult = await this.simulateGame(match.player1, match.player2);
    
    match.result = {
      score1: gameResult.result === '1-0' ? 1 : gameResult.result === '1/2-1/2' ? 0.5 : 0,
      score2: gameResult.result === '0-1' ? 1 : gameResult.result === '1/2-1/2' ? 0.5 : 0,
      games: [gameResult],
      winner: gameResult.winner,
      method: 'normal'
    };
    
    match.status = 'completed';
    match.endTime = Date.now();
    
    // Update participant scores
    match.player1.score += match.result.score1;
    match.player2.score += match.result.score2;
    
    // Add to match history
    match.player1.matchHistory.push(match);
    match.player2.matchHistory.push(match);
    
    // Update ratings
    if (match.player1.agent && match.player2.agent) {
      await this.tournamentSystem.updateRating(
        match.player1.id,
        match.player2.id,
        gameResult.result,
        this.config.gameType
      );
    }
    
    console.log(`Match completed: ${match.player1.name} ${match.result.score1}-${match.result.score2} ${match.player2.name}`);
  }

  private async simulateGame(player1: TournamentParticipant, player2: TournamentParticipant): Promise<GameResult> {
    // Simulate a quick game based on ratings
    const ratingDiff = player1.rating - player2.rating;
    const player1WinProb = 1 / (1 + Math.pow(10, -ratingDiff / 400));
    
    const random = Math.random();
    let result: '1-0' | '0-1' | '1/2-1/2';
    let winner: string | undefined;
    
    if (random < player1WinProb * 0.8) { // 80% of expected wins
      result = '1-0';
      winner = player1.name;
    } else if (random > 1 - (1 - player1WinProb) * 0.8) {
      result = '0-1';
      winner = player2.name;
    } else {
      result = '1/2-1/2';
    }
    
    return {
      gameId: `game_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      result,
      winner,
      moves: 20 + Math.floor(Math.random() * 40),
      duration: 300000 + Math.random() * 600000, // 5-15 minutes
      termination: result === '1/2-1/2' ? 'draw' : 'checkmate'
    };
  }

  private updateStandings(): void {
    // Sort participants by score, then by rating
    this.participants.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.rating - a.rating;
    });
    
    console.log('Current standings:');
    this.participants.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}: ${p.score} points (${p.rating} rating)`);
    });
  }

  private async finalizeTournament(): Promise<void> {
    this.status = 'completed';
    this.endTime = Date.now();
    this.winner = this.participants[0];
    
    console.log(`Tournament ${this.config.name} completed!`);
    console.log(`Winner: ${this.winner.name} with ${this.winner.score} points`);
    
    // Award prizes and achievements
    await this.awardPrizes();
  }

  private async awardPrizes(): Promise<void> {
    if (!this.config.prizes) return;
    
    for (const prize of this.config.prizes) {
      if (prize.position <= this.participants.length) {
        const recipient = this.participants[prize.position - 1];
        console.log(`${recipient.name} wins: ${prize.description}`);
        
        // In a real implementation, actually award the prize
      }
    }
  }

  public getStatus(): TournamentStatus {
    return {
      id: this.id,
      name: this.config.name,
      status: this.status,
      currentRound: this.currentRound,
      totalRounds: this.config.format.rounds,
      participants: this.participants.length,
      matches: this.matches.length,
      standings: [...this.participants],
      recentMatches: this.matches.slice(-5),
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}

interface TournamentStatus {
  id: string;
  name: string;
  status: string;
  currentRound: number;
  totalRounds: number;
  participants: number;
  matches: number;
  standings: TournamentParticipant[];
  recentMatches: TournamentMatch[];
  startTime?: number;
  endTime?: number;
}

export {
  TournamentSystem,
  Tournament
};

export type {
  ELORating,
  TournamentFormat,
  TournamentConfig,
  TournamentParticipant,
  TournamentMatch,
  MatchResult,
  GameResult,
  LadderEntry,
  LadderGame,
  Achievement,
  RankingSystem,
  RatingDistribution,
  TournamentStatus
};
