import { ChessBook, OpeningTheory, EndgameStudy, TacticalPattern, PGNGame } from '../ai/ChessLearningEngine';

/**
 * Sample chess literature data for training AI agents
 */

// Sample master games in simplified format
const sampleMasterGames: PGNGame[] = [
  {
    pgn: `[Event "World Championship"]
[Site "New York"]
[Date "1972.07.11"]
[Round "6"]
[White "Fischer, Robert James"]
[Black "Spassky, Boris V"]
[Result "1-0"]
[WhiteElo "2785"]
[BlackElo "2660"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf6 19. Nxe6 Qxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 Ne6 27. Rf3 1-0`,
    white: "Fischer, Robert James",
    black: "Spassky, Boris V",
    result: "1-0",
    elo: { white: 2785, black: 2660 },
    event: "World Championship",
    date: "1972.07.11",
    moves: ["c4", "e6", "Nf3", "d5", "d4", "Nf6", "Nc3", "Be7", "Bg5", "O-O", "e3", "h6", "Bh4", "b6", "cxd5", "Nxd5", "Bxe7", "Qxe7", "Nxd5", "exd5", "Rc1", "Be6", "Qa4", "c5", "Qa3", "Rc8", "Bb5", "a6", "dxc5", "bxc5", "O-O", "Ra7", "Be2", "Nd7", "Nd4", "Qf6", "Nxe6", "Qxe6", "e4", "d4", "f4", "Qe7", "e5", "Rb8", "Bc4", "Kh8", "Qh3", "Nf8", "b3", "a5", "f5", "Ne6", "Rf3"]
  },
  {
    pgn: `[Event "Candidates Tournament"]
[Site "Zurich"]
[Date "1953.08.30"]
[Round "15"]
[White "Petrosian, Tigran V"]
[Black "Bronstein, David I"]
[Result "1/2-1/2"]
[WhiteElo "2615"]
[BlackElo "2625"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. a3 Bxc3+ 6. bxc3 Nc6 7. Bd3 O-O 8. Ne2 b6 9. e4 Ne8 10. Bc2 Ba6 11. f4 f5 12. e5 Bb7 13. Bb3 Na5 14. Bc2 cxd4 15. cxd4 Rc8 16. Bb3 Nxb3 17. Qxb3 Nc7 18. Be3 Nd5 19. Bd2 Rc2 20. Rd1 Qc7 21. h3 a5 22. Kf2 Ba6 23. Rhc1 Rfc8 24. Rxc2 Qxc2 25. Rc1 Qxb3 26. Rxc8+ Bxc8 1/2-1/2`,
    white: "Petrosian, Tigran V",
    black: "Bronstein, David I",
    result: "1/2-1/2",
    elo: { white: 2615, black: 2625 },
    event: "Candidates Tournament",
    date: "1953.08.30",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "e3", "c5", "a3", "Bxc3+", "bxc3", "Nc6", "Bd3", "O-O", "Ne2", "b6", "e4", "Ne8", "Bc2", "Ba6", "f4", "f5", "e5", "Bb7", "Bb3", "Na5", "Bc2", "cxd4", "cxd4", "Rc8", "Bb3", "Nxb3", "Qxb3", "Nc7", "Be3", "Nd5", "Bd2", "Rc2", "Rd1", "Qc7", "h3", "a5", "Kf2", "Ba6", "Rhc1", "Rfc8", "Rxc2", "Qxc2", "Rc1", "Qxb3", "Rxc8+", "Bxc8"]
  }
];

