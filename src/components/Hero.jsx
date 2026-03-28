import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Hero = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full h-[80vh] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full"
      >
        {habits.map((habit) => (
          <SwiperSlide key={habit._id} className="relative h-full w-full">
            <img src={habit.Image} className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-4xl md:text-5xl font-bold">
                  {habit.Title}
                </h1>
                <p className="mt-4 text-gray-200">
                  {habit.Description?.slice(0, 120)}...
                </p>

                <div className="mt-6">
                  <Link to="/public-habits">
                    <button className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                      Explore Habits
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
