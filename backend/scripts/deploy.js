const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with address :", deployer.address);

  const MyVoting = await hre.ethers.getContractFactory("Voting");
  const myVoting = await MyVoting.deploy();

  await myVoting.waitForDeployment();

  console.log("Contract deployed to:", await myVoting.getAddress());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x5FbDB2315678afecb367f032d93F642f64180aa3