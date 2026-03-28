import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const FeaturedHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch("http://localhost:3000/featured-habits");
        const data = await res.json();
        setHabits(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-white">
        Loading featured habits...
      </div>
    );
  }

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

            <div className="mt-auto flex justify-end">
              <Link to="/">
                <button className="btn btn-primary mt-4">
                  Add to my habits
                </button>
              </Link>
              <Link to="/">
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
