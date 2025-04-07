import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

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
      await contract.createElection(electionName, startTime, endTime);
      alert("Election Created!");
      // console.log(electionName, startTime, endTime);
      setFormData({ electionName: "", startTime: "", endTime: "" });
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#023047]">
            Create New Election
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Set up a secure, transparent election powered by blockchain technology.
            <span className="block mt-2 text-[#023047] font-medium">Every vote will be securely recorded.</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#023047] to-gray-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Election Name</label>
                <input
                  type="text"
                  name="electionName"
                  placeholder="Enter a descriptive name for your election"
                  value={formData.electionName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg font-medium shadow-lg bg-white/90 text-[#023047] hover:bg-white transition-colors flex items-center justify-center group"
                >
                  <span className="text-lg">Create Election</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-[#023047] mb-4">About Blockchain Elections</h3>
          <p className="text-gray-700 mb-4">
            Elections created on our platform are secured by blockchain technology, ensuring transparency, 
            immutability, and verifiability. Once an election is created, it cannot be altered or tampered with.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-blue-500 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Secure</h4>
              <p className="text-sm text-gray-600">Protected by cryptographic algorithms</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-blue-500 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Transparent</h4>
              <p className="text-sm text-gray-600">All votes are publicly verifiable</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-blue-500 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Immutable</h4>
              <p className="text-sm text-gray-600">Results cannot be altered once recorded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
