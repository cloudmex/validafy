import React, { Component, useContext, useEffect } from "react";

import "./App.css";
import "./assets/css/compiled-tailwind.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
 

//starter kit
import "@fortawesome/fontawesome-free/css/all.min.css";
//profile tempalte
import Profile from "./views/Profile.js";
//login template
import Login from "./views/Login.js";
//landing template
import Landing from "./views/Landing.js";
//dashboard template
import Dashboard from "./views/Dashboard.js";
import Preview from "./views/Preview";
import Withdraw from "./views/Withdraw.js";
function App() {
   
 
  return (
    <Router>
      <Route path="/perfil" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/lan" component={Landing} />
      <Route path="/dash" component={Dashboard} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/preview/:id" component={Preview} />

      {/** Ruta principal y libre */}
      <Route exact path="/" component={Landing} />
     

      
    </Router>
  );
}

export default App;
