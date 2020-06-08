import { ICanvasInfo } from '../types/analyzeTypes';

export const getTimeDiff = (interval: number, elapsedTime: number): number => {
  const timeDifference = window.performance.now() - elapsedTime;
  const pause = timeDifference - interval;
  return timeDifference > 0 ? -2 * pause : pause;
};

export const setInitialCanvas = (): ICanvasInfo => {
  return {
    context: null,
    height: 0,
    width: 0,
    maxBarHeight: 0,
  };
};
