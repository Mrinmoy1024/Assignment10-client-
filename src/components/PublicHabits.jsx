import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router";

const PublicHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(
      "https://habit-tracker-server-df4tjwqan-mtex1024-2836s-projects.vercel.app/habits",
    )
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
      const res = await fetch(
        "https://habit-tracker-server-df4tjwqan-mtex1024-2836s-projects.vercel.app/my-habits",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(myHabit),
        },
      );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
            <div className="flex justify-end gap-2 mt-auto">
              <button
                className="btn"
                onClick={() => handleAddToMyHabits(habit)}
              >
                Add to my habits
              </button>
              <Link to={`/habit-details/${habit._id}`}>
                <button className="btn bg-indigo-500 hover:bg-indigo-700 text-white">
                  Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicHabits;
