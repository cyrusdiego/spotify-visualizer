export const getTimeDiff = (
  interval: number, // time between beats
  timeMeasured: number, // time the elapsed time was recieved from api
  trackProgress: number // elapsed time of track
): { pause: number; startingBeat: number } => {
  if (!isFinite(interval)) return { pause: 0, startingBeat: -1 };

  const half = interval / 2;
  const correctedTrackProgress =
    trackProgress + (window.performance.now() / 1000 - timeMeasured);
  const startingBeatIndex = Math.round(correctedTrackProgress / interval);
  const nextBeatTime = startingBeatIndex * interval;
  const timeWindowMs = nextBeatTime - correctedTrackProgress;
  const start = timeWindowMs < half ? timeWindowMs + half : timeWindowMs - half;
  const actualStartingBeatIndex =
    timeWindowMs < half ? startingBeatIndex + 1 : startingBeatIndex;

  return { pause: start, startingBeat: actualStartingBeatIndex };
};
