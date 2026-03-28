import React from "react";
import { motion } from "framer-motion";

const reasons = [
  {
    title: "Improve Productivity",
    description:
      "Consistent habits help you manage your time better and get more done every day.",
    icon: "📈",
  },
  {
    title: "Enhance Mental Health",
    description:
      "Good habits like exercise and mindfulness reduce stress and boost mood.",
    icon: "🧠",
  },
  {
    title: "Build Self-Discipline",
    description:
      "Following daily routines strengthens willpower and helps achieve long-term goals.",
    icon: "💪",
  },
  {
    title: "Achieve Long-Term Goals",
    description:
      "Small daily actions compound over time, helping you reach big milestones.",
    icon: "🏆",
  },
];

const WhyBuildHabits = () => {
  return (
    <section className="py-20 bg-gray-100 lg:pl-60">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Build Habits?
        </motion.h2>
        <div className="lg:pl-100">
          <p className="text-gray-600 mb-12 max-w-2xl ">
            Building good habits transforms your life. Here are some reasons why
            developing habits can make a huge difference in your personal and
            professional growth.
          </p>
        </div>

        <div className="flex justify-center w-full">
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center flex-1 min-w-[250px] max-w-[280px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="text-4xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-gray-500">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuildHabits;
