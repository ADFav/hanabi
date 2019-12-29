import React from 'react';
import Game from './Components/Game';
import GameSelector from './Components/GameSelector';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import { firebaseContext } from './Context/firebaseContext';
import './App.css';

function App() {
    return ( 
    <Router>
      <Switch>
        <Route exact path="/">
          <GameSelector />
        </Route>
        <Route path="/games/:gameId">
          <Game />
        </Route>
      </Switch>
    </Router>);
      
}

export default App;