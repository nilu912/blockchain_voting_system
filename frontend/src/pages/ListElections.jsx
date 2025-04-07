import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Drawer, Pagination } from "rsuite";
import ManageElections from "./ManageElections";

const ListElections = () => {
  const { contract } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [open, setOpen] = useState(false);

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
        } catch (error) {
          console.error("Error fetching elections:", error);
        }
      };

      console.log("Contract updated!");

      // Initial fetch
      fetchAllElections();

    }, [contract, open]); // include contract in dependency array

  const handleOpen = (election) => {
    setSelectedElection(election);
    setOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🗳️ All Elections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedElections.map((election) => (
          <div
            key={election.id}
            onClick={() => handleOpen(election)}
            className="cursor-pointer border p-4 rounded-xl shadow hover:bg-gray-100 transition"
          >
            <h2 className="text-xl font-semibold">{election.electionName}</h2>
            <p>Total Votes: {election.totalVotes}</p>
            <p>
              Status: {election.isCompleted ? "✅ Completed" : "🕓 Ongoing"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          prev
          last
          next
          first
          size="md"
          total={elections.length}
          limit={limit}
          activePage={activePage}
          onChangePage={setActivePage}
        />
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
