import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Toggle } from "rsuite";

export default function Admin() {
  const { isAdmin, contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedElection, setSelectedElection] = useState({
    electionName: "------",
    startTime: "--",
  });
  const [candidates, setCandidate] = useState([]);
  const [winner, setWinner] = useState({
    candidateName: "-",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchElections();
    }
  }, [isAdmin]);

  const fetchElections = async () => {
    if (contract) {
      try {
        const electionsData = await contract.getAllElections();
        const cleanElections = electionsData.map((el, index) => ({
          id: index,
          electionId: Number(el.electionId),
          electionName: el.electionName,
          description:
            "Vote for your student representatives for the 2023-2024 academic year",
          image:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
          category: "Education",
          isActive: el.isActive,
          startTime: Number(el.startTime),
          endTime: Number(el.endTime),
          participants: Number(el.totalCandidates),
          totalVoters: Number(el.totalVoters),
          votes: Number(el.totalVotes),
          winnerId: Number(el.winnerId),
          registrationPhase: el.registrationPhase,
          votingPhase: el.votingPhase,
          isCompleted: el.isCompleted,
        }));
        // console.log(cleanElections);
        setElections(cleanElections);

      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const fetchElection = async (e) => {
    try {
      if (!e) {
        return;
      }
      const election = await contract.getElection(parseInt(e));
      const candidates = await contract.getAllCandidates(parseInt(e));
      const winner = await contract.getCandidate(
        parseInt(e),
        parseInt(election.winnerId)
      );
      setWinner(winner);
      setCandidate(candidates);
      setSelectedElection(election);
    } catch (error) {
      console.error(error);
    }
  };
  // Get election phase
  const getElectionPhase = (startTime, endTime) => {
    const now = Date.now() / 1000;
    if (now > endTime) {
      return "Completed";
    } else if (now > startTime) {
      return "Voting";
    } else {
      return "Upcoming";
    }
  };

  // Format date from unix timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getElectionStatus = (e) => {
    if (e.isActive) return "Active";
    else if (e.registrationPhase) return "Registration";
    else if (e.isCompleted) return "Complete";
    else if (e.votingPhase) return "Voting";
    return "Not Active";
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gradient-to-b from-[#023047] to-gray-800 min-h-screen text-white p-5 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-white/70 text-sm mt-1">
                Blockchain Voting System
              </p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Dashboard
              </button>

              <Link
                to="/newElection"
                className="w-full flex items-center px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Create Election
              </Link>

              <button
                onClick={() => setActiveTab("manage")}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === "manage"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Manage Elections
              </button>

              <button
                onClick={() => setActiveTab("results")}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === "results"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                Results
              </button>

              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  to="/"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    ></path>
                  </svg>
                  Back to Home
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#023047]">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Manage your blockchain-based elections with complete
                  transparency and security.
                  <span className="block mt-2 text-[#023047] font-medium">
                    Monitor activity and ensure fair voting.
                  </span>
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#023047]"></div>
                </div>
              ) : (
                <>
                  {activeTab === "dashboard" && (
                    <>
                      {/* Stats Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white/80 text-sm">
                                Total Elections
                              </p>
                              <h3 className="text-3xl font-bold mt-1">
                                {elections.length}
                              </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-white/80">
                            <span className="font-medium text-white">
                              +{elections.length}
                            </span>{" "}
                            total created
                          </div>
                        </div>

                        {/* Rest of the dashboard stats */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white/80 text-sm">
                                Active Elections
                              </p>
                              <h3 className="text-3xl font-bold mt-1">
                                {
                                  elections.filter(
                                    (e) =>
                                      e.isActive &&
                                      getElectionPhase(
                                        e.startTime,
                                        e.endTime
                                      ) === "Voting"
                                  ).length
                                }
                              </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-white/80">
                            <span className="font-medium text-white">
                              Currently in voting phase
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white/80 text-sm">
                                Upcoming Elections
                              </p>
                              <h3 className="text-3xl font-bold mt-1">
                                {
                                  elections.filter(
                                    (e) =>
                                      getElectionPhase(
                                        e.startTime,
                                        e.endTime
                                      ) === "Upcoming"
                                  ).length
                                }
                              </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-white/80">
                            <span className="font-medium text-white">
                              Scheduled for future
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white/80 text-sm">
                                Completed Elections
                              </p>
                              <h3 className="text-3xl font-bold mt-1">
                                {elections.filter((e) => e.isCompleted).length}
                              </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-white/80">
                            <span className="font-medium text-white">
                              Archived results
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Elections Table */}
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-xl font-bold text-[#023047]">
                            Elections Overview
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            Manage and monitor all elections
                          </p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Election
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Start Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  End Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Participants
                                </th>
                                {/* <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Actions
                                </th> */}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {elections.map((election) => {
                                const phase = getElectionPhase(
                                  election.startTime,
                                  election.endTime
                                );

                                return (
                                  <tr key={election.electionId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <img
                                            className="h-10 w-10 rounded-md object-cover"
                                            src={election.image}
                                            alt={election.electionName}
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {election.electionName}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {election.electionName}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          phase === "Voting"
                                            ? "bg-green-100 text-green-800"
                                            : phase === "Upcoming"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {getElectionStatus(election)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {/* {election.startTime} */}
                                      {formatDate(election.startTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatDate(election.endTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {election.participants}
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                          View
                                        </button>
                                        <button className="text-yellow-600 hover:text-yellow-900">
                                          Edit
                                        </button>
                                        {phase === "Upcoming" && (
                                          <button className="text-red-600 hover:text-red-900">
                                            Cancel
                                          </button>
                                        )}
                                      </div>
                                    </td> */}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                          to="/newElection"
                          className="bg-gradient-to-br from-[#023047] to-gray-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="bg-white/20 p-3 rounded-lg inline-block mb-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            Create New Election
                          </h3>
                          <p className="text-white/80 mb-4">
                            Set up a new blockchain-based election with custom
                            parameters
                          </p>
                          <div className="flex items-center text-sm">
                            <span>Get started</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                        </Link>

                        {/* <button className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                          <div className="bg-white/20 p-3 rounded-lg inline-block mb-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            Generate Reports
                          </h3>
                          <p className="text-white/80 mb-4">
                            Create detailed reports of election results and
                            participation
                          </p>
                          <div className="flex items-center text-sm">
                            <span>View reports</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                        </button> */}

                        {/* <button className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                          <div className="bg-white/20 p-3 rounded-lg inline-block mb-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            System Settings
                          </h3>
                          <p className="text-white/80 mb-4">
                            Configure blockchain parameters and system
                            preferences
                          </p>
                          <div className="flex items-center text-sm">
                            <span>Manage settings</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                        </button> */}
                      </div>
                    </>
                  )}

                  {activeTab === "results" && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-xl font-bold text-[#023047]">
                            Election Results
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            View and analyze completed election results
                          </p>
                        </div>

                        <div className="p-6">
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Election
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#023047] focus:border-[#023047]"
                              onChange={(e) => {
                                fetchElection(e.target.value);
                              }}
                            >
                              <option value="">
                                Select an election to view results
                              </option>
                              {elections
                                .filter((e) => getElectionStatus(e) === "Complete")
                                .map((election) => (
                                  <option
                                    key={election.electionId}
                                    value={election.electionId}
                                  >
                                    {election.electionName} (
                                    {formatDate(election.endTime)})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* Sample Results Display */}
                        <div className="px-6 pb-6">
                          <div className="bg-gradient-to-r from-[#023047] to-gray-700 rounded-xl overflow-hidden mb-8">
                            <div className="p-8 text-white">
                              <h2 className="text-2xl font-bold mb-2">
                                {selectedElection.electionName}
                              </h2>
                              <p className="text-white/80 mb-4">
                                End Date:{" "}
                                {formatDate(Number(selectedElection.endTime))}
                              </p>
                              <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    Winner Id
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    {selectedElection.winnerId}
                                  </span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    Total Votes
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    {selectedElection.totalVotes}
                                  </span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    Total Candidates
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    {selectedElection.totalCandidates}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Winner Section */}
                          <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#023047] mb-4">
                              Election Winner
                            </h3>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                              <h4 className="text-lg font-bold text-green-800 mb-2">
                                Winner:
                              </h4>
                              <div className="flex items-center">
                                <img
                                  src="/avtar.png"
                                  alt="Alex Johnson"
                                  className="w-16 h-16 rounded-full object-cover border-4 border-green-500"
                                />
                                <div className="ml-4">
                                  <div className="font-bold text-gray-900 text-xl">
                                    {winner.candidateName}
                                  </div>
                                  <div className="text-green-600">
                                    {winner.voteCount} votes (
                                    {(Number(winner.voteCount) /
                                      Number(selectedElection.totalVotes)) *
                                      100}%
                                    )
                                  </div>
                                  <div className="text-gray-500 mt-1">
                                    Address: {winner.candidateAddress}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Results Table */}
                          <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Candidate
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Votes
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Percentage
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Result
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {candidates.map((candidate) => {
                                    const percentage = (
                                      (Number(candidate.voteCount) / Number(selectedElection.totalVotes)) *
                                      100
                                    ).toFixed(1);

                                    return (
                                      <tr key={candidate.candidateId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                              <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src="/avtar.png"
                                                alt="candidateImg"
                                              />
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {candidate.candidateName}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {candidate.voteCount}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                            <div
                                              className={`h-2.5 rounded-full ${
                                                candidate.candidateId == selectedElection.winnerId
                                                  ? "bg-green-500"
                                                  : "bg-[#023047]"
                                              }`}
                                              style={{
                                                width: `${percentage}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {percentage}%
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {candidate.candidateId == selectedElection.winnerId ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                              Winner
                                            </span>
                                          ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                              Defeated
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === "manage" && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-xl font-bold text-[#023047]">
                            Manage Elections
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            Edit, update, or cancel existing elections
                          </p>
                        </div>

                        <div className="p-6">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Election
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Dates
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Active
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {elections.map((election) => {
                                  const phase = getElectionPhase(
                                    election.startTime,
                                    election.endTime
                                  );

                                  return (
                                    <tr key={election.electionId}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                              className="h-10 w-10 rounded-md object-cover"
                                              src={election.image}
                                              alt={election.name}
                                            />
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                              {election.electionName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {election.electionName}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            phase === "Voting"
                                              ? "bg-green-100 text-green-800"
                                              : phase === "Upcoming"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {getElectionStatus(election)}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {formatDate(election.startTime)} -{" "}
                                          {formatDate(election.endTime)}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Toggle
                                          checked={election.isActive}
                                          disabled={phase === "Completed"}
                                          size="sm"
                                          onClick={async () => {
                                            if (!election.isActive)
                                              try {
                                                const res =
                                                  await contract.activeElection(
                                                    election.electionId
                                                  );
                                                await res.wait();
                                                alert("elction Active");
                                              } catch (error) {
                                                console.error(error.reson);
                                              }
                                            else
                                              try {
                                                const res =
                                                  await contract.deactiveElection(
                                                    election.electionId
                                                  );
                                                await res.wait();
                                                alert("elction Deactive");
                                              } catch (error) {
                                                console.error(error.reson);
                                              }
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { Toggle } from 'rsuite';

// export default function Admin() {
//   const { isAdmin, contract } = useAuth();
//   const [elections, setElections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isAdmin) {
//       fetchElections();
//     }
//   }, [isAdmin]);

//   const fetchElections = async () => {
//     if (contract) {
//       try {
//         // const electionCount = await contract.electionCount();
//         // await electionCount.wait();

//         // for(let i=0;i<parseInt(electionCount);i++)
//         const electionList = await contract.getAllElections(); // Fetch from contract
//         setElections(electionList);
//       } catch (error) {
//         console.error("Error fetching elections:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-5">
//         <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
//         <nav className="space-y-3">
//           <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">
//             Dashboard
//           </Link>
//           <Link
//             to="/newElection"
//             className="block hover:bg-gray-700 p-2 rounded"
//           >
//             Create Election
//           </Link>
//           <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
//             Go to Home
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-5">
//         <div>
//           <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
//           {/* <Toggle /> */}
//         </div>
//         {loading ? (
//           <p>Loading Elections...</p>
//         ) : (
//           <div className="bg-white p-4 rounded shadow">
//             <h2 className="text-xl font-semibold mb-3">Elections Overview</h2>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
//                 <p className="text-lg">Total Elections</p>
//                 <h3 className="text-2xl font-bold">{elections.length}</h3>
//               </div>
//               <div className="p-4 bg-green-500 text-white rounded-lg shadow">
//                 <p className="text-lg">Active Elections</p>
//                 <h3 className="text-2xl font-bold">
//                   {elections.filter((e) => e.isActive).length}
//                 </h3>
//               </div>
//               <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
//                 <p className="text-lg">Upcoming Elections</p>
//                 <h3 className="text-2xl font-bold">
//                   {elections.filter((e) => !e.active).length}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
//   // // const [contract, setContract] = useState(null);
//   // const { wallet, provider , contract} = useAuth();
//   // const [elections, setElections] = useState({
//   //   electionName: '',
//   //   startTime: '',
//   //   endTime: ''
//   // });

//   // const setInputHandler = (e) => {
//   //   const {name, value} = e.target;
//   //   setElections(prevState => ({
//   //     ...prevState,
//   //     [name]: value
//   //   }))
//   // }
//   // // const getValueFromContract = async () => {
//   // //   if (contract) {
//   // //     try {
//   // //       const contractValue = await contract.getValue(); // Get the stored value
//   // //       setValue(contractValue.toString());
//   // //       console.log("Stored value is:", contractValue.toString());
//   // //     } catch (error) {
//   // //       console.error("Error getting value:", error);
//   // //     }
//   // //   }
//   // // };
//   // const createElection = async() => {
//   //   if(contract){
//   //     const newElection = await contract.createElection(elections.electionName, parseInt(elections.startTime), parseInt(elections.endTime));
//   //     await newElection.wait();
//   //     console.log(newElection.toString())
//   //   }
//   // }
//   // const getElection = async () => {
//   //   if(contract){
//   //     const electionData = await contract.getElection(3);
//   //     // await electionData.wait();
//   //     console.log(electionData)
//   //   }
//   // }
//   // return (
//   //   <div>
//   //     <h2>Set Value and Get Value from Contract:</h2>

//   //     <div>
//   //     <input
//   //         type="text"
//   //         name="electionName"
//   //         value={elections.electionName}
//   //         onChange={setInputHandler}
//   //       />
//   //       <input
//   //         type="number"
//   //         name="startTime"
//   //         value={elections.startTime}
//   //         onChange={setInputHandler}
//   //       />
//   //       <input
//   //         type="number"
//   //         name="endTime"
//   //         value={elections.endTime}
//   //         onChange={setInputHandler}
//   //       />
//   //       <button onClick={createElection}>Create Election</button>
//   //     </div>

//   //     <div>
//   //       <button onClick={getElection}>Get Stored Value</button>
//   //       {/* {value !== null && <p>Stored Value: {value}</p>} */}
//   //     </div>
//   //   </div>
//   // );
// }
