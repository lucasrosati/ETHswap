import React, { Component } from 'react';
import { FaEthereum } from 'react-icons/fa';
import Web3 from 'web3';

class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: '0'
    };
  }

  handleChange = (event) => {
    const etherAmount = event.target.value;
    this.setState({
      output: (etherAmount * 100).toFixed(4)
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let etherAmount = this.input.value.toString();
    etherAmount = Web3.utils.toWei(etherAmount, 'Ether');
    
    try {
      await this.props.buyTokens(etherAmount);
      alert('Compra realizada com sucesso!');
    } catch (error) {
      console.error('Erro na compra de tokens:', error);
      alert('Falha na compra de tokens. Tente novamente.');
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {(this.props.ethBalance / 1e18).toFixed(4)} ETH
          </span>
          <div className="input-group mb-4">
            <input
              type="text"
              onChange={this.handleChange}
              ref={(input) => { this.input = input }}
              className="form-control form-control-lg"
              placeholder="0"
              required
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <FaEthereum />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {(this.props.tokenBalance / 1e18).toFixed(4)} DApp
          </span>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="0"
              value={this.state.output}
              disabled
            />
            <div className="input-group-append">
              <div className="input-group-text">DApp</div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
      </form>
    );
  }
}

export default BuyForm;
