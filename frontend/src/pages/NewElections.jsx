import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function NewElections() {
  const { contract } = useAuth();
  const [formData, setFormData] = useState({
    electionName: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "datetime-local" || e.target.type === "date") {
      const date = new Date(e.target.value);
      const unixTime = Math.floor(date.getTime() / 1000);
      setFormData({ ...formData, [e.target.name]: unixTime });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { electionName, startTime, endTime } = formData;

    if (!electionName || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return;
    }

    try {
      // await contract.createElection(electionName, startTime, endTime);
      // alert("Election Created!");
      console.log(electionName, startTime, endTime);
      setFormData({ electionName: "", startTime: "", endTime: "" });
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">🗳️ Create New Election</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="electionName"
          placeholder="Election Name"
          value={formData.electionName}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="datetime-local"
          name="startTime"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="datetime-local"
          name="endTime"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded transition-all"
        >
          Create Election
        </button>
      </form>
    </div>
  );
}
