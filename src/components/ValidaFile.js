import React, { Component, useRef } from 'react';
import Web3 from 'web3';
import '../App.css';
import Meme from '../abis/Meme.json'
import AuthService from '../Services/AuthService'
import CertService from '../Services/CertService'
import Button from 'react-bootstrap/Button'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class ValidaFile extends React.Component {


    async componentWillMount() {


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

    
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Meme.networks[networkId]
        if (networkData) {
            const contract = web3.eth.Contract(Meme.abi, networkData.address)
            this.setState({ contract })
            const Hash = await contract.methods.get().call()
            this.setState({ Hash })
        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }
onChange = e => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }
    constructor(props) {
        super(props)

        this.state = {
            Hash: '',
            contract: null,
            web3: null,
            buffer: null,
            account: null,

            user: {
                id: "",
                title: "",
                hash: ""
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
        console.log('buufer', this.state.buffer)
        //ipfs method
        ipfs.add(this.state.buffer, (error, result) => {
            console.log('Ipfs result', result)
            if (error) {
                console.error(error)
                return
            }//blockchain method to add y and ge4t the ipfs hash
            this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
                return this.setState({ Hash: result[0].hash })
            })
            console.log("hash", this.state.Hash)
            this.setState({
                user:
                {
                    id: this.state.id,
                    title: this.state.title,
                    hash: this.state.Hash
                }
            });
            console.log("usedatacer", this.state.user)
            if (this.state.user.hash != null) {
                //this method save the title,the hash to the id user
                AuthService.regnewcertbyid(this.state.user).then(data => {
                    const { message } = data;
                    let timerID = (null);


                    // this.setState(message=message);
                    if (!message.msgError) {
                        timerID = setTimeout(() => {
                            this.props.history.push('/student-list');
                        }, 8000)
                        console.log("se añadio")
                    }
                }
                );
            }


        })
    }

    render() {

        return (
            <div className="container">
                <div class="h-screen bg-white flex flex-col space-y-10 justify-center items-center">
                    <div class="bg-white w-96 shadow-xl rounded p-5">
                        <h1 class="text-3xl font-medium">Registrar Nuevo Documento</h1>
                        <form class="space-y-5 mt-5" onSubmit={this.onSubmit}>
                            <div className="row">
                                <div className="col">
                                    <input class="w-full h-12 border border-gray-800 rounded px-3" required="true" type="file" accept=".jpg,.png" onChange={this.captureFile} />
                                </div>
                                <div className="col">
                                    <p>&nbsp;</p>
                                    <input class="w-full h-12 border border-gray-800 rounded px-3" type="submit" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
} export default ValidaFile
