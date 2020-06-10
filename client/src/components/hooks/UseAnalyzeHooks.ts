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
    const getBpm = (): number => {
      if (trackAnalysis.sections) {
        const sections = trackAnalysis.sections;
        const averageTempo =
          sections.reduce((total, section) => total + section.tempo, 0) /
          sections.length;
        return Math.round(averageTempo);
      }
      return 0;
    };
    setCalcBpm(getBpm());
  }, [trackAnalysis]);
  useEffect(() => {
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
    setStartingBeat(getActiveBeatInterval());
  }, [elapsedTime, trackAnalysis]);
  useEffect(() => {
    const getFreqencySpectrum = (): number[][] => {
      const segments = trackAnalysis.segments;
      const tatum = trackAnalysis.tatums;
      let segmentActiveInterval = -1;
      for (let i = 0; i < segments.length; i++) {
        const interval = segments[i];
        const end = interval.duration + interval.start;
        const start = interval.start;
        if (start <= elapsedTime / 1000 && elapsedTime / 1000 <= end) {
          segmentActiveInterval = i;
          break;
        }
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
  }, [trackAnalysis, startingBeat, elapsedTime]);

  return {
    calcBpm,
    freqSpectrum,
    startingBeat,
  };
};
