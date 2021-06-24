import React, { Component, useContext, useEffect } from "react";

import "./App.css";
import "./assets/css/compiled-tailwind.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import PrivateRoute from "./hocs/PrivateRoute";
import Home from "./components/Home";
import regAd from "./components/reg_Admins";
//import Admins from './components/Admins'
import editStudent from "./components/Edit-Student";
import StudentList from "./components/student-list.component";

import UnPrivateRoute from "./hocs/UnPrivateRoute";

import Navbar from "./components/Navbar";
import NewCertificado from "./components/NewCertificado";
import CertId from "./components/ValidaFile";

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
  const [initialBc, setInitialBc] = React.useState({ show: false });

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
      <UnPrivateRoute path="/NewCertificado" component={NewCertificado} />
      {/** Ruta para users ,admins y SU */}
      <PrivateRoute
        path="/home"
        roles={["admin", "user", "SU"]}
        component={Home}
      />
      {/** Ruta para los Admins */}

      <PrivateRoute
        path="/student-list"
        roles={["admin"]}
        component={StudentList}
      />
      <PrivateRoute
        path="/edit-student/:id"
        roles={["admin"]}
        component={editStudent}
      />

      {/** Ruta para El SuperUser */}
      <PrivateRoute path="/regAdmins" roles={["SU"]} component={regAd} />

      {/** Ruta para el Alumno */}
      <PrivateRoute path="/Mititulo" roles={["user"]} component={CertId} />

    
    </Router>
  );
}

export default App;
