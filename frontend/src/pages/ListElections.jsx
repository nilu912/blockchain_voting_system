import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Drawer, Pagination, ButtonGroup, Button } from "rsuite";
import ManageElections from "./ManageElections";

const ListElections = () => {
  const { contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [open, setOpen] = useState(false);
  const [filteredElections, setFilteredElections] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const limit = 4;
  const paginatedElections = elections.slice(
    (activePage - 1) * limit,
    activePage * limit
  );

  useEffect(() => {
    const fetchAllElections = async () => {
      try {
        const electionsData = await contract.getAllElections();
        const cleanElections = electionsData.map((el, index) => ({
          id: index,
          electionId: Number(el.electionId),
          electionName: el.electionName,
          isActive: el.isActive,
          startTime: new Date(Number(el.startTime) * 1000).toLocaleString(),
          endTime: new Date(Number(el.endTime) * 1000).toLocaleString(),
          totalCandidates: Number(el.totalCandidates),
          totalVoters: Number(el.totalVoters),
          totalVotes: Number(el.totalVotes),
          winnerId: Number(el.winnerId),
          registrationPhase: el.registrationPhase,
          votingPhase: el.votingPhase,
          isCompleted: el.isCompleted,
        }));
        setElections(cleanElections);
        setFilteredElections(cleanElections);

      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };

    console.log("Contract updated!");

    // Initial fetch
    fetchAllElections();
  }, [contract, open]); // include contract in dependency array
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
  

  const handleOpen = (election) => {
    setSelectedElection(election);
    setOpen(true);
  };

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
          key={election.id}
          onClick={() => handleOpen(election)}
          className="group relative bg-gradient-to-br from-[#023047] to-gray-700 rounded-xl overflow-hidden shadow-xl hover:shadow-[#023047]/20 transition-all duration-500 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 z-10"></div>
          <div className="h-56 overflow-hidden bg-blue-100">
            {/* Placeholder for image */}
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🗳️
            </div>
          </div>

          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 bg-[#023047]/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              Election #{election.electionId}
            </span>
          </div>

          <div className="absolute top-4 left-4 z-20">
            <span
              className={`px-3 py-1 backdrop-blur-sm text-white text-xs font-semibold rounded-full ${
                election.isActive ? "bg-green-500/80" : "bg-gray-500/80"
              }`}
            >
              {election.isActive ? "Active" : "Deactive"}
            </span>
          </div>

          <div className="relative z-20 p-6 -mt-6">
            <h2
              className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors"
              style={{ color: "white", opacity: "80%" }}
            >
              {election.electionName}
            </h2>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[
                    ...Array(Math.min(3, election.totalVoters || 1)),
                  ].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white"
                    ></div>
                  ))}
                </div>
                <span className="text-white/70 text-sm ml-2">
                  +{election.totalVoters || 0} voters
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-200 font-medium">
                  {election.totalVotes || 0} votes cast
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
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
              <div className="bg-white/10 rounded-lg p-3">
                <span className="block text-white/70">Candidates</span>
                <span className="text-white">
                  {election.totalCandidates || 0}
                </span>
              </div>
            </div>

            <button className="w-full py-3 rounded-md font-medium shadow-lg bg-white/90 text-indigo-700 hover:bg-white transition-colors flex items-center justify-center group">
              <span>View Details</span>
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





      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        size="full"
        placement="right"
      >
        {selectedElection && (
          <ManageElections
            election={selectedElection}
            eleId={selectedElection.electionId}
            setOpen={setOpen}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ListElections;

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

//     useEffect(() => {
//       const fetchAllElections = async () => {
//         try {
//           const electionsData = await contract.getAllElections();
//           const cleanElections = electionsData.map((el, index) => ({
//             id: index,
//             electionId: Number(el.electionId),
//             electionName: el.electionName,
//             isActive: el.isActive,
//             startTime: new Date(Number(el.startTime) * 1000).toLocaleString(),
//             endTime: new Date(Number(el.endTime) * 1000).toLocaleString(),
//             totalCandidates: Number(el.totalCandidates),
//             totalVoters: Number(el.totalVoters),
//             totalVotes: Number(el.totalVotes),
//             winnerId: Number(el.winnerId),
//             registrationPhase: el.registrationPhase,
//             votingPhase: el.votingPhase,
//             isCompleted: el.isCompleted,
//           }));
//           setElections(cleanElections);
//         } catch (error) {
//           console.error("Error fetching elections:", error);
//         }
//       };

//       console.log("Contract updated!");

//       // Initial fetch
//       fetchAllElections();

//     }, [contract, open]); // include contract in dependency array

//   const handleOpen = (election) => {
//     setSelectedElection(election);
//     setOpen(true);
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">🗳️ All Elections</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {paginatedElections.map((election) => (
//           <div
//             key={election.id}
//             onClick={() => handleOpen(election)}
//             className="cursor-pointer border p-4 rounded-xl shadow hover:bg-gray-100 transition"
//           >
//             <h2 className="text-xl font-semibold">{election.electionName}</h2>
//             <p>Total Votes: {election.totalVotes}</p>
//             <p>
//               Status: {election.isCompleted ? "✅ Completed" : "🕓 Ongoing"}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 flex justify-center">
//         <Pagination
//           prev
//           last
//           next
//           first
//           size="md"
//           total={elections.length}
//           limit={limit}
//           activePage={activePage}
//           onChangePage={setActivePage}
//         />
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
