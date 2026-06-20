import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Services from "./components/Services";
import History from "./components/History";
import Gallery from "./components/Gallery";
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
    history.replaceState(null, "", "#book");
  };

  const handleOpenBooking = () => {
    setSelectedPlan(undefined);
    setModalOpen(true);
    history.replaceState(null, "", "#book");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(undefined);
    // Remove hash when modal closes
    history.replaceState(null, "", window.location.pathname);
  };

  // Handle deep links on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#book") {
      setModalOpen(true);
    } else if (hash === "#pricing") {
      setTimeout(() => {
        document
          .getElementById("pricing")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  // Sync modal state with hash changes (browser back/forward)
  useEffect(() => {
    const handler = () => {
      if (window.location.hash === "#book") {
        setModalOpen(true);
      } else {
        setModalOpen(false);
        setSelectedPlan(undefined);
      }
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return (
    <>
      <Navbar onOpenBooking={handleOpenBooking} />
      <main>
        <Hero onOpenBooking={handleOpenBooking} />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Services />
        <History />
        <Gallery />
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
