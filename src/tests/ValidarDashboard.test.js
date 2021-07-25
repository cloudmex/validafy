import Web3 from "web3";
import Validar from "../helpers/ValidarDashboard"
import {
    // init,
    addNetwork,
    wait,
    sameNetwork
  } from "../utils/interaction_blockchain";
  import ValidafySM from "../contracts/Valid.json";
//   import {useState} from 'react';
import {renderHook, act } from '@testing-library/react-hooks'
import HookDashBoard from "../Hooks/HookDashBoard";
import ValidarDashboard, {MatchKeys,GetContrac,GetIpfs} from "../helpers/ValidarDashboard";


const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});





describe('Pruebas en los hooks del DashBoard', () => {
    
    


    let getvalues = ()  => renderHook(() => HookDashBoard(
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




    

    test('hideComponent es una funcion, deberia de resivir un parametro tipo boolean', () => {
        const values = getvalues();
        act(() => {
            values.result.current.hideComponent(true);
        });
        expect(typeof values.result.current.hideComponent).toBe('function');
        expect(typeof values.result.current.initialBc.showHidebutton).toEqual('boolean');
    });

    test('unhideCharge es una funcion, deberia de resivir un parametro tipo boolean', () => {
        const values = getvalues();
        act(() => {
            values.result.current.unhideCharge(true);
        });
        expect(typeof values.result.current.unhideCharge).toBe('function');
        expect(typeof values.result.current.initialBc.showHideCharge).toEqual('boolean');
    });

    test('hideFile es una funcion, deberia de resivir un parametro tipo boolean', () => {
        const values = getvalues();
        act(() => {
            values.result.current.hideFile(true);
        });
        expect(typeof values.result.current.hideFile).toBe('function');
        expect(typeof values.result.current.initialBc.showHideFile).toEqual('boolean');
    });

    test('resetForm es una funcion, deberia hacer reset a los hooks InitialBc, Buffer, Sm', () => {
        const values = getvalues();
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
        const values = getvalues();
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
        const values = getvalues();
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
        const values = getvalues();
        act(() => {
            values.result.current.RemoveLoadImage();
        });

        expect(typeof values.result.current.RemoveLoadImage).toBe('function');
        expect(typeof values.result.current.initialBc.showHideCharge ).toEqual('boolean');
        expect(values.result.current.initialBc.showHideCharge ).toEqual(false);
        

    });

    test('ModalSucces es una funcion, deberia de agregar al objeto initialBc lo siguiente {show: true, success: true, message: "Hola"}', () => {
        const values = getvalues();
        act(() => {
            // values.result.current.setInitialBc(ej);
            // values.result.current.setShowModal(ej);
            values.result.current.ModalSucces("Hola");
        });

        expect(typeof values.result.current.ModalSucces).toBe('function');
        expect(values.result.current.Modal).toEqual({...values.result.current.initialBc, show: true, success: true, message: "Hola"});
        
    });
    
    test('ModalAlert es una funcion, deberia de agregar al objeto initialBc lo siguiente {show: true, success: false, message: "Hola"}', () => {
        const values = getvalues();
        act(() => {
            // values.result.current.setInitialBc(ej);
            // values.result.current.setShowModal(ej);
            values.result.current.ModalAlert("Hola");
        });

        expect(typeof values.result.current.ModalSucces).toBe('function');
        expect(values.result.current.Modal).toEqual({...values.result.current.initialBc, show: true, success: false, message: "Hola"});
        
    });

    test('ModalAlert es una funcion, deberia de agregar al objeto initialBc lo siguiente {namepdf: "Hola.pdf",showImg: true}', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.FileName("Hola.pdf");
        });
//     FileName,namepdf: file,
// showImg: true,   
        expect(typeof values.result.current.FileName).toBe('function');
        expect(values.result.current.initialBc).toEqual({...re, namepdf: "Hola.pdf",showImg: true});
        
    });

    test('BufferUndefined es una funcion, deberia de agregar al objeto initialBc lo siguiente {buffer: undefined}', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.BufferUndefined();
        });

        expect(typeof values.result.current.BufferUndefined).toBe('function');
        expect(values.result.current.initialBc).toEqual({...re, buffer: undefined});
        
    });

    test('showImgValidar es una funcion, deberia de agregar al objeto initialBc lo siguiente {buffer: undefined}', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        const Validar = "asdasd";
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.showImgValidar(Validar);
        });

        expect(typeof values.result.current.showImgValidar).toBe('function');
        expect(values.result.current.initialBc).toEqual({...re, Validado: "",showImg: true, Validar});
        
    });
    
    test('hideProgresss es una funcion, deberia de agregar al objeto initialBc lo siguiente { showHideProgress: e }', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.hideProgresss(true);
        });

        expect(typeof values.result.current.hideProgresss).toBe('function');
        expect(values.result.current.initialBc).toEqual({ showHideProgress: true });
        
    });
    
    test('Validado es una funcion, deberia de agregar al objeto initialBc lo siguiente { Validado: "" }', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.Validado();
        });

        expect(typeof values.result.current.Validado).toBe('function');
        expect(values.result.current.initialBc).toEqual({ ...re, Validado: "" });
        
    });

    test('AddInfoInitialBc es una funcion, deberia de resivir un objeto como parametro y agregarlo a initialBc', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        const todo = {
            prueva: "prueva"
        }
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.AddInfoInitialBc(todo);
        });

        expect(typeof values.result.current.AddInfoInitialBc).toBe('function');
        expect(values.result.current.initialBc).toEqual({ ...re, ...todo });
        
    });

    test('AddInfoModal es una funcion, deberia agregar un nuevo valor a setShowModal y rescive un objeto', () => {
        const values = getvalues();
        const re = values.result.current.initialBc;
        const todo = {
            prueva: "prueva"
        }
        act(() => {
            // values.result.current.setInitialBc({E:"asd"});
            // values.result.current.setShowModal(ej);
            values.result.current.AddInfoModal(todo);
        });
// setShowModal
        expect(typeof values.result.current.AddInfoModal).toBe('function');
        expect(values.result.current.Modal).toEqual({ ...re, ...todo });
        
    });
  
});

