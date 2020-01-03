import React from 'react';
import Game from './Components/Game';
import GameSelector from './Components/GameSelector';
// import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Router from "./Components/Router";
// import { firebaseContext } from './Context/firebaseContext';
import './App.css';
import Login from './Components/Login';

function App() {
    return ( 
      <Router/>
    // <Router>
    //   <Switch>
    //     <Route exact path="/">
    //       <GameSelector />
    //     </Route>
    //     <Route path="/games/:gameId">
    //       <Game />
    //     </Route>
    //   </Switch>
    // </Router>);
);
}

export default App;