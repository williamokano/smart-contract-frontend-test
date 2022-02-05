import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

const contractAddress = '0x2e91E37a9baAE9b2664cCB2F9D1Dde424E408A46'
const SimpleStore_abi = [
    'event NameUpdated(string name)',
    'function setName(string memory _name) public',
    'function getName() external view returns (string memory)',
]

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractAddress, SimpleStore_abi, signer)

const SimpleStore = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')
    const [isConnected, setIsConnected] = useState(() => false)

    const [currentContractVal, setCurrentContractVal] = useState(null)

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            handleConnectedAccounts(accounts)
        } else {
            setErrorMessage('Need to install MetaMask')
        }
    }

    useEffect(() => {
        provider.listAccounts().then(connectedAccounts => handleConnectedAccounts(connectedAccounts))
    }, [])

    const handleConnectedAccounts = async (accounts) => {
        if (accounts.length > 0) {
            accountChangedHandler(accounts[0])
            setIsConnected(true)
        }
    }

    const accountChangedHandler = account => {
        setDefaultAccount(account)
        setConnButtonText('Connected')
    }

    const getCurrentValue = async () => {
        const name = await contract.getName()
        setCurrentContractVal(name)
    }

    const setHandler = async (event) => {
        event.preventDefault()
        try {
            await contract.setName(event.target.setText.value)
        } catch (error) {
            console.error(error)
            setErrorMessage(error.errorMessage)
        }
    }

    return (
        <div>
            <h3>{"Get/Set Interaction with contract!"}</h3>
            {!isConnected &&
                <button onClick={connectWalletHandler}>{connButtonText}</button>
            }
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id='setText' type='text' />
                <button type='submit'>Update Contract</button>
            </form>

            <button onClick={getCurrentValue}>Get Current Value</button>
            <h3>Current contract value: {currentContractVal}</h3>
            {errorMessage}
        </div>
    )
}

export default SimpleStore;