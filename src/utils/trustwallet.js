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


// lista de las redes 
export const nets = {
  [56]:{
      rpc: {
          56: 'https://bsc-dataseed1.binance.org'
      },
      network: 'binance',
      chainId: 56,
      infuraId: "95fd5fa4c7c54398948fbe7535f31d28",
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

//  Verifica si esta iniciada la cartera y retorna un valor booleano 
export const init = async() => {
  
  try {
    
        window.web3.MyConnet = true;
        console.log("asdasd: ",window.web3.MyConnet);
        switch(getNameWallet()){
          case "Metamask":  await initMetamask(); window.web3.walletName = "Metamask";  break;
          case "QRWC": await  initQRWC(); window.web3.walletName = "QRWC";  break;
          default: return false;
        }
        
        console.log("solo una ves");
        // console.log("esta en el init");
        if (!localStorage.getItem("network")) localStorage.setItem("network", 56);
      // }
      
      return true;
    } catch (error) {
      console.error(error);
      window.web3.MyConnet = false;
      return false;
    }
    
}

// Esta funcion inicia el servidor ipfs
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
// Inicia el la cartera de metamask
export const initMetamask = async() => {

if(!(await isLog())){
  // await addNetwork(56);
  await window.web3.currentProvider.enable();
  window.web3 =   new Web3(window.ethereum);
  
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

// Inicia el QR de walletconnet
export const initQRWC = async() => {
if(!(await isLog())){
  // await window.ethereum.enable();
  const provider = new WalletConnectProvider(nets[56]);
      await provider.enable();
      window.web3 = new Web3(provider);
      initIpfs();
      setNameWallet("QRWC");
      // window.location.href = "/dash";
  return true;
}else{
  return false;
}  
} 

// Cambia el nombre de la cartera 
export const setNameWallet = (name) =>{ 
window.localStorage.setItem("NameWallet", name);
}

// Obtiene el nombre de la cartera
export const getNameWallet = () =>{ 
  return window.localStorage.getItem("NameWallet");
}

// Lista de redes, es importante para la funcion addNetork
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

// Cambia o agrega una red a metamask 
// (solo funciona con metamask en el navengador)
export  async function addNetwork(id) {
try {
  let networkData = nets[id];
  await window.web3.currentProvider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: networkData }],
  });
  window.location.reload();
} catch (error) {
  console.log("numero ", error.code);
  // if (error.code === 4902 || error.code === -32602) {
    try {
      await window.web3.currentProvider.request({
        method: "wallet_addEthereumChain",
        params: networksElse[id],
      });
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  
}

}

// Verifica si la red que esta en el localstorage es igual a 
// la que esta selecciona en la cartera  
export const sameNetwork = async() => {

    try {
      return parseInt(localStorage.getItem("network")) ==  await getChainId();
      // return true;
    } catch (error) {
      return false;
    }
  
}

// Detiene el proseso en milisegundos
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

// Obtiene la URL del del scan que permite ver 
// la transaccion con el texhash
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

// Obtiene el nombre de la red actual
export function getNetworkName() {
try {
  return nets[parseInt(localStorage.getItem("network"))].chainName;
} catch (error) {
  // ReloadPage();
  console.error(error);
}
}

// Verifica si la red se encunatra desplegada en el contrato
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

// Obtiene el ChainId de la red actual
export const getChainId = async() =>{
  return await window.web3.eth.getChainId();
}

// Tranformada una cantidad a Wei
// los parametros son tipo String
// el parametro pay es el monto, y coin es la moneda, Ej. ETH
export const getComition = (pay,coin) =>{
return window.web3.utils.toWei(pay, coin)
}

// Obtiene un array de las cuentas vinculadas.
// getAccounts()[0] <-- retorna la direccion de cartera en uso
export const getAccounts = async() =>{
  return await window.web3.eth.getAccounts(); 
}

// Obtiene un array de las cuentas vinculadas.
// getAccounts()[0] <-- retorna la direccion de cartera en uso
export const requestAccounts = async() =>{
  return await window.web3.eth.requestAccounts();
}

// Retorna el contrata con el que se puede usar sus funciones.
// sus para metros son String, se obtienen del archivo compilado del contrato, Ej. MyContr.json
// el parametro abi se obtiene de MyContr.abi
// el parametro address se obtiene de MyContr.networks[ChainId].address
export const Contract = (abi,address) =>{
  return new window.web3.eth.Contract(
    abi,
    address
  );
}

// retorna el balance de la cuneta 
// el parametro es de tipo String
// el parametro addressOwner es la direccion de la cartera del usiario
export const getBalance = async(addressOwner) =>{
  return await window.web3.eth.getBalance(addressOwner);
}

// Retorna un valor booleano. 
// Sí la cartera esta iniciada será un True y si no un False
export const isLog = async() =>{
try{
  return (await window.web3.eth.getAccounts()).length > 0;
}catch(err){
  return false;
}
}


// Esta es al vista que permite elegir 
// iniciar con metamask o walletconnnet
export const WalletModal = () => {
const {Modalw,setModalw} =useContext(AuthContext);

useEffect(() => {
init().then((v) => {
    setModalw(v);
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
        <div className="item" onClick={(c)=> {initQRWC().then(v => window.location.href = "/dash"); close();}}>
            <div className="img">
              <img src="walletconnet.png"/>
            </div>
            <div className="text">
              <p>WalletConnect</p>
            </div>
        </div>
        <div className="close" onClick={e => close()}>
          <img src="x.png"/>
        </div>
    </div>
    
  </div>
)


}


