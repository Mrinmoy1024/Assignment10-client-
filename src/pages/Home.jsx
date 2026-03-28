import React from "react";
import Hero from "../components/Hero";
import FeaturedHabits from "../components/FeaturedHabits";
import WhyBuildHabits from "../components/WhyBuildHabits";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <FeaturedHabits></FeaturedHabits>
      <WhyBuildHabits></WhyBuildHabits>
    </div>
  );
};

export default Home;
