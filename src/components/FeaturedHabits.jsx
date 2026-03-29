import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const FeaturedHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch("http://localhost:3000/featured-habits");
        const data = await res.json();
        setHabits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
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
        headers: { "content-type": "application/json" },
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
    <section className="w-full flex flex-col items-center px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
        Featured Habits
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-center items-center gap-6 place-items-center">
        {habits.map((habit, index) => (
          <motion.div
            key={habit._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1e1b4b] p-5 rounded-xl shadow-lg flex flex-col w-full max-w-sm"
          >
            <img
              src={habit.Image}
              alt={habit.Title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-3 text-white">
              {habit.Title}
            </h3>
            <p className="text-gray-300 mt-2">
              {habit.Description?.slice(0, 80)}...
            </p>
            <p className="text-sm mt-2 text-indigo-300">
              Category: {habit.Category}
            </p>
            <div className="mt-auto flex justify-end gap-2">
              <button
                className="btn btn-primary mt-4"
                onClick={() => handleAddToMyHabits(habit)}
              >
                Add to my habits
              </button>

              <Link to={`/habit-details/${habit._id}`}>
                <button className="btn btn-primary mt-4">Details</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHabits;
