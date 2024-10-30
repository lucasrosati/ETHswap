import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: null,
      ethSwap: null,
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      darkMode: false
    };
  }

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

    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: web3.utils.fromWei(tokenBalance.toString(), 'ether') });
    } else {
      window.alert('Token contract not deployed to detected network.');
    }

    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert('EthSwap contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  toggleDarkMode = () => {
    this.setState(prevState => ({
      darkMode: !prevState.darkMode
    }), () => {
      document.body.classList.toggle('dark-mode', this.state.darkMode);
    });
  };

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

      if (!ethSwap || !ethSwap.options.address) {
        window.alert('Contrato EthSwap não foi carregado corretamente.');
        this.setState({ loading: false });
        return;
      }

      await token.methods.approve(ethSwap.options.address, tokenAmount).send({ from: account })
        .on('transactionHash', async (hash) => {
          console.log("Aprovação confirmada:", hash);
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
        <button
          onClick={this.toggleDarkMode}
          className="dark-mode-toggle"
        >
          {this.state.darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-size">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-size">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </button>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
        <footer className="footer">
          <a href="https://github.com/lucasrosati" target="_blank" rel="noopener noreferrer">
            Created by: Lucas Rosati
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
