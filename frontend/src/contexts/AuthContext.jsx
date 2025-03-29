import { ethers } from "ethers";
import { useContext, useState, createContext, useEffect } from "react";

const AuthContext = createContext();

// const AuthContext = () => {
//   return useContext(AuthContext);
// }
// export default useAuth;

const AuthProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signer, setSigner] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token ? true : false);
    setToken(token)
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask is not installed, install it first!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    setSigner(signer);
    setWallet(account);
    console.log(wallet);
  };

  const loginHandler = async () => {
    if (!wallet) {
      console.log("No wallet connected");
      return;
    }
    const nonce_data = await fetch(
      `http://localhost:5000/api/users/nonce/${wallet}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const nonce = nonce_data.nonce;
    if (!nonce) {
      console.log("nonce not found!");
      return;
    }

    const signature = await signer.signMessage(nonce, wallet);

    const verifyResponce = await fetch(
      "http://localhost:5000/api/users/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address, signature }),
      }
    );
    const { token } = await verifyResponce.json();
    if (!token) {
      console.log("Token not found!");
      return;
    }
    localStorage.setItem("token", token);
    setToken(token)

    alert("Signin successfull!");
  };

  const logoutHandler = () => {
    wallet(null);
    localStorage.removeItem("token");
  };

  const isAuthenticatedHandller = () => {
    if (localStorage.getItem("token")) setIsAuthenticated(true);
  };

  const registerHandler = async (username) => {
    try {
      const userResponse = await fetch(
        `http://localhost:5000/api/users/${wallet}/`,
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
          body: JSON.stringify({ wallet }),
        }
      );
      const nonce = nonce_data.nonce;
      if (!nonce) {
        console.log("nonce not found!");
        return;
      }

      const signature = signer.signMessage(nonce, wallet);

      const verifyResponce = fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.parse({ username, wallet_address: wallet, signature }),
      });
      console.log(verifyResponce);
    } catch {
      console.log("Something wents wrong during registration!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        wallet,
        token,
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

export {AuthContext, AuthProvider};
