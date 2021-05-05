import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";
  
import Sidebar from "../components/Sidebar.js"; 
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default function Dashboard() {

  



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
  
  const [message, setMessage] = useState("");
  const [buffer, setBuffer] = useState("");
  const [ipfss, setIpfs] = useState("");
  const [sm, setSm] = useState([]);
  const mycomision = window.localStorage;
  const myfile = window.localStorage;
  function useStickyState(defaultValue, key) {
    const [value, setValue] = React.useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    });
    React.useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
  }

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

  const resetForm = () => {
    setInitialBc({Hash: "",contract: null,buffer: null,web3: null,account: null,file:null,showHidebutton: false});
    setBuffer("");
    setSm([]);
    mycomision.setItem("payed",false);
  };
 
  
  useEffect(() => {
    (async () => {
      console.log("mycomi"+mycomision.getItem("payed"))
     
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
  
 
  const captureFile = async (event) => {
    window.alert("Usted esta pagando la comision de la Dapp(metodo de comision)");
    if(mycomision.getItem("payed")==true){
      console.log("arder el mundo")
      }
    try {
      
      const value = window.web3.utils.toWei('0.00022', 'ether');    //invest
      const to = "0x9F4152a30cb683aD284dff6629E809B80Ff555C1";
      const payload ={to,from:sm.useraccount,value};
      window.web3.eth.sendTransaction(payload).then(res => {
        window.onbeforeunload = function() {
          return '¡No salir de esta ventana,se perderá la trasaccion!';
      }
        console.log("TX:"+res +"\n Se pago comisión");
        hideComponent();
        mycomision.setItem("payed",true)
        console.log("mycomi"+mycomision.getItem("payed"))
        window.alert("La comision se ha pagado,presione el boton registrar para continuar");
    }).catch(err => {
      window.alert("La trasacción ha sido cancelada");
      window.location.reload();
        console.log("err",err)
    });
    } catch (error) {
      console.log("err",error)
    }
    
    
      event.preventDefault();
    try {
      setInitialBc({file:event.target.files[0]})
      const file = event.target.files[0];
      mycomision.setItem("file", event.target.files[0])
      
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



    try {
      window.onbeforeunload = function() {
        return '¡No salir de esta ventana,se perderá la trasaccion!';
    }
      ipfs.add(buffer.buffer).then((result) => {
        sm.contr.methods
          .createItem(sm.useraccount, result[0].path)
          .send({ from: sm.useraccount })
          .once("receipt", (receipt) => {
            window.alert("Se ha minado,el nuevo token esta en su cartera");
            console.log(receipt);
            console.log(result);
            resetForm();
             
            window.location.href = "/perfil";
            //se hizo correctamente la transaccion
            if (receipt.status) {
              setIpfs(result[0].path);
            }
          }).catch(error=>{
            window.alert("La trasacción ha sido cancelada");
            window.onbeforeunload = function() {
              return '¡No salir de esta ventana,se perderá la trasaccion!';
          }
            console.log("erere" + error)
          });
      }).catch(err => {
        window.alert("La trasacción ha sido cancelada");
        window.location.reload();
          console.log("err",err)
      });
      
    } catch (error) {
      window.alert("La trasacción ha sido cancelada");
        window.location.reload();
      console.log(error);
    }
   


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
        

      <main className="profile-page ">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://blogcandidatos.springspain.com/wp-content/uploads/2020/01/proyecto-blockchain-1200x600.jpg')",
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
                 
                <div className="w-full h-full md:w-1 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                  <div className="h-auto   bg-white flex flex-col space-y-15   justify-top items-center">
                 <h1 className="text-3xl mt-6 font-medium">Estampa Documento</h1>
                 </div>

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
