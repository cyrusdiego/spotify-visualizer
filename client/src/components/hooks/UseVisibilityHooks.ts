import { useState, useEffect, useRef } from 'react';

// credit: https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
function usePrevActiveState(value: boolean) {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// credit: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
export const useVisibilityHooks = () => {
  const [animationWasStopped, setAnimationWasStopped] = useState(false);
  const prevState = usePrevActiveState(animationWasStopped);
  useEffect(() => {
    if (
      typeof document.addEventListener === 'undefined' ||
      typeof document.hidden === undefined
    ) {
      console.log(
        'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
      );
    }
    document.addEventListener('visibilitychange', handleActivity);
    return () => {
      document.removeEventListener('visibilitychange', handleActivity);
    };
  }, []);

  // react will only re-render (and update beat index in render hooks)
  // when the window is visible
  // only change the animationWasStopped state if prevState is false
  const handleActivity = () => {
    const animationState = document.hidden && !prevState;
    return setAnimationWasStopped(animationState);
  };

  return !animationWasStopped;
};
