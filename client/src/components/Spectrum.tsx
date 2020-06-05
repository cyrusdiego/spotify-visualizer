import React, { FC, useEffect } from 'react';
import './styling/Spectrum.css';
import { segment, section, timeInterval } from '../api/spotify';
import { useSyncHooks } from './hooks/UseSyncHooks';

interface ISpectrumProps {
  accessToken: string;
  trackAnalysis: {
    segments: segment[];
    sections: section[];
    tatums: timeInterval[];
    beats: timeInterval[];
    bars: timeInterval[];
  };
  progress: number;
}

export const Spectrum: FC<ISpectrumProps> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const elapsedTime = props.progress;
  const { startingBeat, calcBpm } = useSyncHooks(
    props.trackAnalysis,
    elapsedTime
  );
  const sections = props.trackAnalysis.sections;
  useEffect(() => {
    let current = canvas.current;
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let currentGoal = 100;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);
    let bpm = sections[0] ? sections[0].tempo : 0;
    const interval = (1 / bpm) * 60;
    const fps = 60;
    const bars = 12;
    const delta = (0.5 * (fps * fps)) / bpm;

    const render = () => {
      timeoutId = setTimeout(() => {
        if (current) {
          const ctx = current.getContext('2d')!!;
          ctx.clearRect(
            0,
            ctx.canvas.height,
            ctx.canvas.width,
            -ctx.canvas.height
          );
          ctx.fillRect(0, ctx.canvas.height, ctx.canvas.width / bars, -i);
          ctx.fillStyle = 'white';
          ctx.fill();
          requestId = requestAnimationFrame(render);
        }
        if (i < currentGoal) {
          i += diffGoal / delta;
        } else if (
          currentGoal - diffGoal / delta <= i &&
          i <= currentGoal + diffGoal / delta
        ) {
          currentGoal = currentGoal === 0 ? 100 : 0;
        } else {
          i -= diffGoal / delta;
        }
      }, 1000 / fps);
    };

    const timeDifference = window.performance.now() - elapsedTime;
    setTimeout(() => {}, Math.abs(timeDifference - interval));
    render();

    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  }, [startingBeat]);

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
