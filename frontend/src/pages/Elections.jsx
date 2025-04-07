import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const { contract, wallet } = useAuth();
  useEffect(() => {
    const fetchActiveElections = async () => {
      try {
        const allElections = await contract.getAllElections();
        const activeElections = allElections.filter(
          (election) => election.isActive
        );

        const formatted = activeElections.map((election, index) => ({
          id: index,
          electionId: Number(election.electionId),
          name: election.name,
          description: election.description,
          startTime: new Date(
            Number(election.startTime) * 1000
          ).toLocaleString(),
          endTime: new Date(Number(election.endTime) * 1000).toLocaleString(),
        }));
        console.log(formatted);
        setElections(formatted);
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };

    fetchActiveElections();
  }, [contract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Active Elections
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Register Voter Form */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register Voter</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Wallet Address:
              </label>
              <input
                type="text"
                value={wallet}
                // onChange={(e) => setVoterAddress(e.target.value)}
                // disabled={votingClosed || transactionPending}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wallet address (0x...)"
              />
            </div>
            <button
              type="submit"
              // disabled={votingClosed || !voterAddress || transactionPending}
              className={`w-full py-2 rounded-lg 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Register Voter
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default Elections;
