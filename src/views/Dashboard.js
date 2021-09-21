import React, { useState, useEffect, Fragment, useRef } from "react";
import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";
import {
  init,
  addNetwork,
  wait,
  sameNetwork,
} from "../utils/interaction_blockchain";
import { Dialog, Transition } from "@headlessui/react";
import { acceptedFormats } from "../utils/constraints";
import Sidebar from "../components/Sidebar.js";
import { getExplorerUrl } from "../utils/interaction_blockchain";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

//Using the Pinata SDK with dokxo apikeys
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "8e2b2fe58bbbc6c45be1",
  "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
);

export default function Dashboard() {
  
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef();

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
    showImg: true,
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
  const [docHash, setdocHash] = useState("");

  const mycomision = window.localStorage;
  const myfile = window.localStorage;
  function useStickyState(defaultValue, key) {
    const [value, setValue] = React.useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
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

  const hideComponent = (e) => {
    return setInitialBc({ showHidebutton: e });
  };
  const unhideCharge = (e) => {
    var neg = "";
    if (e) {
      neg = false;
    } else {
      neg = true;
    }
    return setInitialBc({ showHideCharge: e });
  };
  const hideFile = (e) => {
    return setInitialBc({ showHideFile: e });
  };
  const hideProgresss = (e) => {
    return setInitialBc({ showHideProgress: e });
  };

  const resetForm = () => {
    setInitialBc({
      Hash: "",
      contract: null,
      buffer: null,
      web3: null,
      account: null,
      file: null,
      showHidebutton: false,
    });
    setBuffer("");
    setSm([]);
    mycomision.setItem("payed", 0);
  };

  useEffect(() => {
    (async () => {
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
        console.error(error);
      }

      //Testing if Validafy is conected to Pinata.
      pinata
        .testAuthentication()
        .then((result) => {
          //handle successful authentication here
          console.log(result);
        })
        .catch((err) => {
          //handle error here
          console.log(err);
        });
      /////
      //console.log("mycomi"+mycomision.getItem("payed"))
      try {
        window.ethereum._metamask.isUnlocked().then(function(value) {
          if (value) {
            console.log("Abierto");
          } else {
            console.log("Cerrado");
            window.location.href = "/";
          }
        });
      } catch (error) {
        console.log("e" + error);
      }
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
        setSm({ contr: contract, useraccount: useraccounts[0] });
      }
      mycomision.getItem("payed") == 1
        ? setShowModal({
            ...initialBc,
            show: true,
            success: true,
            message: "Ya se pagó la comision. Seleccione un Documento",
          })
        : console.log("false");
    })();
  }, []);

  const Validar = async (event) => {
    event.preventDefault();

    ///browser detection
    unhideCharge(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      try {
        //tratamos de cargar el documento que el usuario eligio
        const file = event.target.files[0];
        console.log(file);
        if (file === undefined) {
          window.location.reload();
        }

        if (!event.target.files) {
          throw "no agrego ningun archivo";
        }

        //cambiar red

        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();

        if (!(await sameNetwork())) {
          // window.alert('Error de red,Selecciona la red de BSC para seguir.')

          setInitialBc({
            ...initialBc,
            show: true,
            success: false,
            message: "Selecciona la red e intentalo de nuevo",
            disabled: true,
          });

          //se sale del bucle hasta que la red the metamask y la llave network en localstorage son identicas

          while (!(await sameNetwork())) {
            //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
            wait(200);
            await addNetwork(parseInt(localStorage.getItem("network"))).catch();
          }
          setInitialBc({
            ...initialBc,
            show: false,
            showHideCharge: true,
          });
        }
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
              // console.log(result[0].hash);
              setdocHash(result[0].hash);
              let estado = "Documento no estampado";
              if (ishashed) estado = "Documento Valido";
              setShowModal({
                ...initialBc,
                show: true,
                success: ishashed,
                message: estado,
              });

              setInitialBc({ ...initialBc, namepdf: file.name, showImg: true });
            });
        };
      } catch (err) {
        //   window.alert(err.message || err);
        return;
      }
    } else {
      //no tiene metamask lo mandamos a la pagina oficial de descarga

      window.open("https://metamask.io/download", "_blank");
    }
  };

  const ValidarCaptura = async (event) => {
    event.preventDefault();
    unhideCharge(true);
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
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        if (!(await sameNetwork())) {
          setInitialBc({
            ...initialBc,
            show: true,
            success: false,
            message: "Selecciona la red e intentalo de nuevo",
            disabled: true,
          });

          //se sale del bucle hasta que agregue la red
          let data = false;
          while (data != null) {
            wait(200);
            data = await addNetwork(
              parseInt(localStorage.getItem("network"))
            ).catch((err) => {
              return err;
            });
          }
        }
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
              if (ishashed) {
                setShowModal({
                  ...initialBc,
                  show: true,
                  success: false,
                  message: "!Error!.\nEl documento ya ha sido estampado",
                });
                setInitialBc({
                  ...initialBc,
                  namepdf: file.name,
                  showImg: true,
                });
                // window.alert("El documento ya ha sido estampado");
                unhideCharge(false);
                hideFile(true);
                //window.location.reload();
                setTimeout(function() {
                  window.location.reload(1);
                }, 5000);
                return;
              }

              //si no se encuentra el hash dentro de algun tokenuri los estampamos

              //comision
              const comision = window.web3.utils.toWei("0.003", "ether");

              //guardar el archivo a ipfs
              ipfs.add(Buffer(reader.result)).then((result) => {
                //Pinata Options
                const options = {
                  pinataMetadata: {
                    name: file.name,
                   
                  },
                };

                

                //Adds a hash to Pinata's pin queue to be pinned asynchronously
                pinata
                  .pinByHash(result[0].hash, options)
                  .then((result) => {
                    //handle results here
                    console.log(result.ipfsHash);

                    //Mint the Pinata Hash at the blockchain
                    sm.contr.methods
                      .createItem(
                        result.ipfsHash, 
                        file.name,
                        getExplorerUrl()
                        )
                      .send({
                        from: sm.useraccount,
                        value: comision,
                      })
                      .once("receipt", (receipt) => {
                        console.log("resultado--> ",receipt);

                     
                        const metadata = {
                          name: file.name,
                          keyvalues: {
                            tokenid: receipt.events.Transfer.returnValues.tokenId,
                            owner: receipt.events.Transfer.returnValues.to,
                            txHash: receipt.transactionHash,
                            explorer:getExplorerUrl()
                          }
                      };
               
                   console.log("metadata--->  ",metadata);
                    pinata.hashMetadata(result.ipfsHash, metadata).then((result) => {
                      //handle results here
                      console.log(result + " asqui");

                      setShowModal({
                        ...initialBc,
                        show: true,
                        success: true,
                        message:
                          "!Exito!. Se ha minado,el nuevo token esta en su cartera",
                      });

                  //     //quitar la imagen de carga
                      setInitialBc({ ...initialBc, showHideCharge: false });
                  }).catch((err) => {
                      //handle error here
                      console.log(err);
                  });
 
                      })
                      .catch((err) => {
                        console.log(err);

                        setShowModal({
                          ...initialBc,
                          show: true,
                          success: false,
                          message: err.stack,
                        });
                        setInitialBc({ ...initialBc, showHideCharge: false });
                      });
                    //
                  })
                  .catch((err) => {
                    //handle error here
                    console.log(err);
                  });
              });
            });
        };
      } catch (err) {
        console.log(err);
        setShowModal({
          ...initialBc,
          show: true,
          success: false,
          message: "!Hubo un error!.  ",
        });
        setInitialBc({ ...initialBc, showHideCharge: false });
        // window.alert(err.message || err);
        return;
      }
    } else {
      //no tiene metamask lo mandamos a la pagina oficial de descarga

      window.open("https://metamask.io/download", "_blank");
    }
  };

  const onSubmit = (e) => {
    //window.alert("Usted esta pagando el costo de minar un nuevo token(metodo de minado)");

    e.preventDefault();
    //console.log("buffer1", initialBc.buffer);
    //console.log("buffer2", buffer.buffer);
    unhideCharge(true);

    try {
      //Se avanza el estado del estampado
      setprogress(50);
      setestadoProgress("Paso 4 de 6: pagando Estampado");

      unhideCharge(true);

      ipfs
        .add(buffer.buffer)
        .then((result) => {
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
              mycomision.setItem("payed", 0);
              //console.log(receipt);
              //console.log(result);
              resetForm();
              // window.alert("Se ha minado,el nuevo token esta en su cartera");

              setTimeout(function() {
                window.location.href = "/perfil";
              }, 8000);
              //window.location.href = "/perfil";
              setShowModal({
                ...initialBc,
                show: true,
                success: true,
                message:
                  "!Exito!. Se ha minado,el nuevo token esta en su cartera",
              });
              //se hizo correctamente la transaccion
              if (receipt.status) {
                setIpfs(result[0].path);
              }
            })
            .catch((error) => {
              // window.alert("La trasacción ha sido cancelada");
              setShowModal({
                ...initialBc,
                show: true,
                success: false,
                message:
                  "!Error!. El estampado ha sido cancelado \n \n \npresione Estampar para continuar",
              });
              hideComponent(true);
              window.onbeforeunload = function() {
                return "¡No salir de esta ventana,se perderá la trasaccion!";
              };
              console.log("Se cancelo transanccion paso 5:" + error);
            });
        })
        .catch((err) => {
          setShowModal({
            ...initialBc,
            show: true,
            success: false,
            message: "!Error!. El estampado ha sido cancelado",
          });
          window.alert("La trasacción ha sido cancelada");
          window.location.reload();
          console.log("err", err);
        });
    } catch (error) {
      window.alert("La trasacción ha sido cancelada");
      window.location.reload();
      console.log(error);
    }
  };

  const { showHidebutton } = initialBc;
  const { showHideCharge } = initialBc;
  const { showHideFile } = initialBc;
  const { showHideProgress } = initialBc;

  const isValidado = () =>{
    return "Documento Valido" == Modal.message;
  }
  //TIMEOUT

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <div className="min-h-screen bg-white p-4 flex items-center"></div>

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
                  <div
                    name="valida"
                    className="flex flex-wrap items-center pt-5"
                  >
                    <div className=" w-full md:w-1  text-center pb-20 ">
                      <div className="px-12 sm:px-0   min-w-0 break-words  mb-8  rounded-lg mt-4">
                        <ul
                          className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                          role="tablist"
                        >
                          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                              className={
                                "text-xs font-bold btn-animate uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 1
                                  ? "text-white bg-pink-600"
                                  : "text-pink-600 bg-white")
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenTab(1);
                                setInitialBc({
                                  ...initialBc,
                                  buffer: undefined,
                                });
                              }}
                              data-toggle="tab"
                              href="#link1"
                              role="tablist"
                            >
                              <i className="fas fa-clipboard-check text-base mr-1"></i>
                              Click Para Validar
                            </a>
                          </li>
                          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                              className={
                                "text-xs font-bold btn-animate uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 2
                                  ? "text-white bg-pink-600"
                                  : "text-pink-600 bg-white")
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenTab(2);
                                setInitialBc({
                                  ...initialBc,
                                  buffer: undefined,
                                });
                              }}
                              role="tablist"
                            >
                              <i className="fas fa-link text-base mr-1"></i>
                              Click Para Estampa
                            </a>
                          </li>
                        </ul>

                        <div className="  flex flex-col min-w-0  bg-white w-full  rounded">
                          <div className="px-4 flex-auto">
                            {openTab === 1 ? (
                              <div id="link1">
                                <div>
                                  {!showHideCharge ? (
                                    <label className="w-full btn-animate flex flex-col items-center px-4 py-6 bg-white rounded-lg  tracking-wide uppercase  cursor-pointew-full flex flex-col items-center px-4   mtbg-white rounded-lg  tracking-wide uppercase  cursor-pointer ">
                                      {initialBc.showImg && (
                                        <svg
                                          className="w-8 h-8 text-pink-600"
                                          fill="currentColor"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                        </svg>
                                      )}

                                      {initialBc.showImg && (
                                        <span className="mt-2  text-base leading-normal">
                                          Selecciona un archivo
                                        </span>
                                      )}

                                      <input
                                      
                                        type="file"
                                        className="hidden"
                                        accept={acceptedFormats}
                                        onChange={Validar}
                                        required
                                        onClick={() => {
                                          setInitialBc({
                                            ...initialBc,
                                            Validado: "",
                                            showImg: true,
                                            Validar,
                                          });
                                        }}
                                      />
                                    </label>
                                  ) : (
                                    <div className="w-full flex flex-col items-center">
                                      <img
                                        src={
                                          "https://media.giphy.com/media/l3q2SWX1EW3LdD7H2/giphy.gif"
                                        }
                                        alt="loading..."
                                      />
                                    </div>
                                  )}
                                  <h2>{initialBc.Validado}</h2>
                                  <h2>{initialBc.namepdf}</h2>
                                </div>
                              </div>
                            ) : (
                              <div id="link1" className="flex justify-center">
                                {showHideFile && (
                                  <label className="btn-animate w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg  tracking-wide uppercase  cursor-pointer ">
                                    <svg
                                      className="w-8 h-8 text-pink-600"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span className="mt-2 text-base  leading-normal">
                                      Estampa un archivo
                                    </span>

                                    <input
                                      type="file"
                                      className="hidden"
                                      accept={acceptedFormats}
                                      onChange={ValidarCaptura}
                                      required
                                      onClick={() => {
                                        setInitialBc({
                                          ...initialBc,
                                          Validado: "",
                                        });
                                      }}
                                    />
                                  </label>
                                )}

                                {showHideCharge && (
                                  <img
                                    src={
                                      "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                                    }
                                    alt="loading..."
                                    className="w-3/12"
                                  />
                                )}
                              </div>
                            )}
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
                <div className="relative w-full md:w-6/12 my-6 ">
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
                      <div className="row space-between">
                      <button
                        className={`${
                          Modal.success ? "bg-emerald-500" : "bg-red-500"
                        } w-min  text-white active:${
                          Modal.success ? "bg-emerald-600" : "bg-red-600"
                        } font-bold ${isValidado() ? "col-9" : "col-12"} uppercase text-sm btn-animate px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                        type="button"
                        onClick={() => {
                          setShowModal({ ...Modal, show: false });
                        }}
                      >
                        continuar
                      </button>
                      <a
                        href={`./preview/${docHash}`}
                        target="_blank"
                        className={`${
                          Modal.success ? "bg-emerald-500" : "bg-red-500"
                        } w-min  text-white active:${
                          Modal.success ? "bg-emerald-600" : "bg-red-600"
                        } font-bold ${isValidado() ? "col-3" : "display-none"} row justify-center uppercase text-sm btn-animate px-6 py-3 rounded-full ounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                      >
                        <i className="fa fa-info-circle m-1">  </i>
                        <p>ver</p>
                      </a>
                      </div>

                      
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
