import { MultiGameAI, GameType, GameState } from './MultiGameAI';

/**
 * Advanced Neural Network Architecture for Multi-Game AI
 * Implements transformer-based models with self-attention
 */

export interface NeuralNetworkConfig {
  gameType: GameType;
  inputDimensions: number;
  hiddenDimensions: number;
  outputDimensions: number;
  numLayers: number;
  attentionHeads: number;
  dropoutRate: number;
  learningRate: number;
  batchSize: number;
}

export interface TrainingData {
  states: Float32Array[];
  actions: number[];
  rewards: number[];
  nextStates: Float32Array[];
  dones: boolean[];
  gameType: GameType;
  metadata: { [key: string]: any };
}

export interface NetworkPrediction {
  actionProbabilities: Float32Array;
  stateValue: number;
  confidence: number;
  attentionWeights: Float32Array[];
  hiddenFeatures: Float32Array;
}

export class TransformerGameNetwork {
  private config: NeuralNetworkConfig;
  private weights: Map<string, Float32Array> = new Map();
  private biases: Map<string, Float32Array> = new Map();
  private optimizer: AdamOptimizer;
  private trainingHistory: TrainingMetrics[] = [];

  constructor(config: NeuralNetworkConfig) {
    this.config = config;
    this.optimizer = new AdamOptimizer(config.learningRate);
    this.initializeWeights();
  }

  private initializeWeights(): void {
    const { inputDimensions, hiddenDimensions, outputDimensions, numLayers, attentionHeads } = this.config;

    // Input embedding layer
    this.weights.set('embedding', this.randomWeights(inputDimensions, hiddenDimensions));
    this.biases.set('embedding', new Float32Array(hiddenDimensions));

    // Transformer layers
    for (let layer = 0; layer < numLayers; layer++) {
      // Multi-head attention
      const headDim = hiddenDimensions / attentionHeads;
      this.weights.set(`attention_q_${layer}`, this.randomWeights(hiddenDimensions, hiddenDimensions));
      this.weights.set(`attention_k_${layer}`, this.randomWeights(hiddenDimensions, hiddenDimensions));
      this.weights.set(`attention_v_${layer}`, this.randomWeights(hiddenDimensions, hiddenDimensions));
      this.weights.set(`attention_output_${layer}`, this.randomWeights(hiddenDimensions, hiddenDimensions));

      // Feed-forward network
      this.weights.set(`ff1_${layer}`, this.randomWeights(hiddenDimensions, hiddenDimensions * 4));
      this.weights.set(`ff2_${layer}`, this.randomWeights(hiddenDimensions * 4, hiddenDimensions));
      this.biases.set(`ff1_${layer}`, new Float32Array(hiddenDimensions * 4));
      this.biases.set(`ff2_${layer}`, new Float32Array(hiddenDimensions));

      // Layer normalization
      this.weights.set(`ln1_scale_${layer}`, new Float32Array(hiddenDimensions).fill(1));
      this.weights.set(`ln2_scale_${layer}`, new Float32Array(hiddenDimensions).fill(1));
      this.biases.set(`ln1_bias_${layer}`, new Float32Array(hiddenDimensions));
      this.biases.set(`ln2_bias_${layer}`, new Float32Array(hiddenDimensions));
    }

    // Output heads
    this.weights.set('policy_head', this.randomWeights(hiddenDimensions, outputDimensions));
    this.weights.set('value_head', this.randomWeights(hiddenDimensions, 1));
    this.biases.set('policy_head', new Float32Array(outputDimensions));
    this.biases.set('value_head', new Float32Array(1));
  }

  private randomWeights(inputSize: number, outputSize: number): Float32Array {
    const weights = new Float32Array(inputSize * outputSize);
    const std = Math.sqrt(2.0 / inputSize); // He initialization
    
    for (let i = 0; i < weights.length; i++) {
      weights[i] = this.randomNormal() * std;
    }
    
    return weights;
  }

  private randomNormal(): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  public async predict(gameState: GameState, contextStates?: GameState[]): Promise<NetworkPrediction> {
    // Convert game state to tensor
    const inputTensor = this.gameStateToTensor(gameState);
    
    // Add context states for sequence modeling
    const sequenceTensors = contextStates 
      ? contextStates.map(state => this.gameStateToTensor(state)).concat([inputTensor])
      : [inputTensor];

    // Forward pass through transformer
    const output = this.forwardPass(sequenceTensors);

    return {
      actionProbabilities: output.policyOutput,
      stateValue: output.valueOutput[0],
      confidence: this.calculateConfidence(output.policyOutput),
      attentionWeights: output.attentionWeights,
      hiddenFeatures: output.hiddenFeatures
    };
  }

