import React, { FC } from 'react';
import { IAudioAnalysis } from '../api/spotify';
import { useAnalyzeHooks } from './hooks/UseAnalyzeHooks';
import './styling/Spectrum.css';
import { useRenderHooks } from './hooks/UseRenderHooks';

interface ISpectrumProps {
  trackAnalysis: IAudioAnalysis;
  trackProgress: number;
  timeMeasured: number;
  duration: number;
}

export const Spectrum: FC<ISpectrumProps> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const trackProgress = props.trackProgress;
  const trackAnalysis = props.trackAnalysis;
  const timeMeasured = props.timeMeasured;
  const height = window.innerHeight;
  const width = window.innerWidth;
  const { bpm, spectrum } = useAnalyzeHooks(trackAnalysis);
  useRenderHooks(canvas, trackProgress, bpm, spectrum, timeMeasured);
  return (
    <div className='spectrum_container'>
      <canvas
        ref={canvas}
        className='spectrum'
        height={height}
        width={width}
      ></canvas>
    </div>
  );
};
