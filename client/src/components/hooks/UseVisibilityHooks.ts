import { useState, useEffect, useRef } from 'react';

// credit: https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
function usePrevActiveState(value: boolean) {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = value;
    console.log(ref.current);
  });
  return ref.current;
}

// credit: https://stackoverflow.com/questions/49902883/check-if-the-browser-tab-is-in-focus-in-reactjs
export const useVisibilityHooks = () => {
  const [animationWasStopped, setAnimationWasStopped] = useState(false);
  const prevState = usePrevActiveState(animationWasStopped);
  useEffect(() => {
    document.addEventListener('visibilitychange', handleActivity);
    document.addEventListener('blur', () => handleActivity(false));
    window.addEventListener('blur', () => handleActivity(false));
    window.addEventListener('focus', () => handleActivity(true));
    document.addEventListener('focus', () => handleActivity(true));

    return () => {
      window.removeEventListener('blur', handleActivity);
      document.removeEventListener('blur', handleActivity);
      window.removeEventListener('focus', handleActivity);
      document.removeEventListener('focus', handleActivity);
      document.removeEventListener('visibilitychange', handleActivity);
    };
  });

  // react will only re-render (and update beat index in render hooks)
  // when the user comes back to the window
  const handleActivity = (forcedFlag: any) => {
    // this part handles when it's triggered by the focus and blur events
    if (typeof forcedFlag === 'boolean') {
      const animationState = forcedFlag && !prevState;
      return setAnimationWasStopped(animationState);
    }
    const animationState = document.hidden && !prevState;
    return setAnimationWasStopped(animationState);
  };
};
