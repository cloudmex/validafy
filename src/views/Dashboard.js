import React, { useState, useEffect,Fragment, useRef } from "react";
import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";

 import { Dialog, Transition } from '@headlessui/react'
 
import Sidebar from "../components/Sidebar.js"; 
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default function Dashboard() {

  
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef()


  const [initialBc, setInitialBc] = useState({
    Hash: "",
    contract: null,
    buffer: null,
    web3: null,
    account: null,
    file:null,
    showHidebutton: false,
    showHideCharge:false,
    showHideProgress:false,
    showHideFile:true,

  });
  //  const [Buffe,setBuffer]=useState(null );
  const [openTab, setOpenTab] = React.useState(2);

  const [message, setMessage] = useState("");
  const [estadoProgress, setestadoProgress] = useState("");

  const [buffer, setBuffer] = useState("");
  const [ipfss, setIpfs] = useState("");
  const [sm, setSm] = useState([]);
  const [progress, setprogress] = useState(0);
  const [Modal, setShowModal] = React.useState({ show: false });

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
  //console.log(initialBc.account);
    const networkId = await web3.eth.net.getId();

    if (networkId) {
    //console.log(initialBc.contract);
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }
  
  const hideComponent= (e)=> {
    return setInitialBc({showHidebutton:e});
    
  }
  const unhideCharge= (e)=> {
    var neg="";
    if(e){neg=false}
    else{neg=true}
    return setInitialBc({showHideCharge:e});
    
  }
  const hideFile= (e)=> {
    return setInitialBc({showHideFile:e});
    
  }
  const hideProgresss= (e)=> {
    return setInitialBc({showHideProgress:e});
    
  }

  const resetForm = () => {
    setInitialBc({Hash: "",contract: null,buffer: null,web3: null,account: null,file:null,showHidebutton: false});
    setBuffer("");
    setSm([]);
    mycomision.setItem("payed",false);
  };
 
  
  useEffect(() => {
    (async () => {
    //console.log("mycomi"+mycomision.getItem("payed"))
     
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
  
 
 /* const captureFile = async (event) => {
    window.alert("Usted esta pagando la comision de la Dapp(metodo de comision)");
    if(mycomision.getItem("payed")==true){
    //console.log("arder el mundo")
      }
    try {
      
      const value = window.web3.utils.toWei('0.00022', 'ether');    //invest
      const to = "0x9F4152a30cb683aD284dff6629E809B80Ff555C1";
      const payload ={to,from:sm.useraccount,value};
      window.web3.eth.sendTransaction(payload).then(res => {
        window.onbeforeunload = function() {
          return '¡No salir de esta ventana,se perderá la trasaccion!';
      }
      //console.log("TX:"+res +"\n Se pago comisión");
        hideComponent();
        mycomision.setItem("payed",true)
      //console.log("mycomi"+mycomision.getItem("payed"))
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
      //console.log("buffer2", buffer);
      };
    } catch (error) {
      console.log(error);
    }

  //console.log("buffer v", initialBc.buffer);
  };
*/
const Validar = async (event) => {
  event.preventDefault();
  ///browser detection
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);

    try {
      //tratamos de cargar el documento que el usuario eligio
      const file = event.target.files[0];

      if (!event.target.files) {
        throw "no agrego ningun archivo";
      }
      //cambiar red
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
      //get the actual networkid or chainid
      let ActualnetworkId = await window.ethereum.request({
        method: "net_version",
      });
      // sm address
      let tokenNetworkData = ValidafySM.networks[ActualnetworkId];
      //instantiate the contract object
      let contract = new window.web3.eth.Contract(
        ValidafySM.abi,
        tokenNetworkData.address
      );

      //nos permite cargar el archivo
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        //obtener el hash de ipfs ,una vez que cargo el archivo
        ipfs
          .add(Buffer(reader.result), { onlyHash: true })
          .then(async (result) => {
            //comprobar si el hash se encuetra dentro de algun tokenuri
            let ishashed = await contract.methods
              .IsHashed(result[0].hash)
              .call();
            console.log(result[0].hash);
            let estado = "Documento no estampado";
            if (ishashed) estado = "Documento Valido";
            setShowModal({
              ...initialBc,
              show: true,
              success: ishashed,
              message: estado,
            });

            setInitialBc({ ...initialBc, namepdf: file.name });
          });
      };
    } catch (err) {
      window.alert(err.message || err);
      return;
    }
  } else {
    //no tiene metamask lo mandamos a la pagina oficial de descarga

    window.open("https://metamask.io/download", "_blank");
  }
};

  const ValidarCaptura=async(event)=>{
    event.preventDefault();
    unhideCharge(true);

    setestadoProgress("Paso 1 de 6: Validando documento : ");
    setprogress(10);
    ///browser detection
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      try {
        //tratamos de cargar el documento que el usuario eligio
        const file = event.target.files[0];

        if (!event.target.files) {
          throw "no agrego ningun archivo";
        }
        //cambiar red
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
        //get the actual networkid or chainid
        let ActualnetworkId = await window.ethereum.request({
          method: "net_version",
        });
        // sm address
        let tokenNetworkData = ValidafySM.networks[ActualnetworkId];
        //instantiate the contract object
        let contract = new window.web3.eth.Contract(
          ValidafySM.abi,
          tokenNetworkData.address
        );

        //nos permite cargar el archivo
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          //obtener el hash de ipfs ,una vez que cargo el archivo
          ipfs
            .add(Buffer(reader.result), { onlyHash: true })
            .then(async (result) => {
              //comprobar si el hash se encuetra dentro de algun tokenuri
              let ishashed = await contract.methods
                .IsHashed(result[0].hash)
                .call();
            //console.log(result[0].hash);
              let estado = "El documento es invalido";
              if (ishashed){ 
               
                setShowModal({
                  ...initialBc,
                  show: true,
                  success: false,
                  message: "!Error!.\nEl documento ya ha sido estampado",
                });
               // window.alert("El documento ya ha sido estampado"); 
                estado = "El documento es valido";
                unhideCharge(false);
                hideFile(true)
                
               //window.location.reload();
               setTimeout(function(){
                window.location.reload(1);
             }, 5000); 
                return;
              }
              
              //guardar el mensaje
              setInitialBc({
                ...initialBc,
                Validado: estado,
              });
              setInitialBc({ buffer: Buffer(reader.result) });
              setBuffer({ buffer: Buffer(reader.result) });
              hideFile(false);
              setprogress(20);
              setestadoProgress("Paso 2 de 6: pagando comisión : ");

            //console.log(initialBc.buffer)
            //console.log(Buffer.buffer)

            //console.log("vamos bien");
              unhideCharge(true);
              try {
             //   window.alert("Usted esta pagando la comision de la Dapp(metodo de comision)");
                const value = window.web3.utils.toWei('0.00022', 'ether');    //invest
                const to = "0x9F4152a30cb683aD284dff6629E809B80Ff555C1";
                const payload ={to,from:sm.useraccount,value};
                window.web3.eth.sendTransaction(payload).then(res => {
                  window.onbeforeunload = function() {
                    return '¡No salir de esta ventana,se perderá la trasaccion!';
                }
                //console.log("TX:"+res +"\n Se pago comisión");
                  hideComponent(true);
                  
                  mycomision.setItem("payed",true);
                  setestadoProgress("Paso 3 de 6: Comisión pagada");
                //console.log("mycomi"+mycomision.getItem("payed"));
                  //Se avanza el estado del estampado
                  setprogress(30);

                  setShowModal({
                    ...initialBc,
                    show: true,
                    success: true,
                    message: "!Exito!.La comision se ha pagado    \npresione el boton Espampar  para continuar",
                  });
    
              //  window.alert("La comision se ha pagado,presione el boton registrar para continuar");
              }).catch(err => {
                if(err){
                  setShowModal({
                    ...initialBc,
                    show: true,
                    success: false,
                    message: "!Error!.La transaccion ha sido cancelada",
                  });
                  
                hideComponent(false);
              }
                
              setTimeout(function(){
                window.location.reload(1);
             }, 5000); 
                  console.log("err",err)
              });
              } catch (error) {
                console.log("err",error)
              }
              
            });
        };
      } catch (err) {
        window.alert(err.message || err);
        return;
      }
    } else {
      //no tiene metamask lo mandamos a la pagina oficial de descarga

      window.open("https://metamask.io/download", "_blank");
    }

  }

  const onSubmit = (e) => {
  //window.alert("Usted esta pagando el costo de minar un nuevo token(metodo de minado)");
  
    e.preventDefault();
  //console.log("buffer1", initialBc.buffer);
  //console.log("buffer2", buffer.buffer);
    unhideCharge(true);


    try {
      window.onbeforeunload = function() {
        return '¡No salir de esta ventana,se perderá la trasaccion!';
    }
    //Se avanza el estado del estampado
    setprogress(50);
    setestadoProgress("Paso 4 de 6: pagando Estamapado");
    
    unhideCharge(true);

      ipfs.add(buffer.buffer).then((result) => {

        //Se avanza el estado del estampado
        setprogress(80);
        setestadoProgress("Paso 5 de 6: Estampando documento");
        
        unhideCharge(true);

        sm.contr.methods
          .createItem(sm.useraccount, result[0].path)
          .send({ from: sm.useraccount })
          .once("receipt", (receipt) => {
            //Se avanza el estado del estampado
             setprogress(100);
             setestadoProgress("Paso 6 de 6: Documento Estampado");
          //console.log(receipt);
          //console.log(result);
            resetForm();
           // window.alert("Se ha minado,el nuevo token esta en su cartera"); 

           setTimeout(function(){
            window.location.href = "/perfil";         }, 8000); 
            //window.location.href = "/perfil";
            setShowModal({
              ...initialBc,
              show: true,
              success: true,
              message: "!Exito!. Se ha minado,el nuevo token esta en su cartera",
            });
            //se hizo correctamente la transaccion
            if (receipt.status) {
              setIpfs(result[0].path);
            }
          }).catch(error=>{
           // window.alert("La trasacción ha sido cancelada");
            setShowModal({
              ...initialBc,
              show: true,
              success: false,
              message: "!Error!. El estampado ha sido cancelado \n \n \npresione Estampar para continuar",
            });
            hideComponent(true);
            window.onbeforeunload = function() {
              return '¡No salir de esta ventana,se perderá la trasaccion!';
          }
            console.log("Se cancelo transanccion paso 5:" + error)
          });
      }).catch(err => {
        setShowModal({
          ...initialBc,
          show: true,
          success: false,
          message: "!Error!. El estampado ha sido cancelado",
        });
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
  const { showHideCharge} = initialBc;
  const { showHideFile} = initialBc;
  const { showHideProgress} = initialBc;
//TIMEOUT
 
  
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
      <div className="min-h-screen bg-white p-4 flex items-center">


     

 </div>

      <main className="Dash-page ">
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
              <div name="valida" className="flex flex-wrap items-center pt-5">
               
              <div className=" w-full md:w-1  text-center pb-20 ">
                <div className="px-12 sm:px-0   min-w-0 break-words  mb-8  rounded-lg mt-4">
                  <ul
                    className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                    role="tablist"
                  >
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 1
                            ? "text-white bg-pink-600"
                            : "text-pink-600 bg-white")
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(1);
                          setInitialBc({ ...initialBc, buffer: undefined });
                        }}
                        data-toggle="tab"
                        href="#link1"
                        role="tablist"
                      >
                        <i className="fas fa-clipboard-check text-base mr-1"></i>
                        Validar
                      </a>
                    </li>
                    <li
                      
                      className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    >
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (openTab === 2
                            ? "text-white bg-pink-600"
                            : "text-pink-600 bg-white")
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(2);
                          setInitialBc({ ...initialBc, buffer: undefined });
                        }}
                        role="tablist"
                      >
                        <i className="fas fa-link text-base mr-1"></i>
                        Estampar
                      </a>
                    </li>
                  </ul>

                  <div className="  flex flex-col min-w-0 break-words bg-white w-full mb-6  rounded">
                    <div className="px-4 py-5 flex-auto">
                      <div>
                        <div
                          className={  openTab === 2 ? "visble" : "invisible"}
                          id="link1"
                        >
                       <form onSubmit={onSubmit} className="space-y-5 mt-10"  >
                       {showHideFile &&   <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg  tracking-wide uppercase  cursor-pointer ">
                            <svg
                              className="w-8 h-8 text-pink-600"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal">
                              Estampa un archivo
                            </span>

                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf"
                              onChange={ValidarCaptura}
                              required
                              onClick={() => {
                                setInitialBc({ ...initialBc, Validado: "" });
                              }}
                            />

                            
                          </label>}
                          {showHidebutton && 
                            <button className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
                              style={{
                                WebkitTextStroke: "0px black",
                                margin: "10px 0px 6px 0px",
                                
                                
                              }}
                              
                              type="submit"
                            >
                              Estamapar
                            </button>

                            
                            }
                             </form>
                             <div className="relative pt-1">
  <div className="flex mb-2 items-center justify-between">
    <div>
      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
        Progreso del estampado
      </span>
     

    </div>

    <div>
        
      {showHideCharge && <img src={"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"} style={{width:"30%"}} alt="loading..." />
       }
      
      </div>
   
    <div><div className="text-right">
      <span className="text-sm font-semibold inline-block text-pink-600">
        {estadoProgress}{initialBc.namepdf}
      </span>
    </div></div>
    <div className="text-right">
      <span className="text-sm font-semibold inline-block text-pink-600">
        {progress}%
      </span>
    </div>

    
  </div>
  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
    <div style={{ width: progress+"%" }} className={ "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"   } ></div>
  </div>
</div>





                        </div>
                        <div
                          className={openTab === 1 ? "visible" : "invisible"}
                          id="link1"
                        >
                         <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg  tracking-wide uppercase  cursor-pointer ">
                            <svg
                              className="w-8 h-8 text-pink-600"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal">
                              Selecciona un archivo
                            </span>

                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf"
                              onChange={Validar}
                              required
                              onClick={() => {
                                setInitialBc({ ...initialBc, Validado: "" });
                              }}
                            />
                          </label>
                          <h2>{initialBc.Validado}</h2>
                          <h2>{initialBc.namepdf}</h2>
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
CloudMex Analytics  
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