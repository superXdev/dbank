# Dbank
this project is forked from: https://github.com/superXdev/dbank.git

a simple Decentralized Application of Bank, where user can simply put their money (ETH) to this decentralized bank and take some interest in token (DBC) for 10% per years.

## Installation
First you need to install ganache, the RPC client for testing and development

Using npm:

```Bash
npm install -g ganache-cli
```

or, if you are using [Yarn](https://yarnpkg.com/):

```Bash
yarn global add ganache-cli
```
Install truffle, a tool for developing smart contracts.

```Bash
npm install -g truffle
```

Install all nodejs dependencies

```Bash
npm install
```

Migrate smart contract (dbank and token), dont forget to run ganache first `ganache-cli`

```Bash
truffle migrate
```

Run reactjs local development server

```Bash
npm run start
```

After that, you can import ethereum private key for testnet into metamask extension from given by ganache