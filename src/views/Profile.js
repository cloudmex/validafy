import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
<<<<<<< HEAD
import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import ValidafySM from "../contracts/Valid.json";
=======
import Navbar from "../components/Navbar_profile_template.js";
import Footer from "../components/Footer_profile_template.js";
import ValidafySM from "../contracts/Valid.json";
import Sidebar from "../components/Sidebar.js";

>>>>>>> 2cf7376ab0e05ab4fed5d398c04cd65cffb2566c

console.log(window.ethereum);
export default function Profile() {
  const [Documents, setDocuments] = useState([]);
<<<<<<< HEAD
  useEffect(() => {
    (async () => {
=======



  useEffect(() => {
    (async () => {

      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, document.title, window.location.href);
      });



>>>>>>> 2cf7376ab0e05ab4fed5d398c04cd65cffb2566c
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
        let contract = new window.web3.eth.Contract(
          ValidafySM.abi,
          tokenNetworkData.address
        );

        //obtenemos sus tokens
        let tokensarr = await contract.methods.tokensOf(useraccounts[0]).call();
        //sacamos los hashes

        console.log(tokensarr);
        let documents = [];
        if (tokensarr.tokens) {
          for (let tokenid of tokensarr.tokens) {
            documents.push(await contract.methods.tokenURI(tokenid).call());
          }
        }

        console.log(documents);
        setDocuments(documents);
      }
<<<<<<< HEAD
      console.log(window.ethereum);
=======
>>>>>>> 2cf7376ab0e05ab4fed5d398c04cd65cffb2566c
    })();
  }, []);
  return (
    <> <Sidebar />
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
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-end">
                    <div className="relative">
                      <img
                        alt="..."
                        src={require("../assets/img/team-2-800x800.jpg")}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-end">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        type="button"
                        style={{ transition: "all .15s ease" }}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-end py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          22
                        </span>
                        <span className="text-sm text-gray-500">Friends</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          10
                        </span>
                        <span className="text-sm text-gray-500">Photos</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          89
                        </span>
                        <span className="text-sm text-gray-500">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="  text-center   mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                    Mis Documentos
                  </h3>

                  <table class="table-fixed text-center  w-full  mr-4  bg-pink-200 shadow-lg bg-pink">
                    <thead >
                      <tr>
                        <th class="bg-blue-100 border text-right px-8 py-4" >hash</th>
                        <th class="bg-blue-100 border text-right px-8 py-4"> content</th>

                      </tr>
                    </thead>
                    <tbody>
                      {Documents.map((doc, i) => (

                        <tr>
                          <td class="border px-8 py-4" ><img className=" text-center  justify-end item-right " style={{
                            marginRight: "0", marginLeft: "auto",
                            display: "block", height: "100px"
                          }}
                            src={`https://ipfs.infura.io/ipfs/${doc.substring(
                              0,
                              doc.length - 1
                            )}`}
                          /></td>
                          <td class="border px-8 py-4"> <a className="a-link" href={`https://ipfs.infura.io/ipfs/${doc.substring(0, doc.length - 1)}`} >{`${doc.substring(0, doc.length - 1)}`} </a></td>

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
              Copyright © {new Date().getFullYear()}{" "}Validafy by  {" "}
              <a
                href="https://cloudmex.io/"
                className="text-gray-600 hover:text-gray-900"
              >               
CloudMex Analytics S.A.P.I. de C.V.
              </a>.
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
