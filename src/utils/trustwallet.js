import Web3 from "web3";
import React, {useContext, useEffect} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {AuthContext} from '../Context/AuthContext';
import ValidafySM from "../contracts/Valid.json";
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
        blockExplorerUrls:"https://testnet.bscscan.com",
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
          switch(getNameWallet()){
            case "Metamask":  await initMetamask(); break;
            case "TrustWallet": await  initTrustWallet(); break;
            default: return false;
          }
          // console.log("esta en el init");
          if (!localStorage.getItem("network")) localStorage.setItem("network", 56);
          return true;
      } catch (error) {
        console.error(error);
        return false;
      }
      
}


export const initIpfs = () =>{
  window.ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  console.log("servidor iniciado");
}

export const initMetamask = async() => {
  
  if(!(await isLog())){
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

export  async function addNetwork(id) {
    try {
      //obtener el arreglo con los datos de la red
      let networkData = nets[id];
      
    if (!networkData)   return "no existe esa red";
    // agregar red o cambiar red
      await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkData.chainIdHex }],
    });
    window.location.reload();
    } catch (error) {
      ReloadPage();
      console.error(error);
    }
   
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

  export const isLog = async() =>{
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
    <div className={`wallet-modal ${Modalw ? "display-out" : ""}`}>
      <div className="info">
          
          <div className="item" onClick={(c)=> {initMetamask().then(v => window.location.href = "/dash"); close();}}>
              <div className="img">
                <img src="metamask-logo-png-transparent.png"/>
              </div>
              <div className="text">
                <p>Metamask</p>
              </div>
          </div>
          <div className="item" onClick={(c)=> {initTrustWallet().then(v => window.location.href = "/dash"); close();}}>
              <div className="img">
                <img src="trustwallet.png"/>
              </div>
              <div className="text">
                <p>Trust Wallet</p>
              </div>
          </div>
          <div className="close" onClick={e => close()}>
            <img src="x.png"/>
          </div>
      </div>
      
    </div>
  )


}


