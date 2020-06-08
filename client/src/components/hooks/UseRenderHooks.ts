import { useState, useEffect } from 'react';
import { getTimeDiff, setInitialCanvas } from './utils.ts/analyzeUtils';

export const useRenderHooks = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elapsedTime: number,
  bpm: number,
  spectrum: number[][]
) => {
  const [canvas, setCanvas] = useState(setInitialCanvas());
  const interval = (1 / bpm) * 60;
  const fps = 60;
  const bars = 12;
  const delta = (0.5 * (fps * fps)) / bpm;
  useEffect(() => {
    if (canvasRef.current) {
      setCanvas({
        context: canvasRef.current.getContext('2d'),
        height: canvasRef.current.height,
        width: canvasRef.current.width,
        maxBarHeight: -canvasRef.current.height,
      });
    }
  }, [canvasRef]);
  let heights = [150, 75];
  let colors = ['white', 'red', 'blue', 'green'];
  let colorIdx = 0;
  useEffect(() => {
    // refactor this
    if (
      !canvas.context ||
      bpm === 0 ||
      elapsedTime === -1 ||
      spectrum.length < 0 ||
      !spectrum[0][0]
    ) {
      return;
    }
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let idx = 0;
    let currentGoal = heights[idx];
    // let currentGoal = spectrum[0][2] * canvas.height;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);

    const update = () => {
      // double check logic here and make it cleaner
      if (currentGoal === 0) {
        if (i > currentGoal) {
          i -= diffGoal / delta;
        } else {
          currentGoal = heights[idx % heights.length];
        }
      } else {
        if (i < currentGoal) {
          i += diffGoal / delta;
        } else {
          idx += 1;
          colorIdx += 1;
          oldGoal = currentGoal;
          currentGoal = oldGoal === 0 ? heights[idx % heights.length] : 0;
          // currentGoal = heights[idx % heights.length];
          // currentGoal =
          //   spectrum[idx % spectrum.length][2] > 1
          //     ? 0.9 * canvas.height
          //     : spectrum[idx % spectrum.length][2] * canvas.height;
          currentGoal = Math.round(currentGoal);
          diffGoal = Math.abs(currentGoal - oldGoal);
        }
      }
    };
    const draw = () => {
      const ctx = canvas.context!!;
      ctx.clearRect(0, canvas.height, canvas.width, canvas.maxBarHeight);
      ctx.fillRect(0, canvas.height, canvas.width / bars, -i);
      ctx.fillStyle = '#8d99ae';
      ctx.fill();
    };
    const animate = () => {
      timeoutId = setTimeout(() => {
        update();
        draw();
        requestId = requestAnimationFrame(animate);
      }, 1000 / fps);
    };

    setTimeout(() => {}, getTimeDiff(interval, elapsedTime));
    animate();

    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  }, [bpm, elapsedTime, spectrum]);
};
