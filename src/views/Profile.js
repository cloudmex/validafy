import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import ValidafySM from "../contracts/Valid.json";
import Sidebar from "../components/Sidebar.js";
import validlogo from "../assets/img/validafy-logotipo.png";

import { init,getExplorerUrl } from "../utils/interaction_blockchain";




export default function Profile() {
  const [initialBc, setInitialBc] = useState({
    Hash: "",
    contract: null,
    buffer: null,
    web3: null,
    account: null,
    file: null,
    showHidebutton: false,
    showHideCharge: false,
    showHideProgress: false,
    showHideFile: true,
  });
  const [Documents, setDocuments] = useState([]);
  const [Profile, setProfile] = useState([]);
  const [Modal, setShowModal] = React.useState({ show: false });
  
  useEffect(() => {
    (async () => {
      unhideCharge(true);
     try {
      if (!init()) {
        setInitialBc({
          show: true,
          success: false,
          message:
            "No cuentas con metamask,te estamos redireccionando al sitio oficial para que procedas con la descarga",
        });
        setTimeout(() => {
          window.location.replace("https://metamask.io/download");
        }, 5000);
      }
     } catch (error) {
       
     }
     try {
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
          // window.alert("Ese smartcontract no se desplego en esta red");
          setShowModal({
            ...initialBc,
            show: true,
            success: false,
            message: "!Advertencia!  cambia de red",
          });
          
          return;
        }
        
        //instantiate the contract object
        
        let contract = new window.web3.eth.Contract(
          ValidafySM.abi,
          tokenNetworkData.address
          );
          //obtenemos sus documentos
          let tokensarr = await contract.methods
          .documentsOF(useraccounts[0])
          .call();
          //get the owner of the contract
          setProfile({
            address: useraccounts,
          });
          //arreglo con todos los documentos
          let documents = [];
          
          //si no esta vacio agregamos todos los documentos al arreglo documents
          if (tokensarr.length) {
            for (let doc of tokensarr) {
              //hash se refiere al ipfshash
              documents.push({ hash: doc.hash, tokenid: doc.tokenid, time: doc.data });
            }
            
            console.log("estos son los documetos:  ",documents);
            const options = {
              filter: { tokenId: documents.map((x) => x.tokenid) },
              fromBlock: 0,
              toBlock: 5000,
            }
           
            //obtenemos todas las transacciones de esos tokens
            // let eventos = await contract.getPastEvents("allEvents", {
            //   filter: { tokenId: documents.map((x) => x.tokenid) },
            //   fromBlock: 12168656,
            //   toBlock: 12168756,
            //   // toBlock: "pending",
            // });

            // console.log( await window.web3.eth.getPastLogs("Transfer",
            //   {
            //     address: "0xe11999d339d7f3fb0b512beef4bced92133de289",
            //     filter: { tokenId: documents.map((x) => x.tokenid) },
            //     fromBlock: "12221557",
            //     toBlock: "12221557",

            //    }));
            
            // let algo = await window.ethereum.request({
            //   method: "eth_getLogs",
            // });

            const totalBlocks = await window.web3.eth.getBlockNumber();
            const desde = 9536913;
            const diferencia = totalBlocks - 9536913;
            const ciclos = parseInt((totalBlocks ) /5000);
            const ciclosRestantes =  (totalBlocks) %5000;
            // let eventos = [];
            
            console.log("ciclos ",ciclos, "cicla restantes ", ciclosRestantes);
            let eventos = await contract.getPastEvents("Transfer", {
              filter: { tokenId: documents.map((x) => x.tokenid) },
              fromBlock: totalBlocks -5000,
              toBlock: totalBlocks,
              // toBlock: "pending",
            });
            // console.log();
            // for (let i = desde; i < totalBlocks; i+=5000) {

            //   let arr = await contract.getPastEvents("Transfer", {
            //     filter: { tokenId: documents.map((x) => x.tokenid) },
            //     fromBlock: i,
            //     toBlock: i+5000,
            //     // toBlock: "pending",
            //   });
            //   for (let j = 0; j < arr.length; j++) {
            //     eventos.push(arr[j]);
            //   }
            //   console.log("euu");
            // }

            // let eventos = await contract.getPastEvents("Transfer", {
            //   filter: { tokenId: documents.map((x) => x.tokenid) },
            //   fromBlock: ciclos*5000,
            //   toBlock: totalBlocks,
            //   // toBlock: "latest",
            // });
            // for (let j = 0; j < eventos.length; j++) {
            //   hashes.push(eventos[j]);
         
            // }
            console.log("todos lod odcumentos:    ",eventos);


            // console.log('algo   ', await window.web3.eth.getBlockNumber());

          //  await contract.events.Transfer(options)
          //  .on('data', event => console.log(event))
          //  .on('changed', changed => console.log(changed))
          //  .on('error', err => console.error(err))
          //  .on('connected', str => console.log(str))
          

          //  await contract.getPastEvents('Transfer', options)
          //  .then(results => console.log("euuu ",results[0]))
          //  .catch(err => console.error(err));

            // console.log("identificador:    ");
            
            
            //le agregamos a documents el time y el txhash
            for (let i = 0; i < documents.length; i++) {
              let txhash = await window.ethereum.request({
                method: "eth_getBlockByHash",
                params: [eventos[i].blockHash, false],
              });
            documents[i] = {
              ...documents[i],
              // time: new Date(
              //   parseInt(txhash.timestamp, 16) * 1000
              // ).toLocaleString(),
              txhash: eventos[i].transactionHash,
            };
          }
        }

        //le agregamos a documents el time y el txhash

        console.log("comoasasdasd,",documents);
        setDocuments( documents);
        unhideCharge(false);
      }

      console.log(window.ethereum);
  
    } catch (error) {
      console.log(error);
    }
    
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
  const unhideCharge = (e) => {
    var neg = "";
    if (e) {
      neg = false;
    } else {
      neg = true;
    }
    return setInitialBc({ showHideCharge: e });
  };

  const { showHideCharge } = initialBc;
  return (
    <>
      {" "}
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <main className="profile-page ">
          <section className="relative block" style={{ height: "500px" }}>
            <div
              className="absolute top-0 w-full h-1/2 lg:h-full bg-center bg-cover"
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
                          <span className="text-sm text-pink-700 font-bold">
                            Address
                          </span>
                          <span className="text-sm lg:text-xl  block uppercase  text-gray-700">
                            {Profile.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-2">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <span className="text-sm text-pink-700 font-bold">
                            Documentos
                          </span>
                          <span className=" font-bold block uppercase tracking-wide text-gray-700">
                            {Documents.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-2">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <img
                            alt="..."
                            src={validlogo}
                            className=" rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                            style={{ maxWidth: "150px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {Documents.length ? (
                    <div className="  text-center   mt-12">
                      <h3 className="text-4xl   leading-normal mb-2 text-pink-700 font-bold shadow-2xl mb-2">
                        Mis Documentos
                      </h3>

                      <div className="overflow-x-auto  mb-6 ">
                        <table className=" ml-1 w-full bg-gray-200 ">
                          <thead className="ml-3 bg-pink-600">
                            <tr>
                              <th className=" text-white  ">
                                {" "}
                                <a className="ml-2"> TokenID</a>
                              </th>

                              <th className=" text-white  py-4"> IpfsHash</th>
                              <th className="text-white py-4">TxHash</th>
                              <th className="text-white  py-4">TimeStamp</th>
                              <th className="text-white  py-4">Detalle</th>
                            </tr>
                          </thead>
                          <tbody className="text-base py-3 bg-pink-200">
                            {Documents.map((doc, i) => (
                              <tr key={i} className="px-6">
                                <td className=" ">{doc.tokenid}</td>
                                <td className=" ">
                                  <a
                                    className="a-link"
                                    href={`https://gateway.pinata.cloud/ipfs/${doc.hash}`}
                                    target="_blank"
                                  >
                                    {doc.hash.substring(0, 25) + " ..."}
                                  </a>
                                </td>
                                <td className="">
                                  <a
                                    className="a-link "
                                    href={getExplorerUrl() + doc.txhash}
                                    target="_blank"
                                  >
                                    {doc.txhash.substring(0, 25) + " ..."}
                                  </a>
                                </td>
                                <td className=" ">{doc.time}</td>
                                <td>
                                <a
                                    className="a-link "
                                    href={`./preview/${doc.hash}`}
                                    target="_blank"
                                     
                                  >
                                   <i className="fa fa-info-circle">  </i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="  text-center   mt-12">
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-pink-700 font-bold mb-2">
                        Sin Documentos
                      </h3>{" "}
                      {showHideCharge && (
                        <img
                          src={
                            "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                          }
                          style={{ width: "30%" }}
                          className="  inline-block content-end items-center"
                          alt="loading..."
                        />
                      )}
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
                          window.location.reload(2);
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
        </main>
      </div>
    </>
  );
}
