import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";
import { FillButton } from 'tailwind-react-ui'



import Navbar from "../components/Navbar_landing_template";
import Sidebar from "../components/Sidebar.js";
import LineChart from "../components/LineChart.js";
import BarChart from "../components/BarChart.js";
import { Document ,Page } from 'react-pdf'
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default function Dashboard() {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }




  const [initialBc, setInitialBc] = useState({
    Hash: "",
    contract: null,
    buffer: null,
    web3: null,
    account: null,
    file:null,
    showHidebutton: false,
  });
  //  const [Buffe,setBuffer]=useState(null );
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    phone: "",
    institution: "",
    carrer: "",
    finish: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [buffer, setBuffer] = useState("");
  const [ipfss, setIpfs] = useState("");
  const [sm, setSm] = useState([]);
   

  async function componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async function loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    setInitialBc({ account: accounts[0] });
    console.log(initialBc.account);
    const networkId = await web3.eth.net.getId();

    if (networkId) {
      console.log(initialBc.contract);
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }
  
  const hideComponent= ()=> {
    return setInitialBc({showHidebutton:true});
    
  }


 
  
  useEffect(() => {
    (async () => {
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
        setSm({ contr: contract, useraccount: useraccounts[0] });
      }
    })();
  }, []);
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setUser({
      firstname: "",
      lastname: "",
      username: "",
      password: "",
      phone: "",
      institution: "",
      carrer: "",
      finish: "",
      role: "user",
    });
  };
  const captureFile = async (event) => {
    window.alert("Usted esta pagando la comision de la Dapp(metodo de comision)");
    const value = window.web3.utils.toWei('0.00022', 'ether');    //invest
    const to = "0x9F4152a30cb683aD284dff6629E809B80Ff555C1";
    const payload ={to,from:sm.useraccount,value};
    window.web3.eth.sendTransaction(payload).then(res => {
      console.log("TX:"+res +"\n Se pago comisión");
      hideComponent()
      window.alert("La comision se ha pagado,presione el boton registrar para continuar");
  }).catch(err => {
      console.log("err",err)
  });
      event.preventDefault();
    try {
      setInitialBc({file:event.target.files[0]})
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        setInitialBc({ buffer: Buffer(reader.result) });
        setBuffer({ buffer: Buffer(reader.result) });
        console.log("buffer2", buffer);
      };
    } catch (error) {
      console.log(error);
    }

    console.log("buffer v", initialBc.buffer);
  };

  const onSubmit = (e) => {
    window.alert("Usted esta pagando el costo de minar un nuevo token(metodo de minado)");
    e.preventDefault();
    console.log("buffer1", initialBc.buffer);
    console.log("buffer2", buffer.buffer);




    ipfs.add(buffer.buffer).then((result) => {
      sm.contr.methods
        .createItem(sm.useraccount, result[0].path)
        .send({ from: sm.useraccount })
        .once("receipt", (receipt) => {
          window.alert("Se ha minado,el nuevo token esta en su cartera");
          console.log(receipt);
          console.log(result);
          window.location.href="/perfil"
          //se hizo correctamente la transaccion
          if (receipt.status) {
            setIpfs(result[0].path);
          }
        });
    });
  };
  const alert = (event) => {
    event.preventDefault();
    window.location.href = "#";
    window.alert("haz click en el boton de Metamask");
  };
  const { showHidebutton} = initialBc;
  
  
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        
        {/* Header */}
        <div className="relative bg-pink-600 md:pt-32 pb-30 pt-12">
        </div>
        <div className="px-5 md:px-10 mx-auto w-full -m-24">

          <div className="flex flex-wrap mt-16">
            <div className="w-full xl:w-10\/12 mb-12 xl:mb-0 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-10\/12 mb-6 shadow-lg rounded">
                 <div className="h-auto   bg-white flex flex-col space-y-15   justify-top items-center">
                 <h1 className="text-3xl mt-6 font-medium">Estampa Documento</h1>
                 <div name="valida" className="flex flex-wrap items-center ">
              <div className="w-full h-full md:w-1 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                     
                    <div className="container">
                      <div className="h-full bg-blue flex flex-col space-y-5 justify-top items-center">
                            
                          <form onSubmit={onSubmit} className="space-y-5 mt-10"  >
                            <input
                              className="w-full h-full border border-gray-800 rounded px-3"
                              required
                              type="file"
                              accept=".pdf"
                              onChange={captureFile}
                             />

{showHidebutton && 
                            <button className="mt-12"
                              style={{
                                WebkitTextStroke: "0px black",
                                margin: "10px 0px 6px 0px",
                                
                                
                              }}
                              className="bg-blue"
                              type="submit"
                            >
                              Registrar
                            </button>

                            
                            }
                            
                          </form>
                           
                         
                         
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             </div>

                 
                </div>
              </div>
            </div>
          </div>
          <footer className="block py-4">
            <div className="container mx-auto px-4">
              <hr className="mb-4 border-b-1 border-blueGray-200" />
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4">
                  <div className="text-sm text-blueGray-500 font-semibold py-1">
                    Copyright © {new Date().getFullYear()}{" "}
                    <a
                      href="https://www.creative-tim.com"
                      className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                    >
                      Creative Tim
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-8/12 px-4">
                  <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                    <li>
                      <a
                        href="https://www.creative-tim.com"
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        Creative Tim
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.creative-tim.com/presentation"
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="http://blog.creative-tim.com"
                        className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/LICENSE.md"
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
        </div>
      </div>
    </>
  );
}
