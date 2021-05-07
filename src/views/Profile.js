import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import ValidafySM from "../contracts/Valid.json";
import Sidebar from "../components/Sidebar.js";

console.log(window.ethereum);
export default function Profile() {
  const [Documents, setDocuments] = useState([]);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    (async () => {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener("popstate", function(event) {
        window.history.pushState(null, document.title, window.location.href);
      });

      window.ethereum._metamask.isUnlocked().then(function(value){
        if(value){       console.log("Abierto")
      }
      else{ console.log("Cerrado");
      window.location.href=("/")
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
        setInfo({address: useraccounts});
        let contract = new window.web3.eth.Contract(
          ValidafySM.abi,
          tokenNetworkData.address
        );

        //obtenemos sus tokens
        let tokensarr = await contract.methods.tokensOf(useraccounts[0]).call();
        //sacamos los hashes

        console.log(tokensarr.tokens);
        let documents = [];
        if (tokensarr.tokens) {
          for (let tokenid of tokensarr.tokens) {
            documents.push(await contract.methods.tokenURI(tokenid).call());
          }
        }

        console.log(documents);
        setDocuments(documents);
        
      }

      console.log(window.ethereum);
    })();
  }, []);
  var today = new Date(),
  date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()+" \nHOURS: "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()+"";

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
                  "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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
                   <div className="w-full lg:w-6/12 px-4 lg:order-1 lg:text-center lg:self-end">
                      <div className="   ">
                      <div className="mr-4 p-3 text-center">
                          <span className="text-xs  block   tracking-wide text-gray-700">
                          {info.address}
                          </span>
                          <span className="text-sm text-gray-500">ADDRESS</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-2">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        <div className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                             {Documents.length}
                          </span>
                          <span className="text-sm text-gray-500">Documentos</span>
                        </div>
                        
                         
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 px-4 lg:order-3 flex justify-center">
                      <div className="relative">
                        <img
                          alt="..."
                          src={require("../assets/img/metamask.png")}
                          className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                          style={{ maxWidth: "150px" }}
                        />
                      </div>
                    </div>
                    
                  </div>
                  <div className="  text-center   mt-12">
                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                      Mis Documentos
                    </h3>

                    <table className="table-fixed text-center overflow-y-auto w-full  mr-4 mb-6  bg-gray-200 shadow-lg bg-pink">
                      <thead>
                        <tr>
                        <th className="bg-blue-300 border text-right px-8 py-4">
                            TokenID
                          </th>
                          <th className="bg-blue-100 border text-right px-8 py-4">
                            TxHash
                          </th>
                          <th className="bg-blue-100 border text-right px-8 py-4">
                            {" "}
                            IpfsHash
                          </th>
                          <th className="bg-blue-100 border text-right px-8 py-4">
                          TimeStamp
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Documents.map((doc, i) => (
                          <tr key={i} >
                            <td className="border text-xs px-8 py-4">
                              <a>{i}</a>
                            </td>
                            <td className="border text-xs px-8 py-4">
                            <a>{i}</a>
                            </td>
                            <td className="border text-xs px-8 py-4">
                              {" "}
                              <a
                                className="a-link"
                                href={`https://ipfs.infura.io/ipfs/${doc}`}
                              >
                                {`${doc}`}{" "}
                              </a>
                            </td>
                            <td className="border text-xs px-8 py-4">
                            <a>{date}</a>
                            </td>
                             
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <div className="w-full md:w-8/12 px-4">
                  <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                    <li>
                      <a
                        href=" "
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href=" "
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href=" "
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        MIT License
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
