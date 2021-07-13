import React, { useState, useEffect } from "react";
 

 import "../assets/css/pdfstyle.css";
 import { FillButton } from 'tailwind-react-ui'
 //Using the Pinata SDK with dokxo apikeys
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "8e2b2fe58bbbc6c45be1",
  "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
);


export default function Preview (props) {
  
  const [IpfsHash, setIpfsHash] = useState("");
  const [TxHash, setTxHash] = useState("");
  const [DateCreated, setDateCreated] = useState("");
  const [Owner, setOwner] = useState("");
  const [filename, setfilename] = useState("nombre");
  const [tokenid, settokenid] = useState("");
  const [explorer, setexplorer] = useState("");

  const myhash = window.localStorage;
  function reset (){
    setIpfsHash("");
    setTxHash("");
    setDateCreated("");
    setOwner("");
    setfilename("");
    settokenid("");
    setexplorer("");
  };
  useEffect(async() => {
    (async () => {

 
    
      try {
        if(typeof window.orientation!=="undefined"){
         document.getElementById('enlace').click();
        }
        console.log(props.match.params.id)
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
        /////
  
  
  
      // this
      /*
      result.rows[0].date_pinned
      result.rows[0].metadata.name
      result.rows[0].metadata.keyvalues.owner
      result.rows[0].metadata.keyvalues.tokenid
      result.rows[0].metadata.keyvalues.txHash
  
      */
      reset();
            const filters = {
              hashContains:props.match.params.id,
                status : 'pinned',
                pageLimit: 10,
                pageOffset: 0,
                
            };
         await   pinata.pinList(filters).then((result) => {
                //handle results here
                console.log(result);
                console.log(result.rows[0].metadata.keyvalues.tokenid);
  
                setIpfsHash(props.match.params.id);
                setTxHash(result.rows[0].metadata.keyvalues.txHash);
                setDateCreated(result.rows[0].date_pinned);
                setOwner(result.rows[0].metadata.keyvalues.owner);
                setfilename(result.rows[0].metadata.name);
                settokenid(result.rows[0].metadata.keyvalues.tokenid);
                setexplorer(result.rows[0].metadata.keyvalues.explorer);
               
            }).catch((err) => {
                //handle error here
                console.log(err);
            });
          
      } catch (error) {
        
      }
     
    })();
  }, []);

  function getlink(e) {
    var aux = document.createElement('input');
    aux.setAttribute('value', window.location.href.split('?')[0].split('#')[0]);
    document.body.appendChild(aux);
    aux.select();
  
    document.execCommand('copy');
    document.body.removeChild(aux);
    var css = document.createElement('style');
    var estilo = document.createTextNode('#aviso {position:fixed; z-index: 9999999; top: 50%;left:50%;margin-left: -70px;padding: 20px; background: gold;border-radius: 8px;font-family: sans-serif;}');
    css.appendChild(estilo);
    document.head.appendChild(css);
    var aviso = document.createElement('div');
    aviso.setAttribute('id', 'aviso');
    var contenido = document.createTextNode(e+' copiada');
    aviso.appendChild(contenido);
    document.body.appendChild(aviso);
    window.load = setTimeout('document.body.removeChild(aviso)', 2000);
  }
 
  function copyToClipboard (text)  {
    console.log('text', text)
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  //TIMEOUT

  return (
    <>
       
      <div className="relative   bg-blueGray-100">
  
        <main className="Preview-page ">
          <section className="relative " style={{ height: "500px" }}>
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('https://blogcandidatos.springspain.com/wp-content/uploads/2020/01/proyecto-blockchain-1200x600.jpg')",
              }}
            >
              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black"
              ></span>
            </div>
            <div
              className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
              style={{ height: "70px" }}
            >
              <svg
                className="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="text-gray-300 fill-current"
                  points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
          </section>
          <section className="-mt-32 right-0 flex flex-wrap  py-16 bg-gray-300">
            <div className="container mx-auto px-4">
              
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64  -mr-30">
          
                   
                  
                    
   
    
  <div className="py-3 sm:max-w-xl sm:mx-auto">
    
    <div className="bg-white shadow-lg border-gray-100 max-h-80	 border sm:rounded-3xl p-8 flex space-x-8">
      
      <div className=" overflow-visible w-full">
      <div style={{position: 'relative',width: '100%',height: '100%'}}>
            <object data={`https://gateway.pinata.cloud/ipfs/${props.match.params.id}`}
            type="application/pdf"
            width="100%"
            height="100%"
            >
              Dispositivo no compatible
              <br/>
              <a href={`https://gateway.pinata.cloud/ipfs/${props.match.params.id}`}
              id="enlace"
              download="descarga.pdf" className="a-link" >click aqui para descargar</a>
            </object>

          </div>   
          
      </div>
      <div className="flex flex-col ml-2  w-1/2 space-y-4">
        <div className="flex justify-between text-center shadow-lg items-start">
          <h5 className="text-lg   font-bold">{filename} </h5>
           
        </div>
        <div className="shadow-lg">
        <div>
            
            <div className="text-sm mt-6  bg-gray-100 text-gray-400">Ipfs Hash
            <button> <i className="fa fa-clipboard  ml-2" 
                onClick={() => {
                  
                  getlink("Ipfs hash");
                  copyToClipboard("https://gateway.pinata.cloud/ipfs/"+IpfsHash);
                  //getlink2(IpfsHash);
                 }}
                 
                  >  </i></button></div>
            <div className="text-xs bg-pink-100 text-gray-800">{IpfsHash}
                
            </div>
            
          </div>
          <div>
            <div className="text-sm   text-gray-400">Tx Hash 
            <button> <i className="fa fa-clipboard  ml-2"
                onClick={() => {
                 
                  getlink("Tx hash");
                  copyToClipboard(explorer + TxHash);
                 }}>  </i></button></div>
            <div className="text-xs   bg-pink-100 text-gray-800">{TxHash} 
               
            </div>
          </div>
          <div>
            <div className="text-sm   text-gray-400">Dueño</div>
            <div className="text-xs  bg-pink-100 text-gray-800">{Owner}
            </div>
                 
          </div>
          <div>
            <div className="text-sm    text-gray-400">Token id</div>
            <div className="text-xs  bg-pink-100 text-gray-800">{tokenid}</div>
            <div className="text-sm    text-gray-400">Explorer</div>
            <div className="text-xs  bg-pink-100 text-gray-800">{explorer.toString().substring(8,20) }</div>
            <div className="text-sm   text-gray-400">Fecha Creada</div>
            <div className="text-xs  bg-pink-100 text-gray-800">{DateCreated}</div>
          </div>
         
        </div>
      <div>
        <FillButton className="w-full  py-auto px-auto mt-2 bg-green-500 text-white "onClick={() => {
                
                getlink("URL");
                copyToClipboard(window.location.href);
                 }}> Compartir <i className="fa fa-share-alt-square text-white " aria-hidden="true"></i></FillButton>
        </div>
        <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
      </div>
    
    </div>
  </div>
   
  </div>
  

</div>
                                   
              
                
          </section>
          <footer className="block py-4">
            <div className="container mx-auto px-4">
              <hr className="mb-4 border-b-1 border-blueGray-200" />
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full text-right md:w-4/12 px-4">
                  <div className="text-sm text-right text-gray-600  py-1">
                    Copyright © {new Date().getFullYear()} Validafy by{" "}
                    <a
                      href="https://cloudmex.io/"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      CloudMex Analytics
                    </a>
                    .
                  </div>
                </div>
              </div>
            </div>
          </footer>
        
        </main>
      </div>
    </>
  );
}