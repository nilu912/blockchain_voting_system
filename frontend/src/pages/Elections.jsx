import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import ElectionSelector from "../components/ElectionSelector";
const Elections = () => {
  const [elections, setElections] = useState([]);
  const { contract, wallet } = useAuth();
  const navigate = useNavigate();

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
          name: election.electionName,
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
  const getTimeRemaining = (endTimeStr) => {
    const endTime = new Date(endTimeStr).getTime();
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) return "Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days}d ${hours}h remaining`;
  };

  // Calculate progress percentage
  const getProgressPercentage = (startTimeStr, endTimeStr) => {
    const startTime = new Date(startTimeStr).getTime();
    const endTime = new Date(endTimeStr).getTime();
    const now = new Date().getTime();

    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;

    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;

    return Math.floor((elapsed / totalDuration) * 100);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#023047]">
            Active Elections
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience transparent, tamper-proof elections with our cutting-edge
            blockchain technology.
            <span className="block mt-2 text-[#023047] font-medium">
              Every vote is securely recorded.
            </span>
          </p>
        </div>

        {elections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {elections.map((election) => (
              <div
                key={election.id}
                className="group relative bg-gradient-to-br from-[#023047] to-gray-700 rounded-xl overflow-hidden shadow-xl hover:shadow-[#023047]/20 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 z-10"></div>
                <div className="h-56 overflow-hidden">
                  <img
                    src={election.image}
                    alt={election.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-[#023047]/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {election.category}
                  </span>
                </div>

                <div className="relative z-20 p-6 -mt-6">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors" style={{color: "white", opacity:"80%"}}>
                    {election.name}
                  </h2>
                  <p className="text-white/80 mb-6">{election.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white"
                          ></div>
                        ))}
                      </div>
                      <span className="text-white/70 text-sm ml-2">
                        +{election.participants} participants
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-blue-200 font-medium">
                        {getTimeRemaining(election.endTime)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${getProgressPercentage(
                            election.startTime,
                            election.endTime
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <span className="block text-white/70">Started</span>
                      <span className="text-white">
                        {election.startTime.split(",")[0]}
                      </span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <span className="block text-white/70">Ends</span>
                      <span className="text-white">
                        {election.endTime.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors flex items-center justify-center group"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/election/${election.electionId}`);
                    }}
                  >
                    <span>Cast Your Vote</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#023047] to-gray-700 backdrop-blur-sm rounded-xl p-16 text-center shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Active Elections
            </h3>
            <p className="text-white/80 max-w-md mx-auto">
              The next round of elections is being prepared. Check back soon or
              subscribe to notifications.
            </p>
            <button className="mt-8 px-8 py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors">
              Get Notified
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;
