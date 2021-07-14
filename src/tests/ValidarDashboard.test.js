import Validar from "../helpers/Validar"

describe('Pruevas en el metodo Validar', () => {
    
    const event = {
        preventDefault: jest.fn(),
        target:{
            files:[
                {
                    lastModified: 192732710,
                    lastModifiedDate: new Date().getTime(),
                    name: "informacion (Recuperado automáticamente).docx",
                    size: 14613,
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    webkitRelativePath: ""
                }
            ]
        }
    }
    const unhideCharge =  jest.fn();
    const Web3 =  jest.fn();
    const wait = jest.fn();
    const window = {
        ethereum: {
            request: jest.fn()
        },
        FileReader: {
            readAsArrayBuffer: jest.fn(),
            onloadend: Function,
            result: {}

        },
        location: {
            reload: jest.fn
        },
        web3:{
            eth:{
                net:{
                    getId: jest.fn()
                },
                Contract: jest.fn()
            }
        },
        open: jest.fn()
    };
    const sameNetwork = jest.fn();
    const initialBc = {
        Hash: "",
        Validado: "",
        Validar: jest.fn(),
        account: null,
        buffer: undefined,
        contract: null,
        file: null,
        showHideCharge: false,
        showHideFile: true,
        showHideProgress: false,
        showHidebutton: false,
        showImg: true,
        web3: null,
    };
    const setInitialBc = jest.fn();
    const addNetwork = jest.fn();
    const ValidafySM = {
        networks:[
            {address: "123456789"},
            {address: "10937291392"}
        ],
        abi:{}

    };
    const ipfs = {
        add: jest.fn()
    };
    const setShowModal = jest.fn();

    
test('No deveria de llamarsela funcion reload, si file es diferente a undefine', () => {
    
    const valida =  Validar(
        event,
        unhideCharge,
        Web3,
        wait,
        window,
        sameNetwork,
        initialBc,
        setInitialBc,
        addNetwork,
        ValidafySM,
        ipfs,
        setShowModal
    );

    expect(window.location.reload()).not.toHaveBeenCalled();
});
test('deveria de regresar un mensaje de error si file es igual a null', () => {
    
    // const event = {
    //     preventDefault: jest.fn(),
    //     target:{
    //         files: null
    //     }
    // }
    const valida =  Validar(
        event,
        unhideCharge,
        Web3,
        wait,
        window,
        sameNetwork,
        initialBc,
        setInitialBc,
        addNetwork,
        ValidafySM,
        ipfs,
        setShowModal
    );

    expect(valida).toEqual("no agrego ningun archivo");
})


    



})
