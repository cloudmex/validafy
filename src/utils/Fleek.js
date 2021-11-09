import fleekStorage from '@fleekhq/fleek-storage-js';
// import { Console } from 'console';
import fs from 'fs';
import React, {useState,useEffect} from 'react';
import ValidafySM from "../contracts/Valid.json";
import {
  Contract, getAccounts, getChainId, getExplorerUrl, init,
} from "./trustwallet";



const apiKey =  'iGf4a54cmG+pJbtI4S6mdg==';
const apiSecret = 'XW/quViqnvK97/b7FkqAgiS4Jup6LdiiaxIzE5kLXk4=';


// getFile es para obtener archivos individuales, 
// ya sea el contenido o los datos relacionados, como la clave, el hash y publicUrl
export const getFile = async(key, getOptions = ['data','bucket','key','hash','publicUrl']) => await fleekStorage.get({
    apiKey,
    apiSecret,
    key,
    getOptions
  });

// uploadFile carga un archivo, identificado por una clave, 
// en un depósito. La función devuelve el hash del archivo, publicUrl, la clave y el depósito.
export const uploadFile = async(key, data, httpUploadProgressCallback = (event) =>  {console.log(Math.round(event.loaded/event.total*100)+ '% done');}) =>   await fleekStorage.upload({
    apiKey,
    apiSecret,
    key,
    data,
    httpUploadProgressCallback
  });

// Carga archivos pesados Ej. mp4, mp3
export const streamUpload = async(key, bigFile = './') => {
  const stream  = fs.createReadStream(bigFile);
  return await fleekStorage.streamUpload({
    apiKey,
    apiSecret,
    key,
    stream,
  });
}

// Elimina un archivo por la key
export const deleteFile = async(key) => await fleekStorage.deleteFile({
  apiKey,
  apiSecret,
  key,
  // bucket: 'my-bucket',
});

// El listFiles es para obtener información sobre todos los archivos en un depósito,
// como la clave, el hash y publicUrl.
export const listFiles = async(getOptions = ['bucket','key','hash','publicUrl']) => await fleekStorage.listFiles({
  apiKey,
  apiSecret,
  getOptions,
});

// El getListBuckets devuelve una matriz de nombres de depósito asociados con la cuenta de la clave api.
export const getListBuckets = async() =>  await fleekStorage.listBuckets({
  apiKey,
  apiSecret,
});

// getFileByHash una función de utilidad que descarga los datos de un 
// archivo desde la puerta de enlace IPFS de Fleek utilizando el hash. 
// La clave y el secreto no son necesarios ya que la puerta de enlace está disponible públicamente.
export const getFileByHash = async(hash) => await fleekStorage.getFileFromHash({
  hash
});

export const Reader = (e) => {
  console.log(e.target.files);
  const file = e.target.files[0];
  console.log(file);
  console.log(e.target.value);
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  return {
    file,
    reader
  };
}

export const getHashFile = (e) => {
    
    
}



export const validar = (e,setState) => {
  const{reader} = Reader(e);
  reader.onloadend = () =>window.ipfs
            .add(Buffer(reader.result), { onlyHash: true })
            .then(async (result) => {
                // const c = await getFileByHash(result[0].hash);
                const ActualnetworkId = await getChainId();
                const tokenNetworkData = ValidafySM.networks[ActualnetworkId];
                const contract =  Contract(
                    ValidafySM.abi,
                    tokenNetworkData.address
                  );
                const ishashed = await contract.methods
                  .IsHashed(result[0].hash)
                  .call();
                  setState(!!ishashed);
                
                console.log(result[0].hash);
            })

  //     const{file,reader} = Reader(e);
  //     console.log(file.name);
  // reader.onloadend = async(s) =>  await uploadFile(file.name,Buffer(reader.result))
  // .then(async({hashV0,hash,key})=>{
  //   const ActualnetworkId = await getChainId();
  //   const tokenNetworkData = ValidafySM.networks[ActualnetworkId];
  //   const contract =  Contract(
  //       ValidafySM.abi,
  //       tokenNetworkData.address
  //     );
  //   const ishashed = await contract.methods
  //     .IsHashed(hash)
  //     .call();
  //   if(ishashed){
  //     setres("Este documentos ya fue estamapado");

  //   }else{
  //     setres("este documetno aun no esta estampado");
  //   }
  //   console.log(hash);
  // })
  // return res;
}
  // let ishashed = await contract.methods
  // .IsHashed(result[0].hash)
  // .call();




export const estampar = (e,setState) => {
  const{reader, file} = Reader(e);
  reader.onloadend = () =>window.ipfs
            .add(Buffer(reader.result), { onlyHash: true })
            .then(async (result) => {
                // const c = await getFileByHash(result[0].hash);
                const ActualnetworkId = await getChainId();
                const useraccounts = await getAccounts();
                const comision = window.web3.utils.toWei("0.00001", "ether");
                const tokenNetworkData = ValidafySM.networks[ActualnetworkId];
                const contract =  Contract(
                    ValidafySM.abi,
                    tokenNetworkData.address
                  );
                const ishashed = await contract.methods
                  .IsHashed(result[0].hash)
                  .call();
                  if(!ishashed){
                    await contract.methods
                      .createItem(
                        result[0].hash, 
                        file.name,
                        getExplorerUrl()
                        )
                      .send({
                        from: useraccounts[0],
                        value: comision,
                      })
                      // este evento no se dispara con WalletConnet
                      .on('receipt', async function(receipt){
                        console.log("resultado--> ",receipt);
  

                          // const  options  =  { 
                          //   pinataMetadata : { 
                          //     name: file.name, 
                          //     keyvalues : { 
                          //       tokenid: receipt.events.Transfer.returnValues.tokenId,
                          //       owner: receipt.events.Transfer.returnValues.to,
                          //       txHash: receipt.transactionHash,
                          //       explorer:getExplorerUrl()
                          //     } 
                          // }
                          // } ;

                            await uploadFile(file.name,Buffer(reader.result))
                            .then(async({hashV0,hash,key})=>{
                              console.log("el hash--->",hash);
                              // console.log("el resultado de pinata: ",result);
                              setState(true);
                            }).catch((err)=>{
                              console.log("error en pinata: ",err)
                              setState(false);
                            });
                      }).catch(err =>{
                        setState(false);
                      });
                  }
                
                console.log(result[0].hash);
            }).catch(err =>{
              setState(false);
            });

}

export const ModalFleek = () => {

  const [state, setstate] = useState(undefined);

  const file = (e) => {
    const c = estampar(e,setstate);
    // console.log("que es c: ",c);
    // getFileByHash("bafybeihvzie6fehyplzgrvqe2lei55klkucs7r3h3qniik4lngt2w2xpsy").then((c)=>{
    //   console.log("el resultado es: ",c);
    // });
    
      // uploadFile(
      //   1223123,
      //   e.target.value
      // )
      // .then((e)=>{
      //   console.log("terminado: ",e);
      // })
      // .catch();
    }
    
    if(state){
      console.log("True")
    }else{
      console.log("false")
    }
    useEffect(() => {
  }, []);

  return(
    // "display-out"
    <div className="wallet-modal">
      <div className="info modal-fleek">
          
          <p>nombre del archivo</p>
          <div className="upload-file btnw">
            <input type="file" className="btnw"  onChange={file}/>
          </div>



          <div className="close" >
            <img src="x.png"/>
          </div>
      </div>
      
    </div>
  )
}
