// global to hold current beat index and avoid re calculation
let beatIndex = 0;

export const getTimeDiff = (
  interval: number, // time between beats
  timeMeasured: number, // time the elapsed time was recieved from api
  trackProgress: number // elapsed time of track
): number => {
  if (!isFinite(interval)) return 0;
  const half = interval / 2;
  const correctedTrackProgress =
    trackProgress + (window.performance.now() / 1000 - timeMeasured);
  beatIndex = 0;
  const startingBeatIndex = getCurrentBeatIndex(
    correctedTrackProgress,
    interval
  );
  const nextBeatTime = startingBeatIndex * interval;
  const timeWindowMs = nextBeatTime - correctedTrackProgress;
  return timeWindowMs < half ? timeWindowMs + half : timeWindowMs - half;
};

// experiment with the returning beat index
export const getCurrentBeatIndex = (total: number, period: number) => {
  if (beatIndex !== 0) return beatIndex;
  else {
    beatIndex = Math.round(total / period);
    return beatIndex;
  }
};
