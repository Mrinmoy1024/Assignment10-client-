import React from "react";
import { motion } from "framer-motion";

const tips = [
  {
    id: 1,
    title: "Start Your Day Right",
    description:
      "Learn how a consistent morning routine can improve focus and productivity.",
    image: "https://i.ibb.co/ZR8q9W0B/1-7g-2-AXf-Hsb34-a2t-Vew.jpg",
  },
  {
    id: 2,
    title: "Track Your Progress",
    description:
      "Writing down habits increases accountability and long-term success.",
    image: "https://i.ibb.co/WWzmNn1x/b8ef0a1e2b5844b593a775427fca1cb3.png",
  },
  {
    id: 3,
    title: "Habit Stacking",
    description:
      "Combine small actions for bigger results by stacking habits effectively.",
    image: "https://i.ibb.co/27KhcQWm/1-MNVLJyc-KXUY4km-H1-E5b-BVg-2x.jpg",
  },
  {
    id: 4,
    title: "Stay Consistent",
    description:
      "Consistency is key. Discover strategies to maintain habits over time.",
    image: "https://i.ibb.co/RkkrRHng/images3.png",
  },
];

const DailyHabitTips = () => {
  return (
    <section className="py-16 bg-[#2E2A5F] text-white lg:pl-80">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Daily Habit Tips
        </motion.h2>
        <div className="lg:pl-75 pb-10 pt-10">
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Practical tips and insights to help you build and maintain positive
            habits every day
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {tips.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-gray-700 rounded-2xl shadow-lg overflow-hidden w-full max-w-xs flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-300 flex-1">{post.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyHabitTips;
