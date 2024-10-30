import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Please install MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: web3.utils.fromWei(ethBalance, 'ether') });

    const networkId = await web3.eth.net.getId();

    // Load Token Contract
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: web3.utils.fromWei(tokenBalance.toString(), 'ether') }); // Convertendo tokenBalance para string
    } else {
      window.alert('Token contract not deployed to detected network.');
    }

    // Load EthSwap Contract
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert('EthSwap contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
        window.alert('Swap realizada com sucesso! Você trocou ETH por DApp Tokens.');
      })
      .on('error', (error) => {
        console.error('Erro durante buyTokens:', error);
        this.setState({ loading: false });
      });
  }
  
  sellTokens = async (tokenAmount) => {
    try {
      this.setState({ loading: true });
  
      const { token, ethSwap, account } = this.state;
  
      // Verifique se o contrato EthSwap está carregado corretamente
      if (!ethSwap || !ethSwap.options.address) {
        window.alert('Contrato EthSwap não foi carregado corretamente.');
        this.setState({ loading: false });
        return;
      }
  
      // Aprovação para gastar tokens
      await token.methods.approve(ethSwap.options.address, tokenAmount).send({ from: account })
        .on('transactionHash', async (hash) => {
          console.log("Aprovação confirmada:", hash);
  
          // Após a aprovação, realizar a venda de tokens
          await ethSwap.methods.sellTokens(tokenAmount).send({ from: account })
            .on('transactionHash', (hash) => {
              console.log("Venda de tokens realizada:", hash);
              this.setState({ loading: false });
              window.alert('Swap realizada com sucesso! Você trocou DApp Tokens por ETH.');
            })
            .on('error', (error) => {
              console.error('Erro durante a venda de tokens:', error);
              this.setState({ loading: false });
            });
        })
        .on('error', (error) => {
          console.error('Erro durante a aprovação de tokens:', error);
          this.setState({ loading: false });
        });
    } catch (error) {
      console.error('Erro na função sellTokens:', error);
      this.setState({ loading: false });
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: null,
      ethSwap: null,
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        web3={window.web3}
      />;
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
