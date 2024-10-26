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
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      darkMode: false,
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
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    // Conta do usuário conectada
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Saldo de ETH
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: web3.utils.fromWei(ethBalance, 'ether') });

    // Obtendo o contrato Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      // Balance de Tokens
      const tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: web3.utils.fromWei(tokenBalance.toString(), 'ether') });
    } else {
      window.alert('Token contract not deployed to detected network.');
    }

    // Obtendo o contrato EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert('EthSwap contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  // Função para comprar tokens
  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
        window.alert('Compra realizada com sucesso!');
      })
      .on('error', (error) => {
        console.error('Erro ao comprar tokens:', error);
        this.setState({ loading: false });
      });
  };

  // Função para vender tokens
  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods.approve(this.state.ethSwap._address, tokenAmount).send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.setState({ loading: false });
            window.alert('Venda realizada com sucesso!');
          })
          .on('error', (error) => {
            console.error('Erro ao vender tokens:', error);
            this.setState({ loading: false });
          });
      })
      .on('error', (error) => {
        console.error('Erro ao aprovar tokens:', error);
        this.setState({ loading: false });
      });
  };

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode }, () => {
      document.body.classList.toggle('dark-mode', this.state.darkMode);
    });
  };

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <button onClick={this.toggleDarkMode} className="dark-mode-toggle">
          {this.state.darkMode ? '🌞' : '🌙'}
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
      </div>
    );
  }
}

export default App;
