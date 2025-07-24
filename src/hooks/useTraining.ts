'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChessTrainingEngine, TrainingSession, TrainingMetrics, GameResult } from '../lib/ai/TrainingEngine';
import { ChessAIAgent, LearningParameters } from '../lib/ai/ChessAIAgent';

export interface TrainingState {
  isTraining: boolean;
  currentSession: TrainingSession | null;
  metrics: TrainingMetrics | null;
  recentGames: GameResult[];
  agents: ChessAIAgent[];
  progress: number;
}

export interface UseTrainingReturn {
  state: TrainingState;
  actions: {
    startTraining: (agent1: ChessAIAgent, agent2: ChessAIAgent, targetGames?: number) => Promise<string>;
    stopTraining: () => void;
    createAgent: (name: string, learningParams?: Partial<LearningParameters>) => ChessAIAgent;
    saveAgent: (agent: ChessAIAgent) => void;
    loadAgent: (agentId: string) => ChessAIAgent | null;
    updateAgentParams: (agentId: string, params: Partial<LearningParameters>) => void;
    exportSession: (sessionId: string) => string;
    getStoredAgents: () => string[];
  };
}

export const useTraining = (): UseTrainingReturn => {
  const [state, setState] = useState<TrainingState>({
    isTraining: false,
    currentSession: null,
    metrics: null,
    recentGames: [],
    agents: [],
    progress: 0,
  });

  const trainingEngineRef = useRef<ChessTrainingEngine | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  // Initialize training engine
  useEffect(() => {
    trainingEngineRef.current = new ChessTrainingEngine();
    
    // Load existing agents from storage
    const storedAgentIds = trainingEngineRef.current.listStoredAgents();
    const loadedAgents = storedAgentIds.map(id => 
      trainingEngineRef.current!.loadAgentFromStorage(id)
    ).filter(Boolean) as ChessAIAgent[];

    setState(prev => ({ ...prev, agents: loadedAgents }));

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Update training metrics periodically
  const updateMetrics = useCallback(() => {
    if (!trainingEngineRef.current || !currentSessionIdRef.current) return;

    const session = trainingEngineRef.current.getSessionStatus(currentSessionIdRef.current);
    const metrics = trainingEngineRef.current.getTrainingMetrics(currentSessionIdRef.current);
    const recentGames = trainingEngineRef.current.getRecentGames(10);

    setState(prev => ({
      ...prev,
      currentSession: session,
      metrics,
      recentGames,
      progress: session ? (session.gamesPlayed / session.targetGames) * 100 : 0,
      isTraining: session ? session.isRunning : false,
    }));

    // If training is complete, stop the update interval
    if (session && !session.isRunning) {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }
  }, []);

  const startTraining = useCallback(async (
    agent1: ChessAIAgent,
    agent2: ChessAIAgent,
    targetGames: number = 100
  ): Promise<string> => {
    if (!trainingEngineRef.current) {
      throw new Error('Training engine not initialized');
    }

    try {
      const sessionId = await trainingEngineRef.current.startTrainingSession(
        agent1,
        agent2,
        targetGames
      );

      currentSessionIdRef.current = sessionId;

      setState(prev => ({
        ...prev,
        isTraining: true,
        progress: 0,
      }));

      // Start periodic updates
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      updateIntervalRef.current = setInterval(updateMetrics, 1000);

      return sessionId;
    } catch (error) {
      console.error('Failed to start training:', error);
      throw error;
    }
  }, [updateMetrics]);

  const stopTraining = useCallback(() => {
    if (!trainingEngineRef.current || !currentSessionIdRef.current) return;

    trainingEngineRef.current.stopTrainingSession(currentSessionIdRef.current);
    
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isTraining: false,
    }));
  }, []);

  const createAgent = useCallback((
    name: string,
    learningParams?: Partial<LearningParameters>
  ): ChessAIAgent => {
    if (!trainingEngineRef.current) {
      throw new Error('Training engine not initialized');
    }

    const agent = trainingEngineRef.current.createAgent(name, learningParams);
    
    setState(prev => ({
      ...prev,
      agents: [...prev.agents, agent],
    }));

    return agent;
  }, []);

  const saveAgent = useCallback((agent: ChessAIAgent) => {
    if (!trainingEngineRef.current) return;

    trainingEngineRef.current.saveAgentToStorage(agent);
    
    // Update the agent in the state
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(a => a.id === agent.id ? agent : a),
    }));
  }, []);

  const loadAgent = useCallback((agentId: string): ChessAIAgent | null => {
    if (!trainingEngineRef.current) return null;

    const agent = trainingEngineRef.current.loadAgentFromStorage(agentId);
    if (agent) {
      setState(prev => ({
        ...prev,
        agents: prev.agents.some(a => a.id === agent.id) 
          ? prev.agents.map(a => a.id === agent.id ? agent : a)
          : [...prev.agents, agent],
      }));
    }

    return agent;
  }, []);

  const updateAgentParams = useCallback((
    agentId: string,
    params: Partial<LearningParameters>
  ) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent => {
        if (agent.id === agentId) {
          agent.adjustLearningParameters(params);
        }
        return agent;
      }),
    }));
  }, []);

  const exportSession = useCallback((sessionId: string): string => {
    if (!trainingEngineRef.current) {
      throw new Error('Training engine not initialized');
    }

    return trainingEngineRef.current.exportTrainingData(sessionId);
  }, []);

  const getStoredAgents = useCallback((): string[] => {
    if (!trainingEngineRef.current) return [];
    return trainingEngineRef.current.listStoredAgents();
  }, []);

  return {
    state,
    actions: {
      startTraining,
      stopTraining,
      createAgent,
      saveAgent,
      loadAgent,
      updateAgentParams,
      exportSession,
      getStoredAgents,
    },
  };
};
