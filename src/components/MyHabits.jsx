import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

const MyHabits = () => {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/my-habits?email=${user.email}`,
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#4a5568",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/my-habits/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (data.deletedCount > 0) {
        Swal.fire({
          title: "Deleted!",
          text: "Your habit has been deleted.",
          icon: "success",
          confirmButtonColor: "#48bb78",
        });
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
      const today = new Date().toDateString();
      const lastCompleted = habit.lastCompletedDate
        ? new Date(habit.lastCompletedDate).toDateString()
        : null;

      if (lastCompleted === today && habit.markComplete === "complete") {
        toast.error("You've already marked this habit complete today!");
        return;
      }

      const { _id, ...habitWithoutId } = habit;
      const isCompleting = habit.markComplete !== "complete";

      const updatedHabit = {
        ...habitWithoutId,
        markComplete: isCompleting ? "complete" : "incomplete",
        currentStreak: isCompleting
          ? (habit.currentStreak || 0) + 1
          : Math.max((habit.currentStreak || 0) - 1, 0),
        lastCompletedDate: isCompleting ? new Date() : null,
      };

      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/my-habits/${habit._id.toString()}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(updatedHabit),
        },
      );

      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(
          isCompleting ? "Habit marked complete!" : "Habit marked incomplete!",
        );
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
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
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Current Streak</th>
              <th className="border px-4 py-2">Created Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const today = new Date().toDateString();
              const lastCompleted = habit.lastCompletedDate
                ? new Date(habit.lastCompletedDate).toDateString()
                : null;
              const alreadyCompletedToday =
                lastCompleted === today && habit.markComplete === "complete";

              return (
                <tr key={habit._id} className="bg-gray-800 hover:bg-gray-700">
                  <td
                    className="border px-4 py-2"
                    data-tooltip-id="habit-tooltip"
                    data-tooltip-content={`${habit.Description} | Reminder: ${habit.reminderTime || "Not set"}`}
                  >
                    {habit.Title}
                  </td>
                  <td className="border px-4 py-2">{habit.Category}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        habit.markComplete === "complete"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {habit.markComplete === "complete"
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {habit.currentStreak || 0} 🔥
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(
                      habit.addedAt || habit.createdAt,
                    ).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link to={`/update-habits/${habit._id.toString()}`}>
                      <button className="btn btn-sm bg-blue-500 hover:bg-blue-700">
                        Update
                      </button>
                    </Link>
                    <button
                      className="btn btn-sm bg-red-500 hover:bg-red-700"
                      onClick={() => handleDelete(habit._id.toString())}
                    >
                      Delete
                    </button>
                    <Link to={`/my-habit-details/${habit._id}`}>
                      <button className="btn btn-sm bg-indigo-500 hover:bg-indigo-700 text-white">
                        Details
                      </button>
                    </Link>
                    <button
                      className={`btn btn-sm ${
                        alreadyCompletedToday
                          ? "bg-gray-500 cursor-not-allowed opacity-50"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                      onClick={() => handleMarkComplete(habit)}
                      disabled={alreadyCompletedToday}
                      title={
                        alreadyCompletedToday ? "Already completed today" : ""
                      }
                    >
                      {habit.markComplete === "complete"
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {habits.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  You have no habits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Tooltip
        id="habit-tooltip"
        place="top"
        style={{ maxWidth: "250px", fontSize: "12px" }}
      />
    </div>
  );
};

export default MyHabits;
