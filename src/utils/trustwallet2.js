import Web3 from "web3";
import React, {useContext, useEffect} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {AuthContext} from '../Context/AuthContext';
import ValidafySM from "../contracts/Valid.json";
import Web3Modal from "web3modal";

const ipfsClient = require("ipfs-http-client");
const pinataSDK = require("@pinata/sdk");
window.pinata = pinataSDK(
  "8e2b2fe58bbbc6c45be1",
  "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
);


export const nets = {
    [56]:{
        rpc: {
            56: 'https://bsc-dataseed1.binance.org'
        },
        chainId:56,
        network: 'binance',
        chainIdHex: "0x38",
        qrcodeModalOptions: {    
          mobileLinks: [
            "metamask",
            "trust"
          ],  
        },
        blockExplorerUrls:"https://bscscan.com/",
        chainName:"BSCMAINNET",
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
          // desktopLinks: [
          //   // "encrypted ink",
            
          // ]
        },
        qrcode: true,
    },
    [97]:{
        rpc: {
            97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
        },
        chainId:97,
        chainName:"BSCTESTNET",
        chainIdHex: "0x61",
        blockExplorerUrls:"https://testnet.bscscan.com/",
    }
}
// const providerOptions = nets[56];



export const init = async() => {
    //  Create WalletConnect Provider
    
    //  Enable session (triggers QR Code modal)
    
    try {
      // if (window.web3) {
        // while(!getNameWallet()){

        // }
        if(!window.web3.Myprovider && !window.ipfs){
          // localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
          initIpfs();
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: nets[56],
          }
        };
       
        console.log("esto solo tiene que mostrarse una ves")
      
      
      const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
      
      const provider = await web3Modal.connect();
      
      window.web3 = new Web3(provider);
      window.web3.Myprovider = true;
      
          // console.log("esta en el init");
          if (!localStorage.getItem("network")) localStorage.setItem("network", 56);
    }          
          return true;
      } catch (error) {
        console.error("asdasd ",error);
        // await init();
        return false;
      }
      
}




export const initIpfs = () =>{
  if(!window.ipfs){
    window.ipfs = ipfsClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
    console.log("servidor iniciado");
  }
  
}

export const initMetamask = async() => {
  
  if(!(await isLog())){
    // await addNetwork(56);
    await window.ethereum.enable();
    window.web3 = new Web3(window.ethereum);
    
    // await requestAccounts();
    await window.web3.eth.requestAccounts();
    initIpfs();
    setNameWallet("Metamask");
    // window.location.href = "/dash";
    return true;
  }else{
    return false;
  }
}

export const initTrustWallet = async() => {
  if(!(await isLog())){
    // await window.ethereum.enable();
    const provider = new WalletConnectProvider(nets[56]);
        await provider.enable();
        window.web3 = new Web3(provider);
        initIpfs();
        setNameWallet("TrustWallet");
        // window.location.href = "/dash";
    return true;
  }else{
    return false;
  }  
} 

export const setNameWallet = (name) =>{ 
  window.localStorage.setItem("NameWallet", name);
}

export const getNameWallet = () =>{ 
   return window.localStorage.getItem("NameWallet");
}


const networksElse =  {
  [56]:[
      {
        chainId: "0x38",
        chainName: "BSCMAINNET",
        rpcUrls: ["https://bsc-dataseed1.binance.org"],
        nativeCurrency: {
          name: "BINANCE COIN",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com/"],
      },
    ],
  [97]:[
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
}

export  async function addNetwork(id) {
  try {
    let networkData = nets[id];
    await window.web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkData }],
    });
    // window.location.reload();
  } catch (error) {
    console.log("numero ", error.code);
    // if (error.code === 4902 || error.code === -32602) {
      try {
        await window.web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: networksElse[id],
        });
        // window.location.reload();
      } catch (error) {
        console.log(error.message);
      }
    
  }


    // try {
    //   //obtener el arreglo con los datos de la red
      
      
    // if (!networkData)   return "no existe esa red";
    // // agregar red o cambiar red
    //   await window.web3.currentProvider.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: networkData.chainIdHex }],
    // });
    // window.location.reload();
    // } catch (error) {
    //   ReloadPage();
    //   console.error(error);
    // }
   
  }

export const sameNetwork = async() => {
      try {
        return parseInt(localStorage.getItem("network")) ==  await getChainId();
        // return true;
      } catch (error) {
        return false;
      }
    
}

export const wait= (miliseconds) => {
    try {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > miliseconds) {
          break;
        }
      }
    } catch (error) {
      // ReloadPage();
      console.error(error);
    }
  }

  export function getExplorerUrl() {
    try {
      return (
        nets[parseInt(localStorage.getItem("network"))].blockExplorerUrls +
        "tx/"
      );
    } catch (error) {
      // ReloadPage();
      return console.error(error);
    }
  }

  export function getNetworkName() {
    try {
      return nets[parseInt(localStorage.getItem("network"))].chainName;
    } catch (error) {
      // ReloadPage();
      console.error(error);
    }
  
  }

  export async function isDeployed() {
    
      try {
        //get the actual networkid or chainid
        
        let ActualnetworkId = await getChainId();
    
        //check if we have the actualnetwork on our validafysm abi
        let nets = Object.keys(ValidafySM.networks);
        return nets.includes(ActualnetworkId.toString());
      } catch (error) {
        console.error(error);
        // ReloadPage();
        return false;
      }
  }



  export const getChainId = async() =>{
      return await window.web3.eth.getChainId();
  }

  export const getComition = async(a,b) =>{
    return await window.web3.utils.toWei(a,b)
  }

  export const getAccounts = async() =>{
      return await window.web3.eth.getAccounts();
  }

  export const requestAccounts = async() =>{
      return await window.web3.eth.requestAccounts();
  }

  export const Contract = (v1,v2) =>{
      return new window.web3.eth.Contract(v1,v2);
  }
  
  export const getBalance = async(v1) =>{
      return await window.web3.eth.getBalance(v1);
  }

  export const  isLog = async() =>{
    try{
      return (await window.web3.eth.getAccounts()).length > 0;
    }catch(err){
      return false;
    }
  }

  const ReloadPage = () => {
    // window.location.href = "/";
  }




export const WalletModal = () => {
const {Modalw,setModalw} =useContext(AuthContext);
// const [state, setstate] = useState("display-out");

useEffect(() => {
  init().then((v) => {


    // if(getNameWallet()){
    //   setModalw(true);
    // }else{
      setModalw(v);
    // }
  });
}, []);

const close = () => {
  setModalw(true);
  
}





  return(
    <div></div>
    // <div className={`wallet-modal ${Modalw ? "display-out" : ""}`}>
    //   <div className="info">
          
    //       <div className="item" onClick={(c)=> {initMetamask().then(v => window.location.href = "/dash"); close();}}>
    //           <div className="img">
    //             <img src="metamask-logo-png-transparent.png"/>
    //           </div>
    //           <div className="text">
    //             <p>Metamask</p>
    //           </div>
    //       </div>
    //       <div className="item" onClick={(c)=> {initTrustWallet().then(v => window.location.href = "/dash"); close();}}>
    //           <div className="img">
    //             <img src="walletconnet.png"/>
    //           </div>
    //           <div className="text">
    //             <p>WalletConnect</p>
    //           </div>
    //       </div>
    //       <div className="close" onClick={e => close()}>
    //         <img src="x.png"/>
    //       </div>
    //   </div>
      
    // </div>
  )


}


