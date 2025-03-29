import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

const WalletContext = () => {
  const { wallet, loginHandller, logoutHandller } = useAuth();
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask is not installed, install it first!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    setSigner(signer);
    setAccount(account[0]);
  };
  const registerUser = async (username) => {
    try {
      const userResponse = await fetch(
        `http://localhost:5000/api/users/${account}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (userResponse) {
        alert("User already registered!");
        return;
      }
      const nonce_data = await fetch(
        `http://localhost:5000/api/users/create_nonce/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_address }),
        }
      );
      const nonce = nonce_data.nonce;
      if (!nonce) {
        console.log("nonce not found!");
        return;
      }

      const signature = signer.signMessage(nonce, account);

      const verifyResponce = fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.parse({ username, wallet_address, signature }),
      });
    } catch {
      console.log("Something wents wrong during registration!");
    }
  };

  return <div>WalletContext</div>;
};

export default WalletContext;
