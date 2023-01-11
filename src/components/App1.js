import React, { Component } from "react";
import KryptoBird from '../abis/KryptoBird.json';

class App extends Component{
    async componentDidMount() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    const showAccount = document.querySelector('.showAccount');
    
    async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    showAccount.innerHTML = account;
    }
    ethereumButton.addEventListener('click', () => {
        getAccount();
        });
    }
    render(){
        return(
            <div>
                <h1>NFT MarketPlace</h1>
                <button className="enableEthereumButton">Enable Ethereum</button>
                <h2>Account: <span class="showAccount"></span></h2>
            </div>
        )
    }
}

export default App