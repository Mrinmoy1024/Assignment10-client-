import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHabit = async () => {
    try {
      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/habits/${id}`,
      );
      const data = await res.json();
      setHabit(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load habit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchHabit();
  }, [id]);

  const handleMarkComplete = async () => {
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

      const existingHistory = habit.completionHistory || [];
      const todayISO = new Date().toISOString().split("T")[0];
      const alreadyInHistory = existingHistory.some(
        (entry) => new Date(entry).toISOString().split("T")[0] === todayISO,
      );

      const updatedHistory =
        isCompleting && !alreadyInHistory
          ? [...existingHistory, new Date()]
          : existingHistory;

      const updatedHabit = {
        ...habitWithoutId,
        markComplete: isCompleting ? "complete" : "incomplete",
        currentStreak: isCompleting
          ? (habit.currentStreak || 0) + 1
          : Math.max((habit.currentStreak || 0) - 1, 0),
        lastCompletedDate: isCompleting ? new Date() : null,
        completionHistory: updatedHistory,
      };

      setHabit({ ...habit, ...updatedHabit, _id: habit._id });

      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/habits/${id}`,
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
      } else {
        toast.error("Failed to update habit");
        fetchHabit();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      fetchHabit();
    }
  };

  const calculateProgress = () => {
    const streak = habit?.currentStreak || 0;
    const capped = Math.min(streak, 30);
    return Math.round((capped / 30) * 100);
  };

  const getStreakBadge = (streak) => {
    if (streak >= 30) return { label: "🏆 Legend", color: "bg-yellow-500" };
    if (streak >= 14) return { label: "🔥 On Fire", color: "bg-orange-500" };
    if (streak >= 7) return { label: "⚡ Weekly Hero", color: "bg-purple-500" };
    if (streak >= 3) return { label: "💪 Building", color: "bg-blue-500" };
    return { label: "🌱 Just Started", color: "bg-green-600" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1e1b4b]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1e1b4b]">
        <p className="text-white text-center">Habit not found.</p>
      </div>
    );
  }

  const progress = calculateProgress();
  const streak = habit.currentStreak || 0;
  const badge = getStreakBadge(streak);
  const today = new Date().toDateString();
  const lastCompleted = habit.lastCompletedDate
    ? new Date(habit.lastCompletedDate).toDateString()
    : null;
  const alreadyCompletedToday =
    lastCompleted === today && habit.markComplete === "complete";

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-white flex justify-center items-start p-6">
      <div className="w-full max-w-2xl bg-[#312e81] rounded-2xl shadow-2xl overflow-hidden">
        {habit.Image && (
          <img
            src={habit.Image}
            alt={habit.Title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6 space-y-5">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm bg-gray-600 hover:bg-gray-500 text-white"
          >
            ← Back
          </button>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-bold">{habit.Title}</h1>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500">
              {habit.Category}
            </span>
          </div>

          <p className="text-gray-300 text-base leading-relaxed">
            {habit.Description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                habit.markComplete === "complete"
                  ? "bg-green-600 text-white"
                  : "bg-yellow-600 text-white"
              }`}
            >
              {habit.markComplete === "complete" ? "Complete" : "Incomplete"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${badge.color}`}
            >
              {badge.label}
            </span>
            <span className="text-gray-300 text-sm">
              {streak} day{streak !== 1 ? "s" : ""} streak
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress (last 30 days)</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    progress >= 70
                      ? "#48bb78"
                      : progress >= 40
                        ? "#ed8936"
                        : "#e53e3e",
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#1e1b4b] rounded-xl p-3">
              <p className="text-gray-400 mb-1">Reminder Time</p>
              <p className="font-semibold">{habit.reminderTime || "Not set"}</p>
            </div>
            <div className="bg-[#1e1b4b] rounded-xl p-3">
              <p className="text-gray-400 mb-1">Target Date</p>
              <p className="font-semibold">
                {habit.date
                  ? new Date(habit.date).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
          </div>

          <div className="bg-[#1e1b4b] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold shrink-0">
              {habit.userName ? habit.userName.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {habit.userName || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">{habit.userEmail || ""}</p>
              <p className="text-xs text-gray-400">
                Added on{" "}
                {new Date(
                  habit.addedAt || habit.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleMarkComplete}
            disabled={alreadyCompletedToday}
            className={`btn w-full text-white ${
              alreadyCompletedToday
                ? "bg-gray-500 cursor-not-allowed opacity-50"
                : habit.markComplete === "complete"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-700"
            }`}
            title={alreadyCompletedToday ? "Already completed today" : ""}
          >
            {alreadyCompletedToday
              ? "✓ Completed Today"
              : habit.markComplete === "complete"
                ? "Mark Incomplete"
                : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