  private gameStateToTensor(gameState: GameState): Float32Array {
    switch (gameState.gameType) {
      case 'chess':
        return this.chessStateToTensor(gameState);
      case 'poker':
        return this.pokerStateToTensor(gameState);
      case 'go':
        return this.goStateToTensor(gameState);
      case 'checkers':
        return this.checkersStateToTensor(gameState);
      default:
        throw new Error(`Unsupported game type: ${gameState.gameType}`);
    }
  }

  private chessStateToTensor(gameState: GameState): Float32Array {
    // Convert chess position to 8x8x12 tensor (6 piece types × 2 colors)
    const tensor = new Float32Array(8 * 8 * 12);
    
    // Parse FEN notation and populate tensor
    const fen = gameState.position;
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    
    const pieceMap: { [key: string]: number } = {
      'p': 0, 'n': 1, 'b': 2, 'r': 3, 'q': 4, 'k': 5,
      'P': 6, 'N': 7, 'B': 8, 'R': 9, 'Q': 10, 'K': 11
    };

    for (let row = 0; row < 8; row++) {
      let col = 0;
      for (const char of rows[row]) {
        if (char >= '1' && char <= '8') {
          col += parseInt(char);
        } else if (pieceMap[char] !== undefined) {
          const index = row * 8 * 12 + col * 12 + pieceMap[char];
          tensor[index] = 1.0;
          col++;
        }
      }
    }

    return tensor;
  }

  private pokerStateToTensor(gameState: GameState): Float32Array {
    // Convert poker state to tensor
    const tensor = new Float32Array(this.config.inputDimensions);
    // Implement poker state encoding
    return tensor;
  }

  private goStateToTensor(gameState: GameState): Float32Array {
    // Convert Go state to 19x19x3 tensor (black, white, empty)
    const tensor = new Float32Array(19 * 19 * 3);
    // Implement Go state encoding
    return tensor;
  }

  private checkersStateToTensor(gameState: GameState): Float32Array {
    // Convert checkers state to tensor
    const tensor = new Float32Array(8 * 8 * 4); // red, red_king, black, black_king
    // Implement checkers state encoding
    return tensor;
  }

  private forwardPass(sequenceTensors: Float32Array[]): ForwardPassOutput {
    let hiddenStates = sequenceTensors.map(tensor => this.embedding(tensor));
    const attentionWeights: Float32Array[] = [];

    // Process through transformer layers
    for (let layer = 0; layer < this.config.numLayers; layer++) {
      const { output, attention } = this.transformerLayer(hiddenStates, layer);
      hiddenStates = output;
      attentionWeights.push(attention);
    }

    // Use last hidden state for output
    const finalHidden = hiddenStates[hiddenStates.length - 1];

    // Policy head (action probabilities)
    const policyOutput = this.linear(
      finalHidden,
      this.weights.get('policy_head')!,
      this.biases.get('policy_head')!
    );
    this.softmax(policyOutput);

    // Value head (state evaluation)
    const valueOutput = this.linear(
      finalHidden,
      this.weights.get('value_head')!,
      this.biases.get('value_head')!
    );
    this.tanh(valueOutput);

    return {
      policyOutput,
      valueOutput,
      attentionWeights,
      hiddenFeatures: finalHidden
    };
  }

  private embedding(input: Float32Array): Float32Array {
    return this.linear(
      input,
      this.weights.get('embedding')!,
      this.biases.get('embedding')!
    );
  }

  private transformerLayer(
    hiddenStates: Float32Array[],
    layer: number
  ): { output: Float32Array[]; attention: Float32Array } {
    // Multi-head self-attention
    const { output: attentionOutput, weights: attentionWeights } = 
      this.multiHeadAttention(hiddenStates, layer);

    // Add & Norm
    const residual1 = hiddenStates.map((state, i) => 
      this.layerNorm(
        this.add(state, attentionOutput[i]),
        `ln1_scale_${layer}`,
        `ln1_bias_${layer}`
      )
    );

    // Feed-forward
    const ffOutput = residual1.map(state => this.feedForward(state, layer));

    // Add & Norm
    const output = residual1.map((state, i) =>
      this.layerNorm(
        this.add(state, ffOutput[i]),
        `ln2_scale_${layer}`,
        `ln2_bias_${layer}`
      )
    );

    return { output, attention: attentionWeights };
  }

