import { ICanvasInfo } from '../types/analyzeTypes';

export const getTimeDiff = (
  interval: number,
  beatIdx: number,
  appStart: number,
  elapsed: number
): number => {
  const half = interval / 2;
  const nextBeat = beatIdx * interval;
  const delta = Math.abs(nextBeat - elapsed / 1000);

  return delta < half ? half - delta : delta + half;
};

export const setInitialCanvas = (): ICanvasInfo => {
  return {
    context: null,
    height: 0,
    width: 0,
    maxBarHeight: 0,
  };
};
