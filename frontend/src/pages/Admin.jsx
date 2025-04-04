import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Toggle } from 'rsuite';

export default function Admin() {
  const { isAdmin, contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchElections();
    }
  }, [isAdmin]);

  const fetchElections = async () => {
    if (contract) {
      try {
        // const electionCount = await contract.electionCount();
        // await electionCount.wait();

        // for(let i=0;i<parseInt(electionCount);i++)
        const electionList = await contract.getAllElections(); // Fetch from contract
        setElections(electionList);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav className="space-y-3">
          <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link
            to="/newElection"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Create Election
          </Link>
          <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
            Go to Home
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <div>
          <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
          {/* <Toggle /> */}
        </div>
        {loading ? (
          <p>Loading Elections...</p>
        ) : (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Elections Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
                <p className="text-lg">Total Elections</p>
                <h3 className="text-2xl font-bold">{elections.length}</h3>
              </div>
              <div className="p-4 bg-green-500 text-white rounded-lg shadow">
                <p className="text-lg">Active Elections</p>
                <h3 className="text-2xl font-bold">
                  {elections.filter((e) => e.isActive).length}
                </h3>
              </div>
              <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
                <p className="text-lg">Upcoming Elections</p>
                <h3 className="text-2xl font-bold">
                  {elections.filter((e) => !e.active).length}
                </h3>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  // // const [contract, setContract] = useState(null);
  // const { wallet, provider , contract} = useAuth();
  // const [elections, setElections] = useState({
  //   electionName: '',
  //   startTime: '',
  //   endTime: ''
  // });

  // const setInputHandler = (e) => {
  //   const {name, value} = e.target;
  //   setElections(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }))
  // }
  // // const getValueFromContract = async () => {
  // //   if (contract) {
  // //     try {
  // //       const contractValue = await contract.getValue(); // Get the stored value
  // //       setValue(contractValue.toString());
  // //       console.log("Stored value is:", contractValue.toString());
  // //     } catch (error) {
  // //       console.error("Error getting value:", error);
  // //     }
  // //   }
  // // };
  // const createElection = async() => {
  //   if(contract){
  //     const newElection = await contract.createElection(elections.electionName, parseInt(elections.startTime), parseInt(elections.endTime));
  //     await newElection.wait();
  //     console.log(newElection.toString())
  //   }
  // }
  // const getElection = async () => {
  //   if(contract){
  //     const electionData = await contract.getElection(3);
  //     // await electionData.wait();
  //     console.log(electionData)
  //   }
  // }
  // return (
  //   <div>
  //     <h2>Set Value and Get Value from Contract:</h2>

  //     <div>
  //     <input
  //         type="text"
  //         name="electionName"
  //         value={elections.electionName}
  //         onChange={setInputHandler}
  //       />
  //       <input
  //         type="number"
  //         name="startTime"
  //         value={elections.startTime}
  //         onChange={setInputHandler}
  //       />
  //       <input
  //         type="number"
  //         name="endTime"
  //         value={elections.endTime}
  //         onChange={setInputHandler}
  //       />
  //       <button onClick={createElection}>Create Election</button>
  //     </div>

  //     <div>
  //       <button onClick={getElection}>Get Stored Value</button>
  //       {/* {value !== null && <p>Stored Value: {value}</p>} */}
  //     </div>
  //   </div>
  // );
}
