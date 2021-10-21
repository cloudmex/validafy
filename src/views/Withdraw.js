import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";
import ValidafySM from "../contracts/Valid.json";
import Sidebar from "../components/Sidebar.js";
import validlogo from "../assets/img/validafy-logotipo.png";
import {Contract, getAccounts, getBalance} from "../utils/trustwallet"


export default function Profile() {
  const [withdraw, setwithdraw] = useState({ showHideCharge: false });
  const [Modal, setShowModal] = React.useState({ show: false });

  const Retirar = async () => {
    let useraccounts = await getAccounts();
    console.log(
      useraccounts[0] ==
        (await withdraw.contr.methods.ownerbalance.call().call())
    );

    withdraw.contr.methods
      .withdraw()
      .send({
        from: useraccounts[0],
      })
      .once("receipt", (receipt) => {
        console.log(receipt);
      });
  };

  useEffect(() => {
    (async () => {
      // window.web3 = new Web3(window.ethereum);
      //get the actual networkid or chainid
      // let ActualnetworkId = await window.web3.eth.getChainId();

      // sm address
      let tokenNetworkData =
        ValidafySM.networks[localStorage.getItem("network")];

      if (!tokenNetworkData) {
        // window.alert("Ese smartcontract no se desplego en esta red");
        setShowModal({
          show: true,
          success: false,
          message: "!Advertencia!  cambia de red",
        });

        return;
      }

      //instantiate the contract object

      let contract = new Contract(
        ValidafySM.abi,
        tokenNetworkData.address
      );

      //get the balance of the sm
      
      let smBalance = await getBalance();

      setwithdraw({
        smBalance: window.web3.utils.fromWei(smBalance),
        contr: contract,
      });
    })();
  }, []);

  return (
    <>
      {" "}
      <Sidebar />
      <div className="relative md:ml-64 ">
        <main className="profile-page ">
          <section className="right-0 flex flex-col   py-16  justify-center ">
            <div className="container mx-auto px-4 text-pink-600 text-center text-5xl py-4">
              Disponible
            </div>
            <div className="mx-auto text-lg ">{withdraw.smBalance} BNB</div>

            <button
              className=" mt-12 mx-auto bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:bg-red-500 outline-none focus:outline-none  ease-linear transition-all duration-150"
              onClick={() => {
                Retirar();
              }}
            >
              Retirar
            </button>
          </section>
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
