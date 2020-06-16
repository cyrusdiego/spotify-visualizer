// Libraries
import React from 'react';

// Components
import { Landing } from './components/Landing';
import { Visualizer } from './components/Visualizer';
import { useTokenHooks } from './components/hooks/UseTokenHooks';
import { useVisibilityHooks } from './components/hooks/UseVisibilityHooks';

const App = () => {
  const { accessToken, refreshToken } = useTokenHooks();
  useVisibilityHooks();
  return accessToken ? (
    <Visualizer accessToken={accessToken} refreshToken={refreshToken} />
  ) : (
    <Landing />
  );
};

export default App;
