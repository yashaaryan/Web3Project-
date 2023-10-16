import { useEffect, useState } from "react";
import "./App.css";
import { BrowserProvider, ethers } from "ethers";
import { Counter__factory } from "./generated/contract-types";

export const contractAddress = "0x925901b16c684cc5B50fb1A6649A1C7F4797979a";

declare let window: any

//test test 
function App() {
    const [provider, setProvider] = useState<BrowserProvider>();
    const [address, setAddress] = useState<string>();
    const [balance, setBalance] = useState("0");
    const [data, setData] = useState<string[]>();
    const [numToSet, setNumToSet] = useState<string>();
    const [numToGet, setNumToGet] = useState<number>(-1);

    const handleConnectWallet = async () => {
        const myProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(myProvider)
        if (provider) {
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            setAddress(await signer.getAddress())
            getNum()
        }
    }

    const getBalance = async () => {
        const myProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(myProvider)
        if (provider && address) {
            await provider.send("eth_requestAccounts", [])
            setBalance(ethers.formatEther(await provider.getBalance(address)))
        }
    }

    const getNum = async () => {
        const counter = Counter__factory.connect(contractAddress, provider)
        const n = await counter.getNum()
        setNumToGet(+n.toString())
    }

    const getWords = async () => {
        if (numToGet == -1) {
            return;
        }
        const counter = Counter__factory.connect(contractAddress, provider)
        const n = await counter.getWords()
        setData(n)
    }

    const setNum = async () => {
        if (numToGet == -1) {
            return;
        }
        if (provider) {
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const counter = new ethers.Contract(
                contractAddress,
                Counter__factory.abi,
                signer
            )
            if (numToSet) {
                const n = await counter.setNum(numToSet)
                await n.wait(1);
                getBalance();
                getNum()
            }
        }
    }

    const onChangeHandler = async (e: any) => {
        if (e.target.name == "numToSet") {
            setNumToSet(e.target.value)
        }
    }

    useEffect(() => {
        getBalance()
    }, [address])

    return (
        <div className="App">
            <h1>Blockchain Project 1 Yash Aaryan</h1>

            <br />
            {
                address ? (
                    <>
                        <div>Address: {address}</div>
                        <div>Balance: {balance}</div>
                    </>
                ) : (
                    <div>
                         <button onClick={handleConnectWallet}>Connect Wallet</button>
                         <br />
                    </div>
                )
            }

            <br />
            <div>
                <span>{`Num : ${numToGet == -1 ? "NA" : numToGet}`}</span>
            </div>
            <br />

            <div>
                <button onClick={getWords}>Get Words</button>
            </div>
            <div> </div>
            {
                data && data.length > 0 ?
                (data.map((elem, index) => (<div>{<span>{`${index + 1} : ${elem}`} </span>}</div>))) :
                ""
            }

            < br />
            <div>
                <input
                    type="number"
                    name="numToSet"
                    placeholder="Enter new num"
                    value={numToSet}
                    onChange={onChangeHandler}
                />
            </div>
            <br />

            <div>
                <button onClick={setNum}>Set Num</button>
            </div>
        </div>
    );
}

export default App;