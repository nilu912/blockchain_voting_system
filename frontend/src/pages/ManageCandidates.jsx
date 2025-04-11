import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Table,
  Button,
  IconButton,
  Input,
  DatePicker,
  InputNumber,
} from "rsuite";
import { VscEdit, VscSave, VscRemove } from "react-icons/vsc";
// import { mockUsers } from './mock';

const { Column, HeaderCell, Cell } = Table;
// const defaultData = mockUsers(8);

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`;

const ManageCandidates = () => {
  const { contract } = useAuth();
  const { eveId } = useParams();
  const [candidate, setCandidate] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAllCandidateData = async () => {
      try {
        const candidatesData = await contract.getAllCandidates(eveId);
        console.log(candidatesData);
        const formattedData = candidatesData.map((cand, index) => ({
          id: Number(index),
          candidateId: Number(cand.candidateId),
          candidateName: cand.candidateName,
          candidateAddress: cand.candidateAddress,
          voteCount: Number(cand.voteCount),
        }));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllCandidateData();
  }, [contract]);

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data);
    nextData.find((item) => item.id === id)[key] = value;
    setData(nextData);
  };
  const handleEdit = async (id) => {
    const nextData = Object.assign([], data);
    const activeItem = nextData.find((item) => item.id === id);
    // console.log(eveId, activeItem.candidateName, activeItem.candidateAddress);

    try {
      console.log(eveId, activeItem.candidateName, activeItem.candidateAddress);
      const newCandidate = await contract.addCandidate(
        eveId,
        activeItem.candidateName,
        activeItem.candidateAddress
      );
      // isLoading(true);
      await newCandidate.wait();
      // isLoading(true);
    } catch (error) {
      alert("Message: " + error.reason);
      console.error(error);
    }
    activeItem.status = activeItem.status ? null : "EDIT";

    setData(nextData);
  };

  const handleRemove = (id) => {
    // setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#023047]">
            🗳️ Manage Candidates
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Add, edit, or remove candidates for Election #{eveId}.
            <span className="block mt-2 text-[#023047] font-medium">Double-click on a cell to edit candidate information.</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#023047] to-gray-700 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white" style={{color: 'white', opacity: '80%'}}>Candidate List</h2>
              <Button
                appearance="primary"
                className="bg-white text-[#023047] hover:bg-gray-100"
                onClick={() => {
                  console.log(data);
                  setData([
                    {
                      candidateId: data.length,
                      candidateName: "",
                      candidateAddress: "",
                      voteCount: 0,
                      status: "EDIT",
                    },
                    ...data,
                  ]);
                }}
              >
                Add New Candidate
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <style>{styles}</style>
            <Table 
              height={420} 
              data={data}
              autoHeight
              hover={true}
              bordered
              cellBordered
              wordWrap
              className="rounded-lg overflow-hidden"
            >
              <Column width={100} align="center">
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">ID</HeaderCell>
                <EditableCell
                  dataKey="candidateId"
                  dataType="number"
                  onChange={handleChange}
                />
              </Column>

              <Column flexGrow={1}>
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">Candidate Name</HeaderCell>
                <EditableCell
                  dataKey="candidateName"
                  dataType="string"
                  onChange={handleChange}
                />
              </Column>

              <Column flexGrow={2}>
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">Wallet Address</HeaderCell>
                <EditableCell
                  dataKey="candidateAddress"
                  dataType="string"
                  onChange={handleChange}
                />
              </Column>
              
              <Column width={120} align="center">
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">Votes</HeaderCell>
                <EditableCell
                  dataKey="voteCount"
                  dataType="number"
                  onChange={handleChange}
                />
              </Column>

              <Column width={120} fixed="right">
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">Actions</HeaderCell>
                <ActionCell
                  dataKey="id"
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              </Column>
            </Table>
          </div>
        </div>
        
        {data.length === 0 && (
          <div className="bg-gradient-to-br from-[#023047] to-gray-700 backdrop-blur-sm rounded-xl p-16 text-center shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Candidates Found</h3>
            <p className="text-white/80 max-w-md mx-auto">There are currently no candidates for this election. Add a new candidate to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCandidates;

function toValueString(value, dataType) {
  return dataType === "date" ? value?.toLocaleDateString() : value;
}

const fieldMap = {
  string: Input,
  number: InputNumber,
  date: DatePicker,
};

const EditableCell = ({
  rowData,
  dataType,
  dataKey,
  onChange,
  onEdit,
  ...props
}) => {
  const editing = rowData.status === "EDIT";
  const isNonEditable = dataKey === "candidateId";
  const isNonEditable1 = dataKey === "voteCount";

  const Field = fieldMap[dataType];
  const value = rowData[dataKey];
  const text = toValueString(value, dataType);

  return (
    <Cell
      {...props}
      className={editing ? "table-cell-editing" : ""}
      onDoubleClick={() => {
        onEdit?.(rowData.id);
      }}
    >
      {editing && !isNonEditable && !isNonEditable1 ? (
        <Field
          defaultValue={value}
          onChange={(value) => {
            onChange?.(rowData.id, dataKey, value);
          }}
        />
      ) : (
        text
      )}
    </Cell>
  );
};

const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
  return (
    <Cell {...props} style={{ padding: "6px" }}>
      <div className="flex gap-2 justify-center">
        <IconButton
          appearance="primary"
          size="sm"
          icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
          onClick={() => {
            onEdit(rowData.id);
          }}
          className={rowData.status === "EDIT" ? "bg-green-500" : "bg-blue-500"}
        />
        <IconButton
          appearance="primary"
          color="red"
          size="sm"
          icon={<VscRemove />}
          onClick={() => {
            onRemove(rowData.id);
          }}
        />
      </div>
    </Cell>
  );
};



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import {
//   Table,
//   Button,
//   IconButton,
//   Input,
//   DatePicker,
//   InputNumber,
// } from "rsuite";
// import { VscEdit, VscSave, VscRemove } from "react-icons/vsc";
// // import { mockUsers } from './mock';

// const { Column, HeaderCell, Cell } = Table;
// // const defaultData = mockUsers(8);

// const styles = `
// .table-cell-editing .rs-table-cell-content {
//   padding: 4px;
// }
// .table-cell-editing .rs-input {
//   width: 100%;
// }
// `;

