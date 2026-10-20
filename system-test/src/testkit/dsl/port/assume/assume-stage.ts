import type { AssumeRunning } from './steps/assume-running.js';

export interface AssumeStage {
  skyTravel(): AssumeRunning;
  erp(): AssumeRunning;
  tax(): AssumeRunning;
  clock(): AssumeRunning;
}
