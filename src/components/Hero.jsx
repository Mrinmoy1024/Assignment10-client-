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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://habit-tracker-server-taupe.vercel.app/habits")
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

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center bg-[#1e1b4b]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-[80vh] relative z-0">
      <Swiper
        key={habits.length ? `hero-${habits.length}` : "hero-loading"}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={
          habits.length > 0
            ? { delay: 3000, disableOnInteraction: false }
            : false
        }
        pagination={{ clickable: true }}
        navigation
        loop={habits.length > 1}
        className="h-full w-full"
      >
        {habits.map((habit) => (
          <SwiperSlide
            key={habit._id}
            className="relative isolate h-full w-full"
          >
            <img
              src={habit.Image}
              alt={habit.Title}
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 z-10 bg-black/50" aria-hidden />
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
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
