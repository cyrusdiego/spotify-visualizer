import { useState, useEffect } from 'react';
import { ITrackAnalysis } from './UseSpotifyHooks';

interface ITrackCalculations {
  bpm: number;
  spectrum: number[][];
}

// create strongly typed return type
export const useAnalyzeHooks = (
  trackAnalysis: ITrackAnalysis
): ITrackCalculations => {
  const [bpm, setbpm] = useState(0);
  const [spectrum, setSpectrum] = useState([[0]]);

  // gets BPM using average tempo across sections
  useEffect(() => {
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
    setbpm(getBpm());
  }, [trackAnalysis]);

  // get chromatic spectrum array
  useEffect(() => {
    const getFreqencySpectrum = (): number[][] => {
      // only start calculations when track analysis comes back
      if (trackAnalysis.segments[0] && trackAnalysis.beats[0]) {
        const segments = trackAnalysis.segments;
        const beats = trackAnalysis.beats;
        let prevSegmentIndex = 0;
        let beatIndex = 0;
        let frequencies: number[][] = [];
        let currentFrequencies: number[] = new Array(12).fill(0);
        for (let i = 0; i < segments.length; i++) {
          if (beatIndex >= beats.length) break;
          const segmentEnd = segments[i].start + segments[i].duration;
          const beatStart = beats[beatIndex].start;
          if (segmentEnd >= beatStart) {
            beatIndex += 1;
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
      return [[0]];
    };
    setSpectrum(getFreqencySpectrum());
  }, [trackAnalysis]);

  return {
    bpm,
    spectrum,
  };
};
