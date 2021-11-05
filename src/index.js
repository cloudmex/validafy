import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthContext";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {
  init,
  WalletModal
} from "./utils/trustwallet";
import {Loading} from './components/Loading'
// import WalletModal from './components/WalletModal'


// console.log("una vez");
// awaitStarted();

ReactDOM.render(
  <AuthProvider>
    <App />
    <WalletModal/>
    
  </AuthProvider>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
