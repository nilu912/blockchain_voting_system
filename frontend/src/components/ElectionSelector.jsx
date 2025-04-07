import React from "react";

const ElectionSelector = ({ elections, onSelect }) => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {elections.map((election) => (
        <div
          key={election.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition"
          onClick={() => onSelect(election)}
        >
          <img
            src={election.imageUrl}
            alt={election.name}
            className="w-full h-40 object-cover rounded-t-2xl"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{election.name}</h2>
            <p className="text-gray-600 text-sm mt-2">
              description
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ElectionSelector;
