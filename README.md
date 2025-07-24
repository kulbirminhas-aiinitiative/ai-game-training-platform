# AI Game Training Platform

An advanced AI training platform for chess and poker games where AI agents learn and improve through reinforcement learning and fine-tuning techniques. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎮 Features

### Games
- **Chess**: Interactive chess board with AI vs Human and AI vs AI modes
- **Poker**: Full Texas Hold'em implementation with multiple AI agents
- **Real-time gameplay** with smooth animations and responsive design

### AI Training
- **Reinforcement Learning**: Customizable training parameters
- **Performance Tracking**: Real-time win rates and learning curves
- **Agent Configuration**: Adjustable hyperparameters for different strategies
- **Training Dashboard**: Comprehensive analytics and monitoring

### Analytics
- **Performance Charts**: Visual representation of learning progress
- **Game History**: Detailed logs of all matches and training sessions
- **Strategy Analysis**: AI decision-making insights
- **Comparative Metrics**: Multiple agent performance comparison

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gaming-agents-learning
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Home Page
- Select between Chess and Poker training
- View overall platform statistics
- Access training dashboard and analytics

### Chess Training
- Play against AI agents or watch AI vs AI matches
- Adjust AI difficulty and training parameters
- Monitor move history and game analysis
- Configure search depth, learning rate, and exploration

### Poker Training
- Participate in multi-agent poker games
- Customize AI strategy parameters (aggression, bluff frequency, risk tolerance)
- View hand analysis and probability calculations
- Track training metrics and win rates

### Training Dashboard
- Monitor all active AI agents
- Adjust training parameters in real-time
- View performance charts and learning curves
- Compare different agent strategies

## 🏗️ Project Structure

```
src/
├── app/
│   ├── chess/           # Chess game interface
│   ├── poker/           # Poker game interface
│   ├── training/        # Training dashboard
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components (future)
├── types/              # TypeScript type definitions (future)
└── utils/              # Utility functions (future)
```

## 🧠 AI Architecture

### Chess AI
- **Engine**: Chess.js for game logic and move validation
- **Strategy**: Minimax algorithm with alpha-beta pruning
- **Learning**: Position evaluation neural networks
- **Training**: Self-play reinforcement learning

### Poker AI
- **Game Logic**: Custom Texas Hold'em implementation
- **Strategy**: Monte Carlo Tree Search with neural networks
- **Features**: Bluffing, pot odds calculation, opponent modeling
- **Learning**: Deep reinforcement learning with experience replay

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts for data visualization
- **Game Logic**: Chess.js for chess mechanics
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS

## 🔧 Configuration

### AI Training Parameters
- **Learning Rate**: Controls how quickly the AI adapts (0.001 - 0.1)
- **Batch Size**: Number of games processed together (16 - 512)
- **Exploration Rate**: Balance between exploration and exploitation (0 - 1)
- **Network Depth**: Neural network complexity (2 - 20 layers)

### Game-Specific Settings
- **Chess**: Search depth, evaluation functions, opening book
- **Poker**: Aggression level, bluff frequency, risk tolerance

## 📊 Performance Tracking

- **Win Rate**: Percentage of games won over time
- **Game Duration**: Average time per game
- **Training Hours**: Total time spent learning
- **Strategy Evolution**: How AI behavior changes over time

## 🚧 Future Enhancements

- **Additional Games**: Go, Backgammon, other strategic games
- **Advanced AI**: Transformer-based architectures
- **Multiplayer**: Online tournaments and competitions
- **Mobile App**: Native mobile version
- **Cloud Training**: Distributed training across multiple servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Chess.js](https://github.com/jhlywa/chess.js)
- [Recharts](https://recharts.org)
