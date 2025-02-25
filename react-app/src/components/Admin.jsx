import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constant/constants";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const Admin = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [contract, setContract] = useState(null);

  const initContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signer);
    setContract(contractInstance); 
  };

  const addCandidate = async () => {
    if (!contract) return;
    try {
      const tx = await contract.addCandidate(name, image);
      await tx.wait();
      alert("Candidate added successfully!");
    } catch (error) {
      alert("Error adding candidate.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button onClick={initContract}>Connect to Contract</button>
      <input type="text" placeholder="Candidate Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <button onClick={addCandidate}>Add Candidate</button>
    </div>
  );
};

export default Admin;
