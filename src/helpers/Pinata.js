import {useState} from 'react';
const pinataSDK = require("@pinata/sdk");
export const pinata = pinataSDK(
  "8e2b2fe58bbbc6c45be1",
  "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
);

export const start = async() =>{
await pinata.testAuthentication()
          .then((result) => {
            //handle successful authentication here
            console.log(result);
          })
          .catch((err) => {
            //handle error here
            console.log(err,"este es el error");
          });
        }
start();


export const metadata = async(filters = {hashContains:props.match.params.id,status : 'pinned',pageLimit: 10,pageOffset: 0,}) =>{

    const [TxHash, setTxHash] = useState("");
    const [DateCreated, setDateCreated] = useState("");
    const [Owner, setOwner] = useState("");
    const [filename, setfilename] = useState("nombre");
    const [tokenid, settokenid] = useState("");
    const [explorer, setexplorer] = useState("");

    const load = () => await   pinata.pinList(filters).then((result) => {
        //handle results here
        console.log(result);
        console.log(result.rows[0].metadata.keyvalues.tokenid);

        // setIpfsHash(props.match.params.id);
        setTxHash(result.rows[0].metadata.keyvalues.txHash);
        setDateCreated(result.rows[0].date_pinned);
        setOwner(result.rows[0].metadata.keyvalues.owner);
        setfilename(result.rows[0].metadata.name);
        settokenid(result.rows[0].metadata.keyvalues.tokenid);
        setexplorer(result.rows[0].metadata.keyvalues.explorer);
       
    }).catch((err) => {
        //handle error here
        console.log(err, "este es el rror");
    });

    return{
        TxHash,
        setTxHash,
        DateCreated,
        setDateCreated,
        Owner,
        setOwner,
        filename,
        setfilename,
        tokenid,
        settokenid,
        explorer,
        setexplorer,
        load    
    }
}


// export default pinata;