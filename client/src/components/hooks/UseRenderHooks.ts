import { useState, useEffect } from 'react';
import { getTimeDiff, setInitialCanvas } from './utils.ts/analyzeUtils';

export const useRenderHooks = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elapsedTime: number,
  bpm: number,
  spectrum: number[][],
  beatIdx: number
) => {
  console.log('does this hook run?');
  const [canvas, setCanvas] = useState(setInitialCanvas());
  const interval = (1 / bpm) * 60;
  const fps = 60;
  const bars = 12;
  const delta = (0.5 * (fps * fps)) / bpm;
  const minHeight = 15;

  //   let start = 0;

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
  //   let heights = [100];
  let colors = ['white', 'red'];
  let colorIdx = 0;
  useEffect(() => {
    // refactor this
    if (
      !canvas.context ||
      bpm === 0 ||
      elapsedTime === -1 ||
      spectrum.length <= 1
    ) {
      console.log('somethings wrong');
      return;
    }
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let idx = 0;
    // let currentGoal = heights[idx];
    let currentGoal = Math.floor(spectrum[0][0] * canvas.height);
    let oldGoal = minHeight;
    let diffGoal = Math.abs(currentGoal - oldGoal);

    const update = () => {
      // double check logic here and make it cleaner
      if (currentGoal === minHeight) {
        if (i > currentGoal) {
          i -= diffGoal / delta;
        } else {
          //   console.log('timing');
          //   console.log((window.performance.now() - start) / 1000);
          //   start = window.performance.now();
          //   currentGoal = heights[idx % heights.length];
          //   idx += 1;
          //   colorIdx += 1;
          oldGoal = currentGoal;
          currentGoal =
            spectrum[idx % spectrum.length][0] > 1
              ? 0.9 * (canvas.height - minHeight)
              : spectrum[idx % spectrum.length][0] *
                (canvas.height - minHeight);
          currentGoal = Math.floor(currentGoal);
          diffGoal = Math.abs(currentGoal - oldGoal);
        }
      } else {
        if (i < currentGoal) {
          i += diffGoal / delta;
        } else {
          idx += 1;
          colorIdx += 1;
          oldGoal = currentGoal;
          //   currentGoal =
          //     oldGoal === minHeight ? heights[idx % heights.length] : minHeight;
          currentGoal = minHeight;
          // spectrum[idx % spectrum.length][2] > 1
          //   ? 0.9 * canvas.height
          //   : spectrum[idx % spectrum.length][2] * canvas.height;
          diffGoal = Math.abs(currentGoal - oldGoal);
        }
      }
    };
    const draw = () => {
      const ctx = canvas.context!!;
      ctx.clearRect(0, canvas.height, canvas.width, canvas.maxBarHeight);
      ctx.fillRect(0, canvas.height, canvas.width / bars, -i);
      ctx.fillStyle = colors[colorIdx % colors.length];
      ctx.fill();
    };
    const animate = () => {
      timeoutId = setTimeout(() => {
        if (idx > spectrum.length) return;
        // console.log('drawing');
        update();
        draw();
        requestId = requestAnimationFrame(animate);
      }, 1000 / fps);
    };

    const pause = Math.floor(getTimeDiff(interval, beatIdx));
    setTimeout(() => {}, pause);
    animate();
    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  }, [bpm, beatIdx, elapsedTime, spectrum]);
};
