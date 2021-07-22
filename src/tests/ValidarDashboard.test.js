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
import HookDashBoard from "../Hooks/HookDashBoard";
import { hide } from "@popperjs/core";
// import {useState} from 'react';
// import React from 'react';




describe('Pruebas en los hooks del DashBoard', () => {
    
    
    // const {
    //     open,
    //     cancelButtonRef,
    //     initialBc,
    //     openTab,
    //     message,
    //     estadoProgress,
    //     buffer,
    //     ipfss,
    //     sm,
    //     progress,
    //     Modal,


    //     ModalAlert,
    //     ModalSucces,
    //     FileName,
    //     BufferUndefined,
    //     showImgValidar,
    //     Validado
    //   } 
    let values =  
    renderHook(() => HookDashBoard(
            false,
            {
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
            },
            2,
            '',
            '',
            '',
            '',
            [],
            0,
            { 
              show: false 
            }
            )
    );

    beforeEach(() =>{
        values =  
    renderHook(() => HookDashBoard(
            false,
            {
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
            },
            2,
            '',
            '',
            '',
            '',
            [],
            0,
            { 
              show: false 
            }
            )
    );
    });

    test('hideComponent es una funcion, deberia de resivir un parametro tipo boolean', () => {
        act(() => {
            values.result.current.hideComponent(true);
        });
        expect(typeof values.result.current.hideComponent).toBe('function');
        expect(typeof values.result.current.initialBc.showHidebutton).toEqual('boolean');
    });

    test('unhideCharge es una funcion, deberia de resivir un parametro tipo boolean', () => {
        act(() => {
            values.result.current.unhideCharge(true);
        });
        expect(typeof values.result.current.unhideCharge).toBe('function');
        expect(typeof values.result.current.initialBc.showHideCharge).toEqual('boolean');
    });

    test('hideFile es una funcion, deberia de resivir un parametro tipo boolean', () => {
        act(() => {
            values.result.current.hideFile(true);
        });
        expect(typeof values.result.current.hideFile).toBe('function');
        expect(typeof values.result.current.initialBc.showHideFile).toEqual('boolean');
    });

    test('resetForm es una funcion, deberia hacer reset a los hooks InitialBc, Buffer, Sm', () => {
        act(() => {
            values.result.current.resetForm();
        });
        expect(typeof values.result.current.resetForm).toBe('function');
        expect(values.result.current.initialBc)
        .toEqual(
            {
                Hash: "",
                contract: null,
                buffer: null,
                web3: null,
                account: null,
                file: null,
                showHidebutton: false,
            }
        );
        expect(values.result.current.buffer).toEqual('');
        expect(values.result.current.sm).toEqual([]);

    });
    
    test('goToMetamask es una funcion, initialBc deberia de ser un objeto que contiene un estado', () => {
        act(() => {
            values.result.current.goToMetamask();
        });
        expect(typeof values.result.current.goToMetamask).toBe('function');
        expect(values.result.current.initialBc)
        .toEqual(
            {
                show: true,
                success: false,
                message:
                "No cuentas con metamask,te estamos redireccionando al sitio oficial para que procedas con la descarga",
            }
        );
    });
    
    test('SelectNetworkTryAgain es una funcion, initialBc deberia de ser un objeto que contiene un estado', () => {
        act(() => {
            values.result.current.SelectNetworkTryAgain();
        });

        expect(typeof values.result.current.SelectNetworkTryAgain).toBe('function');
        expect(typeof values.result.current.initialBc.show ).toEqual('boolean');
        expect(typeof values.result.current.initialBc.success ).toEqual('boolean');
        expect(typeof values.result.current.initialBc.disabled).toEqual('boolean');
        expect(typeof values.result.current.initialBc.message).toEqual('string');

    });

    test('RemoveLoadImage es una funcion, showHideCharge deberia de ser false', () => {
        act(() => {
            values.result.current.RemoveLoadImage();
        });

        expect(typeof values.result.current.RemoveLoadImage).toBe('function');
        expect(typeof values.result.current.initialBc.showHideCharge ).toEqual('boolean');
        expect(values.result.current.initialBc.showHideCharge ).toEqual(false);
        

    });

    test('ModalAlert es una funcion, showHideCharge deberia de ser false', () => {
        act(() => {
            values.result.current.ModalAlert("Hola soy un mensaje de alerta");
        });

        expect(typeof values.result.current.ModalAlert).toBe('function');
        expect(values.result.current.Modal.show).toEqual(true);
        expect(values.result.current.Modal.success).toEqual(false);
        expect(typeof values.result.current.Modal.message).toEqual("string");

    });
})




