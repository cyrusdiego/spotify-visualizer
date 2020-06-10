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
      if (!trackAnalysis.beats[0]) return 0;
      const beats = trackAnalysis.beats;
      const duration =
        beats.reduce((total, beat) => total + beat.duration, 0) +
        beats[0].start +
        beats[beats.length - 1].duration;
      const bpm = 60 / (duration / (beats.length + 2));
      return Math.round(bpm);
    };
    setCalcBpm(getBpm());
  }, [trackAnalysis]);
  useEffect(() => {
    const getActiveBeatInterval = (
      trackProgress: number,
      timeMeasured: number
    ): number => {
      if (trackProgress === -1 || !trackAnalysis.beats) return -1;
      const beats = trackAnalysis.beats;
      const delay = window.performance.now() / 1000 - timeMeasured; // seconds
      const actualTrackProgress = trackProgress + delay;
      for (let i = 0; i < beats.length; i++) {
        const interval = beats[i];
        const start = interval.start;
        const end = interval.duration + start;
        if (start <= actualTrackProgress && actualTrackProgress <= end) {
          return i;
        }
      }
      return beats.length - 1;
    };
    setStartingBeat(getActiveBeatInterval());
  }, [elapsedTime, trackAnalysis]);
  useEffect(() => {
    const getFreqencySpectrum = (): number[][] => {
      if (trackAnalysis.segments) {
        const segments = trackAnalysis.segments;
        const beats = trackAnalysis.beats;
        let prevSegmentIndex = 0;
        let beatIndex = 0;
        let frequencies: number[][] = [];
        let currentFrequencies: number[] = new Array(12).fill(0);
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
          const beatStart = beats[beatIndex].start;
          if (segmentEnd >= beatStart) {
            beatIndex++;
            const numberOfMeasurements = i - prevSegmentIndex;
            prevSegmentIndex = i;
            currentFrequencies = currentFrequencies.map(
              (f) => f / numberOfMeasurements
            );
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
