import React,{useState,useEffect,useRef} from "react";
import Web3 from 'web3';

import Navbar from "../components/Navbar_landing_template";
import Footer from "../components/Footer_landing_template";


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

export default function Landing() {
  const [initialBc,setInitialBc]=useState({Hash: '',contract: null,buffer:null,web3: null,account: null});
  //  const [Buffe,setBuffer]=useState(null );
    const [user,setUser] = useState({firstname:"",lastname:"",username: "", password : "",phone:"",institution:"",carrer:"",finish:"",role:"user"});
    const [message,setMessage] = useState("");
    const [buffer,setBuffer]=useState("");
    const [ipfss,setIpfs]=useState("");



  async function componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async function loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setInitialBc({account:accounts[0] })
    console.log(initialBc.account)
    const networkId = await web3.eth.net.getId()
    
    if( networkId) {
       
      console.log(initialBc.contract)
   
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  let timerID = useRef(null);
  
  useEffect(()=>{
      return ()=>{
          clearTimeout(timerID);
      }
  },[]);
  const onChange = e =>{
    setUser({...user,[e.target.name] : e.target.value});
  }

  const resetForm = ()=>{ 
        setUser({firstname:"",lastname:"",username: "", password : "",phone:"",institution:"",carrer:"",finish:"",role:"user"});
  } 
  const captureFile = async (event) => {
    
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setInitialBc({buffer:Buffer(reader.result) })
      setBuffer({buffer:Buffer(reader.result) })
      console.log('buffer2', buffer)
      

    } 
    console.log('buffer v', initialBc.buffer)
    
   }
   const onSubmit = e =>{
    e.preventDefault();
    console.log('buffer1', initialBc.buffer)
    console.log('buffer2', buffer.buffer)
    try {
      ipfs.add(initialBc.buffer, (error, result) => {
        console.log('Ipfs result', result[0].path)
        setIpfs(result[0].path);
        if(error) {
          console.error(error)
          return
        }
     
      })
    } catch (error) {
      console.error(error)
    }
  
}
  const alert =(event)=>{
    event.preventDefault()
    window.location.href = "#"
    window.alert('haz click en el boton de Metamask')

  }
  return (
    <>
      <Navbar transparent />
      {message}
      <main>
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{
            minHeight: "75vh",
          }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl">
                  Tus documentos descentralizados

                  </h1>
                  <p className="mt-4 text-lg text-gray-300">
                  Validafy es más que un sistema de estampado, queremos que el almacenamiento de información
                   sea libre, descentralizado e interplanetario. Conoce nuestro whitepaper <a className="a-link" href="https://docs.google.com/document/d/1Cm9j-O9LBIVtoBFxtSTB3PraybhxDi5vZwOtYPDXd6Q/edit#">aquí</a>.

                  </p>
                </div>
              </div>
            </div>
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
        </div>

        <section className="pb-20 bg-gray-300 -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Estampado</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                    Estampa tus documentos en blockchain con Validafy y deja una
                     marca de tiempo permanente de que el documento existió.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                      <i className="fas fa-retweet"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Validación</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                    Conoce si tus documentos los han estampado antes sobre el blockchain y cuándo ocurrió.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                      <i className="fas fa-fingerprint"></i>
                    </div>
                    <h6 className="text-xl font-semibold">API</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                    ¿Quieres que tu aplicación pueda hacer uso de Validafy?
                     nuestra API te permitirá verificar los hashes que ya han sido estampados en blockchain. (Muy pronto)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div name="valida" className="flex flex-wrap items-center mt-32">
            <div className="w-full h-auto md:w-1 px-4 text-center">  
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    
                    <div className="text-white p-3 text-left  bg-blue-400">
                    
                    <ul className="list-reset flex border-b">
                        <li className="-mb-px mr-1">
                          <a className="bg-blue inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-dark font-semibold" href="#">Valida</a>
                        </li>
                        <li className="mr-1">
                          <a className="bg-blue inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold" href="#" onClick={alert} >Estampa</a>
                        </li>
                        
                      </ul>
                                   
                    </div>
                      <div className="container">
                          <div className="h-auto bg-blue flex flex-col space-y-5 justify-top items-center">
                              <div className="bg-white w-50 shadow-xl rounded p-5">
                                  <h1 className="text-3xl font-medium">Valida Documento</h1>
                                  <form className="space-y-5 mt-5"  onSubmit={onSubmit}>
                                  <input className="w-full h-12 border border-gray-800 rounded px-3" required type="file" accept=".jpg,.png" onChange={captureFile}  />
                                  <button 
                                                            style={{"WebkitTextStroke":"0px black","margin":"10px 0px 6px 0px"}} 
                                                            type="submit"
                                                            >Registrar
                                                    </button> 
                                       

                                      <textarea className="w-full h-12 border border-gray-800 rounded px-3" readOnly value={ipfss} ></textarea>
                                  </form>
                              </div>
                          </div>
                      </div>
                   
                  </div>
                </div>
              </div>

              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">

            


                <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                Casos de uso
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                ¿Sabes para qué te sirve tener tus documentos en blockchain?

                </p>
                
                <ul  className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                      <li ><i className="fa fa-check-square" aria-hidden="true"></i> Control y auditoría.</li>
                      <li><i className="fa fa-check-square" aria-hidden="true"></i> Credenciales.</li>
                      <li><i className="fa fa-check-square" aria-hidden="true"></i> Almacenamiento interplanetario de archivos.</li>
                      <li> <i className="fa fa-check-square" aria-hidden="true"></i> Registro de sucesos.</li>
                      <li><i className="fa fa-check-square" aria-hidden="true"></i> Propiedad intelectual.</li>
                    </ul>
               
                
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit#/presentation"
                  className="font-bold text-gray-800 mt-8"
                >
                   
                </a>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-pink-600">
                  <img
                    alt="..."
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 583 95"
                      className="absolute left-0 w-full block"
                      style={{
                        height: "95px",
                        top: "-94px",
                      }}
                    >
                      <polygon
                        points="-30,95 583,95 583,65"
                        className="text-pink-600 fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">
                    Ventajas
                    </h4>
                    
                     <ul className="text-md font-light mt-2 text-white">
                      <li><i className="fa fa-desktop" aria-hidden="true"></i> Descentralizado.</li>
                      <li><i className="fa fa-globe" aria-hidden="true"></i> Interplanetario.</li>
                      <li> <i className="fa fa-gavel" aria-hidden="true"></i> Legalmente válido</li>
                      
                    </ul>
                   
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>











 
        <section className="pb-20 relative block bg-gray-900">
          <div
            className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
            style={{ height: "80px" }}
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
                className="text-gray-900 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                    Construye con nosotros
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
                Para las organizaciones con sistemas de gestión de calidad que necesitan 
                de procesos de validación, Validafy es una plataforma descentralizada que 
                permite el control de documentos basada en blockchain.

                </p>
              </div>
            </div>
            <div className="flex flex-wrap mt-12 justify-center">
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-medal text-xl"></i>
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">
                  Excelent Services
                </h6>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-poll text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Grow your market
                </h5>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-lightbulb text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Launch time
                </h5>
                <p className="mt-2 mb-4 text-gray-500">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="relative block py-24 lg:pt-0 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      Te interesa trabajaar con nosotros?
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-gray-600">
                      Completa el formulario para ponernos en contacto.
                    </p>
                    <div className="relative w-full mb-3 mt-8">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="full-name"
                      >
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Nombre completo"
                        style={{ transition: "all .15s ease" }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Correo
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Correo"
                        style={{ transition: "all .15s ease" }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="message"
                      >
                        Mensaje
                      </label>
                      <textarea
                        rows="4"
                        cols="80"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Escribe tu mensaje..."
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        style={{ transition: "all .15s ease" }}
                      >
                        Enviar Mensaje
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
