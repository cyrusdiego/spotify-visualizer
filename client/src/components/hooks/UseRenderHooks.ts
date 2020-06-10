import { useState, useEffect, useLayoutEffect } from 'react';
import { getTimeDiff, setInitialCanvas } from './utils.ts/analyzeUtils';

export const useRenderHooks = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elapsedTime: number,
  bpm: number,
  spectrum: number[][],
  beatIdx: number,
  appStart: number
) => {
  const [canvas, setCanvas] = useState(setInitialCanvas());
  const interval = (1 / bpm) * 60;
  const fps = 60;
  const bars = 12;
  const delta = (0.5 * (fps * fps)) / bpm;
  const minHeight = 0;

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

  let colors = ['white', 'red', '#fca311', 'blue'];
  let colorIdx = 0;
  let timeoutId: NodeJS.Timeout;
  let requestId: number;
  useLayoutEffect(() => {
    // refactor this
    if (
      !canvas.context ||
      bpm === 0 ||
      elapsedTime === -1 ||
      spectrum.length <= 1
    ) {
      return;
    }
    let growth = new Array(12).fill(0);
    let idx = 0;
    let currentGoal = spectrum[idx][0] === 0 ? spectrum[1] : spectrum[idx];
    let oldGoal = new Array(12).fill(0);
    let diffGoal = currentGoal.map((height, note) =>
      Math.abs(height - oldGoal[note])
    );

    // extract update and draw functions out into utils
    const update = () => {
      // double check logic here and make it cleaner
      // also refactor to use foreach in array
      for (let i = 0; i < bars; i++) {
        if (currentGoal[i] === minHeight) {
          if (growth[i] > currentGoal[i]) {
            growth[i] -= diffGoal[i] / delta;
          } else {
            oldGoal[i] = currentGoal[i];
            currentGoal[i] =
              spectrum[idx][i] > 1
                ? 0.9
                : spectrum[idx][i] === 0
                ? 0.01
                : spectrum[idx][i];

            diffGoal[i] = Math.abs(currentGoal[i] - oldGoal[i]);
          }
        } else {
          if (growth[i] < currentGoal[i]) {
            growth[i] += diffGoal[i] / delta;
          } else {
            if (i === 11) {
              idx += 1;
              colorIdx += 1;
            }
            oldGoal[i] = currentGoal[i];
            currentGoal[i] = minHeight;
            diffGoal[i] = Math.abs(currentGoal[i] - oldGoal[i]);
          }
        }
      }
    };
    const draw = () => {
      const ctx = canvas.context!!;
      ctx.clearRect(0, canvas.height, canvas.width, canvas.maxBarHeight);
      let x = 0;

      for (let i = 0; i < bars; i++) {
        const barWidth = (canvas.width - bars * 5) / bars;
        ctx.fillRect(
          x,
          canvas.height,
          barWidth,
          -growth[i] * (canvas.height - minHeight)
        );
        x += barWidth + 5;
        ctx.fillStyle = '#fca311';
        // ctx.fillStyle = colors[colorIdx % colors.length];
        ctx.fill();
      }
    };
    const animate = () => {
      timeoutId = setTimeout(() => {
        // if (idx > spectrum.length) return;
        update();
        draw();
        // console.log(spectrum.length);
        requestId = requestAnimationFrame(animate);
      }, 1000 / fps);
    };
    const pause = getTimeDiff(interval, timeError, trackProgress);
    beatIndex = getCurrentBeatIndex(trackProgress, interval);
    setTimeout(() => {
      animate();
    }, pause);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(requestId);
    };
  }, [bpm, beatIdx, elapsedTime, spectrum]);
};
