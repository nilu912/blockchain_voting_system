import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function Admin() {
  const [formData, setFormData] = useState({ name: "", party: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    // Redirect if not admin (for simplicity, assuming a function `isAdmin` exists)
    if (isAuthenticated) {
    //   window.location.href = "/";
    console.log("Not admin", isAuthenticated)
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.party) {
      setStatus({ type: "error", message: "Please fill out all fields" });
      return;
    }
    setStatus({
      type: "success",
      message: `Candidate "${formData.name}" added successfully`,
    });
    setFormData({ name: "", party: "" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {status.type && (
        <p className={`text-${status.type === "error" ? "red" : "green"}-500`}>
          {status.message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Candidate Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="party"
          value={formData.party}
          onChange={handleInputChange}
          placeholder="Political Party"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add Candidate
        </button>
      </form>
    </div>
  );
}
