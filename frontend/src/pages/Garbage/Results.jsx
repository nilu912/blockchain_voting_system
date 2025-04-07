import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for completed elections
    const fetchCompletedElections = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockElections = [
          {
            id: 1,
            name: "Student Council Election 2023",
            description: "Results for the 2023 student council representatives",
            endDate: "October 15, 2023",
            totalVotes: 1248,
            image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: "Education",
            candidates: [
              { id: 1, name: "Alex Johnson", position: "President", votes: 487, image: "https://randomuser.me/api/portraits/men/32.jpg" },
              { id: 2, name: "Sarah Williams", position: "Vice President", votes: 365, image: "https://randomuser.me/api/portraits/women/44.jpg" },
              { id: 3, name: "Michael Chen", position: "Secretary", votes: 252, image: "https://randomuser.me/api/portraits/men/67.jpg" },
              { id: 4, name: "Jessica Rodriguez", position: "Treasurer", votes: 144, image: "https://randomuser.me/api/portraits/women/33.jpg" },
            ]
          },
          {
            id: 2,
            name: "Community Board Election",
            description: "Results for the neighborhood community board election",
            endDate: "September 30, 2023",
            totalVotes: 856,
            image: "https://images.unsplash.com/photo-1577985051167-0d49eec21977?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: "Community",
            candidates: [
              { id: 1, name: "Robert Wilson", position: "Board Chair", votes: 312, image: "https://randomuser.me/api/portraits/men/52.jpg" },
              { id: 2, name: "Emily Parker", position: "Vice Chair", votes: 287, image: "https://randomuser.me/api/portraits/women/28.jpg" },
              { id: 3, name: "David Thompson", position: "Secretary", votes: 257, image: "https://randomuser.me/api/portraits/men/22.jpg" },
            ]
          },
          {
            id: 3,
            name: "Club President Election",
            description: "Results for the annual club president election",
            endDate: "August 15, 2023",
            totalVotes: 124,
            image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: "Club",
            candidates: [
              { id: 1, name: "Jennifer Adams", position: "President", votes: 68, image: "https://randomuser.me/api/portraits/women/65.jpg" },
              { id: 2, name: "Thomas Brown", position: "President", votes: 56, image: "https://randomuser.me/api/portraits/men/41.jpg" },
            ]
          }
        ];

        setElections(mockElections);
        // Set the first election as selected by default
        setSelectedElection(mockElections[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setLoading(false);
      }
    };

    fetchCompletedElections();
  }, []);

  // Calculate percentage of votes for a candidate
  const calculatePercentage = (votes, totalVotes) => {
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  // Determine the winner(s) of the election
  const getWinners = (candidates) => {
    if (!candidates || candidates.length === 0) return [];
    
    const maxVotes = Math.max(...candidates.map(c => c.votes));
    return candidates.filter(c => c.votes === maxVotes);
  };

  // Group candidates by position
  const getCandidatesByPosition = (candidates) => {
    const positions = {};
    
    candidates.forEach(candidate => {
      if (!positions[candidate.position]) {
        positions[candidate.position] = [];
      }
      positions[candidate.position].push(candidate);
    });
    
    return positions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#023047]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#023047] mb-8 text-center">Election Results</h1>
        
        {/* Election selector */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {elections.map(election => (
              <div
                key={election.id}
                className={`cursor-pointer rounded-xl overflow-hidden shadow-md transition-all ${
                  selectedElection?.id === election.id 
                    ? 'ring-2 ring-[#023047] transform scale-[1.02]' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedElection(election)}
              >
                <div className="relative h-32">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#023047]/80 to-transparent"></div>
                  <img 
                    src={election.image} 
                    alt={election.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold">{election.name}</h3>
                    <p className="text-white/80 text-sm">{election.totalVotes} votes • {election.endDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedElection && (
          <div>
            {/* Election header */}
            <div className="bg-gradient-to-r from-[#023047] to-gray-700 rounded-xl overflow-hidden mb-8">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedElection.name}</h2>
                <p className="text-white/80 mb-4">{selectedElection.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="block text-sm text-white/70">Total Votes</span>
                    <span className="text-xl font-bold text-white">{selectedElection.totalVotes}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="block text-sm text-white/70">End Date</span>
                    <span className="text-xl font-bold text-white">{selectedElection.endDate}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="block text-sm text-white/70">Category</span>
                    <span className="text-xl font-bold text-white">{selectedElection.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overall Winner */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-[#023047] mb-4">Election Winner</h3>
              
              {/* Winner announcement */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-100">
                <h4 className="text-lg font-bold text-green-800 mb-2">Winner:</h4>
                {(() => {
                  // Find the candidate with the most votes across all positions
                  const allCandidates = selectedElection.candidates;
                  const winner = allCandidates.reduce((prev, current) => 
                    (prev.votes > current.votes) ? prev : current
                  );
                  
                  return (
                    <div className="flex items-center">
                      <img 
                        src={winner.image} 
                        alt={winner.name} 
                        className="w-16 h-16 rounded-full object-cover border-4 border-green-500"
                      />
                      <div className="ml-4">
                        <div className="font-bold text-gray-900 text-xl">{winner.name}</div>
                        <div className="text-green-600">
                          {winner.votes} votes ({calculatePercentage(winner.votes, selectedElection.totalVotes)}%)
                        </div>
                        <div className="text-gray-500 mt-1">{winner.position}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Detailed results */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Votes
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedElection.candidates.sort((a, b) => b.votes - a.votes).map(candidate => {
                        const isWinner = candidate === selectedElection.candidates.reduce((prev, current) => 
                          (prev.votes > current.votes) ? prev : current
                        );
                        const percentage = calculatePercentage(candidate.votes, selectedElection.totalVotes);
                        
                        return (
                          <tr key={candidate.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={candidate.image} 
                                    alt={candidate.name} 
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{candidate.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{candidate.votes}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div 
                                  className={`h-2.5 rounded-full ${isWinner ? 'bg-green-500' : 'bg-[#023047]'}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-sm text-gray-500">{percentage}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isWinner ? (
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
            
            {/* Blockchain verification section */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-8">
              <h3 className="text-xl font-bold text-[#023047] mb-4">Blockchain Verification</h3>
              <p className="text-gray-700 mb-4">
                These results are permanently recorded on the blockchain and cannot be altered. 
                Each vote has been cryptographically verified for authenticity.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction Hash</h4>
                  <p className="font-mono text-sm text-gray-800 truncate">0x7f9e8d7c6b5a4e3f2d1c0b9a8e7d6c5b4a3f2e1d</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Block Number</h4>
                  <p className="font-mono text-sm text-gray-800">15,782,341</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-[#023047] font-medium hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  View on Blockchain Explorer
                </button>
              </div>
            </div>
            
            {/* Download and share section */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 bg-[#023047] text-white rounded-lg font-medium flex items-center shadow-md hover:bg-[#023047]/90 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Results
              </button>
              <button className="px-6 py-3 bg-white text-[#023047] border border-[#023047] rounded-lg font-medium flex items-center shadow-sm hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Share Results
              </button>
              <button 
                className="px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg font-medium flex items-center shadow-sm hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/elections')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                </svg>
                Back to Elections
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;