import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ElectionDetails = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { contract, wallet, isAuthenticated } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingError, setVotingError] = useState(null);

  useEffect(() => {
    // Mock data for the specific election
    const fetchElectionData = async () => {
      const electionData = await contract.elections(Number(electionId));
      // await electionData.wait();
      const candidateData = await contract.getAllCandidates(Number(electionId));
      // await candidateData.wait();
      const formattedElectionData = {
        id: electionData.electionId,
        electionId: Number(electionData.electionId),
        participants: electionData.totalCandidates,
        description: "Null",
        image:
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        name: electionData.electionName,
        startTime: Number(electionData.startTime),
        endTime: Number(electionData.endTime),
        rules: [
          "Each registered voter can cast one vote",
          "Voting period lasts for 7 days",
          "Results will be published immediately after voting ends",
          "All votes are recorded on the blockchain for transparency",
        ],
        isVoting: electionData.votingPhase,
      };
      const formattedData = candidateData.map((cand, index) => ({
        id: Number(index),
        candidateId: Number(cand.candidateId),
        candidateName: cand.candidateName,
        candidateAddress: cand.candidateAddress.toString(),
        voteCount: Number(cand.voteCount),
      }));
      setIsVoting(formattedElectionData.isVoting);
      console.log(formattedElectionData);
      console.log(formattedData);
      setElection(formattedElectionData);
      setCandidates(formattedData);

      // const formatted = activeElections.map((election, index) => ({}));
    };
    const mockElection = {
      electionId: Number(electionId),
      name: "Student Council Election",
      description:
        "Vote for your student representatives for the 2023-2024 academic year. The elected council will represent student interests in administrative decisions and organize campus events.",
      startTime: new Date(Date.now() - 86400000).getTime() / 1000, // Yesterday
      endTime: new Date(Date.now() + 86400000 * 7).getTime() / 1000, // 7 days from now
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      category: "Education",
      participants: 248,
      rules: [
        "Each registered voter can cast one vote",
        "Voting period lasts for 7 days",
        "Results will be published immediately after voting ends",
        "All votes are recorded on the blockchain for transparency",
      ],
    };

    // Mock candidates data
    const mockCandidates = [
      {
        id: 1,
        name: "Alex Johnson",
        position: "President",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        platform: "Improving campus facilities and student welfare programs",
        voteCount: 87,
      },
      {
        id: 2,
        name: "Sarah Williams",
        position: "Vice President",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        platform: "Enhancing academic resources and student representation",
        voteCount: 65,
      },
      {
        id: 3,
        name: "Michael Chen",
        position: "Secretary",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        platform: "Promoting diversity and inclusion in campus activities",
        voteCount: 52,
      },
      {
        id: 4,
        name: "Jessica Rodriguez",
        position: "Treasurer",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        platform:
          "Transparent budget allocation and financial literacy programs",
        voteCount: 41,
      },
    ];

    // setElection(formattedElectionData);
    // setCandidates(mockCandidates);

    // Check if user has already voted (mock implementation)
    fetchElectionData();
    const mockHasVoted = false;
    setHasVoted(mockHasVoted);
  }, [electionId]);

  const handleVote = async () => {
    if (selectedCandidate === null) {
      setVotingError("Please select a candidate to vote");
      return;
    }

    if (!isAuthenticated) {
      setVotingError("Please connect your wallet to vote");
      return;
    }

    // setIsVoting(true);
    setVotingError(null);

    try {
      // Mock voting process with a delay
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const tx = await contract.castVote(Number(electionId), selectedCandidate);
      // await tx.wait();
      alert("Your vote casted successfully!");
      // In a real implementation, this would call the smart contract
      console.log(
        `Voted for candidate ${selectedCandidate} in election ${electionId}`
      );

      setHasVoted(true);
      setIsVoting(false);
    } catch (error) {
      alert("Error voting:", error.reason);
      console.error("Error voting:", error);
      setVotingError("Failed to cast vote. Please try again.");
      setIsVoting(false);
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = Date.now() / 1000;
    const timeLeft = endTime - now;

    if (timeLeft <= 0) return "Voting ended";

    const days = Math.floor(timeLeft / (60 * 60 * 24));
    const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));

    return `${days} days, ${hours} hours remaining`;
  };

  if (!election) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#023047]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#023047] mb-6 hover:underline"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Elections
        </button>

        {/* Election header */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023047]/80 to-gray-700/80 z-10"></div>
          <img
            src={election.image}
            alt={election.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4 inline-block">
                  {election.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {election.name}
                </h1>
                <p className="text-white/80 max-w-2xl">
                  {election.description}
                </p>
              </div>
              <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {election.participants}
                  </div>
                  <div className="text-sm">Participants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Election details and voting section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar with election info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-[#023047] mb-4">
                Election Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium text-green-600">
                      Voting Active
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Time Remaining
                  </h3>
                  <p className="font-medium text-[#023047]">
                    {getTimeRemaining(election.endTime)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Start Date
                  </h3>
                  <p className="font-medium text-[#023047]">
                    {new Date(election.startTime * 1000).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    End Date
                  </h3>
                  <p className="font-medium text-[#023047]">
                    {new Date(election.endTime * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#023047] mb-4">
                Election Rules
              </h2>
              <ul className="space-y-2">
                {election.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#023047] mr-2 mt-0.5"
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
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right section with candidates */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#023047] mb-6">
              Candidates
            </h2>

            {hasVoted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-12 h-12 text-green-500 mr-4"
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
                  <div>
                    <h3 className="text-xl font-bold text-green-800">
                      Vote Successfully Cast!
                    </h3>
                    <p className="text-green-700">
                      Your vote has been recorded on the blockchain and cannot
                      be altered.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-12 h-12 text-blue-500 mr-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800">
                      Ready to Vote?
                    </h3>
                    <p className="text-blue-700">
                      Select a candidate below and submit your vote. This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {votingError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700">{votingError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all p-4 flex cursor-pointer ${
                    selectedCandidate === candidate.id
                      ? "border-l-[#023047] bg-[#023047]/5 shadow-md"
                      : "border-l-gray-200"
                  }`}
                  onClick={() => {
                    if (!hasVoted) {
                      setSelectedCandidate(candidate.id);
                      console.log("Selected candidate:", candidate.id);
                    }
                  }}
                >
                  <div className="relative mr-4">
                    <div
                      className={`w-16 h-16 rounded-full overflow-hidden ${
                        selectedCandidate === candidate.id
                          ? "ring-4 ring-[#023047]/50"
                          : ""
                      }`}
                    >
                      <img
                        src={candidate.image}
                        alt={candidate.candidateName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedCandidate === candidate.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#023047] rounded-full flex items-center justify-center shadow-md animate-pulse">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {candidate.candidateName}
                        </h3>
                        <p className="text-[#023047] text-sm font-medium">
                          {candidate.position}
                        </p>
                      </div>
                      {hasVoted && (
                        <div className="bg-gray-100 rounded-full px-3 py-1">
                          <span className="font-bold text-[#023047]">
                            {candidate.voteCount}
                          </span>
                          <span className="text-gray-500 text-xs ml-1">
                            votes
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{candidate.platform}</p>

                    <div className="mt-3 flex items-center">
                      <div
                        className={`h-1.5 flex-grow rounded-full overflow-hidden ${
                          selectedCandidate === candidate.id
                            ? "bg-gray-200"
                            : "bg-gray-100"
                        }`}
                      >
                        {hasVoted && (
                          <div
                            className="h-full bg-[#023047]"
                            style={{
                              width: `${
                                (candidate.voteCount /
                                  candidates.reduce(
                                    (sum, c) => sum + c.voteCount,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        )}
                      </div>
                      {selectedCandidate === candidate.id && !hasVoted && (
                        <span className="ml-3 text-sm text-[#023047] font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!hasVoted && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleVote}
                  disabled={!isVoting || selectedCandidate === null}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                    isVoting || !selectedCandidate
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#023047] text-white hover:bg-[#023047]/90"
                  }`}
                >
                  {isVoting && (
                    <>
                      Submit Vote
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        ></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;
