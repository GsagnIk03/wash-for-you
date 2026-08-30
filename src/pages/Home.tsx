import React from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Services from "../components/Services";
import Reviews from "../components/Reviews";
import ContactStrip from "../components/ContactStrip";

interface HomeProps {
  onOpenBooking: () => void;
  onSelectPlan: (planName: string) => void;
}

const Home: React.FC<HomeProps> = ({ onOpenBooking, onSelectPlan }) => (
  <>
    <Hero onOpenBooking={onOpenBooking} />
    <Pricing onSelectPlan={onSelectPlan} />
    <Services />
    <Reviews />
    <ContactStrip />
  </>
);

export default Home;
