import React from "react";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Home page</h1>
      <p>User authentication is : {isAuthenticated}</p>
    </div>
  );
};

export default Home;
