import { useState, useEffect, useLayoutEffect } from 'react';
import { getTimeDiff, getCurrentBeatIndex } from './utils/renderUtils';

interface ICanvasInfo {
  context: CanvasRenderingContext2D | null;
  height: number;
  width: number;
  maxBarHeight: number;
}

const setInitialCanvas = (): ICanvasInfo => {
  return {
    context: null,
    height: 0,
    width: 0,
    maxBarHeight: 0,
  };
};

// current color rotation
const colors = [
  'ffadad',
  'ffd6a5',
  'fdffb6',
  'caffbf',
  '9bf6ff',
  'a0c4ff',
  'bdb2ff',
  'ffc6ff',
  'fffffc',
];

export const useRenderHooks = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  trackProgress: number, // at time of api return
  bpm: number, // calcualted from average section tempos
  spectrum: number[][], // full song spectrum
  timeError: number // time elapsedTime was measured
) => {
  let beatIndex = 0;
  const [canvas, setCanvas] = useState(setInitialCanvas());
  const interval = 60 / bpm;
  // const interval = duration / (numberOfBeats + 2)
  const fps = 60;
  const bars = 12;
  const timeDiffOnDraw = (0.5 * (fps * fps)) / bpm;
  const minHeight = 0;

  // get canvas information
  useEffect(() => {
    if (canvasRef.current) {
      const dpi = window.devicePixelRatio;
      const computedHeight = +getComputedStyle(canvasRef.current)
        .getPropertyValue('height')
        .slice(0, -2);
      const computedWidth = +getComputedStyle(canvasRef.current)
        .getPropertyValue('width')
        .slice(0, -2);

      const height = computedHeight * dpi;
      const width = computedWidth * dpi;
      setCanvas({
        context: canvasRef.current.getContext('2d'),
        height: height,
        width: width,
        maxBarHeight: height,
      });

      // set canvas to this height and width to account for dpi
      canvasRef.current.setAttribute('height', height.toString());
      canvasRef.current.setAttribute('width', width.toString());
    }
  }, [canvasRef]);

  let colorIdx = 0;
  let timeoutId: NodeJS.Timeout;
  let requestId: number;
  useLayoutEffect(() => {
    if (
      !canvas.context ||
      bpm === 0 ||
      trackProgress === -1 ||
      spectrum.length <= 1
    ) {
      return;
    }

    // arrays to hold current height, goal height, previous height, and difference in heights
    let barHeights = new Array(12).fill(0);
    let currentGoal = spectrum[beatIndex];
    let oldGoal = new Array(12).fill(0);
    let diffGoal = currentGoal.map((height, note) =>
      Math.abs(height - oldGoal[note])
    );

    // calculate height of bar
    const update = () => {
      for (let i = 0; i < bars; i++) {
        // bars are going downard
        if (currentGoal[i] === minHeight / canvas.height) {
          // bars have not yet reached their goal
          if (barHeights[i] > currentGoal[i]) {
            barHeights[i] -= diffGoal[i] / timeDiffOnDraw;
          } else {
            // goal has been reached
            oldGoal[i] = currentGoal[i];
            currentGoal[i] =
              spectrum[beatIndex][i] >= 1
                ? 0.9
                : spectrum[beatIndex][i] === 0
                ? 0.01
                : spectrum[beatIndex][i];
            // update the difference in heights
            diffGoal[i] = Math.abs(currentGoal[i] - oldGoal[i]);
          }
          // bars are going upwards
        } else {
          // bars have not yet reach their goal
          if (barHeights[i] < currentGoal[i]) {
            barHeights[i] += diffGoal[i] / timeDiffOnDraw;
            // goal has been reached (a beat has been 'hit')
          } else {
            // only increment colors and beat index once the last loop has been reached
            if (i === 11) {
              beatIndex += 1;
              colorIdx += 1;
            }
            // update new goal ('zero')
            oldGoal[i] = currentGoal[i];
            currentGoal[i] = minHeight / canvas.height;
            diffGoal[i] = Math.abs(currentGoal[i] - oldGoal[i]);
          }
        }
      }
    };

    // clear and redraw bars
    const draw = () => {
      const ctx = canvas.context!!;
      ctx.clearRect(0, canvas.height, canvas.width, -canvas.maxBarHeight);
      const barWidth = canvas.width / bars;
      let x = 0;

      for (let i = 0; i < bars; i++) {
        ctx.fillRect(
          x - 1.5,
          canvas.height,
          barWidth + 0.5,
          -barHeights[i] * (canvas.height - minHeight)
        );
        x += barWidth;
        ctx.fillStyle = '#' + colors[colorIdx % colors.length];
        ctx.fill();
      }
    };

    // animation loop using request animation frame and timeout to set fps
    const animate = () => {
      timeoutId = setTimeout(() => {
        if (beatIndex > spectrum.length) return;
        update();
        draw();
        requestId = requestAnimationFrame(animate);
      }, 1000 / fps);
    };

    // get time difference between time of api data return and now
    const pause = getTimeDiff(interval, timeError, trackProgress);

    // get spectrum index to start animation from
    beatIndex = getCurrentBeatIndex(trackProgress, interval);

    // don't animate until next downbeat
    setTimeout(() => {
      animate();
    }, pause);

    // clean up
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(requestId);
    };
  }, [canvas.context, bpm, trackProgress, spectrum, beatIndex]);
};
