import React from 'react';

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";

import LogIn from './components/auth/LogIn';
import Dashboard from './components/Dashboard';
import SignUp from "./components/auth/SignUp";
import Assignment, { ProblemSet } from './components/assignment/Assignment'
import TeacherAssignment from "./components/assignment/TeacherAssignment";


function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LogIn}></Route>
        <Route path="/signup" component={SignUp}>
        </Route>
        <Route path="/dashboard" component={Dashboard}></Route>
        <Route path="/teacherassignment" component={TeacherAssignment}/>
      </Switch>
    </Router>
  );
}

export default App;
