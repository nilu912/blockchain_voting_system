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
import axios from "axios";
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

const ManageVoters = () => {
  const { contract } = useAuth();
  const { eveId } = useParams();
  const [voter, setVoter] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAllVoterData = async () => {
      try {
        //   const votersData = await contract.getAllVoters(eveId);
        //   console.log(votersData);
        //   const formattedData = votersData.map((cand, index) => ({
        //     id: Number(index),
        //     voterId: Number(cand.voterId),
        //     voterName: cand.voterName,
        //     voterAddress: cand.voterAddress,
        //     voteCount: Number(cand.voteCount),
        //   }));
        const response = await axios.get(
          `http://localhost:5000/api/voter/getVoters/${eveId}`,
          {
            headers: {
              token: sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        // const voters = response.data
        //   ? response.data
        //   : Object.values(response.data);
        console.log(typeof response.data);
        const filteredData = response.data.filter(
          (index) => index.status === "pending"
        );
        console.log(filteredData);
        setData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllVoterData();
  }, [contract]);

  const handleAccept = async (id) => {
    const nextData = [...data];
    const activeItem = nextData.find((item) => item.user_id === id);
    console.log(activeItem);
    try {
      // Update status locally to "accepted"
      activeItem.status = "accepted";
      setData(nextData);
      console.log({
        elec_id: eveId,
        user_id: id,
        status: "accepted",
      });
      //   Make an API call to update status on the backend

      await axios.put("http://localhost:5000/api/voter/updateStatus", {
        elec_id: Number(eveId),
        user_id: activeItem.user_id,
        status: "accepted",
      });
      //   console.log(activeItem.username, Number(eveId), 0, activeItem.wallet_address)
      try {
        const tx = await contract.regVoter(
          activeItem.username,
          Number(eveId),
          0,
          activeItem.wallet_address
        );
        await tx.wait();
        alert("That voter is eligable to vote now!");
      } catch (error) {
        alert(error.reason);
        console.error(error);
      }
      console.log(`Voter with ID ${id} has been accepted.`);
    } catch (error) {
      console.error("Error accepting voter request:", error);
    }
  };

  const handleReject = async (id) => {
    const nextData = [...data];
    const activeItem = nextData.find((item) => item.user_id === id);
    console.log(activeItem);
    try {
      // Update status locally to "accepted"
      activeItem.status = "accepted";
      setData(nextData);
      console.log({
        elec_id: eveId,
        user_id: id,
        status: "denied",
      });
      //   Make an API call to update status on the backend

      await axios.put("http://localhost:5000/api/voter/updateStatus", {
        elec_id: Number(eveId),
        user_id: activeItem.user_id,
        status: "denied",
      });
      console.log(`Voter with ID ${id} has been not accepted.`);
    } catch (error) {
      console.error("Error accepting voter request:", error);
    }
  };

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data);
    nextData.find((item) => item.id === id)[key] = value;
    setData(nextData);
  };
  const handleEdit = async (id) => {
    const nextData = Object.assign([], data);
    const activeItem = nextData.find((item) => item.id === id);
    // console.log(eveId, activeItem.voterName, activeItem.voterAddress);

    try {
      console.log(eveId, activeItem.voterName, activeItem.voterAddress);
      const newVoter = await contract.addVoter(
        eveId,
        activeItem.voterName,
        activeItem.voterAddress
      );
      // isLoading(true);
      await newVoter.wait();
      // isLoading(true);
    } catch (error) {
      alert("Message: " + error);
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
            🗳️ Manage Voters
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Add, edit, or remove voters for Election #{eveId}.
            <span className="block mt-2 text-[#023047] font-medium">
              Double-click on a cell to edit voter information.
            </span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#023047] to-gray-700 p-6">
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-bold text-white"
                style={{ color: "white", opacity: "80%" }}
              >
                Voter List
              </h2>
              <Button
                appearance="primary"
                className="bg-white text-[#023047] hover:bg-gray-100"
                onClick={() => {
                  console.log(data);
                  //   setData([
                  //     {
                  //       voterId: data.length,
                  //       voterName: "",
                  //       voterAddress: "",
                  //       voteCount: 0,
                  //       status: "EDIT",
                  //     },
                  //     ...data,
                  //   ]);
                }}
              >
                Add New Voter
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
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">
                  ID
                </HeaderCell>
                <EditableCell
                  dataKey="user_id"
                  dataType="number"
                  //   onChange={handleChange}
                />
              </Column>

              <Column flexGrow={1}>
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">
                  Voter Name
                </HeaderCell>
                <EditableCell
                  dataKey="username"
                  dataType="string"
                  onChange={handleChange}
                />
              </Column>

              <Column flexGrow={2}>
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">
                  Wallet Address
                </HeaderCell>
                <EditableCell
                  dataKey="wallet_address"
                  dataType="string"
                  onChange={handleChange}
                />
              </Column>

              <Column width={120} align="center">
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">
                  Date
                </HeaderCell>
                <EditableCell
                  dataKey="timestamp"
                  dataType="string"
                  //   onChange={handleChange}
                />
              </Column>

              <Column width={120} fixed="right">
                <HeaderCell className="bg-gray-100 text-[#023047] font-medium">
                  Actions
                </HeaderCell>
                <ActionCell
                  dataKey="id"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </Column>
            </Table>
          </div>
        </div>

        {data.length === 0 && (
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
              No Voters Found
            </h3>
            <p className="text-white/80 max-w-md mx-auto">
              There are currently no voters for this election. Add a new voter
              to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVoters;

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
  const isNonEditable = dataKey === "voterId";
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

const ActionCell = ({ rowData, dataKey, onAccept, onReject, ...props }) => {
  return (
    <Cell {...props} style={{ padding: "6px" }}>
      <div className="flex gap-2 justify-center">
        {rowData.status === "pending" ? (
          <>
            <Button
              appearance="primary"
              color="green"
              size="sm"
              onClick={() => onAccept(rowData.user_id)} // Accept action handler
            >
              Accept
            </Button>
            <Button
              appearance="primary"
              color="red"
              size="sm"
              onClick={() => onReject(rowData.user_id)} // Reject action handler
            >
              Reject
            </Button>
          </>
        ) : (
          <span>{rowData.status}</span> // Display current status if not pending
        )}
      </div>
    </Cell>
  );
};
