import React, { FC, useEffect } from 'react';
import './styling/Spectrum.css';

export const Spectrum: FC<{}> = () => {
  const canvas = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let current = canvas.current;
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let currentGoal = 100;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);
    const fps = 60;
    let bpm = 137;
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
          ctx.fillRect(0.5, ctx.canvas.height, 50, -i);
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

    render();

    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  });

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
