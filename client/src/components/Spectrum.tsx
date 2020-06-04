import React, { FC, useEffect } from 'react';
import './styling/Spectrum.css';
import { segment, section, timeInterval } from '../api/spotify';

interface ISpectrumProps {
  segments: segment[];
  sections: section[];
  tatums: timeInterval[];
}

const colors = ['white', 'red', 'blue', 'green'];

export const Spectrum: FC<ISpectrumProps> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const sections = props.sections;
  const tatums = props.tatums;
  let time = 0;
  let idx = 1;
  let j = 0;
  let currentDuration = sections[0] ? Math.round(sections[idx].start) : 0;
  // const timer = setInterval(() => {
  //   time += 1;
  //   if (currentDuration === time) {
  //     idx += 1;
  //     currentDuration = Math.round(sections[idx].start);
  //     j += 1;
  //   }
  // }, 1000);
  useEffect(() => {
    let current = canvas.current;
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let currentGoal = 100;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);
    console.log(tatums);
    console.log(tatums.reduce((total, tatum) => total + tatum.duration, 0));
    console.log(tatums.length);
    let bpm = tatums[0]
      ? tatums.reduce((total, tatum) => total + tatum.duration, 0) /
        tatums.length
      : 0;
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
          ctx.fillStyle = colors[j % colors.length];
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
  }, [sections]);

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
