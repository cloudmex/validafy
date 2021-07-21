const pinataSDK = require("@pinata/sdk");
    const pinata = pinataSDK(
    "8e2b2fe58bbbc6c45be1",
    "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
    );


export const GetStampedData  = async(
  reset, 
  setDateCreated,
  setOwner,
  setfilename,
  settokenid,
  setexplorer,
  setIpfsHash,
  setTxHash,
  props
  ) => {
    
  
  try {
    if(typeof window.orientation!=="undefined"){
       document.getElementById('enlace').click();
      }
 
    reset();
    
    const Filter = {
      hashContains: props.match.params.id,
        status : 'pinned',
        pageLimit: 10,
        pageOffset: 0
    }
       await helperPinata(
          Filter,
          setIpfsHash,
          setTxHash,
          setDateCreated,
          setOwner,
          setfilename,
          settokenid,
          setexplorer,
          props,
          );
        
    } catch (error) {

    }
  }

  

  export const helperPinata = async(
    filters = {},
    setIpfsHash,
    setTxHash,
    setDateCreated,
    setOwner,
    setfilename,
    settokenid,
    setexplorer,
    props,
    ) =>{

      //Testing if Validafy is conected to Pinata.
      pinata
      .testAuthentication()
      .then((result) => {
          //handle successful authentication here
          console.log(result);
        })
        .catch((err) => {
          //handle error here
          console.log(err);
        });
      
        return await pinata.pinList(filters).then((result) => {
          //handle results here
          // console.log(result);
          // console.log(result.rows[0].metadata);
          
          setTxHash(result.rows[0].metadata.keyvalues.txHash);
          setIpfsHash(props.match.params.id);
          setDateCreated(result.rows[0].date_pinned);
          setOwner(result.rows[0].metadata.keyvalues.owner);
          setfilename(result.rows[0].metadata.name);
          settokenid(result.rows[0].metadata.keyvalues.tokenid);
          setexplorer(result.rows[0].metadata.keyvalues.explorer);
          // console.log("entro");
        }).catch((err) => {
          //handle error here
          // console.log(err);
          // console.log("entro al error");
        });
  }