// Opening theory from classic books
const classicOpenings: OpeningTheory[] = [
  {
    name: "Italian Game",
    eco: "C50",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    explanation: "One of the oldest chess openings, focusing on rapid development and central control",
    keyIdeas: [
      "Control the center with pawns",
      "Develop pieces quickly",
      "Castle early for king safety",
      "Target the f7 square"
    ],
    commonContinuations: ["Be7", "f5", "Nf6", "d6"],
    masterGames: ["Morphy vs Duke of Brunswick", "Greco vs NN"]
  },
  {
    name: "Queen's Gambit",
    eco: "D06",
    moves: ["d4", "d5", "c4"],
    explanation: "A classical opening offering a pawn to gain central control",
    keyIdeas: [
      "Control the center",
      "Develop queenside pieces first",
      "Create pawn chains",
      "Pressure d5 square"
    ],
    commonContinuations: ["dxc4", "e6", "c6", "Nf6"],
    masterGames: ["Capablanca vs Marshall", "Alekhine vs Bogoljubov"]
  },
  {
    name: "Sicilian Defense",
    eco: "B20",
    moves: ["e4", "c5"],
    explanation: "The most popular and aggressive response to 1.e4",
    keyIdeas: [
      "Fight for the center asymmetrically",
      "Create counterplay on queenside",
      "Prepare ...d6 and ...Nf6",
      "Castle kingside"
    ],
    commonContinuations: ["Nf3", "d6", "Nc6", "g6"],
    masterGames: ["Fischer vs Najdorf", "Kasparov vs Karpov"]
  },
  {
    name: "French Defense",
    eco: "C00",
    moves: ["e4", "e6"],
    explanation: "A solid but somewhat passive defense",
    keyIdeas: [
      "Control the center with ...d5",
      "Develop the light-squared bishop",
      "Create pawn chains",
      "Seek counterplay on queenside"
    ],
    commonContinuations: ["d4", "d5", "Nc3", "Bb4"],
    masterGames: ["Alekhine vs Chatard", "Petrosian vs Botvinnik"]
  },
  {
    name: "Nimzo-Indian Defense",
    eco: "E20",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
    explanation: "A hypermodern defense controlling the center with pieces",
    keyIdeas: [
      "Pin the knight on c3",
      "Control e4 square",
      "Create doubled pawns for opponent",
      "Flexible pawn structure"
    ],
    commonContinuations: ["a3", "Qc2", "e3", "f3"],
    masterGames: ["Nimzowitsch vs Capablanca", "Kasparov vs Karpov"]
  }
];

// Endgame studies from masters
const endgameStudies: EndgameStudy[] = [
  {
    name: "King and Pawn vs King",
    position: "8/8/8/8/3K4/3P4/8/5k2 w - - 0 1",
    technique: "Opposition and key squares",
    keyMoves: ["Kd5", "Ke2", "Ke6", "Kf3"],
    explanation: "Master the opposition to promote the pawn",
    difficulty: "beginner"
  },
  {
    name: "Rook vs Pawn on 7th",
    position: "8/1p6/8/8/8/8/8/R3K2k w - - 0 1",
    technique: "Cut off the king, then attack the pawn",
    keyMoves: ["Ra7", "Rb1", "Kg2", "Ra2+"],
    explanation: "Prevent the pawn from promoting by controlling key squares",
    difficulty: "intermediate"
  },
  {
    name: "Queen vs Rook",
    position: "8/8/8/8/8/8/5q2/R3K3 b - - 0 1",
    technique: "Centralize queen and create threats",
    keyMoves: ["Qf4+", "Qc1+", "Qh3", "Qd4"],
    explanation: "Use the queen's mobility to create multiple threats",
    difficulty: "advanced"
  },
  {
    name: "Bishop vs Knight Endgame",
    position: "8/8/8/3k4/3n4/8/3K1B2/8 w - - 0 1",
    technique: "Improve king position and restrict knight",
    keyMoves: ["Kc3", "Be3", "Kd3", "Bf4"],
    explanation: "In open positions, the bishop is usually superior",
    difficulty: "intermediate"
  },
  {
    name: "Lucena Position",
    position: "1K6/1P1k4/8/8/8/8/r7/8 w - - 0 1",
    technique: "Build a bridge with the rook",
    keyMoves: ["Rc1", "Rc4", "Ka7", "Kb8"],
    explanation: "Classic rook endgame technique for promoting passed pawn",
    difficulty: "advanced"
  }
];

