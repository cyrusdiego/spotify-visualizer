import { useState, useEffect, useCallback } from 'react';

export const useRenderHooks = (
  canvas: React.RefObject<HTMLCanvasElement>,
  elapsedTime: number,
  bpm: number
) => {
  useEffect(() => {
    let current = canvas.current;
    let timeoutId: NodeJS.Timeout;
    let requestId: number;
    let i = 0;
    let currentGoal = 100;
    let oldGoal = 0;
    let diffGoal = Math.abs(currentGoal - oldGoal);
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
    const pause =
      timeDifference > 0
        ? -2 * timeDifference - interval
        : timeDifference - interval;
    if (elapsedTime === -1) {
      setTimeout(() => {}, 1000);
    } else {
      setTimeout(() => {}, pause);
      render();
    }

    return () => {
      cancelAnimationFrame(requestId);
      clearTimeout(timeoutId);
    };
  }, [bpm]);
};
