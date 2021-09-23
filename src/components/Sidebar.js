import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import validlogo from "../assets/img/validafy.png";
import NotificationDropdown from "./NotificationDropdown.js";
import Dropdown from "./Dropdown.js";
import UserDropdown from "./UserDropdown.js";
import Web3 from "web3";
import ValidafySM from "../contracts/Valid.json";
import { addNetwork, isDeployed } from "../utils/interaction_blockchain";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [sidebar, setSidebar] = React.useState(false);
  const [redtext, setRedtext] = React.useState();

  let ActualnetworkId;
  let contract;
  useEffect(() => {
    (async () => {
       //instantiate the contract object
   
      try {
        console.log("is");
      console.log(await isDeployed());
      //get the useraccounts
      let useraccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //get the actual networkid or chainid
       ActualnetworkId = await window.ethereum.request({
        method: "net_version",
      });
      setRedtext (ActualnetworkId === "56" ? "BSC -Testnet" : "BSC -Mainnet")
      // sm address
      let tokenNetworkData = ValidafySM.networks[ActualnetworkId];

      window.web3 = new Web3(window.ethereum);
       contract = new window.web3.eth.Contract(
        ValidafySM.abi,
        tokenNetworkData.address);

        setSidebar({
          smOwner:
            useraccounts[0] == (await contract.methods.ownerbalance.call().call())
              ? true
              : false,
        });
      } catch (error) {
        console.error(error)
      }
      
   

    })();
  }, []);
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 hover:text-pink-600 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            <img
              style={{ width: 125 }}
              className="bg-white rounded"
              src={validlogo}
            ></img>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none"></ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 hover:text-pink-600 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  ></Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className=" text-blueGray-700 hover:text-pink-600 text-md uppercase py-3 font-bold block"
                  to="/dash"
                >
                  <i className="fa fa-link opacity-75 uppercase mr-2 text-md"></i>{" "}
                  Estampar
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-pink-600 text-md uppercase py-3 font-bold block"
                  to="/perfil"
                >
                  <i className="fas fa-user-circle text-blueGray-400 mr-2 uppercase text-md"></i>{" "}
                  mis documentos
                </Link>
              </li>
              {sidebar.smOwner && (
                <li className="items-center">
                  <Link
                    className="text-blueGray-700 hover:text-pink-600 text-md uppercase py-3 font-bold block"
                    to="/withdraw"
                  >
                    <i className="fas fa-user-circle text-blueGray-400 mr-2 uppercase text-md"></i>{" "}
                    Retirar
                  </Link>
                </li>
              )}
            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            <ul className=" inline-flex md:flex-col md:min-w-full   ">
              <li className="items-center">
                <a className="text-blueGray-700 hover:text-pink-600 text-md uppercase py-3 font-bold block">
                  {redtext}{" "}
                </a>
                <Dropdown color="pink" />
              </li>
            </ul>
            {/* Heading */}
          </div>
        </div>
      </nav>
    </>
  );
}
