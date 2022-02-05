import { ethers } from 'ethers'
import React, { useEffect, useState, useCallback } from 'react'

const contractAddress = '0x2e91E37a9baAE9b2664cCB2F9D1Dde424E408A46'
const SimpleStore_abi = [
    'event NameUpdated(string name)',
    'function setName(string memory _name) public',
    'function getName() external view returns (string memory)',
]

const SimpleStore = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')
    const [isConnected, setIsConnected] = useState(() => false)

    const [currentContractVal, setCurrentContractVal] = useState(null)

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            handleConnectedAccounts(accounts)
        } else {
            setErrorMessage('Need to install MetaMask')
        }
    }

    const handleConnectedAccounts = useCallback((accounts) => {
        if (accounts.length > 0) {
            accountChangedHandler(accounts[0])
            setIsConnected(true)
        }
    }, [])

    const accountChangedHandler = account => {
        setDefaultAccount(account)
        setConnButtonText('Connected')
    }

    const getCurrentValue = useCallback(() => {
        contract?.getName()
            .then(name => setCurrentContractVal(name))
    }, [contract])

    const setHandler = async (event) => {
        event.preventDefault()
        try {
            await contract.setName(event.target.setText.value)
        } catch (error) {
            console.error(error)
            setErrorMessage(error.errorMessage)
        }
    }

    useEffect(() => {
        if (window.ethereum !== undefined) {
            setProvider(new ethers.providers.Web3Provider(window.ethereum))
        }
    }, [])

    useEffect(() => {
        setSigner(provider?.getSigner())
        provider?.listAccounts()
            .then(connectedAccounts => handleConnectedAccounts(connectedAccounts))
    }, [provider, handleConnectedAccounts])

    useEffect(() => {
        if (signer) {
            setContract(new ethers.Contract(contractAddress, SimpleStore_abi, signer))
        }
    }, [signer])

    useEffect(() => {
        getCurrentValue()

        contract?.on('NameUpdated', name => {
            console.log(`Contract name updated to '${name}'`)
            getCurrentValue()
        })

    }, [contract, getCurrentValue])

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