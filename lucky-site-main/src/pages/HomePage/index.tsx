import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";
import CTA from "./CTA";

// bg-gradient-to-r from-cyan-400 to-teal-300
const HomePage: React.FC = () => {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(30,30,40,1) 0%, rgba(10,10,15,1) 100%)",
      }}
    >
      <Hero />
      <Features />
      <Stats />
      <CTA />
    </div>
  );
};

export default HomePage;
