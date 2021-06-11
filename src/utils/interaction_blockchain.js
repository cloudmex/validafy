import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";
const ipfsClient = require("ipfs-http-client");
/**
 * agrega o cambia la red con el chainid que le mandes
 * si se le manda el chainid de la red que tiene el usario seleccionada no hace nada
 * @param {int} id es el chainid de la blockchain
 */
export async function addNetwork(id) {
  let networkData;
  switch (id) {
    //bsctestnet
    case 97:
      networkData = [
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
      ];
      break;
    //bscmainet
    case 56:
      networkData = [
        {
          chainId: "0x38",
          chainName: "BSCMAINET",
          rpcUrls: ["https://bsc-dataseed1.binance.org"],
          nativeCurrency: {
            name: "BINANCE COIN",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      ];
      break;
    default:
      break;
  }

  // agregar red o cambiar red
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: networkData,
  });
}
/**
 *nos permite inicializar la instancia de web3, ipfs etc
 * @returns regresa true si tiene metamask si no es asi regresa false
 */
export function init() {
  if (window.ethereum || window.web3) {
    window.web3 = new Web3(window.ethereum);
    window.ipfs = ipfsClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });
    if (!localStorage.getItem("network")) localStorage.setItem("network", 97);

    return true;
  } else {
    return false;
  }
}

/**
 *
 * @returns {bool} if the current network have been deployed the smart contract will return true otherwise false
 */
export async function isDeployed() {
  //get the actual networkid or chainid
  let ActualnetworkId = await window.ethereum.request({
    method: "net_version",
  });

  //check if we have the actualnetwork on our validafysm abi
  let nets = Object.keys(ValidafySM.networks);
  return nets.includes(ActualnetworkId.toString());
}

/**
 * with this function we will pause the execution of code , sended as parameter
 * @param {int} miliseconds es el numero de milisegundos a esperar
 */
export function wait(miliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > miliseconds) {
      break;
    }
  }
}
