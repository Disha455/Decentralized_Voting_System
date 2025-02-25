const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const Voting = await ethers.getContractFactory("Voting");

    // Candidate names and image URLs
    const candidateNames = ["Conor", "Rock"];
    const candidateImages = [
        "http://localhost:3000/images/conor.jpg", // Update this to a URL relative to your React public folder
        "http://localhost:3000/images/rock.jpg"  // Use relative path from public folder
    ];

    // Duration in minutes
    const votingDuration = 90; // Set the voting duration in minutes

    // Deploy contract with candidate names, images, and duration
    const Voting_ = await Voting.deploy(candidateNames, candidateImages, votingDuration);
    console.log("Contract deployed to:", Voting_.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
