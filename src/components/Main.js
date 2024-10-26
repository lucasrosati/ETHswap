import React, { Component } from 'react';
import Web3 from 'web3';
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
      ? (inputValue * 100).toFixed(4) // Conversão de ETH para DAPP
      : (inputValue / 100).toFixed(4); // Conversão de DAPP para ETH
    this.setState({ inputValue, outputValue });
  };

  invertTokens = () => {
    this.setState((prevState) => ({
      isEthToDapp: !prevState.isEthToDapp,
      inputValue: '',
      outputValue: '',
    }));
  };

  handleSwap = async () => {
    const { isEthToDapp, inputValue } = this.state;
    const { buyTokens, sellTokens } = this.props;

    if (isEthToDapp) {
      try {
        const valueInWei = Web3.utils.toWei(inputValue, 'ether');
        await buyTokens(valueInWei);
      } catch (error) {
        console.error("Erro na compra de tokens:", error);
      }
    } else {
      try {
        const valueInWei = Web3.utils.toWei(inputValue, 'ether');
        await sellTokens(valueInWei);
      } catch (error) {
        console.error("Erro na venda de tokens:", error);
      }
    }
  };

  render() {
    const { isEthToDapp, inputValue, outputValue } = this.state;
    const { ethBalance, tokenBalance } = this.props;

    return (
      <div className="swap-container">
        {/* Campo de Entrada */}
        <div className="input-group">
          <label>{isEthToDapp ? 'ETH' : 'DApp'}</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={isEthToDapp ? ethIcon : dappIcon} alt="Token" style={{ width: '32px', height: '32px', marginRight: '8px' }} />
            <input
              type="text"
              value={inputValue}
              onChange={this.handleInputChange}
              placeholder=""
            />
          </div>
          <span className="balance">Balance: {isEthToDapp ? parseFloat(ethBalance).toFixed(4) : parseFloat(tokenBalance).toFixed(4)}</span>
        </div>

        {/* Botão de Inverter */}
        <div className="invert-button-container">
          <button className="invert-button" onClick={this.invertTokens}>
            <FaExchangeAlt />
          </button>
        </div>

        {/* Campo de Saída */}
        <div className="input-group">
          <label>{isEthToDapp ? 'DApp' : 'ETH'}</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={isEthToDapp ? dappIcon : ethIcon} alt="Token" style={{ width: '32px', height: '32px', marginRight: '8px' }} />
            <input
              type="text"
              value={outputValue || ''}
              readOnly
              placeholder=""
            />
          </div>
          <span className="balance">Balance: {isEthToDapp ? parseFloat(tokenBalance).toFixed(4) : parseFloat(ethBalance).toFixed(4)}</span>
        </div>

        {/* Botão Swap */}
        <button className="swap-button" onClick={this.handleSwap} style={{ marginTop: '15px', padding: '10px 20px', fontSize: '16px' }}>
          Swap
        </button>
      </div>
    );
  }
}

export default Main;
