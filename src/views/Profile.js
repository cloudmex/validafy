import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import ValidafySM from "../contracts/Valid.json";
import Sidebar from "../components/Sidebar.js";

console.log(window.ethereum);
export default function Profile() {
  const [Documents, setDocuments] = useState([]);
  const [Profile, setProfile] = useState([]);
  useEffect(() => {
    (async () => {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener("popstate", function(event) {
        window.history.pushState(null, document.title, window.location.href);
      });

      window.ethereum._metamask.isUnlocked().then(function(value) {
        if (value) {
          console.log("Abierto");
        } else {
          console.log("Cerrado");
          window.location.href = "/";
        }
      });

      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        //get the useraccounts
        let useraccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        //get the actual networkid or chainid
        let ActualnetworkId = await window.ethereum.request({
          method: "net_version",
        });

        // sm address
        let tokenNetworkData = ValidafySM.networks[ActualnetworkId];

        if (!tokenNetworkData) {
          window.alert("Ese smartcontract no se desplego en esta red");
          return;
        }
        //instantiate the contract object
        setProfile({ address: useraccounts });
        let contract = new window.web3.eth.Contract(
          ValidafySM.abi,
          tokenNetworkData.address
        );
        //obtenemos sus documentos
        let tokensarr = await contract.methods
          .documentsOF(useraccounts[0])
          .call();

        //arreglo con todos los documentos
        let documents = [];

        //si no esta vacio agregamos todos los documentos al arreglo documents
        if (tokensarr.length) {
          for (let doc of tokensarr) {
            //hash se refiere al ipfshash
            documents.push({ hash: doc.hash, tokenid: doc.tokenid });
          }

          //obtenemos todas las transacciones de esos tokens
          let eventos = await contract.getPastEvents("Transfer", {
            filter: { tokenId: documents.map((x) => x.tokenid) },
            fromBlock: 0,
            toBlock: "latest",
          });

          //le agregamos a documents el time y el txhash
          for (let i = 0; i < eventos.length; i++) {
            let txhash = await window.ethereum.request({
              method: "eth_getBlockByHash",
              params: [eventos[i].blockHash, false],
            });
            documents[i] = {
              ...documents[i],
              time: new Date(
                parseInt(txhash.timestamp, 16) * 1000
              ).toLocaleString(),
              txhash: eventos[i].transactionHash,
            };
          }
        }

        //le agregamos a documents el time y el txhash

        console.log(documents);
        setDocuments(documents);
      }

      console.log(window.ethereum);
    })();
  }, []);
  /*
  var today = new Date(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " \nHOURS: " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds() +
      "";
*/
  return (
    <>
      {" "}
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <main className="profile-page ">
          <section className="relative block" style={{ height: "500px" }}>
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1566132127697-4524fea60007?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80')",
              }}
            >
              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black"
              ></span>
            </div>
            <div
              className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
              style={{ height: "70px" }}
            >
              <svg
                className="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="text-gray-300 fill-current"
                  points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
          </section>
          <section className="right-0 flex flex-wrap  py-16 bg-gray-300">
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64  -mr-30">
                <div className="px-6">
                  <div className="flex flex-wrap justify-end">
                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex-1 ml-4">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className=" p-3 text-center">
                          <span className="text-sm lg:text-xl  block uppercase  text-gray-700">
                            {Profile.address}
                          </span>
                          <span className="text-sm text-gray-500">Address</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-2">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <span className=" font-bold block uppercase tracking-wide text-gray-700">
                            {Documents.length}
                          </span>
                          <span className="text-sm text-gray-500">
                            Documentos
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-2">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <img
                            alt="..."
                            src={require("../assets/img/metamask.png")}
                            className=" rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                            style={{ maxWidth: "150px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {Documents.length ? (
                    <div className="  text-center   mt-12">
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Mis Documentos
                      </h3>

                      <div className="overflow-x-auto  mb-6 ">
                        <table className=" w-full bg-gray-200 ">
                          <thead>
                            <tr>
                              <th className="  py-4">TokenID</th>
                              <th className=" py-4">TxHash</th>
                              <th className="  py-4"> IpfsHash</th>
                              <th className="  py-4">TimeStamp</th>
                            </tr>
                          </thead>
                          <tbody className="text-base">
                            {Documents.map((doc, i) => (
                              <tr key={i} className="px-6">
                                <td className=" ">{doc.tokenid}</td>
                                <td className="">
                                  <a
                                    href={
                                      "https://testnet.bscscan.com/tx/" +
                                      doc.txhash
                                    }
                                    target="_blank"
                                  >
                                    {doc.txhash}
                                  </a>
                                </td>
                                <td className=" ">
                                  <a
                                    className="a-link"
                                    href={`https://ipfs.infura.io/ipfs/${doc.hash}`}
                                    target="_blank"
                                  >
                                    {doc.hash}
                                  </a>
                                </td>
                                <td className=" ">{doc.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="  text-center   mt-12">
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Sin Documentos
                      </h3>{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          <footer className="block py-4">
            <div className="container mx-auto px-4">
              <hr className="mb-4 border-b-1 border-blueGray-200" />
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full text-right md:w-4/12 px-4">
                  <div className="text-sm text-right text-gray-600  py-1">
                    Copyright © {new Date().getFullYear()} Validafy by{" "}
                    <a
                      href="https://cloudmex.io/"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      CloudMex Analytics
                    </a>
                    .
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
