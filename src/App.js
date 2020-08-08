import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import './App.css';
import LogIn from './components/auth/LogIn';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LogIn}></Route>
        <Route path="/dashboard" component={Dashboard}></Route>
      </Switch>
    </Router>
  );
}

export default App;