// const ManageCandidates = () => {
//   const { contract } = useAuth();
//   const { eveId } = useParams();
//   const [candidate, setCandidate] = useState([]);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchAllCandidateData = async () => {
//       try {
//         const candidatesData = await contract.getAllCandidates(eveId);
//         console.log(candidatesData);
//         const formattedData = candidatesData.map((cand, index) => ({
//           id: Number(index),
//           candidateId: Number(cand.candidateId),
//           candidateName: cand.candidateName,
//           candidateAddress: cand.candidateAddress,
//           voteCount: Number(cand.voteCount),
//         }));
//         setData(formattedData);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchAllCandidateData();
//   }, [contract]);

//   const handleChange = (id, key, value) => {
//     const nextData = Object.assign([], data);
//     nextData.find((item) => item.id === id)[key] = value;
//     setData(nextData);
//   };
//   const handleEdit = async (id) => {
//     const nextData = Object.assign([], data);
//     const activeItem = nextData.find((item) => item.id === id);
//     // console.log(eveId, activeItem.candidateName, activeItem.candidateAddress);

//     try {
//       console.log(eveId, activeItem.candidateName, activeItem.candidateAddress);
//       const newCandidate = await contract.addCandidate(
//         eveId,
//         activeItem.candidateName,
//         activeItem.candidateAddress
//       );
//       // isLoading(true);
//       await newCandidate.wait();
//       // isLoading(true);
//     } catch (error) {
//       alert("Message: " + error);
//       console.error(error);
//     }
//     activeItem.status = activeItem.status ? null : "EDIT";

