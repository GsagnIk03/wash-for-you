import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import History from './components/History';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/globals.css';

const App: React.FC = () => {
  // When user clicks "Book This Plan" on Pricing, pre-fill the Contact form
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    // Scroll to contact section after a brief tick
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <History />
        <Services />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Contact
          preselectedService={selectedPlan}
          onServiceConsumed={() => setSelectedPlan(undefined)}
        />
      </main>
      <Footer />
    </>
  );
};

export default App;
