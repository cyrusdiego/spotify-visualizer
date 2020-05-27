// Libraries
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import { Landing } from './components/Landing';
import { Player } from './components/Player';

function App() {
  return (
    <Switch>
      <Route path='/player'>
        <Player />
      </Route>
      <Route path='/'>
        <Landing />
      </Route>
    </Switch>
  );
}

export default App;
