import {act, renderHook} from '@testing-library/react-hooks';
import HookGetStampedData from "../../Hooks/HookGetStampedData";

let hook; //renderHook(() => HookGetStampedData('v1','v2','v3','v4','v5','v6','v7'));

beforeEach(() =>{
    jest.resetAllMocks();
    jest.restoreAllMocks();
    hook = renderHook(() => HookGetStampedData('v1','v2','v3','v4','v5','v6','v7'));
});

describe('pruebas en los hooks que se encuentran de GetStampedData', () => {

    

        test('la variable de retorno deberia de ser String', () => {

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
       
        });
   
    

})
