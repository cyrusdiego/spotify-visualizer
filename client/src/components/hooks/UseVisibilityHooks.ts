import { useState, useEffect, useCallback } from 'react';

// credit: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
export const useVisibilityHooks = () => {
  // credit: https://stackoverflow.com/questions/53215285/how-can-i-force-component-to-re-render-with-hooks-in-react
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  let prevState = document.hidden;
  // adds event listeners to document
  useEffect(() => {
    document.addEventListener('visibilitychange', handleActivity);
    return () => {
      document.removeEventListener('visibilitychange', handleActivity);
    };
  }, []);

  // we only want to force a re-render (to re-calc beat index)
  // when we re-enter the visualizer
  const handleActivity = () => {
    const animationIsCurrentlyStopped = document.hidden && !prevState;
    prevState = document.hidden;
    return animationIsCurrentlyStopped ? () => {} : forceUpdate();
  };
};
