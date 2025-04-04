import React from 'react'
import useAuth from "../hooks/useAuth";

const Voting = () => {
  const { wallet, provider , contract, isAdmin} = useAuth();
  return (
    <>
    <div>Voting</div>
    <button onClick={() => {console.log(isAdmin)}}>Click</button>
    </>
  )
}

export default Voting