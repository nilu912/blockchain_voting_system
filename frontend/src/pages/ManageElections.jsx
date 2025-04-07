import React, { useEffect, useState } from "react";
import { Button, Toggle, InlineEdit } from "rsuite";
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
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Election Details</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              const electionsData = await contract.getAllElections();
              console.log("abc", electionsData);
            }}
            appearance="primary"
          >
            Confirm
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
        <div className="mt-8 border-t pt-6 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.01] duration-300">
            <div className="flex">
              <h2 className="text-3xl whitespace-nowrap pb-5 font-semibold text-blue-700 flex items-center gap-2 mb-4">
                📋 Election Details:
              </h2>
              <div className="flex justify-between pb-2 w-full">
                <h2>
                  <span className="pl-2 text-gray-800">
                    {selectedElection.electionName}
                  </span>
                </h2>
                <div className="flex gap-10 m-4">
                  <Button
                    className="mr-2 ml-2"
                    color="green"
                    appearance="primary"
                    onClick={() => {
                      setOpen(false);
                      navigate(
                        `/electionsDashboard/${selectedElection.electionId}`
                      );
                    }}
                  >
                    Manage Candidates
                  </Button>
                  {selectedElection.isActive ? (
                    <Button
                      className="mr-2 ml-2"
                      color="green"
                      appearance="primary"
                      onClick={() => {
                        deactiveElectionHandler(selectedElection.electionId);
                      }}
                    >
                      Click To Deactive Election
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        activeElectionHandler(selectedElection.electionId);
                      }}
                      color="green"
                      appearance="ghost"
                    >
                      Click To Active Election
                    </Button>
                  )}
                  <Toggle
                    className="my-auto"
                    checked={editMod}
                    onChange={() => setEditMod(!editMod)}
                    checkedChildren="Close Edit Mode"
                    unCheckedChildren="Open Edit Mode"
                  />
                </div>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 text-base">
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">🆔 Election ID:</span>

                <InlineEdit
                  defaultValue={parseInt(selectedElection.electionId)}
                  disabled={!editMod}
                />
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">🕒 Start Time:</span>
                {!editMod ? (
                  <span>{selectedElection.startTime}</span>
                ) : (
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(selectedElection.startTime)}
                    name="startTime"
                    className="border rounded"
                  />
                )}
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">⏰ End Time:</span>
                {!editMod ? (
                  <span>{selectedElection.endTime}</span>
                ) : (
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(selectedElection.endTime)}
                    name="startTime"
                    className="border rounded"
                  />
                )}
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">👤 Total Candidates:</span>
                <span>{selectedElection.totalCandidates}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">🗳️ Total Voters:</span>
                <span>{selectedElection.totalVoters}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">✅ Total Votes:</span>
                <span>{selectedElection.totalVotes}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">🏆 Winner ID:</span>
                <span>{selectedElection.winnerId}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">📝 Registration Phase:</span>
                <span
                  className={
                    selectedElection.registrationPhase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {selectedElection.registrationPhase ? (
                    <Button
                      color="green"
                      onClick={() => {
                        registrationPhaseDeactive(selectedElection.electionId);
                      }}
                      appearance="primary"
                    >
                      Deactive
                    </Button>
                  ) : (
                    <Button
                      color="red"
                      onClick={() => {
                        registrationPhaseActive(selectedElection.electionId);
                      }}
                      appearance="ghost"
                    >
                      Activate
                    </Button>
                  )}
                </span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">🗳️ Voting Phase:</span>
                <span
                  className={
                    selectedElection.votingPhase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {selectedElection.votingPhase ? (
                    <Button
                      onClick={() => {
                        votingPhaseDeactive(selectedElection.electionId);
                      }}
                      color="green"
                      appearance="primary"
                    >
                      Click to deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        votingPhaseActive(selectedElection.electionId);
                      }}
                      color="red"
                      appearance="ghost"
                    >
                      Click to Active
                    </Button>
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">📦 Completed:</span>
                <span
                  className={
                    selectedElection.isCompleted
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {selectedElection.isCompleted ? (
                    <Button
                      onClick={() => {
                        getElectionWinner(selectedElection.electionId);
                      }}
                      color="green"
                      appearance="primary"
                    >
                      Click to publish result
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        completeVoting(selectedElection.electionId);
                      }}
                      color="red"
                      appearance="ghost"
                    >
                      Not yet
                    </Button>
                  )}
                </span>
              </li>
            </ul>
            <div>
              {editMod && (
                <div className="w-full flex justify-end mt-5">
                  <Button color="blue" appearance="primary">
                    Click to apply changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer.Body>
    </>
  );
};

export default ManageElection;

// import React, { useState, useEffect } from "react";
// import useAuth from "../hooks/useAuth";
// import { Pagination } from "rsuite";
// import { Drawer, Button, Toggle, InlineEdit } from "rsuite";

// const ManageElections = (props) => {
//   const { contract } = useAuth();
//   const [selectedElection, setSelectedElection] = useState(null);
//   const [size, setSize] = useState();
//   const [open, setOpen] = useState(false);
//   const [placement, setPlacement] = useState("right");
//   const [editMod, setEditMod] = useState(false);
//   // Pagination state

//   useEffect(() => {
//       const fetchAllElections = async () => {
//         try {
//           const electionsData = await contract.getAllElections();
//           console.log(electionsData);
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
//     fetchAllElections();
//   }, []);

//         // Calculate which elections to show for current page
//         const handleOpen = async (election) => {
//           setSelectedElection(election);
//           setSize("full");
//           setOpen(true);
//         };
//         function toDateTimeLocal(dateString) {
//           const date = new Date(dateString);
//           const iso = date.toISOString();
//           return iso.slice(0, 16);
//         }
//   const activeElectionHandler = async (electionId) => {
//     try {
//       await contract.activeElection(electionId);
//       setSelectedElection({ isActive: true });
//       alert("This Election is Active now!");
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const deactiveElectionHandler = async (electionId) => {
//     try {
//       await contract.deactiveElection(electionId);
//       setSelectedElection({ isActive: false });
//       alert("This Election is Deactive now!");
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const registrationPhaseActive = async (electionId) => {
//     try {
//         await contract.activeRegistration(electionId);
//         setSelectedElection({ registrationPhase: true });
//         alert("Registraion phase now active!");
//       } catch (error) {
//         console.error(error);
//       }
//   }
//   const registrationPhaseDeactive = async (electionId) => {
//     try {
//         await contract.deactiveRegistration(electionId);
//         setSelectedElection({ registrationPhase: true });
//         alert("Registraion phase now deactive!");
//       } catch (error) {
//         console.error(error);
//       }
//   }
//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <Drawer
//         size={size}
//         placement={placement}
//         open={open}
//         onClose={() => setOpen(false)}
//       >
//         <Drawer.Header>
//           <Drawer.Title>Drawer Title</Drawer.Title>
//           <Drawer.Actions>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button
//               onClick={async () => {
//                 const electionsData = await contract.getAllElections();
//                 console.log("abc", electionsData);
//               }}
//               appearance="primary"
//             >
//               Confirm
//             </Button>
//           </Drawer.Actions>
//         </Drawer.Header>
//         <Drawer.Body>
//           {selectedElection && (
//             <div className="mt-8 border-t pt-6 flex flex-col h-full">
//               <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.01] duration-300">
//                 <div className="flex">
//                   <h2 className="text-3xl whitespace-nowrap pb-5 font-semibold text-blue-700 flex items-center gap-2 mb-4">
//                     📋 Election Details:
//                   </h2>
//                   <div className="flex justify-between pb-2 w-full">
//                     <h2>
//                       <span className="pl-2 text-gray-800">
//                         {selectedElection.electionName}
//                       </span>
//                     </h2>
//                     <div className="flex gap-10 m-4">
//                       {selectedElection.isActive ? (
//                         <Button
//                           className="mr-2 ml-2"
//                           color="green"
//                           appearance="primary"
//                           onClick={() => {
//                             deactiveElectionHandler(
//                               selectedElection.electionId
//                             );
//                           }}
//                         >
//                           Click To Deactive Election
//                         </Button>
//                       ) : (
//                         <Button
//                           onClick={() => {
//                             activeElectionHandler(selectedElection.electionId);
//                           }}
//                           color="green"
//                           appearance="ghost"
//                         >
//                           Click To Active Election
//                         </Button>
//                       )}
//                       <Toggle
//                         className="my-auto"
//                         onClick={() => setEditMod(!editMod)}
//                         checkedChildren="Close Edit Mode"
//                         unCheckedChildren="Open Edit Mode"
//                         defaultChecked
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <ul className="space-y-3 text-gray-700 text-base">
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">🆔 Election ID:</span>

//                     <InlineEdit
//                       defaultValue={selectedElection.electionId}
//                       disabled={!editMod}
//                     />
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">🕒 Start Time:</span>
//                     {!editMod ? (
//                       <span>{selectedElection.startTime}</span>
//                     ) : (
//                       <input
//                         type="datetime-local"
//                         value={toDateTimeLocal(selectedElection.startTime)}
//                         name="startTime"
//                         className="border rounded"
//                       />
//                     )}
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">⏰ End Time:</span>
//                     {!editMod ? (
//                       <span>{selectedElection.endTime}</span>
//                     ) : (
//                       <input
//                         type="datetime-local"
//                         value={toDateTimeLocal(selectedElection.endTime)}
//                         name="startTime"
//                         className="border rounded"
//                       />
//                     )}
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">👤 Total Candidates:</span>
//                     <span>{selectedElection.totalCandidates}</span>
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">🗳️ Total Voters:</span>
//                     <span>{selectedElection.totalVoters}</span>
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">✅ Total Votes:</span>
//                     <span>{selectedElection.totalVotes}</span>
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">🏆 Winner ID:</span>
//                     <span>{selectedElection.winnerId}</span>
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">📝 Registration Phase:</span>
//                     <span
//                       className={
//                         selectedElection.registrationPhase
//                           ? "text-green-600"
//                           : "text-red-500"
//                       }
//                     >
//                       {selectedElection.registrationPhase ? (
//                         <Button color="green" onClick={() => { registrationPhaseDeactive(selectedElection.electionId)}} appearance="primary">
//                           Deactive
//                         </Button>
//                       ) : (
//                         <Button color="red" onClick={() => { registrationPhaseActive(selectedElection.electionId)}} appearance="ghost">
//                           Activate
//                         </Button>
//                       )}
//                     </span>
//                   </li>
//                   <li className="flex justify-between border-b pb-2">
//                     <span className="font-medium">🗳️ Voting Phase:</span>
//                     <span
//                       className={
//                         selectedElection.votingPhase
//                           ? "text-green-600"
//                           : "text-red-500"
//                       }
//                     >
//                       {selectedElection.votingPhase ? (
//                         <Button color="green" appearance="primary">
//                           Active
//                         </Button>
//                       ) : (
//                         <Button color="red" appearance="ghost">
//                           Deactive
//                         </Button>
//                       )}
//                     </span>
//                   </li>
//                   <li className="flex justify-between">
//                     <span className="font-medium">📦 Completed:</span>
//                     <span
//                       className={
//                         selectedElection.isCompleted
//                           ? "text-green-600"
//                           : "text-red-500"
//                       }
//                     >
//                       {selectedElection.isCompleted ? (
//                         <Button color="green" appearance="primary">
//                           Successfully
//                         </Button>
//                       ) : (
//                         <Button color="red" appearance="ghost">
//                           Not yet
//                         </Button>
//                       )}
//                     </span>
//                   </li>
//                 </ul>
//                 <div>
//                   {editMod && (
//                     <div className="w-full flex justify-end mt-5">
//                       <Button color="blue" appearance="primary">
//                         Click to apply changes
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </Drawer.Body>
//       </Drawer>
//       <h1 className="text-3xl font-bold mb-4">🗳️ All Elections</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {paginatedElections.map((election) => (
//           <div
//             key={election.id}
//             // onClick={() => {setSelectedElection(election); handleOpen()}}
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

//       {/* Pagination Control */}
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
//     </div>
//   );
// };

// export default ManageElections;
