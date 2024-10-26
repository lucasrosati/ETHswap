import React, { Component } from 'react';
import { FaEthereum } from 'react-icons/fa';

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: '0'
    };
  }

  handleChange = (event) => {
    const tokenAmount = event.target.value;
    this.setState({
      output: tokenAmount / 100
    });
  };

  render() {
    return (
      <form onSubmit={(event) => {
        event.preventDefault();
        let tokenAmount = this.input.value.toString();
        tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether');
        this.props.sellTokens(tokenAmount);
      }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {this.props.tokenBalance}
          </span>
          <div className="input-group mb-4">
            <input
              type="text"
              onChange={this.handleChange}
              ref={(input) => { this.input = input }}
              className="form-control form-control-lg"
              placeholder="0"
              required />
            <div className="input-group-append">
              <div className="input-group-text">DApp</div>
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {this.props.ethBalance}
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
              <div className="input-group-text">
                <FaEthereum />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
      </form>
    );
  }
}

export default SellForm;
