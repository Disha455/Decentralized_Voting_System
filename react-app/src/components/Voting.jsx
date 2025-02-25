import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constant/constants";
import "./Voting.css";

// Initialize Ethereum provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);

const Voting = ({ account }) => {
  const [candidates, setCandidates] = useState([]);
  const [contract, setContract] = useState(null);
  //const [loading, setLoading] = useState(true);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateImage, setNewCandidateImage] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [votingStatus, setVotingStatus] = useState(false);

  // Initialize the contract and fetch candidates on page load
  useEffect(() => {
    const initContract = async () => {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

      const candidateList = await contractInstance.getAllCandidates();
      setCandidates(candidateList);
      //setLoading(false);

      const votingStatus = await contractInstance.getVotingStatus();
      setVotingStatus(votingStatus);

      const remaining = await contractInstance.getRemainingTime();
      setRemainingTime(remaining);
    };

    initContract();
  }, []);

  // Fetch candidates after voting or adding a new one
  const loadCandidates = async () => {
    if (!contract) return;
    const candidatesCount = await contract.getCandidateCount();
    const candidatesData = [];
    for (let i = 0; i < candidatesCount; i++) {
      const candidate = await contract.getCandidate(i);
      candidatesData.push(candidate);
    }
    setCandidates(candidatesData);
  };

  // Handle voting for a candidate
  const vote = async (id) => {
    if (!contract) return;
    try {
      const tx = await contract.vote(id, { gasLimit: 300000 });
      await tx.wait();
      alert("Vote casted successfully!");
      loadCandidates();
    } catch (error) {
      alert("Error while voting.");
    }
  };

  const removeCandidate = async (index) => {
    if (!contract) return;
    try {
      const tx = await contract.removeCandidate(index);
      await tx.wait();
      alert('Candidate removed successfully!');
      loadCandidates(); // Refresh candidate list
    } catch (error) {
      alert('Error while removing candidate');
      console.error(error);
    }
  };

  const restartVoting = async () => {
    if (!contract) return;

    try {
      // Extract candidate names and images from the candidates state
      const candidateNames = candidates.map(candidate => candidate.name);
      const candidateImages = candidates.map(candidate => candidate.imageUrl);

      const votingDuration = 90; // Or any logic to set the duration (e.g., from a state)

      const tx = await contract.restartVoting(candidateNames, candidateImages, votingDuration);
      await tx.wait();
      alert('Voting restarted successfully!');
    } catch (error) {
      alert('Error restarting voting.');
      console.error(error);
    }
  };



  // Add a new candidate to the contract
  const addCandidate = async () => {
    if (!contract || !newCandidateName || !newCandidateImage) return;

    try {
      // Attempt to add a candidate to the contract
      const tx = await contract.addCandidate(newCandidateName, newCandidateImage);

      // Wait for the transaction to be mined
      await tx.wait();

      alert('Candidate added successfully!');
      loadCandidates();  // Reload candidates after adding
      setNewCandidateName('');
      setNewCandidateImage('');
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert(`Error while adding candidate: ${error.message}`);
    }
  };

  // Render candidates and voting controls
  return (
    <div className="voting-container">
      <h2>Vote for Your Favorite Candidate</h2>

      {/* Add Candidate Form */}
      <div>
        <input
          type="text"
          placeholder="Candidate Name"
          value={newCandidateName}
          onChange={(e) => setNewCandidateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Candidate Image URL"
          value={newCandidateImage}
          onChange={(e) => setNewCandidateImage(e.target.value)}
        />
        <button onClick={addCandidate}>Add Candidate</button>
      </div>

      {/* Display Remaining Time */}
      {votingStatus && remainingTime > 0 ? (
        <div>
          <h3>Remaining Time: {Math.floor(remainingTime / 60)} minutes</h3>
        </div>
      ) : (
        <h3>Voting has ended or is not active.</h3>
      )}

      {candidates.map((candidate, index) => (
        <div key={index} className="candidate">
          <img src={candidate.imageUrl} alt={candidate.name} />
          <p>{candidate.name}</p>
          <p>Votes: {ethers.utils.formatUnits(candidate.voteCount, 0)}</p>
          <button onClick={() => vote(index)}>Vote</button>
          <button onClick={() => removeCandidate(index)} style={{ backgroundColor: "red" }}>Remove</button>
        </div>
      ))}

      {!votingStatus && (
        <button onClick={restartVoting}>Restart Voting</button>

      )}




      {/* Display Candidates */}
      
    </div>
  );
};

export default Voting;
