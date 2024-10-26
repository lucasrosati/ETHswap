pragma solidity ^0.5.0;

import "./Token.sol"; // Certifique-se de ter o contrato Token.sol no mesmo diretório

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; // Taxa de câmbio: 1 ETH = 100 tokens

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Calcula a quantidade de tokens a serem comprados
        uint tokenAmount = msg.value * rate;

        // Verifica se o contrato EthSwap possui tokens suficientes
        require(token.balanceOf(address(this)) >= tokenAmount, "Contrato não possui tokens suficientes");

        // Transfere tokens para o comprador
        token.transfer(msg.sender, tokenAmount);

        // Emite um evento de compra de tokens
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        // O vendedor deve ter tokens suficientes
        require(token.balanceOf(msg.sender) >= _amount, "Você não possui tokens suficientes");

        // Calcula a quantidade de Ether a ser devolvida
        uint etherAmount = _amount / rate;

        // Verifica se o contrato EthSwap possui Ether suficiente
        require(address(this).balance >= etherAmount, "Contrato não possui Ether suficiente");

        // Transfere tokens de volta para o contrato EthSwap
        token.transferFrom(msg.sender, address(this), _amount);

        // Transfere Ether para o vendedor
        msg.sender.transfer(etherAmount);

        // Emite um evento de venda de tokens
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
