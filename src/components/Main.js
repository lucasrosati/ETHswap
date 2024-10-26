import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import { FaExchangeAlt } from 'react-icons/fa';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0',
      tokenBalance: '0',
      ethSwap: null,
      token: null,
      amount: '0',
      transactionType: 'buy', // 'buy' or 'sell'
    };
  }

  async componentDidMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(accounts[0]);
    this.setState({ ethBalance: web3.utils.fromWei(ethBalance, 'Ether') });

    const networkId = await web3.eth.net.getId();

    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      const tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: web3.utils.fromWei(tokenBalance.toString(), 'Ether') });
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
  }

  buyTokens = (etherAmount) => {
    this.state.ethSwap.methods.buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on('transactionHash', (hash) => {
        this.loadBlockchainData();
      });
  };

  sellTokens = (tokenAmount) => {
    this.state.token.methods.approve(this.state.ethSwap._address, tokenAmount)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.loadBlockchainData();
          });
      });
  };

  toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  render() {
    const { ethBalance, tokenBalance } = this.state;

    return (
      <div className="container">
        <Navbar account={this.state.account} />
        <button onClick={this.toggleDarkMode} className="dark-mode-toggle">
          🌙
        </button>
        <h2>Swap</h2>
        <div className="swap-container">
          {this.state.transactionType === 'buy' ? (
            <BuyForm
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
              buyTokens={this.buyTokens}
            />
          ) : (
            <SellForm
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
              sellTokens={this.sellTokens}
            />
          )}
          <button onClick={() => this.setState({ transactionType: this.state.transactionType === 'buy' ? 'sell' : 'buy' })} className="invert-button">
            <FaExchangeAlt />
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
