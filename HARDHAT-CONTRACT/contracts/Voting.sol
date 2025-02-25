// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string imageUrl; // Adding image URL field
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    // Constructor to initialize candidates with their names, images, and voting duration
    constructor(string[] memory _candidateNames, string[] memory _candidateImages, uint256 _durationInMinutes) {
        require(_candidateNames.length == _candidateImages.length, "Names and images count mismatch.");
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                imageUrl: _candidateImages[i], // Storing the image URL for each candidate
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // Modifier to restrict certain functions to only the owner
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Function to allow the owner to add new candidates
    function addCandidate(string memory _name, string memory _imageUrl) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            imageUrl: _imageUrl,
            voteCount: 0
        }));
    }

    // Function to allow users to vote for candidates
    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");
        require(block.timestamp >= votingStart && block.timestamp < votingEnd, "Voting period is over.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    // Function to get the number of candidates (used for fetching candidates count in frontend)
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    // Function to get a specific candidate's details by index
    function getCandidate(uint256 index) public view returns (string memory name, string memory imageUrl, uint256 voteCount) {
        require(index < candidates.length, "Candidate index out of bounds.");
        Candidate memory candidate = candidates[index];
        return (candidate.name, candidate.imageUrl, candidate.voteCount);
    }

    // Function to get all candidates' details (including image URL)
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Function to check the status of voting
    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    // Function to get the remaining time for voting
    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    // Function to fetch final voting results
    function getVotingResults() public view returns (string memory result) {
        require(block.timestamp >= votingEnd, "Voting is still in progress.");
        
        uint256 winningVoteCount = 0;
        string memory winningCandidate;
        
        // Find the candidate with the highest votes
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate = candidates[i].name;
            }
        }

        // Return results
        return string(abi.encodePacked("The winner is ", winningCandidate, " with ", uint2str(winningVoteCount), " votes."));
    }
     
     // Function to remove a candidate by index (Only Owner can remove)
function removeCandidate(uint256 _index) public onlyOwner {
    require(_index < candidates.length, "Invalid candidate index.");

    // Shift the last element to the index being deleted
    candidates[_index] = candidates[candidates.length - 1];

    // Remove the last element
    candidates.pop();
}
 
 function restartVoting(string[] memory _newCandidateNames, string[] memory _newCandidateImages, uint256 _newDurationInMinutes) public onlyOwner {
    require(block.timestamp >= votingEnd, "Current voting is still active.");
    delete candidates;  // Clear old candidates

    for (uint256 i = 0; i < _newCandidateNames.length; i++) {
        candidates.push(Candidate({
            name: _newCandidateNames[i],
            imageUrl: _newCandidateImages[i], 
            voteCount: 0
        }));
    }

    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_newDurationInMinutes * 1 minutes);
}


    // Helper function to convert uint to string (used for final results)
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}