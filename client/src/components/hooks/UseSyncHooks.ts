import { useState, useEffect } from 'react';
import { ITrackAnalysisState } from './UseSpotifyHooks';

export const useSyncHooks = (
  trackAnalysis: ITrackAnalysisState,
  elapsedTime: number
) => {
  const [startingBeat, setStartingBeat] = useState(-1);
  const [calcBpm, setCalcBpm] = useState(0);
  useEffect(() => {
    const getActiveBeatInterval = (): number => {
      if (elapsedTime === -1) return -1;
      const tatums = trackAnalysis.tatums;
      for (let i = 0; i < tatums.length; i++) {
        const interval = tatums[i];
        const end = interval.duration - interval.start;
        const start = interval.start;
        if (start <= elapsedTime && elapsedTime <= end) return i;
      }
      return tatums.length - 1;
    };
    const getBpm = (): number => {
      const beats = trackAnalysis.beats;
      return (
        60 /
        (beats.reduce((total, beat) => total + beat.duration, 0) / beats.length)
      );
    };
    setCalcBpm(getBpm());
    setStartingBeat(getActiveBeatInterval());
  }, [trackAnalysis]);

  return {
    startingBeat,
    calcBpm,
  };
};
