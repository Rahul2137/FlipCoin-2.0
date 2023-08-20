import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FlipBank from '../../abis/FlipBank.json';
import FlipCoin from "../../abis/FlipCoin.json";
import { getContractActions } from "../../app/actions/contractActions.js";
import { connect } from 'react-redux';

const EthProvider = ({setContractDetails}) => {

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    // Load Token
    const networkId = await web3.eth.net.getId();
    const flipBankData = FlipBank.networks[networkId];
    const flipCoinData = FlipCoin.networks[networkId];

    if (flipBankData && flipCoinData) {
      const flipBank = new web3.eth.Contract(FlipBank.abi, flipBankData.address);
      const flipCoin = new web3.eth.Contract(FlipCoin.abi, flipCoinData.address);
      setContractDetails({
        flipBank: flipBank.methods,
        flipCoin: flipCoin.methods,
        accounts: accounts
      })
    
    } else {
      window.alert('Token contract not deployed to detected network.');
    }
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // Return your JSX content here
  return (
    <></>
  );
}

const mapActionsToProps = (dispatch) => {
  return {
    ...getContractActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(EthProvider);
