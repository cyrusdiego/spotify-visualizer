import React, { FC, useEffect, useState } from 'react';
import './styling/Spectrum.css';
import { Bar } from './Bar';
import { spectrumColors } from './constants/SpectrumColors';

// TODO:
// 1. fix color of spectrum
// 2. deal with pausing music

// Edge cases:
// if certain frequencies reach their target heights before other frequencies
//  then each bar may need its own increment based on how far it is from target
//  and the time it has till next refresh

// const getPixelRatio = (context: CanvasRenderingContext2D) => {
//   var backingStore =
//     context.backingStorePixelRatio ||
//     context.webkitBackingStorePixelRatio ||
//     context.mozBackingStorePixelRatio ||
//     context.msBackingStorePixelRatio ||
//     context.oBackingStorePixelRatio ||
//     context.backingStorePixelRatio ||
//     1;

//   return (window.devicePixelRatio || 1) / backingStore;
// };

export const Spectrum: FC<{}> = () => {
  // Constants
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const numberOfBars = 12;
  const fps = 60;
  // let ctx: CanvasRenderingContext2D | null = null;
  // let canvasWidth: number = 0;
  // let canvasHeight: number = 0;
  // let barWidth: number = ;
  // State initializers
  const initializeBarHeights: () => number[] = () => {
    return new Array<number>(numberOfBars).fill(50);
  };

  const intializeBars: () => Bar[] = () => {
    const bars: Bar[] = [];
    return bars;
  };

  // Hooks
  const [heights, setBarHeights] = useState(initializeBarHeights());
  const [bars, setBar] = useState(intializeBars());
  // On mount, set the Canvas context
  // can only set context when canvas is mounted
  // useEffect(() => {
  //   ctx = canvas.current?.getContext('2d')!!;
  //   if (ctx) {
  //     canvasWidth = ctx.canvas.width;
  //     canvasHeight = ctx.canvas.height;
  //     barWidth = canvasHeight / numberOfBars;
  //   }
  // }, []);

  // When ctx is no longer null, set bars state
  useEffect(() => {
    let ctx = canvas.current?.getContext('2d');

    if (ctx) {
      let bars: Bar[] = [];
      let x = 0;
      let canvasWidth = ctx.canvas.width;
      let barWidth = canvasWidth / numberOfBars;
      for (let i = 0; i < numberOfBars; i++) {
        bars.push({
          x: x,
          y: ctx.canvas.height,
          width: barWidth,
          fill: spectrumColors[i],
        });
        x += barWidth;

        setBar(bars);
      }
    }
  }, []);

  // Animation sequence
  // 1. set target height for each bar (an array)
  //    a. recieving intensities from api call will need to be converted
  //        s.t. it is mapped to the height of the canvas window
  // 2. incremenet or decrement `newBarHeight` until target height is reached
  // 3. once target height is reached set target height again

  // Take the array of Bar objects and update their heights

  // Take the array of Bar objects and render on canvas
  // const render1 = () => {
  //   if (ctx) {
  //     // The clearing of all the rectangles can be handled by clearing the entire canvas
  //     ctx.clearRect(0, canvasHeight, canvasWidth, -canvasHeight);

  //     for (let i = 0; i < numberOfBars; i++) {
  //       if (ready) {
  //         ctx.fillRect(
  //           bars.bars[i].x,
  //           bars.bars[i].y,
  //           bars.bars[i].width,
  //           heights.heights[i].height
  //         );
  //       }
  //       ctx.fill();
  //     }
  //   }
  // };

  // Animation loop
  //
  // I think it only needs two steps here: setting heights and then animate
  // but you only set the heights after each beat
  //
  // May need to do consumer - producer - store patter so that theres a queue of heights ready
  // in between beats, the numberOfBars are trying to reach their target heights and when beat
  // lands each bar should be at their respective target height
  // const refresh = () => {
  //   // set timeout to set fps limit
  //   setTimeout(() => {
  //     requestAnimationFrame(refresh);
  //     update();
  //     render1();
  //   }, 1000 / fps);
  // };

  // // Start animation sequence
  // requestAnimationFrame(refresh);
  let goalHeight: number;
  useEffect(() => {
    let ctx = canvas.current?.getContext('2d');
    let animationId: number;
    let canvasWidth: number;
    let canvasHeight: number;
    const update = () => {
      let goalHeight = 200;
      for (let i = 0; i < numberOfBars; i++) {
        // if (heights.heights[i] === 200) {
        //   goalHeight = 0;
        // }
        // if (heights.heights[i] === 0) {
        //   goalHeight = 200;
        // }
        if (goalHeight == 200 && heights[i] < goalHeight) {
          const newHeights = heights;
          newHeights.forEach((h) => {
            h += 0.5;
          });
          setBarHeights(newHeights);
          console.log(heights);
        }
        // if (goalHeight === 0 && heights.heights[i] > goalHeight) {
        //   const newHeights = heights;
        //   newHeights.heights.forEach((h) => {
        //     h -= 0.5;
        //   });
        //   setBarHeights({ heights: newHeights.heights });
        // }
      }
    };

    const render = () => {
      if (ctx) {
        canvasWidth = ctx.canvas.width;
        canvasHeight = ctx.canvas.width;
        ctx.clearRect(0, canvasHeight, canvasWidth, -canvasHeight);
        for (let i = 0; i < numberOfBars; i++) {
          ctx.fillRect(bars[i].x, bars[i].y, bars[i].width, -heights[i]);
          ctx.fillStyle = bars[i].fill;
          ctx.fill();
        }
      }
    };
    let frames: NodeJS.Timeout;
    const animate = () => {
      frames = setTimeout(() => {
        render();
        update();
        animationId = requestAnimationFrame(animate);
      }, 1000 / fps);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(frames);
    };
  });

  return (
    <div className='spectrum_container'>
      <canvas ref={canvas} className='spectrum'></canvas>
    </div>
  );
};
