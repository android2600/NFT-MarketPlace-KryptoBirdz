import React, { Component } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/KryptoBird.json';
import Web3 from "web3";

class App extends Component{
    async componentDidMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();
    }
    async loadWeb3(){
        const provider = await detectEthereumProvider();
        if(provider){
            console.log("Connected")
            window.web3=new Web3(provider)
        }
        else{
            console.log("Wallet not found")
        }
    }
    async loadBlockchainData(){
        const web3=window.web3

        const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
        this.setState({account:accounts})
        console.log(this.state.account)
        const networkId=await web3.eth.net.getId()
        this.setState({networkId:networkId})
        const networkdata=KryptoBird.networks[networkId]
        if(networkdata){
            var abi=KryptoBird.abi
            var address=networkdata.address
            var contract= new web3.eth.Contract(abi,address)
            this.setState({contract}) //{contract:contract}
            console.log(this.state.contract)
            
            const totalSupply=await contract.methods.totalSupply().call()
            this.setState({totalSupply})
            console.log(this.state.totalSupply)

            for(let i=1;i<=totalSupply;i++){
                const Kryptobird= await contract.methods.kryptoBirdz(i-1).call()
                console.log(Kryptobird)
                {this.setState({
                    KryptoBird:[...this.state.KryptoBird,Kryptobird] //spread operator!!!
                })}
            }
            console.log(this.state.KryptoBird)
        }
        else{
            window.alert('smart contract not deployed')
        }
    }

    constructor(props) {
        super(props);
        this.state={
            account: "",
            networkId: "",
            contract:null,
            totalSupply:0,
            KryptoBird:[]
        }
    }

    render(){
        return(
            <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div className="navbar-brand col-sm-3 col-md-3 mr-0" style={{color:"white"}}>
                    KryptoBirdz NFT
                </div>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block text-white">
                    {this.state.account}
                </li>
                <li className="text-white">{this.state.networkId}</li>
            </ul>
            </nav>
            </div>
        )
    }
}

export default App