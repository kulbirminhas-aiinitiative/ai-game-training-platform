# Copilot Instructions for AI Game Training Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an AI Game Training Platform focused on chess and poker with the following key features:
- Web-based digital game interfaces for chess and poker
- AI agents that can learn and improve through tuning and fine-tuning
- Training dashboard for monitoring and adjusting AI parameters
- Game analytics and performance tracking
- Agent vs agent and human vs agent gameplay modes

## Architecture
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and App Router
- **Games**: Chess and poker game engines with interactive web interfaces
- **AI Training**: Reinforcement learning models with customizable parameters
- **Backend**: Python/FastAPI orchestration layer (to be implemented)
- **Database**: Game history, AI training data, and performance metrics

## Code Guidelines
1. Use TypeScript for all React components and utilities
2. Follow Next.js App Router conventions with server and client components
3. Use Tailwind CSS for styling with a gaming-focused design system
4. Implement responsive design for both desktop and mobile gameplay
5. Create modular, reusable components for game boards, pieces, and UI elements
6. Use React hooks for game state management and AI training status
7. Implement proper error handling and loading states
8. Add comprehensive TypeScript types for game states and AI configurations

## Key Components to Implement
- Game boards (chess and poker tables)
- AI agent configuration panels
- Training progress visualizations
- Performance analytics dashboards
- Game history and replay systems
- Real-time game state updates

## Naming Conventions
- Components: PascalCase (e.g., `ChessBoard`, `PokerTable`)
- Hooks: camelCase with 'use' prefix (e.g., `useGameState`, `useAITraining`)
- Utilities: camelCase (e.g., `calculateMove`, `evaluateHand`)
- Types: PascalCase with descriptive names (e.g., `GameState`, `AIConfiguration`)

## Performance Considerations
- Optimize game rendering for smooth animations
- Implement efficient state management for real-time updates
- Use React.memo for expensive game calculations
- Implement proper cleanup for training processes
