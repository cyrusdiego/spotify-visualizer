import React, { FC, useEffect } from 'react';
import './styling/Spectrum.css';
import { segment, section } from '../api/spotify';

interface ISpectrumProps {
  segments: segment[];
  sections: section[];
}

const colors = ['white', 'red', 'blue', 'green'];

export const Spectrum: FC<ISpectrumProps> = ({ segments, sections }) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let current = canvas.current;
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let currentGoal = 100;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);
    let bpm = sections[0] ? Math.round(sections[0].tempo) : 0;
    console.log(bpm);
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
          if (currentGoal === 0) {
            console.log('b');
          }
        } else {
          i -= diffGoal / delta;
        }
      }, 1000 / fps);
    };

    render();

    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  }, [sections]);

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
