import React, { useEffect, useState } from "react";
import { Button, Toggle, InlineEdit, ButtonGroup } from "rsuite";
import useAuth from "../hooks/useAuth";
import { Drawer } from "rsuite";
import { useNavigate } from "react-router-dom";

const electionEventListener = (electionId, message) => {
  alert("Message: " + message.toString());
};
const getWinnerListener = (electionId, message, winnerId) => {
  alert(
    "Message: " +
      message.toString() +
      "And winner id is: " +
      winnerId.toString()
  );
};

const ManageElection = ({ election, eleId, setOpen }) => {
  const { contract } = useAuth();
  const [editMod, setEditMod] = useState(false);
  const [selectedElection, setSelectedElection] = useState(election);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // Add filter state
  const navigate = useNavigate();

  useEffect(() => {
    // Attach listeners
    contract.once("activeElectionEvent", electionEventListener);
    contract.once("deactiveElectionEvent", electionEventListener);
    contract.once("activeRegistrationEvent", electionEventListener);
    contract.once("deactiveRegistrationEvent", electionEventListener);
    contract.once("activeVotingEvent", electionEventListener);
    contract.once("deactiveVotingEvent", electionEventListener);
    contract.once("completeElectionEvent", electionEventListener);
    contract.once("getWinnerEvent", getWinnerListener);

    return () => {
      console.log("Cleaning up listeners");
      contract.off("activeElectionEvent", electionEventListener);
      contract.off("deactiveElectionEvent", electionEventListener);
      contract.off("activeRegistrationEvent", electionEventListener);
      contract.off("deactiveRegistrationEvent", electionEventListener);
      contract.off("activeVotingEvent", electionEventListener);
      contract.off("deactiveVotingEvent", electionEventListener);
      contract.off("completeElectionEvent", electionEventListener);
      contract.off("getWinnerEvent", getWinnerListener);
    };
  }, [contract]);

  const updateElectionData = async () => {
    const data = await contract.elections(eleId);
    setSelectedElection({
      electionId: Number(data.electionId),
      electionName: data.electionName,
      isActive: data.isActive,
      startTime: new Date(Number(data.startTime) * 1000).toLocaleString(),
      endTime: new Date(Number(data.endTime) * 1000).toLocaleString(),
      totalCandidates: Number(data.totalCandidates),
      totalVoters: Number(data.totalVoters),
      totalVotes: Number(data.totalVotes),
      winnerId: Number(data.winnerId),
      registrationPhase: data.registrationPhase,
      votingPhase: data.votingPhase,
      isCompleted: data.isCompleted,
    });
  };

  function toDateTimeLocal(dateString) {
    const date = new Date(dateString);
    const iso = date.toISOString();
    return iso.slice(0, 16);
  }

  const activeElectionHandler = async (electionId) => {
    try {
      const tx = await contract.activeElection(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };

  const deactiveElectionHandler = async (electionId) => {
    try {
      const tx = await contract.deactiveElection(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };

  const registrationPhaseActive = async (electionId) => {
    try {
      const tx = await contract.activeRegistration(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };

  const registrationPhaseDeactive = async (electionId) => {
    try {
      const tx = await contract.deactiveRegistration(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };
  const votingPhaseActive = async (electionId) => {
    try {
      const tx = await contract.activeVoting(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };
  const votingPhaseDeactive = async (electionId) => {
    try {
      const tx = await contract.deactiveVoting(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };
  const completeVoting = async (electionId) => {
    try {
      const tx = await contract.completeElection(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };
  const getElectionWinner = async (electionId) => {
    try {
      const tx = await contract.getWinner(electionId);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      console.log(tx);
      updateElectionData();
    } catch (error) {
      alert(error.reason);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#023047] to-gray-700">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-[#023047]">Processing Transaction</h2>
          <p className="text-gray-600 mt-2">Please wait while we update the election data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Drawer.Header className="bg-gradient-to-r from-[#023047] to-gray-700 text-white">
        <Drawer.Title className="text-xl font-bold">Election Management</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={() => setOpen(false)} appearance="subtle" className="text-white">
            Close
          </Button>
          <Button
            onClick={async () => {
              const electionsData = await contract.getAllElections();
              console.log("abc", electionsData);
              setOpen(false);
            }}
            appearance="primary"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Done
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body className="bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Add filter controls */}
          <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[#023047]">Filter Elections</h3>
              <ButtonGroup>
                <Button 
                  appearance={filterStatus === "all" ? "primary" : "default"}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button 
                  appearance={filterStatus === "active" ? "primary" : "default"}
                  onClick={() => setFilterStatus("active")}
                  color="green"
                >
                  Active
                </Button>
                <Button 
                  appearance={filterStatus === "inactive" ? "primary" : "default"}
                  onClick={() => setFilterStatus("inactive")}
                  color="red"
                >
                  Inactive
                </Button>
              </ButtonGroup>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#023047] to-gray-700 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">🗳️</span>
                {selectedElection.electionName}
              </h2>
              <p className="text-white/80 mt-1">Election #{selectedElection.electionId}</p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  appearance="primary"
                  color="blue"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setOpen(false);
                    navigate(`/electionsDashboard/${selectedElection.electionId}`);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Manage Candidates
                </Button>
                
                {selectedElection.isActive ? (
                  <Button
                    appearance="primary"
                    color="red"
                    className="flex items-center gap-2"
                    onClick={() => deactiveElectionHandler(selectedElection.electionId)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                    Deactivate Election
                  </Button>
                ) : (
                  <Button
                    appearance="ghost"
                    color="green"
                    className="flex items-center gap-2"
                    onClick={() => activeElectionHandler(selectedElection.electionId)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Activate Election
                  </Button>
                )}
                
                <div className="ml-auto flex items-center gap-2">
                  <span className={`text-sm ${editMod ? 'text-blue-600' : 'text-gray-500'}`}>Edit Mode</span>
                  <Toggle
                    checked={editMod}
                    onChange={() => setEditMod(!editMod)}
                    size="md"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-medium text-[#023047] mb-4">Election Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedElection.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedElection.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Registration Phase</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedElection.registrationPhase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedElection.registrationPhase ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Voting Phase</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedElection.votingPhase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedElection.votingPhase ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completion Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedElection.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedElection.isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-medium text-[#023047] mb-4">Election Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-[#023047]">{selectedElection.totalCandidates}</div>
                      <div className="text-sm text-gray-500">Candidates</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-[#023047]">{selectedElection.totalVoters}</div>
                      <div className="text-sm text-gray-500">Registered Voters</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-[#023047]">{selectedElection.totalVotes}</div>
                      <div className="text-sm text-gray-500">Total Votes</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-[#023047]">{selectedElection.winnerId || '-'}</div>
                      <div className="text-sm text-gray-500">Winner ID</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-medium text-[#023047] mb-4">Election Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Start Time</div>
                      {!editMod ? (
                        <div className="font-medium">{selectedElection.startTime}</div>
                      ) : (
                        <input
                          type="datetime-local"
                          value={toDateTimeLocal(selectedElection.startTime)}
                          name="startTime"
                          className="border rounded p-1 text-sm"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">End Time</div>
                      {!editMod ? (
                        <div className="font-medium">{selectedElection.endTime}</div>
                      ) : (
                        <input
                          type="datetime-local"
                          value={toDateTimeLocal(selectedElection.endTime)}
                          name="endTime"
                          className="border rounded p-1 text-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-[#023047] mb-4">Election Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Registration Phase</h4>
                    {selectedElection.registrationPhase ? (
                      <Button
                        block
                        appearance="primary"
                        color="red"
                        onClick={() => registrationPhaseDeactive(selectedElection.electionId)}
                      >
                        Close Registration
                      </Button>
                    ) : (
                      <Button
                        block
                        appearance="ghost"
                        color="blue"
                        onClick={() => registrationPhaseActive(selectedElection.electionId)}
                      >
                        Open Registration
                      </Button>
                    )}
                    
                    <h4 className="font-medium text-gray-700">Voting Phase</h4>
                    {selectedElection.votingPhase ? (
                      <Button
                        block
                        appearance="primary"
                        color="red"
                        onClick={() => votingPhaseDeactive(selectedElection.electionId)}
                      >
                        Close Voting
                      </Button>
                    ) : (
                      <Button
                        block
                        appearance="ghost"
                        color="blue"
                        onClick={() => votingPhaseActive(selectedElection.electionId)}
                      >
                        Open Voting
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Election Completion</h4>
                    {selectedElection.isCompleted ? (
                      <Button
                        block
                        appearance="primary"
                        color="green"
                        onClick={() => getElectionWinner(selectedElection.electionId)}
                      >
                        Publish Results
                      </Button>
                    ) : (
                      <Button
                        block
                        appearance="ghost"
                        color="red"
                        onClick={() => completeVoting(selectedElection.electionId)}
                      >
                        Complete Election
                      </Button>
                    )}
                    
                    {editMod && (
                      <>
                        <h4 className="font-medium text-gray-700">Save Changes</h4>
                        <Button
                          block
                          appearance="primary"
                          color="blue"
                        >
                          Apply Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer.Body>
    </>
  );
};

// If this is a parent component that renders multiple elections, modify it to use the filter
// This would be in a parent component that uses ManageElection
const ManageElections = () => {
  const { contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const [open, setOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await contract.getAllElections();
        setElections(data);
        setFilteredElections(data);
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };

    fetchElections();
  }, [contract]);

  useEffect(() => {
    // Apply both status filter and search filter
    let filtered = [...elections];
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(election => 
        filterStatus === "active" ? election.isActive : !election.isActive
      );
    }
    
    // Apply search filter if there's a search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(election => 
        election.electionName.toLowerCase().includes(query)
      );
    }
    
    setFilteredElections(filtered);
  }, [filterStatus, searchQuery, elections]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#023047]">Manage Elections</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          {/* Status filter buttons */}
          <ButtonGroup>
            <Button 
              appearance={filterStatus === "all" ? "primary" : "default"}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button 
              appearance={filterStatus === "active" ? "primary" : "default"}
              onClick={() => setFilterStatus("active")}
              color="green"
            >
              Active
            </Button>
            <Button 
              appearance={filterStatus === "inactive" ? "primary" : "default"}
              onClick={() => setFilterStatus("inactive")}
              color="red"
            >
              Inactive
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Show message when no elections match filters */}
      {filteredElections.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No elections found</h3>
          <p className="text-gray-500">
            {searchQuery ? 
              `No elections matching "${searchQuery}" were found.` : 
              "No elections match the selected filters."}
          </p>
          <Button 
            appearance="primary" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.map((election) => (
          <div 
            key={election.electionId} 
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => {
              setSelectedElectionId(election.electionId);
              setOpen(true);
            }}
          >
            {/* Election card content remains the same */}
            <div className="bg-gradient-to-r from-[#023047] to-gray-700 p-4 text-white">
              <h2 className="text-xl font-bold">{election.electionName}</h2>
              <p className="text-white/80 text-sm">Election #{election.electionId}</p>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${election.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {election.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Registration</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${election.registrationPhase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {election.registrationPhase ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Voting</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${election.votingPhase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {election.votingPhase ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} size="lg">
        {selectedElectionId !== null && (
          <ManageElection 
            election={elections.find(e => e.electionId === selectedElectionId)} 
            eleId={selectedElectionId}
            setOpen={setOpen}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ManageElections;

// import React, { useState, useEffect } from "react";
// import useAuth from "../hooks/useAuth";
// import { Drawer, Pagination } from "rsuite";
// import ManageElections from "./ManageElections";

// const ListElections = () => {
//   const { contract } = useAuth();
//   const [elections, setElections] = useState([]);
//   const [selectedElection, setSelectedElection] = useState(null);
//   const [open, setOpen] = useState(false);

//   // Pagination
//   const [activePage, setActivePage] = useState(1);
//   const limit = 4;
//   const paginatedElections = elections.slice(
//     (activePage - 1) * limit,
//     activePage * limit
//   );

//   useEffect(() => {
//     const fetchAllElections = async () => {
//       try {
//         const electionsData = await contract.getAllElections();
//         const cleanElections = electionsData.map((el, index) => ({
//           id: index,
//           electionId: Number(el.electionId),
//           electionName: el.electionName,
//           isActive: el.isActive,
//           startTime: new Date(Number(el.startTime) * 1000).toLocaleString(),
//           endTime: new Date(Number(el.endTime) * 1000).toLocaleString(),
//           totalCandidates: Number(el.totalCandidates),
//           totalVoters: Number(el.totalVoters),
//           totalVotes: Number(el.totalVotes),
//           winnerId: Number(el.winnerId),
//           registrationPhase: el.registrationPhase,
//           votingPhase: el.votingPhase,
//           isCompleted: el.isCompleted,
//         }));
//         setElections(cleanElections);
//       } catch (error) {
//         console.error("Error fetching elections:", error);
//       }
//     };

//     console.log("Contract updated!");

//     // Initial fetch
//     fetchAllElections();
//   }, [contract, open]); // include contract in dependency array

//   const handleOpen = (election) => {
//     setSelectedElection(election);
//     setOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-white p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#023047]">
//             🗳️ All Elections
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             View and manage all elections in the blockchain voting system.
//             <span className="block mt-2 text-[#023047] font-medium">
//               Click on an election to see details.
//             </span>
//           </p>
//         </div>

//         {elections.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {paginatedElections.map((election) => (
//                 <div
//                   key={election.id}
//                   onClick={() => handleOpen(election)}
//                   className="group relative bg-gradient-to-br from-[#023047] to-gray-700 rounded-xl overflow-hidden shadow-xl hover:shadow-[#023047]/20 transition-all duration-500 cursor-pointer"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 z-10"></div>
//                   <div className="h-56 overflow-hidden bg-blue-100">
//                     {/* Placeholder for image */}
//                     <div className="w-full h-full flex items-center justify-center text-4xl">
//                       🗳️
//                     </div>
//                   </div>

//                   <div className="absolute top-4 right-4 z-20">
//                     <span className="px-3 py-1 bg-[#023047]/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
//                       Election #{election.electionId}
//                     </span>
//                   </div>

//                   <div className="absolute top-4 left-4 z-20">
//                     <span
//                       className={`px-3 py-1 backdrop-blur-sm text-white text-xs font-semibold rounded-full ${
//                         election.isActive ? "bg-green-500/80" : "bg-gray-500/80"
//                       }`}
//                     >
//                       {election.isActive ? "Active" : "Deactive"}
//                     </span>
//                   </div>

//                   <div className="relative z-20 p-6 -mt-6">
//                     <h2
//                       className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors"
//                       style={{ color: "white", opacity: '80%'}}
//                     >
//                       {election.electionName}
//                     </h2>

//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center">
//                         <div className="flex -space-x-2">
//                           {[
//                             ...Array(Math.min(3, election.totalVoters || 1)),
//                           ].map((_, i) => (
//                             <div
//                               key={i}
//                               className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white"
//                             ></div>
//                           ))}
//                         </div>
//                         <span className="text-white/70 text-sm ml-2">
//                           +{election.totalVoters || 0} voters
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-xs text-blue-200 font-medium">
//                           {election.totalVotes || 0} votes cast
//                         </span>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
//                       <div className="bg-white/10 rounded-lg p-3">
//                         <span className="block text-white/70">Started</span>
//                         <span className="text-white">
//                           {election.startTime.split(",")[0]}
//                         </span>
//                       </div>
//                       <div className="bg-white/10 rounded-lg p-3">
//                         <span className="block text-white/70">Ends</span>
//                         <span className="text-white">
//                           {election.endTime.split(",")[0]}
//                         </span>
//                       </div>
//                       <div className="bg-white/10 rounded-lg p-3">
//                         <span className="block text-white/70">Candidates</span>
//                         <span className="text-white">
//                           {election.totalCandidates || 0}
//                         </span>
//                       </div>
//                     </div>

//                     <button className="w-full py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors flex items-center justify-center group">
//                       <span>View Details</span>
//                       <svg
//                         className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M14 5l7 7m0 0l-7 7m7-7H3"
//                         ></path>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-10 flex justify-center">
//               <Pagination
//                 prev
//                 last
//                 next
//                 first
//                 size="md"
//                 total={elections.length}
//                 limit={limit}
//                 activePage={activePage}
//                 onChangePage={setActivePage}
//                 className="bg-white shadow-md rounded-lg p-2"
//               />
//             </div>
//           </>
//         ) : (
//           <div className="bg-gradient-to-br from-[#023047] to-gray-700 backdrop-blur-sm rounded-xl p-16 text-center shadow-xl">
//             <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
//               <svg
//                 className="w-12 h-12 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 ></path>
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               No Elections Found
//             </h3>
//             <p className="text-white/80 max-w-md mx-auto">
//               There are currently no elections in the system. Create a new
//               election to get started.
//             </p>
//           </div>
//         )}
//       </div>

//       <Drawer
//         open={open}
//         onClose={() => setOpen(false)}
//         size="full"
//         placement="right"
//       >
//         {selectedElection && (
//           <ManageElections
//             election={selectedElection}
//             eleId={selectedElection.electionId}
//             setOpen={setOpen}
//           />
//         )}
//       </Drawer>
//     </div>
//   );
// };

// export default ListElections;

// // import React, { useState, useEffect } from "react";
// // import useAuth from "../hooks/useAuth";
// // import { Drawer, Pagination } from "rsuite";
// // import ManageElections from "./ManageElections";

// // const ListElections = () => {
// //   const { contract } = useAuth();
// //   const [elections, setElections] = useState([]);
// //   const [selectedElection, setSelectedElection] = useState(null);
// //   const [open, setOpen] = useState(false);

// //   // Pagination
// //   const [activePage, setActivePage] = useState(1);
// //   const limit = 4;
// //   const paginatedElections = elections.slice(
// //     (activePage - 1) * limit,
// //     activePage * limit
// //   );

// //     useEffect(() => {
// //       const fetchAllElections = async () => {
// //         try {
// //           const electionsData = await contract.getAllElections();
// //           const cleanElections = electionsData.map((el, index) => ({
// //             id: index,
// //             electionId: Number(el.electionId),
// //             electionName: el.electionName,
// //             isActive: el.isActive,
// //             startTime: new Date(Number(el.startTime) * 1000).toLocaleString(),
// //             endTime: new Date(Number(el.endTime) * 1000).toLocaleString(),
// //             totalCandidates: Number(el.totalCandidates),
// //             totalVoters: Number(el.totalVoters),
// //             totalVotes: Number(el.totalVotes),
// //             winnerId: Number(el.winnerId),
// //             registrationPhase: el.registrationPhase,
// //             votingPhase: el.votingPhase,
// //             isCompleted: el.isCompleted,
// //           }));
// //           setElections(cleanElections);
// //         } catch (error) {
// //           console.error("Error fetching elections:", error);
// //         }
// //       };

// //       console.log("Contract updated!");

// //       // Initial fetch
// //       fetchAllElections();

// //     }, [contract, open]); // include contract in dependency array

// //   const handleOpen = (election) => {
// //     setSelectedElection(election);
// //     setOpen(true);
// //   };

// //   return (
// //     <div className="p-6 max-w-5xl mx-auto">
// //       <h1 className="text-3xl font-bold mb-4">🗳️ All Elections</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         {paginatedElections.map((election) => (
// //           <div
// //             key={election.id}
// //             onClick={() => handleOpen(election)}
// //             className="cursor-pointer border p-4 rounded-xl shadow hover:bg-gray-100 transition"
// //           >
// //             <h2 className="text-xl font-semibold">{election.electionName}</h2>
// //             <p>Total Votes: {election.totalVotes}</p>
// //             <p>
// //               Status: {election.isCompleted ? "✅ Completed" : "🕓 Ongoing"}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="mt-6 flex justify-center">
// //         <Pagination
// //           prev
// //           last
// //           next
// //           first
// //           size="md"
// //           total={elections.length}
// //           limit={limit}
// //           activePage={activePage}
// //           onChangePage={setActivePage}
// //         />
// //       </div>

// //       <Drawer
// //         open={open}
// //         onClose={() => setOpen(false)}
// //         size="full"
// //         placement="right"
// //       >
// //         {selectedElection && (
// //           <ManageElections
// //             election={selectedElection}
// //             eleId={selectedElection.electionId}
// //             setOpen={setOpen}
// //           />
// //         )}
// //       </Drawer>
// //     </div>
// //   );
// // };

// // export default ListElections;
