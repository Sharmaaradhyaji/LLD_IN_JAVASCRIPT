/**
 * StrategyType — the ways a playlist can be played.
 *
 * Each value maps to one PlayStrategy inside StrategyManager.
 */
export enum StrategyType {
  SEQUENTIAL = "SEQUENTIAL",
  RANDOM = "RANDOM",
  CUSTOM_QUEUE = "CUSTOM_QUEUE",
}
