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
     

      {initialBc.show ? (
        <>
          <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="w-full md:w-6/12 my-6 ">
              {/*content*/}
              <div className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
                {/*header*/}

                <div
                  className={`${
                    initialBc.success ? "bg-emerald-500" : "bg-red-500"
                  }  flex items-start justify-center p-5 border-b border-solid border-blueGray-200 rounded-t`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-white my-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {initialBc.success ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                </div>
                <div className="relative p-6 flex flex-col space-y-4 justify-center ">
                  <p className="flex-initial my-4 text-center text-2xl leading-relaxed">
                    {initialBc.message}
                  </p>
                  <button
                    className={`${
                      initialBc.success ? "bg-emerald-500" : "bg-red-500"
                    } w-min  text-white active:${
                      initialBc.success ? "bg-emerald-600" : "bg-red-600"
                    } font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    onClick={() => {
                      setInitialBc({ ...initialBc, show: false });
                      window.location.href = "https://metamask.io/download";
                    }}
                  >
                    continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </Router>
  );
}

export default App;
