import { ethers } from 'ethers'
import React, {useEffect, useState} from 'react'

const SimpleStore = () => {

    const contractAddress = '0x2e91E37a9baAE9b2664cCB2F9D1Dde424E408A46'
    const SimpleStore_abi = [
        'event NameUpdated(string name)',
        'function setName(string memory _name) public',
        'function getName() external view returns (string memory)',
    ]

    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')

    const [currentContractVal, setCurrentContractVal] = useState(null)

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)

    const connectWalletHandler = async () => {
        if (window.ethereum) {
             const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
             accountChangedHandler(accounts[0])
             setConnButtonText('Wallet connected')
             updateEthers()
        } else {
            setErrorMessage('Need to install MetaMask')
        }
    }

    useEffect(() => {
        console.log('Montou')
    }, [])

    const accountChangedHandler = account => {
        setDefaultAccount(account)
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(tempProvider)

        let tempSigner = tempProvider.getSigner()
        setSigner(tempSigner)

        let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner)
        setContract(tempContract)
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
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id='setText' type='text'/>
                <button type='submit'>Update Contract</button>
            </form>

            <button onClick={getCurrentValue}>Get Current Value</button>
            <h3>Current contract value: {currentContractVal}</h3>
            {errorMessage}
        </div>
    )
}

export default SimpleStore;