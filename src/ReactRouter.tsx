import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from './Game';
import Home from './Home';

function ReactRouter() {


  return (
    <Router>
        <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:gameId/:playerId">
            <Game />
          </Route>
        </Switch>
        </div>
    </Router>
  );
}

export default ReactRouter;
