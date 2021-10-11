import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

// set chain id and rpc mapping in provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed1.binance.org'
      },
      chainId: 56
    }
  }
}

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const init = async() =>{
    const provider = await web3Modal.connect();
    console.log("0.- 1231eqdwd");
    await web3Modal.toggleModal();
    console.log("1.- ",provider);
    
    // regular web3 provider methods
    const newWeb3 = new Web3(provider);
    console.log("2.- ",newWeb3);
    const accounts = await newWeb3.eth.getAccounts();
    console.log("3.- ",accounts);
    
    return {
        provider,
        newWeb3,
        accounts
    }
}


// console.log(accounts);

export{
    providerOptions,
    init,
    web3Modal
}