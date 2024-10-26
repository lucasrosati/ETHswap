 # EthSwap - Decentralized Token Exchange

EthSwap is a decentralized exchange application built on Ethereum, allowing users to swap Ethereum (ETH) for DApp tokens and vice versa. This project showcases a simple yet effective approach to creating an ERC-20 token marketplace using Solidity for smart contract development, Truffle for deployment and testing, and React for the front-end interface. EthSwap enables users to interact with smart contracts, purchase and sell tokens, and view real-time token balances via MetaMask integration.

## Features

- **ERC-20 Token Support**: The platform uses a custom ERC-20 token, `DApp Token`, which is minted on deployment and transferred to the exchange.
- **Token Exchange**: Users can buy tokens by sending ETH to the contract or sell tokens back to the contract to receive ETH in return.
- **React Frontend**: A user-friendly frontend built with React to interact seamlessly with the Ethereum blockchain.
- **MetaMask Integration**: Allows users to connect their MetaMask wallet for transactions and balances.

## Project Structure

- **Smart Contracts**: Written in Solidity, compiled, and deployed using Truffle. Contracts include:
  - **Token.sol**: Implements a basic ERC-20 token named `DApp Token`.
  - **EthSwap.sol**: Exchange contract to manage buying and selling of `DApp Tokens`.
- **Frontend**: React application that interfaces with the smart contracts via Web3.js.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
- [Ganache](https://www.trufflesuite.com/ganache) (for local blockchain testing)
- [MetaMask](https://metamask.io/) (browser extension for wallet interaction)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/ethswap.git
    cd ethswap
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start Ganache:**  
   Open Ganache and ensure it runs on the default RPC Server: `http://127.0.0.1:7545` with network ID `5777`.

4. **Configure MetaMask:**
   - Connect MetaMask to the Ganache network:
     - Network Name: `Ganache`
     - RPC URL: `http://127.0.0.1:7545`
     - Chain ID: `1337`
   - Import one of the Ganache accounts using its private key.

5. **Compile and Deploy Contracts:**

    ```bash
    truffle compile
    truffle migrate --reset
    ```

6. **Start the React application:**

    ```bash
    npm start
    ```

   The app should be running on `http://localhost:3000`.

## Usage

1. **Buy DApp Tokens**:  
   - Connect your MetaMask wallet.
   - Enter the amount of ETH you wish to exchange for DApp Tokens in the "Buy" form and click "SWAP!".
   - Confirm the transaction in MetaMask.

2. **Sell DApp Tokens**:  
   - Navigate to the "Sell" form.
   - Enter the amount of DApp Tokens you wish to sell in exchange for ETH and click "SWAP!".
   - Confirm the transaction in MetaMask.

## Project Components

- **Smart Contracts**:
  - `Token.sol`: Defines `DApp Token`, an ERC-20 compliant token with minting functionality.
  - `EthSwap.sol`: The exchange contract to buy and sell DApp Tokens with a fixed rate.
  
- **Frontend Components**:
  - `App.js`: Main component that initializes Web3, loads blockchain data, and renders the UI.
  - `Main.js`: Controls buy/sell form visibility.
  - `BuyForm.js` & `SellForm.js`: Components to handle user inputs and interact with the EthSwap smart contract.

## Screenshots

### Home Page
![Home Page]([SCR-20241025-twcd](https://github.com/user-attachments/assets/ea81ca1a-a170-4ebe-9e92-5c45863957db)

### Buy Tokens
![Buy Tokens](path-to-your-screenshot.png)

### Sell Tokens
![Sell Tokens](path-to-your-screenshot.png)

## Built With

- **Solidity** - Smart contract programming language
- **Truffle** - Development framework for Ethereum
- **Ganache** - Local Ethereum blockchain for testing
- **React** - Frontend framework for building UI
- **Web3.js** - JavaScript library for interacting with the Ethereum blockchain


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Dapp University](https://www.dappuniversity.com/) for tutorials and resources.
- [Ethereum](https://ethereum.org/) for blockchain and smart contract standards.

