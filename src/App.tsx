import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import HistoryPage from "./pages/HistoryPage";
import "./styles/globals.css";

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [cartCheckout, setCartCheckout] = useState(false);
  const location = useLocation();

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setCartCheckout(false);
    setModalOpen(true);
    history.replaceState(null, "", "#book");
  };

  const handleOpenBooking = () => {
    setSelectedPlan(undefined);
    setCartCheckout(false);
    setModalOpen(true);
    history.replaceState(null, "", "#book");
  };

  const handleCartCheckout = () => {
    setSelectedPlan(undefined);
    setCartCheckout(true);
    setModalOpen(true);
    history.replaceState(null, "", "#book");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(undefined);
    setCartCheckout(false);
    // Remove hash when modal closes
    history.replaceState(null, "", window.location.pathname);
  };

  // Handle deep links / cross-page hash navigation, e.g. Navbar linking to
  // "/#pricing" from the Gallery or Our Story pages.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#book") {
      setModalOpen(true);
    } else if (hash && location.pathname === "/") {
      setTimeout(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.pathname]);

  // Sync modal state with hash changes (browser back/forward)
  useEffect(() => {
    const handler = () => {
      if (window.location.hash === "#book") {
        setModalOpen(true);
      } else {
        setModalOpen(false);
        setSelectedPlan(undefined);
        setCartCheckout(false);
      }
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Scroll to top on route change (skip when the booking modal hash is set).
  useEffect(() => {
    if (window.location.hash === "#book") return;
    if (!window.location.hash) {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  return (
    <CartProvider>
      <Navbar onOpenBooking={handleOpenBooking} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOpenBooking={handleOpenBooking}
                onSelectPlan={handleSelectPlan}
              />
            }
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="*"
            element={
              <Home
                onOpenBooking={handleOpenBooking}
                onSelectPlan={handleSelectPlan}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
      <CartDrawer onCheckout={handleCartCheckout} />
      <BookingModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        preselectedService={selectedPlan}
        onServiceConsumed={() => setSelectedPlan(undefined)}
        cartMode={cartCheckout}
      />
    </CartProvider>
  );
};

export default App;
