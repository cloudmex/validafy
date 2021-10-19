import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
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
        chainId:56 ,
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
        }
        // qrcode: false,
    },
    [97]:{
        rpc: {
            97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
        },
        chainId:97
    }
}
// const providerOptions = nets[56];

export let isStarted =  true;
export const awaitStarted = () => {
    while(isStarted){console.log(isStarted)};
}
export const init = async() => {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider(nets[56]);
    
    //  Enable session (triggers QR Code modal)
    isStarted = true;
    try {
        if (window.web3) {
            //   window.web3 = new Web3(window.ethereum);
        await provider.enable();
        window.web3 = new Web3(provider);
        console.log(getAccounts());
        // window.web3 = web3;
        // console.log(await window.web3.eth.getAccounts());
          window.ipfs = ipfsClient({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
          });
          if (!localStorage.getItem("network")) localStorage.setItem("network", 56);
          isStarted = false;
          return true;
        } else {
          isStarted = false;
          return false;
        }
      } catch (error) {
        isStarted = false;
        console.error(error);
      }
      isStarted = false;
      // return isStarted;
}

export async function addNetwork(id) {
    try {
      //obtener el arreglo con los datos de la red
      let networkData = nets[id];
      
    if (!networkData)   return "no existe esa red";
    // agregar red o cambiar red
    return "red agregada"
    } catch (error) {
      console.error(error);
    }
   
  }

export const sameNetwork = async() => {
    try {
        
        return parseInt(localStorage.getItem("network")) ==  await window.web3.eth.getChainId();
      } catch (error) {}
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
      return console.error(error);
    }
  }

  export function getNetworkName() {
    try {
      return nets[parseInt(localStorage.getItem("network"))].chainName;
    } catch (error) {
      console.error(error);
    }
  
  }

  export async function isDeployed() {
    try {
      //get the actual networkid or chainid
      // let ActualnetworkId = await window.ethereum.request({
      //   method: "net_version",
      // });
      let ActualnetworkId = await window.web3.eth.getChainId();
  
      //check if we have the actualnetwork on our validafysm abi
      let nets = Object.keys(ValidafySM.networks);
      return nets.includes(ActualnetworkId.toString());
    } catch (error) {
      console.error(error);
    }
  }



  export const getChainId = async() =>{
    await window.web3.eth.getChainId();
  }

  export const getComition = (a,b) =>{
    window.web3.utils.toWei(a,b);
  }

  export const getAccounts = async() =>{
    await window.web3.eth.getAccounts();
  }

const fnn = async()=>{


// set chain id and rpc mapping in provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/'
      },
      // network: 'binance',
      chainId: 56,
      // infuraId: YOUR_INFURA_KEY,
    }
  }
};

// import Web3 from "web3";
// import Web3Modal from "web3modal";

// const providerOptions = {
//   /* See Provider Options Section */
// };

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const provider = await web3Modal.connect();

const web3 = new Web3(provider);

}

// fnn();

