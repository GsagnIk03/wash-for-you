import React, { useEffect } from "react";
import { ShoppingCart, X, Trash2, CalendarCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

const CART_CSS = `
  .cart-fab {
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 1400;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3ECFCF, #27B5B5);
    color: #0A2540;
    border: none;
    box-shadow: 0 10px 28px rgba(62,207,207,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease;
  }
  .cart-fab:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 14px 34px rgba(62,207,207,0.55); }
  .cart-fab-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #E74C3C;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    min-width: 21px;
    height: 21px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #fff;
  }
  .cart-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,37,64,0.5);
    backdrop-filter: blur(3px);
    z-index: 1500;
    animation: cartFadeIn 0.2s ease;
  }
  .cart-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 420px;
    background: #fff;
    z-index: 1501;
    display: flex;
    flex-direction: column;
    box-shadow: -20px 0 60px rgba(10,37,64,0.25);
    animation: cartSlideIn 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes cartFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cartSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .cart-item-remove {
    background: #FEF0F0;
    border: none;
    color: #E74C3C;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s ease;
  }
  .cart-item-remove:hover { background: #fde2e2; }
  /* On mobile, a sticky "Book Your Wash" bar hugs the bottom of the screen
     (see Navbar.tsx .mobile-sticky-cta) — lift the cart FAB clear of it so
     the two never overlap or crowd together. */
  @media (max-width: 768px) {
    .cart-fab { bottom: calc(86px + env(safe-area-inset-bottom)); }
  }
  @media (max-width: 480px) {
    .cart-fab { right: 16px; bottom: calc(80px + env(safe-area-inset-bottom)); width: 52px; height: 52px; }
  }
`;

interface CartDrawerProps {
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, removeItem, total, isOpen, open, close } = useCart();

  useEffect(() => {
    const id = "cart-drawer-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = CART_CSS;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="cart-fab"
        onClick={open}
        aria-label={`Open cart${items.length ? ` (${items.length} items)` : ""}`}
      >
        <ShoppingCart size={23} strokeWidth={2.3} />
        {items.length > 0 && (
          <span className="cart-fab-badge">{items.length}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="cart-drawer-overlay" onClick={close} />
          <div className="cart-drawer">
            <div
              style={{
                padding: "24px 24px 18px",
                borderBottom: "1px solid #E8F1FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#0A2540",
                  margin: 0,
                }}
              >
                Your Cart
              </h2>
              <button
                onClick={close}
                aria-label="Close cart"
                style={{
                  background: "#F3F8FF",
                  border: "none",
                  borderRadius: "50%",
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#4A6FA5",
                }}
              >
                <X size={16} strokeWidth={2.3} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    padding: "60px 10px",
                    lineHeight: 1.6,
                  }}
                >
                  <ShoppingCart
                    size={30}
                    strokeWidth={1.6}
                    style={{ marginBottom: 12, opacity: 0.5 }}
                  />
                  <div>Your cart is empty.</div>
                  <div>Configure a wash package and add it here.</div>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1.5px solid #E8F1FB",
                        borderRadius: 14,
                        padding: "14px 16px",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.92rem",
                            color: "#0A2540",
                            marginBottom: 4,
                          }}
                        >
                          {item.planName}
                        </div>
                        {item.addOns.map((a, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: "0.78rem",
                              color: "#64748b",
                              lineHeight: 1.5,
                            }}
                          >
                            {a.choiceLabels.join(", ")}
                            {a.addedPrice > 0 ? ` (+₹${a.addedPrice})` : ""}
                          </div>
                        ))}
                        {item.estimatedTime && (
                          <div
                            style={{
                              fontSize: "0.74rem",
                              color: "#94a3b8",
                              marginTop: 6,
                            }}
                          >
                            {item.estimatedTime}
                          </div>
                        )}
                        <div
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#2979D8",
                            marginTop: 8,
                          }}
                        >
                          ₹{item.totalPrice}
                        </div>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.planName} from cart`}
                      >
                        <Trash2 size={14} strokeWidth={2.2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div
                style={{
                  padding: "18px 24px 24px",
                  borderTop: "1px solid #E8F1FB",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#4A6FA5",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#0A2540",
                    }}
                  >
                    ₹{total}
                  </span>
                </div>
                <button
                  onClick={() => {
                    close();
                    onCheckout();
                  }}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #2979D8, #1A4F8A)",
                    color: "#fff",
                    border: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <CalendarCheck size={17} strokeWidth={2.3} />
                  Proceed to Book
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CartDrawer;
