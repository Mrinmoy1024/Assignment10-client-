import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const Hero = () => {
  return (
    <div className="bg-linear-to-r from-[#2a2765] to-[#1e1b4b] text-white">
      <div className="pt-40 md:pt-70 lg:pt-70 flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Build Better Habits,
            <span className="text-indigo-300"> One Day at a Time</span>
          </h1>

          <p className="mt-4 text-gray-300">
            Track your progress, stay consistent, and transform your life with
            powerful daily habits.
          </p>

          <div className="mt-6 flex justify-center">
            <Link to="/public-habits">
              <button className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                Explore Habits
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
