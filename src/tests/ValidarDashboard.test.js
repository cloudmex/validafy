import Web3 from "web3";
import Validar from "../helpers/ValidarDashboard"
import {
    // init,
    addNetwork,
    wait,
    sameNetwork,
  } from "../utils/interaction_blockchain";
  import ValidafySM from "../contracts/Valid.json";
//   import {useState} from 'react';
import {renderHook, act } from '@testing-library/react-hooks'
import { superHook  } from "./Hooks/Hooks";
// import {useState} from 'react';
// import React from 'react';

describe('Pruevas en el metodo Validar', () => {

   const todo = {
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
    }

    
    const event = {
        preventDefault: jest.fn(),
        target:{
            files:[
                {
                    lastModified: 1625935677999,
                    lastModifiedDate: 'Sat Jul 10 2021 10:47:57 GMT-0600 (hora de verano de las Montañas Rocosas',
                    name: "informacion (Recuperado automáticamente).docx",
                    size: 14613,
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    webkitRelativePath: "",
                }
            ]
        }
    }

    window.open = jest.fn();
    location.reload = jest.fn();
    const ipfsClient = require("ipfs-http-client");
  
    const ipfs = ipfsClient({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
    });

    

test('Deveria recargar la pagina si file.array es undefined', async () => {

    const {result:initialbc} = renderHook( () => superHook(todo));
    const {result:Modal} = renderHook( () => superHook({ show: false }));
    const unhideCharge = (e) => {
        var neg = "";
        if (e) {
            neg = false;
        } else {
            neg = true;
        }
        return initialbc.current.reset({ showHideCharge: e });
    }
    const event = {
        preventDefault: jest.fn(),
        target:{
            files: [undefined]
        }
    }
    window.ethereum= true;
    const spyReload = jest.spyOn(location,'reload');


    const valida =  await Validar(
        event,
        unhideCharge,
        Web3,
        wait,
        sameNetwork,
        initialbc.current.value,
        initialbc.current.setValue,
        addNetwork,
        ValidafySM,
        ipfs,
        Modal.current.setValue
    );

     expect(spyReload).toHaveBeenCalled();
});
test('Deveria de redirigir a metamask si window.ethereum es undefined', async () => {
    jest.resetAllMocks();
    const {result:initialbc} = renderHook( () => superHook(todo));
    const {result:Modal} = renderHook( () => superHook({ show: false }));
    const unhideCharge = (e) => {
        var neg = "";
        if (e) {
            neg = false;
        } else {
            neg = true;
        }
        return initialbc.current.reset({ showHideCharge: e });
    }
    window.ethereum= false;
    
    const spyWindow = jest.spyOn(window,'open');

    const valida =  await Validar(
        event,
        unhideCharge,
        Web3,
        wait,
        sameNetwork,
        initialbc.current.value,
        initialbc.current.setValue,
        addNetwork,
        ValidafySM,
        ipfs,
        Modal.current.setValue
    );

     expect(spyWindow).toHaveBeenCalled();
     expect(spyWindow).toHaveBeenCalledWith("https://metamask.io/download", "_blank");
});



})
