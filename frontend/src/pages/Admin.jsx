import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Toggle } from "rsuite";
import { Drawer, ButtonToolbar, Button, IconButton, Placeholder } from "rsuite";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleDownIcon from "@rsuite/icons/legacy/AngleDown";
import AngleUpIcon from "@rsuite/icons/legacy/AngleUp";

export default function Admin() {
  const { isAdmin, contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleOpen = () => {
    setOpen(true);
    setPlacement("right");
  };

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
          startTime: new Date(Number(el.startTime) * 1000).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
          endTime: new Date(Number(el.endTime) * 1000).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
          participants: Number(el.totalCandidates),
          totalVoters: Number(el.totalVoters),
          votes: Number(el.totalVotes),
          winnerId: Number(el.winnerId),
          registrationPhase: el.registrationPhase,
          votingPhase: el.votingPhase,
          isCompleted: el.isCompleted,
        }));
        console.log(cleanElections);
        setElections(cleanElections);

        // // Mock data for now
        // const mockElections = [
        //   {
        //     electionId: 1,
        //     name: "Student Council Election",
        //     description: "Vote for your student representatives for the 2023-2024 academic year",
        //     isActive: true,
        //     image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        //     category: "Education",
        //     participants: 248,
        //     votes: 156,
        //   },
        //   {
        //     electionId: 2,
        //     name: "Community Board Election",
        //     description: "Select members for the local community board",
        //     startTime: new Date(Date.now() - 86400000 * 2).getTime() / 1000,
        //     endTime: new Date(Date.now() + 86400000 * 5).getTime() / 1000,
        //     isActive: true,
        //     image: "https://images.unsplash.com/photo-1531750026848-8ada78f641c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        //     category: "Community",
        //     participants: 156,
        //     votes: 89,
        //   },
        //   {
        //     electionId: 3,
        //     name: "Blockchain Governance Vote",
        //     description: "Vote on proposed changes to the blockchain protocol",
        //     startTime: new Date(Date.now() + 86400000 * 2).getTime() / 1000,
        //     endTime: new Date(Date.now() + 86400000 * 10).getTime() / 1000,
        //     isActive: false,
        //     image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        //     category: "Technology",
        //     participants: 0,
        //     votes: 0,
        //   }
        // ];

        // setElections(mockElections);

        // Uncomment when contract is ready
        // const electionList = await contract.getAllElections();
        // setElections(electionList);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
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

  return (
    <>
      <Drawer placement={placement} open={open} onClose={() => setOpen(false)}>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)} appearance="primary">
              Confirm
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Placeholder.Paragraph rows={8} />
        </Drawer.Body>
      </Drawer>
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
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === "users"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                Users
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
                                {
                                  elections.filter(
                                    (e) =>
                                      getElectionPhase(
                                        e.startTime,
                                        e.endTime
                                      ) === "Completed"
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
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Actions
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
                                        {phase}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {election.startTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {election.endTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {election.participants}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                                    </td>
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

                        <button className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
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
                        </button>

                        <button className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
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
                        </button>
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
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#023047] focus:border-[#023047]">
                              <option value="">
                                Select an election to view results
                              </option>
                              {elections
                                .filter(
                                  (e) =>
                                    getElectionPhase(e.startTime, e.endTime) ===
                                    "Completed"
                                )
                                .map((election) => (
                                  <option
                                    key={election.electionId}
                                    value={election.electionId}
                                  >
                                    {election.name} (
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
                                Student Council Election
                              </h2>
                              <p className="text-white/80 mb-4">
                                Vote for your student representatives for the
                                2023-2024 academic year
                              </p>
                              <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    Total Votes
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    248
                                  </span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    End Date
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    Oct 15, 2023
                                  </span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                  <span className="block text-sm text-white/70">
                                    Category
                                  </span>
                                  <span className="text-xl font-bold text-white">
                                    Education
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
                                  src="https://randomuser.me/api/portraits/men/32.jpg"
                                  alt="Alex Johnson"
                                  className="w-16 h-16 rounded-full object-cover border-4 border-green-500"
                                />
                                <div className="ml-4">
                                  <div className="font-bold text-gray-900 text-xl">
                                    Alex Johnson
                                  </div>
                                  <div className="text-green-600">
                                    487 votes (39.0%)
                                  </div>
                                  <div className="text-gray-500 mt-1">
                                    President
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
                                  {[
                                    {
                                      id: 1,
                                      name: "Alex Johnson",
                                      votes: 487,
                                      image:
                                        "https://randomuser.me/api/portraits/men/32.jpg",
                                      isWinner: true,
                                    },
                                    {
                                      id: 2,
                                      name: "Sarah Williams",
                                      votes: 365,
                                      image:
                                        "https://randomuser.me/api/portraits/women/44.jpg",
                                      isWinner: false,
                                    },
                                    {
                                      id: 3,
                                      name: "Michael Chen",
                                      votes: 252,
                                      image:
                                        "https://randomuser.me/api/portraits/men/67.jpg",
                                      isWinner: false,
                                    },
                                    {
                                      id: 4,
                                      name: "Jessica Rodriguez",
                                      votes: 144,
                                      image:
                                        "https://randomuser.me/api/portraits/women/33.jpg",
                                      isWinner: false,
                                    },
                                  ].map((candidate) => {
                                    const percentage = (
                                      (candidate.votes / 1248) *
                                      100
                                    ).toFixed(1);

                                    return (
                                      <tr key={candidate.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                              <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={candidate.image}
                                                alt={candidate.electionName}
                                              />
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {candidate.electionName}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">
                                            {candidate.votes}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                            <div
                                              className={`h-2.5 rounded-full ${
                                                candidate.isWinner
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
                                          {candidate.isWinner ? (
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

                          {/* Blockchain Verification */}
                          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="text-lg font-bold text-[#023047] mb-4">
                              Blockchain Verification
                            </h3>
                            <div className="flex items-center mb-4">
                              <div className="bg-green-100 p-2 rounded-full mr-3">
                                <svg
                                  className="w-5 h-5 text-green-600"
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
                              <div>
                                <p className="text-gray-700">
                                  Results verified on blockchain
                                </p>
                                <p className="text-sm text-gray-500">
                                  Last verified: October 16, 2023 at 10:23 AM
                                </p>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-600 break-all">
                              <p>
                                Transaction Hash:
                                0x7d2a5b6c8e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4
                              </p>
                              <p className="mt-2">Block Number: 15482934</p>
                            </div>
                            <div className="mt-4">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  ></path>
                                </svg>
                                View on Blockchain Explorer
                              </button>
                            </div>
                          </div>

                          {/* Export Options */}
                          <div className="mt-8 flex flex-wrap gap-4">
                            <button className="flex items-center px-4 py-2 bg-[#023047] text-white rounded-lg hover:bg-[#023047]/90 transition-colors">
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                ></path>
                              </svg>
                              Export as PDF
                            </button>
                            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              <svg
                                className="w-5 h-5 mr-2"
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
                              Export as CSV
                            </button>
                            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                ></path>
                              </svg>
                              Share Results
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Results Analytics */}
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-xl font-bold text-[#023047]">
                            Voting Analytics
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            Insights and statistics from completed elections
                          </p>
                        </div>

                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Voter Turnout
                              </h3>
                              <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                  <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                      Participation Rate
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                      62.5%
                                    </span>
                                  </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                  <div
                                    style={{ width: "62.5%" }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  248 out of 397 eligible voters participated
                                </p>
                              </div>

                              <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Voting Method
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                      Mobile App
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      68%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-indigo-500 h-1.5 rounded-full"
                                      style={{ width: "68%" }}
                                    ></div>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                      Web Browser
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      32%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-indigo-500 h-1.5 rounded-full"
                                      style={{ width: "32%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Voting Timeline
                              </h3>
                              <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-500 text-center">
                                  [Voting timeline chart would be displayed
                                  here]
                                  <br />
                                  <span className="text-sm">
                                    Shows voting activity over the election
                                    period
                                  </span>
                                </p>
                              </div>
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
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Actions
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
                                          {phase}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {election.startTime} -{" "}
                                          {election.endTime}
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
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                          <button className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                          </button>
                                          {phase !== "Completed" && (
                                            <button className="text-red-600 hover:text-red-900">
                                              Cancel
                                            </button>
                                          )}
                                        </div>
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

                  {activeTab === "users" && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <h2 className="text-xl font-bold text-[#023047]">
                            User Management
                          </h2>
                          <p className="text-gray-500 text-sm mt-1">
                            Manage registered voters and administrators
                          </p>
                        </div>

                        <div className="p-6">
                          <div className="mb-6 flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                Registered Users
                              </h3>
                              <p className="text-sm text-gray-500">
                                Total: 397 users
                              </p>
                            </div>
                            <button className="bg-[#023047] text-white px-4 py-2 rounded-lg hover:bg-[#023047]/90 transition-colors">
                              Add New User
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    User
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Role
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Wallet Address
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
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                  {
                                    id: 1,
                                    name: "John Doe",
                                    email: "john@example.com",
                                    role: "Admin",
                                    walletAddress: "0x1234...5678",
                                    status: "Active",
                                  },
                                  {
                                    id: 2,
                                    name: "Jane Smith",
                                    email: "jane@example.com",
                                    role: "Voter",
                                    walletAddress: "0x8765...4321",
                                    status: "Active",
                                  },
                                  {
                                    id: 3,
                                    name: "Robert Johnson",
                                    email: "robert@example.com",
                                    role: "Voter",
                                    walletAddress: "0x2468...1357",
                                    status: "Inactive",
                                  },
                                  {
                                    id: 4,
                                    name: "Emily Davis",
                                    email: "emily@example.com",
                                    role: "Voter",
                                    walletAddress: "0x1357...2468",
                                    status: "Active",
                                  },
                                ].map((user) => (
                                  <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <img
                                            className="h-10 w-10 rounded-full"
                                            src={`https://randomuser.me/api/portraits/${
                                              user.id % 2 === 0
                                                ? "women"
                                                : "men"
                                            }/${user.id * 10}.jpg`}
                                            alt={user.name}
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {user.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          user.role === "Admin"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {user.role}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {user.walletAddress}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          user.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {user.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                          Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                          Deactivate
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
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
