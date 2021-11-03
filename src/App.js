import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useState, useEffect } from 'react';


function App() {
  const [account, setAccount] = useState('')
  const [manager, setManager] = useState('')
  const [players, setPlayer] = useState([])
  const [balance, setBalance] = useState('')
  const [inputEther, setInputEther] = useState('')
  const [message, setMessage] = useState('')
  const [userBalance, setUserBalance] = useState('')

  useEffect(() => {
    async function getAccount() {
      const accounts = await web3.eth.getAccounts();
      const userBalance = await web3.eth.getBalance(accounts[0])
      setAccount(accounts)
      setUserBalance(userBalance)

    }
    getAccount()
  }, [setAccount])


  useEffect(() => {
    async function getManagerLottery() {
      const manager = await lottery.methods.manager().call();
      setManager(manager)
    }
    async function getPlayters() {
      const players = await lottery.methods.getPlayers().call()
      setPlayer(players)
      if (players.indexOf(account[0])) {
        setMessage('you have been enter')
      }
    }
    async function getBalance() {
      const balance = await web3.eth.getBalance(lottery.options.address)
      setBalance(balance)
    }
    getManagerLottery()
    getPlayters()
    getBalance()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    setMessage('waiting on transaction success')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(inputEther, 'ether')
    });
    setMessage('you have been enter')
  }

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('waiting on transaction success')
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage('you have been enter')


  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Manager Address</p>
        <p>
          This contract is managed by {manager}
        </p>
        <p>
          there are currently {players.length} people entry to
        </p>
        <p>
          competing to win {web3.utils.fromWei(balance, 'ether')} ether!
        </p>
        {message}
        <h3>You balance {web3.utils.fromWei(userBalance, 'ether')}</h3>
        <form onSubmit={onSubmit}>
          <h4>Want to try your luck ?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              onChange={(e) => {
                setInputEther(e.target.value)
              }}
            >
            </input>
            <button type="submit">Enter</button>
          </div>
        </form>
        <div>
          <h3>Ready to pick a winner ?</h3>
          <button onClick={pickWinner}>PickWinner</button>
        </div>
      </header>
    </div>
  );
}

export default App;
