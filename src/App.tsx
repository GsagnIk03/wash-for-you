import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Services from "./components/Services";
import History from "./components/History";
import ContactStrip from "./components/ContactStrip";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import "./styles/globals.css";

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  const handleOpenBooking = () => {
    setSelectedPlan(undefined);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(undefined);
  };

  return (
    <>
      <Navbar onOpenBooking={handleOpenBooking} />
      <main>
        <Hero onOpenBooking={handleOpenBooking} />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Services />
        <History />
        <ContactStrip />
      </main>
      <Footer />

      <BookingModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        preselectedService={selectedPlan}
        onServiceConsumed={() => setSelectedPlan(undefined)}
      />
    </>
  );
};

export default App;