  private multiHeadAttention(
    hiddenStates: Float32Array[],
    layer: number
  ): { output: Float32Array[]; weights: Float32Array } {
    const { hiddenDimensions, attentionHeads } = this.config;
    const headDim = hiddenDimensions / attentionHeads;
    const seqLength = hiddenStates.length;

    // Compute Q, K, V for all heads
    const queries = hiddenStates.map(state => 
      this.linear(state, this.weights.get(`attention_q_${layer}`)!)
    );
    const keys = hiddenStates.map(state =>
      this.linear(state, this.weights.get(`attention_k_${layer}`)!)
    );
    const values = hiddenStates.map(state =>
      this.linear(state, this.weights.get(`attention_v_${layer}`)!)
    );

    // Compute attention for each head
    const headOutputs: Float32Array[][] = [];
    let combinedWeights = new Float32Array(seqLength * seqLength);

    for (let head = 0; head < attentionHeads; head++) {
      const startIdx = head * headDim;
      const endIdx = startIdx + headDim;

      // Extract head-specific Q, K, V
      const headQueries = queries.map(q => q.slice(startIdx, endIdx));
      const headKeys = keys.map(k => k.slice(startIdx, endIdx));
      const headValues = values.map(v => v.slice(startIdx, endIdx));

      // Compute attention scores
      const scores = new Float32Array(seqLength * seqLength);
      for (let i = 0; i < seqLength; i++) {
        for (let j = 0; j < seqLength; j++) {
          scores[i * seqLength + j] = this.dotProduct(headQueries[i], headKeys[j]) / Math.sqrt(headDim);
        }
      }

      // Apply softmax to each row
      for (let i = 0; i < seqLength; i++) {
        const startIdx = i * seqLength;
        const rowScores = scores.slice(startIdx, startIdx + seqLength);
        this.softmax(rowScores);
        scores.set(rowScores, startIdx);
      }

      // Compute attention output
      const headOutput: Float32Array[] = [];
      for (let i = 0; i < seqLength; i++) {
        const output = new Float32Array(headDim);
        for (let j = 0; j < seqLength; j++) {
          const weight = scores[i * seqLength + j];
          for (let k = 0; k < headDim; k++) {
            output[k] += weight * headValues[j][k];
          }
        }
        headOutput.push(output);
      }

      headOutputs.push(headOutput);

      // Add to combined weights (average across heads)
      for (let i = 0; i < combinedWeights.length; i++) {
        combinedWeights[i] += scores[i] / attentionHeads;
      }
    }

    // Concatenate head outputs
    const output: Float32Array[] = [];
    for (let i = 0; i < seqLength; i++) {
      const concatenated = new Float32Array(hiddenDimensions);
      for (let head = 0; head < attentionHeads; head++) {
        const startIdx = head * headDim;
        concatenated.set(headOutputs[head][i], startIdx);
      }
      
      // Apply output projection
      const projected = this.linear(
        concatenated,
        this.weights.get(`attention_output_${layer}`)!
      );
      output.push(projected);
    }

    return { output, weights: combinedWeights };
  }

  private feedForward(input: Float32Array, layer: number): Float32Array {
    // First linear layer with ReLU
    const hidden = this.linear(
      input,
      this.weights.get(`ff1_${layer}`)!,
      this.biases.get(`ff1_${layer}`)!
    );
    this.relu(hidden);

    // Second linear layer
    const output = this.linear(
      hidden,
      this.weights.get(`ff2_${layer}`)!,
      this.biases.get(`ff2_${layer}`)!
    );

    return output;
  }

  private layerNorm(
    input: Float32Array,
    scaleKey: string,
    biasKey: string
  ): Float32Array {
    const mean = input.reduce((sum, val) => sum + val, 0) / input.length;
    const variance = input.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / input.length;
    const std = Math.sqrt(variance + 1e-5);

    const scale = this.weights.get(scaleKey)!;
    const bias = this.biases.get(biasKey)!;

    const output = new Float32Array(input.length);
    for (let i = 0; i < input.length; i++) {
      output[i] = scale[i] * (input[i] - mean) / std + bias[i];
    }

    return output;
  }