//     setData(nextData);
//   };

//   const handleRemove = (id) => {
//     // setData(data.filter((item) => item.id !== id));
//   };

//   return (
//     <div className="bg-blue-500 flex flex-col my-auto">
//       <div className="border-1 bg-gray-100 m-8 p-8 flex w-auto h-screen rounded-md">
//         <div className="bg-blue-100 border-1 w-screen h-auto rounded-md">
//           <h1 className="p-4">Candidate List</h1>
//           <div>
//             <style>{styles}</style>

//             <Button
//               onClick={() => {
//                 console.log(data);
//                 setData([
//                   {
//                     candidateId: data.length,
//                     candidateName: "",
//                     candidateAddress: "",
//                     voteCount: 0,
//                     status: "EDIT",
//                   },
//                   ...data,
//                 ]);
//               }}
//             >
//               Add record
//             </Button>
//             <hr />
//             <Table height={420} data={data}>
//               <Column flexGrow={1}>
//                 <HeaderCell>Candidate Id</HeaderCell>
//                 <EditableCell
//                   dataKey="candidateId"
//                   dataType="number"
//                   onChange={handleChange}
//                   //   onEdit={handleEdit}
//                 />
//               </Column>

//               <Column width={200}>
//                 <HeaderCell>Candidate Name</HeaderCell>
//                 <EditableCell
//                   dataKey="candidateName"
//                   dataType="string"
//                   onChange={handleChange}
//                   //   onEdit={handleEdit}
//                 />
//               </Column>

//               <Column width={200}>
//                 <HeaderCell>Candidate Address</HeaderCell>
//                 <EditableCell
//                   dataKey="candidateAddress"
//                   dataType="string"
//                   onChange={handleChange}
//                   //   onEdit={handleEdit}
//                 />
//               </Column>
//               <Column width={200}>
//                 <HeaderCell>Vote Count</HeaderCell>
//                 <EditableCell
//                   dataKey="voteCount"
//                   dataType="number"
//                   onChange={handleChange}
//                   //   onEdit={handleEdit}
//                 />
//               </Column>

//               <Column width={100}>
//                 <HeaderCell>Action</HeaderCell>
//                 <ActionCell
//                   dataKey="id"
//                   onEdit={handleEdit}
//                   onRemove={handleRemove}
//                 />
//               </Column>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageCandidates;

// function toValueString(value, dataType) {
//   return dataType === "date" ? value?.toLocaleDateString() : value;
// }

// const fieldMap = {
//   string: Input,
//   number: InputNumber,
//   date: DatePicker,
// };

// const EditableCell = ({
//   rowData,
//   dataType,
//   dataKey,
//   onChange,
//   onEdit,
//   ...props
// }) => {
//   const editing = rowData.status === "EDIT";
//   const isNonEditable = dataKey === "candidateId";
//   const isNonEditable1 = dataKey === "voteCount";

//   const Field = fieldMap[dataType];
//   const value = rowData[dataKey];
//   const text = toValueString(value, dataType);

//   return (
//     <Cell
//       {...props}
//       className={editing ? "table-cell-editing" : ""}
//       onDoubleClick={() => {
//         onEdit?.(rowData.id);
//       }}
//     >
//       {editing && !isNonEditable && !isNonEditable1 ? (
//         <Field
//           defaultValue={value}
//           onChange={(value) => {
//             onChange?.(rowData.id, dataKey, value);
//           }}
//         />
//       ) : (
//         text
//       )}
//     </Cell>
//   );
// };

// const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
//   return (
//     <Cell {...props} style={{ padding: "6px", display: "flex", gap: "4px" }}>
//       <IconButton
//         appearance="subtle"
//         icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
//         onClick={() => {
//           onEdit(rowData.id);
//         }}
//       />
//       <IconButton
//         appearance="subtle"
//         icon={<VscRemove />}
//         onClick={() => {
//           onRemove(rowData.id);
//         }}
//       />
//     </Cell>
//   );
// };
