import React from "react";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import Pricing from "../components/Pricing";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import ContactStrip from "../components/ContactStrip";

interface HomeProps {
  onOpenBooking: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenBooking }) => (
  <>
    <Hero onOpenBooking={onOpenBooking} />
    <WhyChooseUs />
    <Pricing />
    <Reviews />
    <FAQ />
    <ContactStrip />
  </>
);

export default Home;
