module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (ganache)
      port: 7545,            // Porta padrão do Ganache
      network_id: "*",       // Qualquer rede
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.5.0",
    }
  }
}