describe('Pruebas en interaction_blockchain',() => {
    
        
        window.ethereum = {
            request: (obj)=>{
                return obj;
            }
        };
        
        test('addNetwork es una funcion, si la red no existe retorna un mensaje', async() => {
            
            expect(typeof addNetwork).toBe('function');
            expect(await addNetwork(90)).toBe("no existe esa red");
        });

        test('Si la red existe retorna un objeto con informacion de la red', async() => {
            
            expect(typeof await addNetwork(97)).toBe('object');
        });

        test('wait es una funcion, Deberia de deterner la ejecucion por milisegundos', () => {
            expect(typeof wait).toBe('function');
            const start = new Date().getTime();
            wait(200);
            const end = new Date().getTime();
            expect((end - start-1)).toBe(200);

        });

        test('sameNetwork es una funcion, Deberia retornar un valor true si las redes son iguales', async() => {
            window.ethereum = {
                request: (obj)=>{
                    return 97;
                }
            };
            Storage.prototype.getItem = (key) =>{
                switch (key) {
                    case "network": return 97;
                }
                return 56;    
            }
            expect(typeof sameNetwork).toBe('function');
            expect( await sameNetwork()).toBe(true);

        });
        

        

    
});

describe('Pruebas en ValidarDashboard', () => {

    test('MatchKeys es una funcion, deberia de llamar corectamente funciones de interaction_blockchain', async() => {
        
        expect(typeof MatchKeys).toBe('function');
        const sameNetwork = jest.fn()
        .mockReturnValue(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);
        
        const AddInfoInitialBc = jest.fn();
        const wait = jest.fn();
        const addNetwork = jest.fn().mockResolvedValue(async() => await 97);

        await MatchKeys(sameNetwork,AddInfoInitialBc,wait,addNetwork);

        expect(sameNetwork).toHaveBeenCalled();
        expect(AddInfoInitialBc).toHaveBeenCalled();
        expect(wait).toHaveBeenCalled();
        expect(addNetwork).toHaveBeenCalled();


    })
    
    
});

describe('Pruevas en GetContrac', () => {

    test('GetContrac es una funcion, window.web3.eth.Contract recive dos parametros', async() => {
        
        window.ethereum= {
            request: jest.fn(() => 97)
        }
        window.web3= {
            eth:{
                Contract: jest.fn(()=> true)   
            }
        }
        
            expect(typeof GetContrac).toBe('function');
            const c = await GetContrac(ValidafySM);
            expect(window.web3.eth.Contract).toHaveBeenCalledWith(expect.anything(),expect.anything());
    })
    
});

describe('Pruevas en GetIpfs', () => {

    test('GetContrac es una funcion, window.web3.eth.Contract recive dos parametros', async() => {
        
        window.ethereum= {
            request: jest.fn(() => 97)
        }
        window.web3 = {
            eth:{
                Contract: () =>({
                    methods:{
                        IsHashed: (v) => ({
                            call:()=> jest.fn(() => true)
                        })
                    }
                })   
            }
        }

        
        const file = {
            name: "prueva"
        };
        Buffer = jest.fn();
        const reader = {
            result: "algo"
        };
        // const ipfs = {
        //     add: (v1,v2) =>({then: (c) => {}}) 
        // }
        // const asyncMock = jest.fn().mockResolvedValue(43);
    //    const v = await asyncMock();
        const AddInfoModal = jest.fn();
        const AddInfoInitialBc = jest.fn();

        await GetIpfs(file,ipfs,reader,AddInfoModal,AddInfoInitialBc,ValidafySM);

        expect(typeof GetIpfs).toBe('function');
        expect(AddInfoModal).toBe('function');

        // expect(v).toBe(42);
    })
    
});










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

    

// test('Deberia recargar la pagina si file.array es undefined', async () => {

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
// test('Deberia de redirigir a metamask si window.ethereum es undefined', async () => {
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
