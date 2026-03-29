import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const PublicHabits = () => {
  const [habits, setHabits] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error(err));
  }, []);

  const { user } = useContext(AuthContext);

  const handleAddToMyHabits = async (habit) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const { _id, ...habitWithoutId } = habit;

      const myHabit = {
        ...habitWithoutId,
        userEmail: user.email,
        userName: user.displayName,
        addedAt: new Date(),
      };

      const res = await fetch("http://localhost:3000/my-habits", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(myHabit),
      });

      const data = await res.json();
      if (data.insertedId) {
        toast.success("Added to My Habits!");
      } else {
        toast.error("Failed to add");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

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
            <button
              className="btn mt-auto self-end"
              onClick={() => handleAddToMyHabits(habit)}
            >
              Add to my habits
            </button>
            <button className="btn mt-auto self-end">Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicHabits;
