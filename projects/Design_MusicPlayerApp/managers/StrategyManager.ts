/**
 * StrategyManager — SINGLETON
 *
 * Pattern: Singleton (registry of Strategy objects)
 *
 * Why:
 *   Strategy objects are created once and reused. Callers ask for a
 *   StrategyType and never `new` a strategy themselves, so adding a new
 *   play mode only touches this file and the enum.
 */
import { StrategyType } from "../enums/StrategyType";
import { CustomQueuePlayStrategy } from "../strategies/CustomQueuePlayStrategy";
import { PlayStrategy } from "../strategies/PlayStrategy";
import { RandomPlayStrategy } from "../strategies/RandomPlayStrategy";
import { SequentialPlayStrategy } from "../strategies/SequentialPlayStrategy";

export class StrategyManager {
  private static instance: StrategyManager | null = null;

  private readonly sequentialStrategy = new SequentialPlayStrategy();
  private readonly randomStrategy = new RandomPlayStrategy();
  private readonly customQueueStrategy = new CustomQueuePlayStrategy();

  private constructor() {}

  static getInstance(): StrategyManager {
    if (!StrategyManager.instance) {
      StrategyManager.instance = new StrategyManager();
    }
    return StrategyManager.instance;
  }

  getStrategy(strategyType: StrategyType): PlayStrategy {
    switch (strategyType) {
      case StrategyType.SEQUENTIAL:
        return this.sequentialStrategy;
      case StrategyType.RANDOM:
        return this.randomStrategy;
      case StrategyType.CUSTOM_QUEUE:
        return this.customQueueStrategy;
      default: {
        const unknown: never = strategyType;
        throw new Error(`Unsupported strategy type: ${unknown}`);
      }
    }
  }
}
