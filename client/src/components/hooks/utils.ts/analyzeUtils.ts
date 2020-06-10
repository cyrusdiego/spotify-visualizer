import { ICanvasInfo } from '../types/analyzeTypes';
let beatIndex = 0;
// this should be moved to render utils
// pretty sure this calculation is wrong...
export const getTimeDiff = (
  interval: number, // time between beats
  timeMeasured: number, // time the elapsed time was recieved from api
  trackProgress: number // elapsed time of track
): number => {
  const half = interval / 2;
  const correctedTrackProgress =
    trackProgress + (window.performance.now() / 1000 - timeMeasured);
  const startingBeatIndex = getCurrentBeatIndex(
    correctedTrackProgress,
    interval
  );
  const nextBeatTime = startingBeatIndex * interval;
  const timeWindowMs = nextBeatTime - correctedTrackProgress;
  return timeWindowMs < half ? timeWindowMs + half : timeWindowMs - half;
};

export const getCurrentBeatIndex = (total: number, period: number) => {
  if (beatIndex !== 0) return beatIndex;
  else {
    beatIndex = Math.round(total / period);
    return beatIndex;
  }
};

export const setInitialCanvas = (): ICanvasInfo => {
  return {
    context: null,
    height: 0,
    width: 0,
    maxBarHeight: 0,
  };
};
