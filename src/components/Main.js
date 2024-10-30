import React, { Component } from 'react';
import ethIcon from '../assets/eth-icon.png';
import dappIcon from '../assets/dapp-icon.png';
import { FaExchangeAlt } from 'react-icons/fa';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEthToDapp: true, 
      inputValue: '',
      outputValue: '',
    };
  }

  handleInputChange = (e) => {
    const inputValue = e.target.value;
    const outputValue = this.state.isEthToDapp
      ? (inputValue * 100).toFixed(4) 
      : (inputValue / 100).toFixed(4); 
    this.setState({ inputValue, outputValue });
  };

  handleSwap = async () => {
    const { isEthToDapp, inputValue } = this.state;
    const { buyTokens, sellTokens, web3 } = this.props;

    try {
      const valueInWei = web3.utils.toWei(inputValue.toString(), 'ether');

      if (isEthToDapp) {
        await buyTokens(valueInWei);
      } else {
        await sellTokens(valueInWei);
      }

      this.setState({ inputValue: '', outputValue: '' });
    } catch (error) {
      console.error('Erro ao realizar o swap:', error);
    }
  };

  invertTokens = () => {
    const { inputValue, outputValue, isEthToDapp } = this.state;

    this.setState({
      isEthToDapp: !isEthToDapp,
      inputValue: isEthToDapp ? outputValue : inputValue,
      outputValue: isEthToDapp ? inputValue : outputValue,
    });
  };

  render() {
    const { isEthToDapp, inputValue, outputValue } = this.state;
    const { ethBalance, tokenBalance } = this.props;

    return (
      <div className="swap-container">
        <div className="input-group">
          <div className="input-group-label">
            <label>{isEthToDapp ? 'ETH' : 'DApp'}</label>
            <img
              src={isEthToDapp ? ethIcon : dappIcon}
              alt="Token"
              style={{ width: '32px', height: '32px', marginLeft: '8px', marginRight: '8px' }}
            />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={this.handleInputChange}
            placeholder="0"
          />
          <span className="balance">Balance: {isEthToDapp ? parseFloat(ethBalance).toFixed(4) : parseFloat(tokenBalance).toFixed(4)}</span>
        </div>

        <div className="invert-button-container">
          <button className="invert-button" onClick={this.invertTokens}>
            <FaExchangeAlt />
          </button>
        </div>

        <div className="input-group">
          <div className="input-group-label">
            <label>{isEthToDapp ? 'DApp' : 'ETH'}</label>
            <img
              src={isEthToDapp ? dappIcon : ethIcon}
              alt="Token"
              style={{ width: '32px', height: '32px', marginLeft: '8px', marginRight: '8px' }}
            />
          </div>
          <input
            type="text"
            value={outputValue || ''}
            readOnly
            placeholder="0"
          />
          <span className="balance">Balance: {isEthToDapp ? parseFloat(tokenBalance).toFixed(4) : parseFloat(ethBalance).toFixed(4)}</span>
        </div>

        {/* Botão de Swap */}
        <button className="swap-button" onClick={this.handleSwap}>
          Swap
        </button>
      </div>
    );
  }
}

export default Main;
