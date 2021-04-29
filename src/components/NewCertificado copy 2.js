import React, { Component,useRef } from 'react';
import Web3 from 'web3';
import '../App.css';
import Meme from '../contracts/Valid.json'
import AuthService from '../Services/AuthService'
import CertService from '../Services/CertService'
import Button from 'react-bootstrap/Button'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class NewCertificado extends Component {

  
  async componentWillMount() {
   
    console.log("props",this.props.match.params.id)
   await AuthService.getStudent(this.props.match.params.id)
    .then(res => {
      console.log(res._id)
      this.setState({
        id:res._id,
        firstname:res.firstname,
        lastname:res.lastname,
        username: res.username, 
        password : res.password,
        phone:res.phone,
        institution:res.institution,
        carrer:res.carrer,
        finish:res.finish,
      });
      
    })
    .catch((error) => {
      console.log(error);
    })
    console.log(this.state.username)

    await this.loadWeb3();
    await this.loadBlockchainData();

  }

  async loadWeb3() {
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

  onChange = e =>{
    this.setState({...this.state,[e.target.name] : e.target.value});
  }
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      const Hash = await contract.methods.get().call()
      this.setState({ Hash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
  
  constructor(props) {
    super(props)
    
    this.state = {
      Hash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      firstname:"",
      lastname:"",
      username:"",
      phone:"",
      institution:"",
      carrer:"",
      finish:"",
      title:"",
      id:"",
      user:{
        id:"",
        title:"",
        hash:""
      }
    }
  }
  //this is a method to capture a file 
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

//this is a method to add the file to the ipfs infura server and add to the blockchain network
  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    console.log('buufer',this.state.buffer)
    //ipfs method
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }//blockchain method to add y and ge4t the ipfs hash
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ Hash: result[0].hash })
       })
        console.log("hash",this.state.Hash)
       this.setState({
         user:
         {
           id:this.state.id,
           title:this.state.title,
           hash:this.state.Hash
          }
        });
       console.log("usedatacer",this.state.user)
      if(this.state.user.hash != null)
        {
          //this method save the title,the hash to the id user
            AuthService.regnewcertbyid(this.state.user).then(data=>{
              const { message } = data;
              let timerID = (null);

            
            // this.setState(message=message);
              if(!message.msgError){
                timerID = setTimeout(()=>{
                  this.props.history.push('/student-list');
                },8000)
              console.log("se añadio")
                }
            }
            );
       }
    
        
    })
  }

    render() {
      
        return (
          <div>
                 
                <header className="masthead2" >
                    <div className="container">
                        <div className="intro-text" >
                        
                               <div className="row">
                                 <div className="col-6">
                                      <div className="auth-wrapper">
                                            <div className="auth-inner">
                                            <form onSubmit={this.onSubmit} >
                                                      <h3>Registrar nuevo certificado</h3>
                                                      <label htmlFor="title" className="sr-only">Titulo: </label>
                                                    <input 
                                                            type="text" 
                                                            name="title" 
                                                           
                                                            onChange={this.onChange} 
                                                            className="form-control" 
                                                            placeholder="Titulo:"
                                                            required="true"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                                                 
                                                   
                                                    <div className="row">
                                                              <div className="col">
                                                              <input required="true" type="file" accept=".jpg,.png" onChange={this.captureFile}/>
                                                              </div>
                                                              <div className="col">
                                                              <p>&nbsp;</p>
                                                              <input type="submit" />
                                                              </div>
                                                            </div>
                                                        <img src={`https://ipfs.infura.io/ipfs/${this.state.Hash}`} 
                                                        className="img-fluid"
                                                        style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}    />
                                                  
                                                  </form>
        
                                               
                                            </div>
                                        
                                        </div>
                                        
                                    </div>
                               
                                  <div className="col-6">
                                      <div className="auth-wrapper">
                                            <div className="auth-inner">
                                            <form >
                                                      <h3>Información del alumno</h3>
                                                      <label htmlFor="firstname" className="sr-only">Nombres: </label>
                                                    <input 
                                                            type="text" 
                                                            name="firstname" 
                                                            value={this.state.firstname}
                                                            readOnly={true}
                                                            
                                                           // onChange={onChange} 
                                                            className="form-control" 
                                                            placeholder="Nombres:"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                                                            
                                                    <label htmlFor="lastname" className="sr-only">Apellidos: </label>
                                                    <input type="text" 
                                                            name="lastname" 
                                                            value={this.state.lastname}
                                                            readOnly={true}
                                                            
                                                           // onChange={onChange} 
                                                            className="form-control" 
                                                            placeholder="Apellidos:"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                                                            
                                                            
                                                   
                                                            
                                                    <label htmlFor="username" className="sr-only">Username: </label>
                                                    <input type="test" 
                                                            name="username"
                                                            value={this.state.username}
                                                            readOnly={true}
                                                            
                                                           // onChange={onChange} 
                                                            className="form-control" 
                                                            placeholder="Usuario:"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                                                            
                                                    <label htmlFor="phone" className="sr-only">phone: </label>
                                                    <input type="Tel" 
                                                            name="phone"
                                                            value={this.state.phone}
                                                            readOnly={true}
                                                           
                                                           // onChange={onChange} 
                                                            className="form-control" 
                                                            placeholder="Telefono:"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                                                    <label htmlFor="institution" className="sr-only">Institucion: </label>
                                                    <select
                                                            name="institution"
                                                            value={this.state.institution}
                                                            readOnly={true}
                                                          
                                                          // 7  onChange={onChange} 
                                                            className="form-control"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            
                                                            >
                                                                <option defaultValue>Institución...</option>
                                                                  <option value="ITT">ITT</option>
                                                                  <option value="UAN">UAN</option>
                                                                  <option value="UT">UT</option>
                                                            
                                                    </select>

                                                    <select
                                                            name="carrer"
                                                            value={this.state.carrer} 
                                                            readOnly={true}
                                                            
                                                          //  onChange={onChange} 
                                                            className="form-control"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            
                                                            >
                                                                <option defaultValue>Carrera...</option>
                                                                  <option value="IGE">Ingenieria en Gestion Empresarial</option>
                                                                  <option value="IE">Ingenieria en Electrica</option>
                                                                  <option value="ISC">Ingenieria en Sistemas Computacionales</option>
                                                                  <option value="IC">Ingenieria Civil</option>
                                                                  <option value="LA">Licenciatura en Arquitectura</option>
                                                            
                                                    </select>
                                                    <label htmlFor="finish" className="sr-only">finish: </label>
                                                    <input type="Date" 
                                                            name="finish"
                                                            readOnly={true}
                                                           
                                                            title="Fecha de egreso"
                                                            value={this.state.finish}
                                                         //   onChange={onChange} 
                                                            className="form-control" 
                                                            placeholder="Telefono"
                                                            style={{"WebkitTextStroke":".1px black","margin":"10px 0px 6px 0px"}}
                                                            />
                               
                                                        
                                                    <p>&nbsp;</p>
                                                   
                                                  
                                                  </form>
        
                                            </div>
                                        
                                        </div>
                                        
                                    </div>
                               </div>
                           
                        </div>
                    </div>
                  </header>

                  <footer className="footer">
                      <div className="container">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <span className="copyright">Copyright &copy; Your Website 2019</span>
                          </div>
                          <div className="col-md-4">
                            <ul style={{"WebkitTextStroke":"px black"}} className="list-inline social-buttons">
                              <li className="list-inline-item">
                                <a href="#something">
                                  <i style={{"WebkitTextStroke":".0px black"}} className="fa fa-twitter"></i>
                                </a>
                              </li>
                              <li className="list-inline-item">
                                <a href="#something">
                                  <i style={{"WebkitTextStroke":"0px black"}} className="fa fa-facebook-f"></i>
                                </a>
                              </li>
                            
                            </ul>
                          </div>
                          <div className="col-md-4">
                            <ul className="list-inline quicklinks">
                              <li className="list-inline-item">
                                <a style={{"WebkitTextStroke":"0px black","color":"#080808"}} href="#something">Privacy Policy</a>
                              </li>
                              <li className="list-inline-item">
                                <a style={{"WebkitTextStroke":"0px black","color":"#080808"}}  href="#something">Terms of Use</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                   </footer>
           
         </div>
        );
    }
}export default  NewCertificado
