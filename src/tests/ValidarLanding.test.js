// import Web3 from "web3";
// import Validar from "../helpers/Validar"
import {
    // init,
    addNetwork,
    wait,
    sameNetwork,
  } from "../utils/interaction_blockchain";
  import ValidafySM from "../contracts/Valid.json";
//   import {useState} from 'react';
import {act, renderHook, } from '@testing-library/react-hooks'
import { superHook  } from "./Hooks/Hooks";

import valida from '../helpers/ValidarLanding';

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
};
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

window.alert = jest.fn();

describe('Pruebas en el metodo Validar del Landing', () => {
    test('Deveria    de recargar la pagina si files es undefine', async() => {
        const {result:initialbc, waitForNextUpdate} = renderHook( () => superHook(todo));
        // await waitForNextUpdate();
        const event = {
            preventDefault: jest.fn(),
            target:{
                files:[undefined]
            }
        };
        location.reload = jest.fn();
        
        await renderHook( () =>  valida(event,initialbc.current.value,initialbc.current.setValue,sameNetwork,addNetwork,ValidafySM,wait));
        expect(location.reload).toHaveBeenCalled();
        
        
    });
    test('Deveria de acceder al LocalStorage', async() => {
        const {result:initialbc, waitForNextUpdate} = renderHook( () => superHook(todo));
        // await waitForNextUpdate();
        Storage.prototype.getItem = jest.fn(() =>'97');
        
        const sameNetwork = () => true;
        const addNetwork = jest.fn();
        const wait = jest.fn();
        window.FileReader = jest.fn();
        
        await renderHook( () =>  valida(event,initialbc.current.value,initialbc.current.setValue,sameNetwork,addNetwork,ValidafySM,wait));
        

        expect(localStorage.getItem).toHaveBeenCalled();
        
        
    });
    test('Deveria de lansar un alert si hay un error en la funcion', async() => {
        const {result:initialbc, waitForNextUpdate} = renderHook( () => superHook(todo));
        
        Storage.prototype.getItem = jest.fn(() =>'97');
        const event = {
            preventDefault: jest.fn()   
        }
        // window.alert = jest.fn();
        
        await renderHook( () =>  valida(event,initialbc.current.value,initialbc.current.setValue,sameNetwork,addNetwork,ValidafySM,wait));
        

        expect(alert).toHaveBeenCalled();
        
    });
    
})
