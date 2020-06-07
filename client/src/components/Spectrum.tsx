import React, { FC } from 'react';
import { IAudioAnalysis } from '../api/spotify';
import { useAnalyzeHooks } from './hooks/UseAnalyzeHooks';
import './styling/Spectrum.css';
import { useRenderHooks } from './hooks/UseRenderHooks';

interface ISpectrumProps {
  trackAnalysis: IAudioAnalysis;
  progress: number;
}

export const Spectrum: FC<ISpectrumProps> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const elapsedTime = props.progress;
  const trackAnalysis = props.trackAnalysis;
  const { calcBpm, freqSpectrum } = useAnalyzeHooks(trackAnalysis, elapsedTime);
  useRenderHooks(canvas, elapsedTime, calcBpm);

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
