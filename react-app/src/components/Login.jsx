import React, { useState } from "react";
import { ethers } from "ethers";

const Login = ({ setAccount }) => {
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        setAccount(account);
      } catch (err) {
        setError("Failed to connect MetaMask.");
      }
    } else {
      setError("MetaMask not installed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Vote</h2>
      <button onClick={connectWallet}>Connect MetaMask</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
