import { ethers } from "ethers";
import contractABI from "../contracts/Voting.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getEthereumContract = async (signer) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  } else {
    alert("Metamask not installed!");
    return;
  }
};