// describe('Pruevas en el metodo Validar', () => {

//    const todo = {
//         Hash: "",
//         contract: null,
//         buffer: null,
//         web3: null,
//         account: null,
//         file: null,
//         showHidebutton: false,
//         showHideCharge: false,
//         showHideProgress: false,
//         showHideFile: true,
//         showImg: true,
//     }

    
//     const event = {
//         preventDefault: jest.fn(),
//         target:{
//             files:[
//                 {
//                     lastModified: 1625935677999,
//                     lastModifiedDate: 'Sat Jul 10 2021 10:47:57 GMT-0600 (hora de verano de las Montañas Rocosas',
//                     name: "informacion (Recuperado automáticamente).docx",
//                     size: 14613,
//                     type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                     webkitRelativePath: "",
//                 }
//             ]
//         }
//     }

//     window.open = jest.fn();
//     location.reload = jest.fn();
//     const ipfsClient = require("ipfs-http-client");
  
//     const ipfs = ipfsClient({
//         host: "ipfs.infura.io",
//         port: 5001,
//         protocol: "https",
//     });

    

// test('Deveria recargar la pagina si file.array es undefined', async () => {

//     const {result:initialbc} = renderHook( () => superHook(todo));
//     const {result:Modal} = renderHook( () => superHook({ show: false }));
//     const unhideCharge = (e) => {
//         var neg = "";
//         if (e) {
//             neg = false;
//         } else {
//             neg = true;
//         }
//         return initialbc.current.reset({ showHideCharge: e });
//     }
//     const event = {
//         preventDefault: jest.fn(),
//         target:{
//             files: [undefined]
//         }
//     }
//     window.ethereum= true;
//     const spyReload = jest.spyOn(location,'reload');


//     const valida =  await Validar(
//         event,
//         unhideCharge,
//         Web3,
//         wait,
//         sameNetwork,
//         initialbc.current.value,
//         initialbc.current.setValue,
//         addNetwork,
//         ValidafySM,
//         ipfs,
//         Modal.current.setValue
//     );

//      expect(spyReload).toHaveBeenCalled();
// });
// test('Deveria de redirigir a metamask si window.ethereum es undefined', async () => {
//     jest.resetAllMocks();
//     const {result:initialbc} = renderHook( () => superHook(todo));
//     const {result:Modal} = renderHook( () => superHook({ show: false }));
//     const unhideCharge = (e) => {
//         var neg = "";
//         if (e) {
//             neg = false;
//         } else {
//             neg = true;
//         }
//         return initialbc.current.reset({ showHideCharge: e });
//     }
//     window.ethereum= false;
    
//     const spyWindow = jest.spyOn(window,'open');

//     const valida =  await Validar(
//         event,
//         unhideCharge,
//         Web3,
//         wait,
//         sameNetwork,
//         initialbc.current.value,
//         initialbc.current.setValue,
//         addNetwork,
//         ValidafySM,
//         ipfs,
//         Modal.current.setValue
//     );

//      expect(spyWindow).toHaveBeenCalled();
//      expect(spyWindow).toHaveBeenCalledWith("https://metamask.io/download", "_blank");
// });



// })
