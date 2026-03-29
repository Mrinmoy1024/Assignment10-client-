import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router";

const MyHabits = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/my-habits?email=${user.email}`,
      );
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`http://localhost:3000/my-habits/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Habit deleted");
        fetchHabits();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleMarkComplete = async (habit) => {
    try {
      const updatedHabit = {
        ...habit,
        currentStreak: (habit.currentStreak || 0) + 1,
      };
      const res = await fetch(`http://localhost:3000/my-habits/${habit._id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedHabit),
      });

      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Habit marked complete!");
        fetchHabits();
      } else {
        toast.error("Failed to update habit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!user) {
    return (
      <p className="text-center text-white mt-10">
        Please login to view your habits
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-white mt-10">Loading habits...</p>;
  }

  return (
    <div className="p-6 pb-100 pt-40 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">My Habits</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-700">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Current Streak</th>
              <th className="border px-4 py-2">Created Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit._id} className="bg-gray-800 hover:bg-gray-700">
                <td className="border px-4 py-2">{habit.Title}</td>
                <td className="border px-4 py-2">{habit.Category}</td>
                <td className="border px-4 py-2">{habit.currentStreak || 0}</td>
                <td className="border px-4 py-2">
                  {new Date(habit.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Link to="/update-habits">
                    <button className="btn btn-sm bg-blue-500 hover:bg-blue-700">
                      Update
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm bg-red-500 hover:bg-red-700"
                    onClick={() => handleDelete(habit._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm bg-green-500 hover:bg-green-700"
                    onClick={() => handleMarkComplete(habit)}
                  >
                    Mark Complete
                  </button>
                </td>
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  You have no habits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHabits;
