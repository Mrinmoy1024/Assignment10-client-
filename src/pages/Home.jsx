import React from "react";
import Hero from "../components/Hero";
import FeaturedHabits from "../components/FeaturedHabits";
import WhyBuildHabits from "../components/WhyBuildHabits";

import DailyHabitTips from "../components/DailyHabitTIps";

const Home = () => {

  return (
    <div>
      <Hero></Hero>
      <FeaturedHabits></FeaturedHabits>
      <WhyBuildHabits></WhyBuildHabits>
      <DailyHabitTips></DailyHabitTips>
    </div>
  );
};

export default Home;
