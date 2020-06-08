import { useState, useEffect } from 'react';
import { ITrackAnalysisState } from './UseSpotifyHooks';

export const useAnalyzeHooks = (
  trackAnalysis: ITrackAnalysisState,
  elapsedTime: number
) => {
  const [startingBeat, setStartingBeat] = useState(-1);
  const [calcBpm, setCalcBpm] = useState(0);
  const [freqSpectrum, setFreqSpectrum] = useState([[0]]);
  useEffect(() => {
    // refactor this to put in utils
    const getActiveBeatInterval = (): number => {
      if (elapsedTime === -1) return -1;
      const tatums = trackAnalysis.tatums;
      for (let i = 0; i < tatums.length; i++) {
        const interval = tatums[i];
        const end = interval.duration + interval.start;
        const start = interval.start;
        if (start <= elapsedTime / 1000 && elapsedTime / 1000 <= end) {
          return i;
        }
      }
      return tatums.length - 1;
    };
    const getBpm = (): number => {
      const beats = trackAnalysis.segments;
      const bpm =
        60 /
        (beats.reduce((total, beat) => total + beat.duration, 0) /
          beats.length) /
        2;
      return bpm;
    };
    setCalcBpm(getBpm());
    setStartingBeat(getActiveBeatInterval());
  }, [trackAnalysis]);

  useEffect(() => {
    const getFreqencySpectrum = (): number[][] => {
      const segments = trackAnalysis.segments;
      const tatum = trackAnalysis.tatums;
      let segmentActiveInterval = -1;
      for (let i = 0; i < segments.length; i++) {
        const interval = segments[i];
        const end = interval.duration + interval.start;
        const start = interval.start;
        if (start <= elapsedTime / 1000 && elapsedTime / 1000 <= end)
          segmentActiveInterval = i;
      }
      if (segmentActiveInterval !== -1 && startingBeat !== -1) {
        let frequencies = [];
        let tatumIdx = startingBeat;
        let currentFrequencies = new Array(12).fill(0);
        for (let i = segmentActiveInterval; i < segments.length; i++) {
          const segmentEnd = segments[i].start + segments[i].duration;
          const tatumEnd = tatum[tatumIdx].start + tatum[tatumIdx].duration;
          if (segmentEnd >= tatumEnd) {
            tatumIdx++;
            currentFrequencies.forEach((f) => f / 12);
            frequencies.push(currentFrequencies);
            currentFrequencies = new Array(12).fill(0);
          }
          currentFrequencies = currentFrequencies.map(
            (f, idx) => f + segments[i].pitches[idx]
          );
        }
        return frequencies;
      }
      return [[]];
    };
    setFreqSpectrum(getFreqencySpectrum());
  }, [trackAnalysis, startingBeat]);

  return {
    calcBpm,
    freqSpectrum,
  };
};