// Tactical patterns from classic games
const tacticalPatterns: TacticalPattern[] = [
  {
    name: "Knight Fork",
    type: "fork",
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
    solution: ["Ng5", "d6", "Nxf7"],
    explanation: "The knight attacks both the king and queen simultaneously",
    rating: 1200
  },
  {
    name: "Pin to Win Material",
    type: "pin",
    position: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 8",
    solution: ["Bg5", "h6", "Bxf6"],
    explanation: "Pin the knight to the queen to win material",
    rating: 1400
  },
  {
    name: "Discovered Attack",
    type: "discovered-attack",
    position: "r2qkb1r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
    solution: ["Nd5", "Nxd5", "exd5"],
    explanation: "Moving the knight discovers an attack on the bishop",
    rating: 1500
  },
  {
    name: "Deflection Tactic",
    type: "deflection",
    position: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution: ["Ra8+", "Kh7", "Ra7"],
    explanation: "Deflect the king from defending the f7 pawn",
    rating: 1600
  },
  {
    name: "Double Attack",
    type: "double-attack",
    position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    solution: ["d3", "d6", "Qd5"],
    explanation: "Attack both the f7 pawn and the knight on c6",
    rating: 1700
  }
];

// Complete chess books
export const chessLiteratureLibrary: ChessBook[] = [
  {
    title: "My System",
    author: "Aron Nimzowitsch",
    games: sampleMasterGames.slice(0, 50).concat(
      // Add more sample games
      Array(48).fill(null).map((_, i) => ({
        pgn: `[Event "Sample Game ${i + 3}"] [Site "Various"] [Date "1920.01.0${(i % 9) + 1}"] [Round "${i + 1}"] [White "Master A"] [Black "Master B"] [Result "*"] 1. e4 e5 2. Nf3 Nc6 *`,
        white: "Master A",
        black: "Master B",
        result: "*",
        event: `Sample Game ${i + 3}`,
        date: `1920.01.0${(i % 9) + 1}`,
        moves: ["e4", "e5", "Nf3", "Nc6"]
      }))
    ),
    openings: classicOpenings.slice(0, 3),
    endgames: endgameStudies.slice(0, 2),
    tactics: tacticalPatterns.slice(0, 3)
  },
  {
    title: "The Art of Attack in Chess",
    author: "Vladimir Vukovic",
    games: Array(75).fill(null).map((_, i) => ({
      pgn: `[Event "Attack Game ${i + 1}"] [Site "Various"] [Date "1930.01.0${(i % 9) + 1}"] [Round "${i + 1}"] [White "Attacker"] [Black "Defender"] [Result "1-0"] 1. e4 e5 2. f4 exf4 3. Nf3 g5 *`,
      white: "Attacker",
      black: "Defender",
      result: "1-0",
      event: `Attack Game ${i + 1}`,
      date: `1930.01.0${(i % 9) + 1}`,
      moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5"]
    })),
    openings: [classicOpenings[0]], // Italian Game
    endgames: [],
    tactics: tacticalPatterns
  },
  {
    title: "Dvoretsky's Endgame Manual",
    author: "Mark Dvoretsky",
    games: Array(100).fill(null).map((_, i) => ({
      pgn: `[Event "Endgame Study ${i + 1}"] [Site "Study"] [Date "1990.01.0${(i % 9) + 1}"] [Round "-"] [White "Study"] [Black "Position"] [Result "*"] 8/8/8/8/8/8/8/8 w - - 0 1 *`,
      white: "Study",
      black: "Position",
      result: "*",
      event: `Endgame Study ${i + 1}`,
      date: `1990.01.0${(i % 9) + 1}`,
      moves: []
    })),
    openings: [],
    endgames: endgameStudies,
    tactics: []
  },
  {
    title: "The Complete Chess Course",
    author: "Fred Reinfeld",
    games: Array(150).fill(null).map((_, i) => ({
      pgn: `[Event "Complete Course ${i + 1}"] [Site "Course"] [Date "1950.01.0${(i % 9) + 1}"] [Round "${i + 1}"] [White "Student"] [Black "Example"] [Result "*"] 1. d4 d5 2. c4 e6 *`,
      white: "Student",
      black: "Example",
      result: "*",
      event: `Complete Course ${i + 1}`,
      date: `1950.01.0${(i % 9) + 1}`,
      moves: ["d4", "d5", "c4", "e6"]
    })),
    openings: classicOpenings,
    endgames: endgameStudies.slice(0, 3),
    tactics: tacticalPatterns.slice(0, 4)
  },
  {
    title: "Zurich International Chess Tournament 1953",
    author: "David Bronstein",
    games: sampleMasterGames.concat(
      Array(200).fill(null).map((_, i) => ({
        pgn: `[Event "Zurich 1953"] [Site "Zurich"] [Date "1953.08.${String(i % 30 + 1).padStart(2, '0')}"] [Round "${i + 1}"] [White "Grandmaster A"] [Black "Grandmaster B"] [Result "*"] 1. Nf3 Nf6 2. c4 g6 *`,
        white: "Grandmaster A",
        black: "Grandmaster B",
        result: "*",
        elo: { white: 2600 + Math.floor(Math.random() * 100), black: 2600 + Math.floor(Math.random() * 100) },
        event: "Zurich 1953",
        date: `1953.08.${String(i % 30 + 1).padStart(2, '0')}`,
        moves: ["Nf3", "Nf6", "c4", "g6"]
      }))
    ),
    openings: classicOpenings,
    endgames: endgameStudies,
    tactics: tacticalPatterns
  }
];

