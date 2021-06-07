import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import Navbar from "../components/Navbar_login_template";
import FooterSmall from "../components/FooterSmall_login_template";
import logo from "../assets/img/metamask.png";

export default function Login() {
  const [initialBc, setInitialBc] = useState({
    Hash: "",
    contract: null,
    buffer: null,
    web3: null,
    account: null,
  });
  const [account, setAccount] = useState("");

  async function loadWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        if (await window.ethereum.enable()) {
          loadBlockchainData();
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "No se ha detectado un navegador compatible con ethereum,prueba instalando la extension de MetaMask!"
        );
        window.location.href = "https://metamask.io/download";
      }
    } catch (error) {
      console.error(error);
      window.location.reload();
    }
  }
  async function loadBlockchainData() {
    try {
      const web3 = window.web3;
      // Load account
      const accounts = await web3.eth.getAccounts();

      setInitialBc({ initialBc, account: accounts[0] });
      setAccount({ account: accounts[0] });
      console.log(account);
      const networkId = await web3.eth.net.getId();

      if (account != null) {
        console.log(account);
        addNetwork();
      } else {
        window.alert("Error de red,Selecciona la red de BSC para seguir.");
      }
    } catch (error) {
      //console.error(error)
    }
  }
  async function addNetwork() {
    try {
      await window.ethereum.request({
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
      window.location.href = "/dash";
    } catch (error) {}
  }

  useEffect(() => {
    

    window.ethereum._metamask.isUnlocked().then(function(value) {
      if (value) {
        console.log("Abierto");
        window.location.href = "/dash";
      } else {
        console.log("Cerrado");
      }
    });

    console.log(window.ethereum);
  });

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="absolute w-full h-full">
          <div
            className="absolute top-0 w-full h-full bg-gray-900 bg-cover lg:bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(" + require("../assets/img/register_bg_2.png") + ")",
            }}
          ></div>
          <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full sm:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                      <h6 className="text-gray-600 text-sm font-bold">
                        Sign in with
                      </h6>
                    </div>
                    <div className="btn-wrapper text-center">
                      <div className="flex justify-center">
                        <img style={{ height: 100 }} src={logo} />
                      </div>

                      <button
                        onClick={loadWeb3}
                        className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                        type="button"
                        style={{ transition: "all .15s ease" }}
                      >
                        Ingresar
                      </button>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
