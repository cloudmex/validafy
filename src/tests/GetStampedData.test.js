
import {GetStampedData,helperPinata} from '../helpers/GetStampedData'
import {act, renderHook} from '@testing-library/react-hooks';
import HookGetStampedData from "../Hooks/HookGetStampedData";




describe('pruebas en los hooks que se encuentran de GetStampedData', () => {

        let hook; //renderHook(() => HookGetStampedData('v1','v2','v3','v4','v5','v6','v7'));

        beforeEach(() =>{
            jest.resetAllMocks();
            jest.restoreAllMocks();
            hook = renderHook(() => HookGetStampedData('v1','v2','v3','v4','v5','v6','v7'));
        });

        test('las variables de los Hooks deberia de ser String', () => {

            const 
            {
                reset,
                IpfsHash, setIpfsHash,
                TxHash, setTxHash,
                DateCreated, setDateCreated,
                Owner, setOwner,
                filename, setfilename,
                tokenid, settokenid,
                explorer, setexplorer
            } 
            =
           hook.result.current;

            expect(typeof IpfsHash).toBe('string');
            expect(typeof TxHash).toBe('string');
            expect(typeof DateCreated).toBe('string');
            expect(typeof Owner).toBe('string');
            expect(typeof filename).toBe('string');
            expect(typeof tokenid).toBe('string');
            expect(typeof explorer).toBe('string');
        });
        test('Los metodos Set Deberian de ser funciones', () => {

            const 
            {
                reset,
                IpfsHash, setIpfsHash,
                TxHash, setTxHash,
                DateCreated, setDateCreated,
                Owner, setOwner,
                filename, setfilename,
                tokenid, settokenid,
                explorer, setexplorer
            } 
            =
           hook.result.current;

            expect(typeof setIpfsHash).toBe('function');
            expect(typeof setTxHash).toBe('function');
            expect(typeof setDateCreated).toBe('function');
            expect(typeof setOwner).toBe('function');
            expect(typeof setfilename).toBe('function');
            expect(typeof settokenid).toBe('function');
            expect(typeof setexplorer).toBe('function');
            expect(typeof reset).toBe('function');
        });
        test('La funcion reset deveria de darle a los hook valores vacios', () => {


            act(() => {
            //    return setstate("2");
                     hook.result.current.reset();
            });
           
            expect(hook.result.current.IpfsHash).toEqual('');
            expect(hook.result.current.TxHash).toEqual('');
            expect(hook.result.current.DateCreated).toEqual('');
            expect(hook.result.current.Owner).toEqual('');
            expect(hook.result.current.filename).toEqual('');
            expect(hook.result.current.tokenid).toEqual('');
            expect(hook.result.current.explorer).toEqual('');
       
        });
   
    

})

describe('Pruebas en la funcion helperPinata', () => {

    const funJest1 =  jest.fn();
    const funJest2 =  jest.fn();
    const funJest3 =  jest.fn();
    const funJest4 =  jest.fn();
    const funJest5 =  jest.fn();
    const funJest6 =  jest.fn();
    const funJest7 =  jest.fn();

    beforeEach(() =>{
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });


    test('Las funciones set de helperPinata deben de ser llamadas con un parametro String especifico', async() => {

    const props = {
        match:{
            params: { 
                id: "2"
            }
        },


    };

        const Filter = {
              hashContains: props.match.params.id,
              status : 'pinned',
              pageLimit: 10,
              pageOffset: 0
          }
        await helperPinata (
            Filter,
            funJest1,
            funJest2,
            funJest3,
            funJest4,
            funJest5,
            funJest6,
            funJest7,
            props,
            );

         expect(funJest1).toHaveBeenCalledWith("2");
         expect(funJest2).toHaveBeenCalledWith("0x9df9253b1108feebe3b08a961258ff1c6898672c8b132311e52a0b52ec64d99d");
         expect(funJest3).toHaveBeenCalledWith("2021-07-20T16:49:40.221Z");
         expect(funJest4).toHaveBeenCalledWith("0xa336003D83e779bC940De5478cFf61e732Ce770B");
         expect(funJest5).toHaveBeenCalledWith("R.png");
         expect(funJest6).toHaveBeenCalledWith("2");
         expect(funJest7).toHaveBeenCalledWith("https://bscscan.com/tx/");
        //  expect(funJest5).toHaveBeenCalledWith("2021-07-20T16:49:40.221Z");

    });
    test('Si ocurre un error con PinataSDK, no deberia de llamarse ninguna funcion Set', async() => {
    

    const props = {
        match:{
            params: { 
                id: "1"
            }
        },


    };
        
        const Filter = {
              hashContains: props.match.params.id,
              status : 'pinned',
              pageLimit: 10,
              pageOffset: 0
          }
        await helperPinata (
            Filter,
            funJest1,
            funJest2,
            funJest3,
            funJest4,
            funJest5,
            funJest6,
            funJest7,
            props,
            );

         expect(funJest1).not.toHaveBeenCalled();
         expect(funJest2).not.toHaveBeenCalled();
         expect(funJest3).not.toHaveBeenCalled();
         expect(funJest4).not.toHaveBeenCalled();
         expect(funJest5).not.toHaveBeenCalled();
         expect(funJest6).not.toHaveBeenCalled();
         expect(funJest7).not.toHaveBeenCalled();
        //  expect(funJest5).toHaveBeenCalledWith("2021-07-20T16:49:40.221Z");

    });
});

describe('Pruebas en la funcion GetStampedData', () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    const props = {
        match:{
            params: { 
                id: "2"
            }
        }
    }
        
    test('si window.orientation es diferente Undifined, deberia de llamar a document.getElementById', async() => {
        Window.prototype.orientation = " ";
        const v = jest.spyOn(document,'getElementById');
        await GetStampedData(
                        jest.fn(), 
                        jest.fn(),
                        jest.fn(),
                        jest.fn(),
                        jest.fn(),
                        jest.fn(),
                        jest.fn(),
                        jest.fn(),
                        props
                    );
            
        expect(v).toHaveBeenCalled();

    })
    
    
    // test('Deberia de llamar las funJest', async() => {
        
    //     await GetStampedData(
    //             funJest1, 
    //             funJest2,
    //             funJest3,
    //             funJest4,
    //             funJest5,
    //             funJest6,
    //             funJest7,
    //             funJest8,
    //             props
    //         );
            
    //     expect(funJest1).toHaveBeenCalled();
    //     expect(funJest2).toHaveBeenCalled();
    //     expect(funJest3).toHaveBeenCalled();
    //     expect(funJest4).toHaveBeenCalled();
    //     expect(funJest5).toHaveBeenCalled();
    //     expect(funJest6).toHaveBeenCalled();
    //     expect(funJest7).toHaveBeenCalled();
    //     expect(funJest8).toHaveBeenCalled();
    // })
    




});
