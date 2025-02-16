import { ethers } from "ethers";

const connectToBlockchain = async (): Promise<{ provider: ethers.providers.Web3Provider; signer: ethers.Signer } | undefined> => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { provider, signer };
  } else {
    console.error("Please install MetaMask!");
  }
};

export default connectToBlockchain;
