// Libraries
import React from 'react';

// Components
import { Landing } from './components/Landing';
import { Visualizer } from './components/Visualizer';
import { useTokenHooks } from './components/hooks/UseTokenHooks';
import { useVisibilityHooks } from './components/hooks/UseVisibilityHooks';
import { Switch, Route } from 'react-router-dom';

const App = () => {
  const { accessToken, refreshToken, setAccessToken } = useTokenHooks();
  useVisibilityHooks();

  return (
    <Switch>
      <Route path='/visualizer'>
        <Visualizer
          accessToken={accessToken}
          refreshToken={refreshToken}
          setAccessToken={setAccessToken}
        />
      </Route>
      <Route path='/'>
        <Landing />
      </Route>
    </Switch>
  );
};

export default App;
