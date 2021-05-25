import React,{useState,useEffect,useRef} from "react";
import logo from '../assets/img/metamask.png';
import validlogo from  '../assets/img/validafy.png';

import Web3 from 'web3';
 

export default function Navbar(props) {
  const [initialBc,setInitialBc]=useState({Hash: '',contract: null,buffer:null,web3: null,account: null});
  const [account,setAccount]=useState("");
  const [buttontxt,setbuttontxt] = useState("Ingresar");
  const [Modal, setShowModal] = React.useState({ show: false });
  

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
   // window.alert(networkId)
    if( networkId ==97) {
       
     
     
    } else {
     // window.alert('Error de red,Selecciona la red de BSC para seguir.')
      setShowModal({
        ...initialBc,
        show: true,
        success: false,
        message: " !Error de red¡,Selecciona la red de BSC para seguir.",
      });
      setTimeout(function(){
        addNetwork();
     }, 3000); 
      
    }

      
    } catch (error) {
      console.error(error)
    }

  }
  async function addNetwork() {
    
    try {
      
   await  window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x61",
            chainName: "BSCTESTNET",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ],
      });
       
   
    } catch (error) {
     
     // window.alert("Cambia de red porfavor")
    }
   
  }
  async function see() {
    const web3 = window.web3
    const networkId =  await web3.eth.net.getId();
    try {
       window.ethereum._metamask
        .isUnlocked()
        .then(function(value) {
          if (value) {
            
            console.log(networkId)

            if( networkId == 97) {
       
              
                window.location.href="/dash";
            
            }else {
              // window.alert('Error de red,Selecciona la red de BSC para seguir.')
               setShowModal({
                 ...initialBc,
                 show: true,
                 success: false,
                 message: " !Error de red¡,Selecciona la red de BSC para seguir.",
               });
              
               
             }
             
           
          } else {
             setShowModal({
              ...initialBc,
              show: true,
              success: false,
              message: "Para ingresar al panel de tu cuenta primero tienes que estar logeado",
            });
            setTimeout(function(){
              window.location.href = "/login";
           }, 3000); 
            
          }
          
        });
        
    } catch (error) {
      // window.alertt(error)
      console.log("e" );
    }
   
    
    }
    

    useEffect(async () => {
     
     await loadWeb3();
      try {
        window.onbeforeunload = null;
        window.ethereum._metamask
          .isUnlocked()
          .then(function(value) {
            if (value) {
               console.log("en loginlanding Abierto");
              
              setbuttontxt("Mi cuenta");
              console.log(buttontxt);
             
              
            } else {
              console.log("Cerrado");
            }
          });
      } catch (error) {
        console.log("e"+error);
      }
    },[]);


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
            <img style={{ width:125}} className="bg-white rounded"  src={validlogo}></img>  
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
                href="https://docs.google.com/document/d/1Cm9j-O9LBIVtoBFxtSTB3PraybhxDi5vZwOtYPDXd6Q/edit#"
              >
                <i
                  className={
                    (props.transparent
                      ? "lg:text-gray-300 text-gray-500"
                      : "text-gray-500") +
                    " far fa-file-alt text-lg leading-lg mr-2"
                  }
                />{" "}
                whitepaper
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

           

            <li onClick={see} className="flex inline-block text-xs bg-gray-100   px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3">
            <img style={{ height:25}}   src={logo}/>  
            <a className=" text-sm bg-gray-100 pt-1 pl-4 font-bold uppercase">{buttontxt}</a>
           
            </li>
          </ul>
        </div>
         
            

      </div>
      {Modal.show ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-1/2 my-6 ">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}

                  <div
                    className={`${
                      Modal.success ? "bg-emerald-500" : "bg-red-500"
                    }  flex items-start justify-center p-5 border-b border-solid border-blueGray-200 rounded-t`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16 text-white my-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {Modal.success ? (
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
                      {Modal.message}
                    </p>
                    <button
                      className={`${
                        Modal.success ? "bg-emerald-500" : "bg-red-500"
                      } w-min  text-white active:${
                        Modal.success ? "bg-emerald-600" : "bg-red-600"
                      } font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                      type="button"
                      onClick={() => {
                        setShowModal({ ...Modal, show: false });
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

 
    </nav>
  );
}
