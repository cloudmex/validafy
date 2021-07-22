import React, { useState, useEffect } from "react";
import ValidafySM from "../contracts/Valid.json";
import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import {
  init,
  addNetwork,
  isDeployed,
  wait,
  sameNetwork,
  getExplorerUrl,
} from "../utils/interaction_blockchain";
import { acceptedFormats } from "../utils/constraints";
import Valida from '../helpers/ValidarLanding'
export default function Landing() {
  /**
   * @type estado que guarda los datos mas relevantes de el componente
   */
  const [initialBc, setInitialBc] = React.useState({
    showImg: true,
    openTab: 1,
    show: false,
    Validado: "",
  });

  /**
   * podemos validar la existencia de un archivo con este metodo
   * @param {*} event tiene toda la informacion del input asociado
   * @returns  no regresa nada
   */
  useEffect(() => {
    //incializamos la app, si no tiene metamask lo mandamos a la pagina de descarga
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
  }, []);



  const Validar = async(event)=>{
      return await Valida(event,initialBc,setInitialBc,sameNetwork,addNetwork,ValidafySM,wait);
  }
  
  // const Validar = async (event) => {
  //   ///browser detection
  //   event.preventDefault();
  //   setInitialBc({ ...initialBc, showHideCharge: true, showImg: false });

  //   try {
  //     //tratamos de cargar el documento que el usuario eligio
  //     const file = event.target.files[0];
  //     if (file === undefined || !event.target.files) {
  //       window.location.reload();
  //     }
  //     //confirmamos que la red seleccionada y la
  //     if (!(await sameNetwork())) {
  //       setInitialBc({
  //         ...initialBc,
  //         show: true,
  //         success: false,
  //         message: "Cambia de red",
  //         disabled: true,
  //       });

  //       //se sale del bucle hasta que la red the metamask y la llave network en localstorage son identicas

  //       while (!(await sameNetwork())) {
  //         //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
  //         wait(200);
  //         await addNetwork(parseInt(localStorage.getItem("network"))).catch();
  //       }

  //       setInitialBc({
  //         ...initialBc,
  //         show: false,
  //         showHideCharge: true,
  //       });
  //     }

  //     // sm address
  //     let tokenNetworkData =
  //       ValidafySM.networks[localStorage.getItem("network")];
  //     //instantiate the contract object
  //     let contract = new window.web3.eth.Contract(
  //       ValidafySM.abi,
  //       tokenNetworkData.address
  //     );
  //     //nos permite cargar el archivo
  //     const reader = new window.FileReader();
  //     reader.readAsArrayBuffer(file);
  //     reader.onloadend = () => {
  //       //obtener el hash de ipfs ,una vez que cargo el archivo
  //       window.ipfs
  //         .add(Buffer(reader.result), { onlyHash: true })
  //         .then(async (result) => {
  //           //comprobar si el hash se encuetra dentro de algun tokenuri
  //           let ishashed = await contract.methods
  //             .IsHashed(result[0].hash)
  //             .call();
  //           //console.log(result[0].hash);
  //           let estado = "Documento no estampado";
  //           if (ishashed) estado = "Documento Valido";
  //           setInitialBc({
  //             ...initialBc,
  //             show: true,
  //             success: ishashed,
  //             message: estado,
  //             namepdf: file.name,
  //             showImg: true,
  //             disabled: false,
  //           });
  //         });
  //     };
  //   } catch (err) {
  //     window.alert(err.message || err);
  //     return;
  //   }
  // };

  async function see() {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    try {
      window.ethereum._metamask.isUnlocked().then(async function(value) {
        if (value) {
          console.log(networkId);

          if (await sameNetwork()) {
            setInitialBc({
              ...initialBc,
              show: true,
              success: true,
              message: "!Vamos a Estampar¡",
            });

            setTimeout(function() {
              window.location.href = "/dash";
            }, 5000);
          } else {
            setInitialBc({
              ...initialBc,
              show: true,
              success: false,
              message: " !Error de red¡,Cambiando de red",
              disabled: true,
            });

            //se sale del bucle hasta que la red the metamask y la llave network en localstorage son identicas
            while (!(await sameNetwork())) {
              //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
              wait(200);
              await addNetwork(
                parseInt(localStorage.getItem("network"))
              ).catch();
            }

            setInitialBc({
              ...initialBc,
              show: true,
              success: true,
              message: "!Vamos a Estampar¡",
              disabled: false,
            });

            setTimeout(function() {
              window.location.href = "/dash";
            }, 3000);
          }
        } else {
          setInitialBc({
            ...initialBc,
            show: true,
            success: false,
            message: "!Advertencia !.\nPrimero logeate",
          });
          window.location.href = "/login";
        }
      });
    } catch (error) {
      // window.alertt(error)
      console.log("e");
    }
  }

  return (
    <>
      <Navbar transparent />
      <main>
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{
            minHeight: "75vh",
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1566132127697-4524fea60007?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12  ml-auto mr-auto text-center">
                <div className="pr-5">
                  <h3 className="text-white font-semibold text-3xl ">
                    Tus documentos descentralizados
                  </h3>
                  <p className="mt-4 ml-4 text-base text-gray-300">
                    Validafy es más que un sistema de estampado, queremos que el
                    almacenamiento de información sea libre, descentralizado e
                    interplanetario. Conoce nuestro whitepaper{" "}
                    <a
                      className="a-link"
                      href="https://docs.google.com/document/d/1Cm9j-O9LBIVtoBFxtSTB3PraybhxDi5vZwOtYPDXd6Q/edit#"
                    >
                      aquí
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
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
        </div>

        <section className="pb-20 bg-gray-300 -mt-24">
          <div className=" ">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Estampado</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Estampa tus documentos en blockchain con Validafy y deja
                      una marca de tiempo permanente de que el documento
                      existió.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                      <i className="fas fa-retweet"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Validación</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Conoce si tus documentos los han estampado antes sobre el
                      blockchain y cuándo ocurrió.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                      <i className="fas fa-fingerprint"></i>
                    </div>
                    <h6 className="text-xl font-semibold">API</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      ¿Quieres que tu aplicación pueda hacer uso de Validafy?
                      nuestra API te permitirá verificar los hashes que ya han
                      sido estampados en blockchain. (Muy pronto)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              name="valida"
              className=" w-full flex flex-wrap items-center pt-16 justify-center "
            >
              <h1 className="self-center w-full text-center	 shadow text-6xl text-gray-600 mb-6 ">
                Valida tu documento
              </h1>
              <div className=" w-full lg:w-11/12 px-4  text-center pb-20 ">
                <div className=" md:px-2 break-words  mb-8  rounded-lg mt-4 shadow-md">
                  <ul
                    className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                    role="tablist"
                  >
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                          (initialBc.openTab === 1
                            ? "text-white bg-Pentatone"
                            : "text-pink-600 bg-white")
                        }
                        onClick={(e) => {
                          e.preventDefault();
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
                      onClick={see}
                      className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    >
                      <a
                        className={
                          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal text-pink-600 bg-white"
                        }
                        role="tablist"
                      >
                        <i className="fas fa-link text-base mr-1"></i>
                        Estampar
                      </a>
                    </li>
                  </ul>

                  <div className="relative flex flex-col min-w-0 break-words bg-white  mb-6  rounded">
                    <div className=" py-5 ">
                      <div>
                        <div
                          className={
                            initialBc.openTab === 1 ? "block" : "hidden"
                          }
                          id="link1"
                        >
                          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg  tracking-wide uppercase  cursor-pointer ">
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
                              <span className="mt-2 text-base leading-normal">
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
                          <div className="w-full flex flex-col items-center">
                            {initialBc.showHideCharge && (
                              <img
                                src={
                                  "https://media.giphy.com/media/l3q2SWX1EW3LdD7H2/giphy.gif"
                                }
                                alt="loading..."
                              />
                            )}
                          </div>
                          <h2>{initialBc.namepdf}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6  rounded-full bg-gray-100">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  Casos de uso
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                  ¿Sabes para qué te sirve tener tus documentos en blockchain?
                </p>

                <ul className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                  <li>
                    <i className="fa fa-check-square" aria-hidden="true"></i>{" "}
                    Control y auditoría.
                  </li>
                  <li>
                    <i className="fa fa-check-square" aria-hidden="true"></i>{" "}
                    Credenciales.
                  </li>
                  <li>
                    <i className="fa fa-check-square" aria-hidden="true"></i>{" "}
                    Almacenamiento interplanetario de archivos.
                  </li>
                  <li>
                    {" "}
                    <i
                      className="fa fa-check-square"
                      aria-hidden="true"
                    ></i>{" "}
                    Registro de sucesos.
                  </li>
                  <li>
                    <i className="fa fa-check-square" aria-hidden="true"></i>{" "}
                    Propiedad intelectual.
                  </li>
                </ul>

                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
                  className="font-bold text-gray-800 mt-8"
                ></a>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-Pentatone">
                  <img
                    alt="..."
                    src={require("../assets/img/nasdaq.jpg")}
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 583 95"
                      className="absolute left-0 w-full block"
                      style={{
                        height: "95px",
                        top: "-94px",
                      }}
                    >
                      <polygon
                        points="-30,95 583,95 583,65"
                        className="bg-Pentatone fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">Ventajas</h4>

                    <ul className="text-md font-light mt-2 text-white">
                      <li>
                        <i className="fa fa-desktop" aria-hidden="true"></i>{" "}
                        Descentralizado.
                      </li>
                      <li>
                        <i className="fa fa-globe" aria-hidden="true"></i>{" "}
                        Interplanetario.
                      </li>
                      <li>
                        {" "}
                        <i className="fa fa-gavel" aria-hidden="true"></i>{" "}
                        Legalmente válido
                      </li>
                      <li>
                        {" "}
                        <i className="fa fa-link" aria-hidden="true"></i>{" "}
                        Respaldado en la Binance Smart Chain
                      </li>
                    </ul>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative  bg-gray-900">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden bord"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-900 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className=" mx-auto px-4 ">
            <div className="flex flex-wrap text-center justify-center">
              <div className="lg:w-6/12 py-24">
                <h2 className="text-4xl font-semibold text-white">
                  Construye con nosotros
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
                  Para las organizaciones con sistemas de gestión de calidad que
                  necesitan de procesos de validación, Validafy es una
                  plataforma descentralizada que permite el control de
                  documentos basada en blockchain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {initialBc.show ? (
          <>
            <div className="  justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
              <div className="w-full md:w-6/12 my-6 ">
                {/*content*/}
                <div className=" rounded-lg shadow-lg  flex flex-col  bg-white outline-none focus:outline-none">
                  {/*header*/}

                  <div
                    className={`${
                      initialBc.success ? "bg-emerald-500" : "bg-red-500"
                    }  flex items-start justify-center p-5 border-b border-solid border-blueGray-200 rounded-t`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16 text-white my-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {initialBc.success ? (
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
                      {initialBc.message}
                    </p>
                    <button
                      className={`${
                        initialBc.success ? "bg-emerald-500" : "bg-red-500"
                      } w-min  text-white active:${
                        initialBc.success ? "bg-emerald-600" : "bg-red-600"
                      } font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                      type="button"
                      disabled={initialBc.disabled}
                      onClick={() => {
                        setInitialBc({ ...initialBc, show: false });
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
      <Footer />
    </>
  );
}
