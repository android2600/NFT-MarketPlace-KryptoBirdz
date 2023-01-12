import React, { Component } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/KryptoBird.json';
import Web3 from "web3";
import {MDBCard,MDBCardBody,MDBCardTitle,MDBCardImage,MDBCardText}from "mdb-react-ui-kit"
import "./App.css"


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
        this.setState({account:accounts[0]});
        console.log(this.state.account);
        const networkId=await web3.eth.net.getId();
        this.setState({networkId:networkId});
        const networkdata=KryptoBird.networks[networkId];
        if(networkdata){
            var abi=KryptoBird.abi;
            var address=networkdata.address;
            var contract= new web3.eth.Contract(abi,address);
            this.setState({contract}); //{contract:contract}
            console.log(this.state.contract);
            
            const totalSupply=await contract.methods.totalSupply().call();
            this.setState({totalSupply});
            console.log(this.state.totalSupply);

            for(let i=1;i<=totalSupply;i++){
                const Kryptobird= await contract.methods.kryptoBirdz(i-1).call();
                console.log(Kryptobird);
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
    
    mint = (kryptoBird)=>{
        this.state.contract.methods.mint(kryptoBird).send({from:this.state.account}).once('receipt',(receipt)=>{
            this.setState({
            KryptoBird:[...this.state.KryptoBird,KryptoBird] //spread operator!!!
        })})
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
            <div className="container-filled">
            {console.log(this.state.KryptoBird)}
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div className="navbar-brand col-sm-3 col-md-3 mr-0" style={{color:"white"}}>
                    KryptoBirdz NFT
                </div>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block text-white">
                    {this.state.account}
                </li>
            </ul>
            </nav>
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main>" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto"
                        style={{opacity:"0.8"}}>
                                <h1 style={{color:"black",margin:"50px"}}>KryptoBirds NFT Marketplace</h1>
                                <form onSubmit={(event)=>{
                                    event.preventDefault()
                                    const kryptoBird= this.kryptoBird.value
                                    this.mint(kryptoBird)
                                }}>
                                    <input
                                    type="text"
                                    placeholder="Add a file location"
                                    className="form-control mb-1"
                                    ref={(input)=>{this.kryptoBird=input}}
                                    />
                                    <input style={{margin:'6px'}}
                                    type="submit"
                                    className="btn btn-primary btn-black"
                                    value="MINT"
                                    />
                                </form>
                        </div>
                    </main>
                </div>
            
            <hr></hr>
            <div className="row textCenter">
                {this.state.KryptoBird.map((kryptoBird,key)=>{
                    return(
                            <div>
                                <MDBCard className="token img" style={{maxWidth:"22rem"}}>
                                <MDBCardImage src={kryptoBird} position="top" height="200rem" style={{marinRight:"4px"}}/>
                                <MDBCardBody>
                                <MDBCardTitle> KryptoBirdz </MDBCardTitle>
                                <MDBCardText>
                                    The KryptoBirdz are 10 uniquely generated KBirdz from Galaxy far far away.
                                </MDBCardText>
                                </MDBCardBody>
                                </MDBCard>
                            </div>
                    )
                })}
            </div>
        </div>
    </div>
        )
    }
}

export default App