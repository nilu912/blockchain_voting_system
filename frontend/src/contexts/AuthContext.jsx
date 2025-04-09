import { ethers } from "ethers";
import { useContext, useState, createContext, useEffect } from "react";
// import { getEthereumContract } from "../utils/contract";

import contractABI from "../contracts/Voting.json";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const restoreWalletConnection = async () => {
      if (!window.ethereum) return;

      try {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();

        setProvider(provider);
        setWallet(account);
        setSigner(signer);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          signer
        );
        setContract(contractInstance);
        const ownerAdd = await contractInstance.getOwner();
        if (ownerAdd.toLowerCase().toString() == wallet.toLowerCase()) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error restoring wallet connection:", err);
      }
    };
    if (sessionStorage.getItem("token")) restoreWalletConnection();
    // setIsAuthenticated(true);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask is not installed, install it first!");
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      setProvider(provider);
      setWallet(account);
      setSigner(signer);

      return { account, signer };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };
  const loginHandler = async (wallet, signer) => {
    if (!wallet) {
      console.log("No wallet connected");
      return;
    }

    const nonceResponse = await fetch(
      `http://localhost:5000/api/users/create_nonce/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet_address: wallet }),
      }
    );
    const nonce_data = await nonceResponse.json();
    const nonce = nonce_data.nonce;
    if (!nonce) {
      console.log("nonce not found!");
      return;
    }
    console.log(nonce);
    const signature = await signer.signMessage(nonce, wallet);

    const verifyResponce = await fetch(
      "http://localhost:5000/api/users/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: wallet, signature }),
      }
    );
    const { token } = await verifyResponce.json();
    if (!token) {
      alert("You are not registered yet. please register first!");
      console.log("Token not found!");
      return;
    }
    sessionStorage.setItem("token", token);
    setToken(token);
    setIsAuthenticated(true);

    alert("Signin successfull!");
  };

  useEffect(() => {
    const contractCalling = async () => {
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );
      setContract(contractInstance);
      console.log("contract connected!");
      const ownerAdd = await contractInstance.getOwner();
      if (ownerAdd.toLowerCase().toString() == wallet.toLowerCase()) {
        setIsAdmin(true);
      }
    };

    contractCalling();
  }, [wallet]);

  const logoutHandler = () => {
    setIsAuthenticated(false);
    setWallet(null);
    setProvider(null);
    setIsAdmin(false);
    sessionStorage.removeItem("token");
    console.log("logged out.!");
  };

  const isAuthenticatedHandller = () => {
    if (sessionStorage.getItem("token")) setIsAuthenticated(true);
  };

  const registerHandler = async (username) => {
    try {
      try {
        const userResponse = await fetch(
          `http://localhost:5000/api/users/user/${wallet}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const userData = await userResponse.json();
        if (userData.wallet_address) {
          alert("User already registered!");
          return;
        }
      } catch (error) {
        console.error(
          "Error while checking if user is already registered:",
          error
        );
      }
      const response = await fetch(
        `http://localhost:5000/api/users/create_nonce/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_address: wallet }),
        }
      );
      const nonce_data = await response.json();
      if (!nonce_data.nonce) {
        console.log("nonce not found!");
        return;
      }
      const nonce = nonce_data.nonce;
      const signature = await signer.signMessage(nonce.toString());

      const signupResponse = await fetch(
        "http://localhost:5000/api/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, wallet_address: wallet, signature }),
        }
      );
      const signupData = await signupResponse.json();
      if (!signupData) {
        console.error("not login");
        return;
      }
      alert("User successfully signup.");
    } catch {
      console.log("Something wents wrong during registration!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        wallet,
        token,
        contract,
        provider,
        signer,
        isAdmin,
        isAuthenticated,
        connectWallet,
        loginHandler,
        logoutHandler,
        registerHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
