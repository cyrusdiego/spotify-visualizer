import { ICanvasInfo } from '../types/analyzeTypes';

export const getTimeDiff = (interval: number, beatIdx: number): number => {
  const half = interval / 2;
  const current = window.performance.now();
  const nextBeat = beatIdx * interval;
  const delta = nextBeat - current;
  return delta < half ? half - delta : delta + half;
  // const timeDifference = window.performance.now() - elapsedTime;
  // const pause = timeDifference - interval;
  // return timeDifference > 0 ? -2 * pause : pause;
};

export const setInitialCanvas = (): ICanvasInfo => {
  return {
    context: null,
    height: 0,
    width: 0,
    maxBarHeight: 0,
  };
};
