import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import GreedyGeese from './artifacts/contracts/SecondThoughtsClub.sol/STC.json';
import './App.css';
import img1 from './img/1.png';
import img2 from './img/2.png';
import img3 from './img/3.png';
import img4 from './img/4.png';
import img5 from './img/5.png';
import img6 from './img/6.png';
import img7 from './img/7.png';
import img8 from './img/8.png';
import img9 from './img/9.png';
import img10 from './img/10.png';

const STCaddress = "0x7536868cdc4e46c460fe00ea11fc1be083417f13";

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [account, setAccount ] = useState([])

  useEffect(() => {
    fetchData();
    getAccount();
  }, [])

  async function getAccount() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setAccount(accounts);
      console.log(accounts[0])
  }
}

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(STCaddress, GreedyGeese.abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(STCaddress, GreedyGeese.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function withdraw() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(STCaddress, GreedyGeese.abi, signer);
      try {
        const transaction = await contract.withdraw();
        await transaction.wait();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      {account[0] === "0xe8b8cc11b7452570d5efd83918bc9043fdd790f1" && <button className='withdraw' onClick={withdraw}>withdraw</button>}
      <div className="container">
        <div className="banniere">
          <img src={img1} alt="img" />
          <img src={img2} alt="img" />
          <img src={img3} alt="img" />
          <img src={img4} alt="img" />
          <img src={img5} alt="img" />
          <img src={img6} alt="img" />
          <img src={img7} alt="img" />
          <img src={img8} alt="img" />
          <img src={img9} alt="img" />
          <img src={img10} alt="img" />
        </div>
        {error && <p>{error}</p>}
        <h1>Mint a STC NFT !</h1>
        <p className="count">{data.totalSupply} / 50</p>
        <p className="cost">Each STC NFT costs {data.cost / 10**18} eth (excluding gas fees)</p>
        <button onClick={mint}>BUY one STC NFT</button>
      </div>
    </div>
  );
}

export default App;
