import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    //check if MetaMask exists
    if(typeof window.ethereum !== 'undefined') {
      //assign to values to variables: web3, netId, accounts
      const web3 = new Web3(window.ethereum)

      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      //check if account is detected, then load balance&setStates, elsepush alert
      // load balance
      if(typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
      }
      else {
        window.alert("Please login to MetaMask")
      }

      //in try block load contracts
      try {
        // token
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        // dBank
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address

        // load token balance
        const tokenBalance = await token.methods.balanceOf(this.state.account).call()
        // load deposited balance & in-bank
        const depositedBalance = await dbank.methods.etherBalanceOf(this.state.account).call()
        const totalBankBalance = await web3.eth.getBalance(dBank.networks[netId].address)

        this.setState({
          token: token, 
          dbank: dbank, 
          dBankAddress: dBankAddress,
          tokenBalance: tokenBalance,
          depositedBalance: depositedBalance,
          totalBankBalance: totalBankBalance
        })
      } catch(e) {
        console.log('Error', e)
        window.alert("Something error with contact")
      }
    }
    else {
      //if MetaMask not exists push alert
      window.alert("Please install MetaMask")
    }
  }

  async deposit(amount) {
    
    //check if this.state.dbank is ok
    if(this.state.dbank !== 'undefined') {
      //in try block call dBank deposit();
      try {
        await this.state.dbank.methods.deposit().send({
          value: amount.toString(),
          from: this.state.account
        })
      } catch(e) {
        console.log(e)
      }
      await this.loadBalances()
    }
  }

  async withdraw(e) {
    //check if this.state.dbank is ok
    if(this.state.dbank !== 'undefined') {
      //in try block call dBank withdraw();
      try {
        await this.state.dbank.methods.withdraw().send({
          from: this.state.account
        })
      } catch(e) {
        console.log(e)
      }
      await this.loadBalances()
    }
  }

  async loadBalances() {
    const netId = await this.state.web3.eth.net.getId()
    const balance = await this.state.web3.eth.getBalance(this.state.account)
    const tokenBalance = await this.state.token.methods.balanceOf(this.state.account).call()
    const depositedBalance = await this.state.dbank.methods.etherBalanceOf(this.state.account).call()
    const totalBankBalance = await this.state.web3.eth.getBalance(dBank.networks[netId].address)

    this.setState({
      tokenBalance: tokenBalance, 
      balance: balance, 
      depositedBalance: depositedBalance,
      totalBankBalance: totalBankBalance
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null,
      tokenBalance: 0,
      etherBalance: 0,
      depositedBalance: 0,
      totalBankBalance: 0
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to dBank</h1>
          <h2>{this.state.account}</h2>
          <h3>Total in Bank: {this.state.totalBankBalance / 10**18} ETH</h3>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div className="mt-2">
                    <p>{'How much do you want to deposit'}</p>
                    <p>{'Min. amount is 0.01 ETH'}</p>
                    <p>{'1 deposit is possible at the time'}</p>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const amount = this.depositAmount.value * 10**18
                      this.deposit(amount)
                    }}>
                      <div className="form-group mt-2">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="amount.."
                          ref={(input) => {this.depositAmount = input}}
                          className="form-control" 
                          required
                        />

                        <button type="submit" className="btn btn-primary mt-2">DEPOSIT</button>
                      </div>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <div className="mt-2">
                    <p>{'Do you want to withdraw + take interest?'}</p>
                    <button type="submit" className="btn btn-primary" onClick={(e) => {this.withdraw(e)}}>Withdraw</button>
                  </div>
                </Tab>
                <Tab eventKey="balance" title="Balance">
                  <div className="mt-2">
                    <p>Token Balance: {this.state.tokenBalance / 10**18} DBC</p>
                    <p>Ether Balance: {this.state.balance / 10**18} ETH</p>
                    <p>Deposited Balance: {this.state.depositedBalance / 10**18} ETH</p>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;