// Sample PGN database content
export const samplePGNDatabase = `
[Event "World Championship"]
[Site "New York"]
[Date "1972.07.11"]
[Round "6"]
[White "Fischer, Robert James"]
[Black "Spassky, Boris V"]
[Result "1-0"]
[WhiteElo "2785"]
[BlackElo "2660"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf6 19. Nxe6 Qxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 Ne6 27. Rf3 1-0

[Event "Candidates Tournament"]
[Site "Zurich"]
[Date "1953.08.30"]
[Round "15"]
[White "Petrosian, Tigran V"]
[Black "Bronstein, David I"]
[Result "1/2-1/2"]
[WhiteElo "2615"]
[BlackElo "2625"]

1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5 5. a3 Bxc3+ 6. bxc3 Nc6 7. Bd3 O-O 8. Ne2 b6 9. e4 Ne8 10. Bc2 Ba6 11. f4 f5 12. e5 Bb7 13. Bb3 Na5 14. Bc2 cxd4 15. cxd4 Rc8 16. Bb3 Nxb3 17. Qxb3 Nc7 18. Be3 Nd5 19. Bd2 Rc2 20. Rd1 Qc7 21. h3 a5 22. Kf2 Ba6 23. Rhc1 Rfc8 24. Rxc2 Qxc2 25. Rc1 Qxb3 26. Rxc8+ Bxc8 1/2-1/2

[Event "USSR Championship"]
[Site "Moscow"]
[Date "1969.12.15"]
[Round "17"]
[White "Tal, Mikhail"]
[Black "Korchnoi, Viktor"]
[Result "1-0"]
[WhiteElo "2705"]
[BlackElo "2665"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6 8. Qd2 Qxb2 9. Rb1 Qa3 10. e5 h6 11. Bh4 dxe5 12. fxe5 Nfd7 13. Ne4 Qxa2 14. Rd1 Qd5 15. Qf2 Qxe5 16. Re1 Nc6 17. Nxc6 bxc6 18. Qf7+ Kd8 19. Bg3 1-0
`;

export const onlineGameExamples = [
  {
    platform: "lichess",
    gameId: "abc123",
    opponent: "ChessMaster2000",
    opponentRating: 2100,
    timeControl: "10+0",
    result: "win",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"],
    learnings: [
      "Opponent preferred solid setups",
      "Time pressure affected opponent's play",
      "Tactical opportunities in middlegame"
    ]
  },
  {
    platform: "chess.com",
    gameId: "def456",
    opponent: "TacticalGenius",
    opponentRating: 1950,
    timeControl: "15+10",
    result: "loss",
    moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"],
    learnings: [
      "Need to improve endgame technique",
      "Opponent played principled opening",
      "Missed tactical opportunity on move 15"
    ]
  }
];

// Utility function to create training programs
export function createMasterTrainingProgram() {
  return {
    phase1: {
      books: chessLiteratureLibrary.slice(0, 3),
      games: 500
    },
    phase2: {
      onlinePlatforms: ["lichess", "chess.com", "fics"],
      gamesPerPlatform: 50
    },
    phase3: {
      tournamentRounds: 5,
      opponents: [] // Will be populated with other trained agents
    }
  };
}

export function getRandomBook(): ChessBook {
  return chessLiteratureLibrary[Math.floor(Math.random() * chessLiteratureLibrary.length)];
}

export function getMasterGamesPGN(): string {
  return samplePGNDatabase;
}
