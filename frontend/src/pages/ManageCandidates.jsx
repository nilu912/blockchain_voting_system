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
    <div className="bg-blue-500 flex flex-col my-auto">
      <div className="border-1 bg-gray-100 m-8 p-8 flex w-auto h-screen rounded-md">
        <div className="bg-blue-100 border-1 w-screen h-auto rounded-md">
          <h1 className="p-4">Candidate List</h1>
          <div>
            <style>{styles}</style>

            <Button
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
              Add record
            </Button>
            <hr />
            <Table height={420} data={data}>
              <Column flexGrow={1}>
                <HeaderCell>Candidate Id</HeaderCell>
                <EditableCell
                  dataKey="candidateId"
                  dataType="number"
                  onChange={handleChange}
                  //   onEdit={handleEdit}
                />
              </Column>

              <Column width={200}>
                <HeaderCell>Candidate Name</HeaderCell>
                <EditableCell
                  dataKey="candidateName"
                  dataType="string"
                  onChange={handleChange}
                  //   onEdit={handleEdit}
                />
              </Column>

              <Column width={200}>
                <HeaderCell>Candidate Address</HeaderCell>
                <EditableCell
                  dataKey="candidateAddress"
                  dataType="string"
                  onChange={handleChange}
                  //   onEdit={handleEdit}
                />
              </Column>
              <Column width={200}>
                <HeaderCell>Vote Count</HeaderCell>
                <EditableCell
                  dataKey="voteCount"
                  dataType="number"
                  onChange={handleChange}
                  //   onEdit={handleEdit}
                />
              </Column>

              <Column width={100}>
                <HeaderCell>Action</HeaderCell>
                <ActionCell
                  dataKey="id"
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              </Column>
            </Table>
          </div>
        </div>
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
    <Cell {...props} style={{ padding: "6px", display: "flex", gap: "4px" }}>
      <IconButton
        appearance="subtle"
        icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
        onClick={() => {
          onEdit(rowData.id);
        }}
      />
      <IconButton
        appearance="subtle"
        icon={<VscRemove />}
        onClick={() => {
          onRemove(rowData.id);
        }}
      />
    </Cell>
  );
};
