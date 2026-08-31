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

// The booking modal is now always cart-driven (see BookingModal.tsx) — it
// reads straight from CartContext and shows whatever's already been added,
// so there's no more "direct plan" vs "cart checkout" distinction to track
// here. Every entry point (nav button, mobile sticky bar, "Proceed to Book"
// in the cart drawer) just opens the same modal.
const AppContent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const handleOpenBooking = () => {
    setModalOpen(true);
    history.replaceState(null, "", "#book");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
      setModalOpen(window.location.hash === "#book");
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
    <>
      <Navbar onOpenBooking={handleOpenBooking} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home onOpenBooking={handleOpenBooking} />}
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="*"
            element={<Home onOpenBooking={handleOpenBooking} />}
          />
        </Routes>
      </main>
      <Footer />
      <CartDrawer onCheckout={handleOpenBooking} />
      <BookingModal isOpen={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;
