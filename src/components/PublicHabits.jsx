import React, { useEffect, useState } from "react";

const PublicHabits = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-6 p-6">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="border p-4 rounded shadow flex flex-col"
          >
            <img
              src={habit.Image}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-2">{habit.Title}</h2>
            <p className="text-gray-600">{habit.Description}</p>
            <p className="text-sm mt-1">Category: {habit.Category}</p>

            <button className="btn mt-auto self-end">Add to my habits</button>
            <button className="btn mt-auto self-end">Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicHabits;