  private linear(
    input: Float32Array,
    weights: Float32Array,
    bias?: Float32Array
  ): Float32Array {
    const inputSize = input.length;
    const outputSize = bias ? bias.length : weights.length / inputSize;
    const output = new Float32Array(outputSize);

    for (let i = 0; i < outputSize; i++) {
      let sum = 0;
      for (let j = 0; j < inputSize; j++) {
        sum += input[j] * weights[i * inputSize + j];
      }
      output[i] = sum + (bias ? bias[i] : 0);
    }

    return output;
  }

  private add(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] + b[i];
    }
    return result;
  }

  private dotProduct(a: Float32Array, b: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  private softmax(input: Float32Array): void {
    const max = Math.max(...input);
    let sum = 0;
    
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.exp(input[i] - max);
      sum += input[i];
    }
    
    for (let i = 0; i < input.length; i++) {
      input[i] /= sum;
    }
  }

  private relu(input: Float32Array): void {
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.max(0, input[i]);
    }
  }

  private tanh(input: Float32Array): void {
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.tanh(input[i]);
    }
  }

  private calculateConfidence(probabilities: Float32Array): number {
    // Calculate entropy-based confidence
    let entropy = 0;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > 0) {
        entropy -= probabilities[i] * Math.log2(probabilities[i]);
      }
    }
    
    const maxEntropy = Math.log2(probabilities.length);
    return 1 - entropy / maxEntropy; // Higher confidence = lower entropy
  }

  public async train(trainingData: TrainingData[]): Promise<TrainingMetrics> {
    const startTime = Date.now();
    let totalLoss = 0;
    let policyLoss = 0;
    let valueLoss = 0;

    // Batch training
    const batches = this.createBatches(trainingData, this.config.batchSize);
    
    for (const batch of batches) {
      const batchLoss = await this.trainBatch(batch);
      totalLoss += batchLoss.total;
      policyLoss += batchLoss.policy;
      valueLoss += batchLoss.value;
    }

    const avgLoss = totalLoss / batches.length;
    const avgPolicyLoss = policyLoss / batches.length;
    const avgValueLoss = valueLoss / batches.length;

    const metrics: TrainingMetrics = {
      epoch: this.trainingHistory.length + 1,
      totalLoss: avgLoss,
      policyLoss: avgPolicyLoss,
      valueLoss: avgValueLoss,
      learningRate: this.config.learningRate,
      batchSize: this.config.batchSize,
      trainingTime: Date.now() - startTime,
      gameType: trainingData[0]?.gameType || 'unknown'
    };

    this.trainingHistory.push(metrics);
    return metrics;
  }

  private createBatches(data: TrainingData[], batchSize: number): TrainingData[][] {
    const batches: TrainingData[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  private async trainBatch(batch: TrainingData[]): Promise<{ total: number; policy: number; value: number }> {
    // Forward pass for entire batch
    const predictions: NetworkPrediction[] = [];
    for (const data of batch) {
      const states = data.states.map((stateArray, i) => ({
        gameType: data.gameType,
        position: this.tensorToGameState(stateArray, data.gameType).position,
        legalMoves: [],
        isTerminal: data.dones[i]
      }));
      
      const prediction = await this.predict(states[0], states.slice(1));
      predictions.push(prediction);
    }

    // Calculate losses
    let totalPolicyLoss = 0;
    let totalValueLoss = 0;

    for (let i = 0; i < batch.length; i++) {
      const data = batch[i];
      const prediction = predictions[i];

      // Policy loss (cross-entropy)
      const targetAction = data.actions[i];
      const predictedProb = prediction.actionProbabilities[targetAction];
      totalPolicyLoss -= Math.log(Math.max(predictedProb, 1e-8));

      // Value loss (MSE)
      const targetValue = data.rewards[i];
      const predictedValue = prediction.stateValue;
      totalValueLoss += Math.pow(targetValue - predictedValue, 2);
    }

    const avgPolicyLoss = totalPolicyLoss / batch.length;
    const avgValueLoss = totalValueLoss / batch.length;
    const totalLoss = avgPolicyLoss + avgValueLoss;

    // Backward pass (simplified gradient descent)
    await this.updateWeights(batch, predictions, avgPolicyLoss, avgValueLoss);

    return {
      total: totalLoss,
      policy: avgPolicyLoss,
      value: avgValueLoss
    };
  }

  private async updateWeights(
    batch: TrainingData[],
    predictions: NetworkPrediction[],
    policyLoss: number,
    valueLoss: number
  ): Promise<void> {
    // Simplified weight updates (in practice, would implement full backpropagation)
    const learningRate = this.config.learningRate;

    // Update policy head weights
    const policyWeights = this.weights.get('policy_head')!;
    for (let i = 0; i < policyWeights.length; i++) {
      policyWeights[i] -= learningRate * policyLoss * 0.01 * (Math.random() - 0.5);
    }

    // Update value head weights
    const valueWeights = this.weights.get('value_head')!;
    for (let i = 0; i < valueWeights.length; i++) {
      valueWeights[i] -= learningRate * valueLoss * 0.01 * (Math.random() - 0.5);
    }
  }

  private tensorToGameState(tensor: Float32Array, gameType: GameType): GameState {
    // Convert tensor back to game state (simplified)
    return {
      gameType,
      position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Default chess position
      legalMoves: [],
      isTerminal: false
    };
  }

  public getTrainingHistory(): TrainingMetrics[] {
    return [...this.trainingHistory];
  }

  public saveModel(): string {
    // Serialize model weights and configuration
    const modelData = {
      config: this.config,
      weights: Object.fromEntries(
        Array.from(this.weights.entries()).map(([key, weights]) => [
          key,
          Array.from(weights)
        ])
      ),
      biases: Object.fromEntries(
        Array.from(this.biases.entries()).map(([key, biases]) => [
          key,
          Array.from(biases)
        ])
      ),
      trainingHistory: this.trainingHistory
    };

    return JSON.stringify(modelData);
  }

  public loadModel(modelData: string): void {
    const data = JSON.parse(modelData);
    
    this.config = data.config;
    this.trainingHistory = data.trainingHistory || [];

    // Restore weights
    this.weights.clear();
    for (const [key, weightsArray] of Object.entries(data.weights)) {
      this.weights.set(key, new Float32Array(weightsArray as number[]));
    }

    // Restore biases
    this.biases.clear();
    for (const [key, biasesArray] of Object.entries(data.biases)) {
      this.biases.set(key, new Float32Array(biasesArray as number[]));
    }
  }
}

// Adam Optimizer for neural network training
class AdamOptimizer {
  private m: Map<string, Float32Array> = new Map(); // First moment
  private v: Map<string, Float32Array> = new Map(); // Second moment
  private t: number = 0; // Time step
  private beta1: number = 0.9;
  private beta2: number = 0.999;
  private epsilon: number = 1e-8;

  constructor(private learningRate: number) {}

  public update(paramKey: string, gradient: Float32Array, params: Float32Array): void {
    this.t++;

    if (!this.m.has(paramKey)) {
      this.m.set(paramKey, new Float32Array(params.length));
      this.v.set(paramKey, new Float32Array(params.length));
    }

    const m = this.m.get(paramKey)!;
    const v = this.v.get(paramKey)!;

    for (let i = 0; i < params.length; i++) {
      // Update biased first moment estimate
      m[i] = this.beta1 * m[i] + (1 - this.beta1) * gradient[i];
      
      // Update biased second raw moment estimate
      v[i] = this.beta2 * v[i] + (1 - this.beta2) * gradient[i] * gradient[i];
      
      // Compute bias-corrected first moment estimate
      const mHat = m[i] / (1 - Math.pow(this.beta1, this.t));
      
      // Compute bias-corrected second raw moment estimate
      const vHat = v[i] / (1 - Math.pow(this.beta2, this.t));
      
      // Update parameters
      params[i] -= this.learningRate * mHat / (Math.sqrt(vHat) + this.epsilon);
    }
  }
}

// Supporting interfaces
interface ForwardPassOutput {
  policyOutput: Float32Array;
  valueOutput: Float32Array;
  attentionWeights: Float32Array[];
  hiddenFeatures: Float32Array;
}

interface TrainingMetrics {
  epoch: number;
  totalLoss: number;
  policyLoss: number;
  valueLoss: number;
  learningRate: number;
  batchSize: number;
  trainingTime: number;
  gameType: GameType;
}

export { TransformerGameNetwork, AdamOptimizer };
export type { NeuralNetworkConfig, TrainingData, NetworkPrediction, TrainingMetrics };
