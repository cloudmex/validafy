import React,{useState,useEffect,useRef} from "react";
import lofo from '../assets/img/mm-logo.svg';
import Web3 from 'web3';
 

export default function Navbar(props) {
  const [initialBc,setInitialBc]=useState({Hash: '',contract: null,buffer:null,web3: null,account: null});
  const [account,setAccount]=useState("");
  async function componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async function loadWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        
        window.alert('No se ha detectado un navegador compatible con ethereum,prueba instalando la extension de MetaMask!')
        window.location.href ="https://metamask.io/download"
        
      }
    } catch (error) {
      console.error(error)
    }
    
  }
  async function loadBlockchainData() {
    try {
      
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    
    setInitialBc({initialBc,account:accounts[0] })
    setAccount({account:accounts[0]})
    console.log(account)
    const networkId = await web3.eth.net.getId()
    
    if( networkId) {
       
      console.log(initialBc)
      window.location.href ="/dash"
    } else {
      window.alert('Error de red,Selecciona la red de BSC para seguir.')
    }

      
    } catch (error) {
      console.error(error)
    }

  }
  async function see() {
     await loadWeb3()
     await loadBlockchainData()  
    }
    
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <nav
      className={
        (props.transparent
          ? "top-0 absolute z-50 w-full"
          : "relative shadow-lg bg-white shadow-lg") +
        " flex flex-wrap items-center justify-between px-2 py-3 "
      }
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <a
            className={
              (props.transparent ? "text-white" : "text-gray-800") +
              " text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            }
            href=" "
          >
            Validafy
                      </a>
                     
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i
              className={
                (props.transparent ? "text-white" : "text-gray-800") +
                " fas fa-bars"
              }
            ></i>
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none mr-auto">
            <li className="flex items-center">
              <a
                className={
                  (props.transparent
                    ? "lg:text-white lg:hover:text-gray-300 text-gray-800"
                    : "text-gray-800 hover:text-gray-600") +
                  " px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                }
                href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/landing"
              >
                <i
                  className={
                    (props.transparent
                      ? "lg:text-gray-300 text-gray-500"
                      : "text-gray-500") +
                    " far fa-file-alt text-lg leading-lg mr-2"
                  }
                />{" "}
                Docs
              </a>
            </li>
          </ul>
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="flex items-center">
              <a
                className={
                  (props.transparent
                    ? "lg:text-white lg:hover:text-gray-300 text-gray-800"
                    : "text-gray-800 hover:text-gray-600") +
                  " px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                }
                href="https://www.facebook.com/mexanalytics/"
              >
                <i
                  className={
                    (props.transparent
                      ? "lg:text-gray-300 text-gray-500"
                      : "text-gray-500") +
                    " fab fa-facebook text-lg leading-lg "
                  }
                />
                <span className="lg:hidden inline-block ml-2">Share</span>
              </a>
            </li>

            <li className="flex items-center">
              <a
                className={
                  (props.transparent
                    ? "lg:text-white lg:hover:text-gray-300 text-gray-800"
                    : "text-gray-800 hover:text-gray-600") +
                  " px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                }
                href="https://twitter.com/cloudmex_a?lang=en
                "
              >
                <i
                  className={
                    (props.transparent
                      ? "lg:text-gray-300 text-gray-500"
                      : "text-gray-500") +
                    " fab fa-twitter text-lg leading-lg "
                  }
                />
                <span className="lg:hidden inline-block ml-2">Tweet</span>
              </a>
            </li>

            <li className="flex items-center">
              <a
                className={
                  (props.transparent
                    ? "lg:text-white lg:hover:text-gray-300 text-gray-800"
                    : "text-gray-800 hover:text-gray-600") +
                  " px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                }
                href="https://github.com/cloudmex"
              >
                <i
                  className={
                    (props.transparent
                      ? "lg:text-gray-300 text-gray-500"
                      : "text-gray-500") +
                    " fab fa-github text-lg leading-lg "
                  }
                />
                <span className="lg:hidden inline-block ml-2">Github</span>
              </a>
            </li>

            <li className="flex items-center">
              <button onClick={see}
                className={
                  (props.transparent
                    ? " text-gray-800 active:bg-gray-100"
                    : "bg-pink-500 text-white active:bg-pink-600") +
                  " text-xs bg-gray-100 font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                }
                type="button"
                style={{ transition: "all .15s ease" }}
              >
                 <img style={{ height:25}}   src="https://metamask.io/images/mm-logo.svg"></img>  
              </button>
            </li>
          </ul>
        </div>
         
            

      </div>
    </nav>
  );
}
