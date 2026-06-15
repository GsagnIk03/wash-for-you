import React, { useState, useEffect } from "react";
import { useInView } from "../hooks";

import img01 from "../assets/gallery/01.jpeg";
import img02 from "../assets/gallery/02.jpeg";
import img03 from "../assets/gallery/03.jpeg";
import img04 from "../assets/gallery/04.jpeg";
import img05 from "../assets/gallery/05.jpeg";
import img06 from "../assets/gallery/06.jpeg";
import img07 from "../assets/gallery/07.jpeg";
import img08 from "../assets/gallery/08.jpeg";
import img09 from "../assets/gallery/09.jpeg";
import img10 from "../assets/gallery/10.jpeg";
import img11 from "../assets/gallery/11.jpeg";
import img12 from "../assets/gallery/12.jpeg";
import img13 from "../assets/gallery/13.jpeg";
import img14 from "../assets/gallery/14.jpeg";

const IMAGES = [
  { src: img01, alt: "Bike wash in progress — detailing handlebars" },
  { src: img02, alt: "Suzuki Gixxer covered in foam wash" },
  { src: img03, alt: "Pressure washing a sports bike" },
  { src: img04, alt: "Team pressure washing bike on the street" },
  { src: img05, alt: "Foam wash on a red-wheel bike" },
  { src: img06, alt: "Team washing multiple bikes at a customer location" },
  { src: img07, alt: "Hero bike fully lathered in foam" },
  { src: img08, alt: "Car exterior cleaning with polish" },
  { src: img09, alt: "Interior deep clean — seat and door panel" },
  { src: img10, alt: "Interior door panel wipe-down" },
  { src: img11, alt: "Harley Davidson seat and body foam wash" },
  { src: img12, alt: "Car interior rear seat vacuum clean" },
  { src: img13, alt: "Car floor mat cleaning with spray" },
  { src: img14, alt: "Interior rear floor brushing and deep clean" },
];

const GALLERY_CSS = `
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 1024px) {
    .gallery-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    .gallery-section { padding: 60px 5% !important; }
  }
  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    cursor: pointer;
    aspect-ratio: 3/4;
    background: #0A2540;
  }
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
    display: block;
  }
  .gallery-item:hover img {
    transform: scale(1.06);
  }
  .gallery-item-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,37,64,0.7) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 14px;
  }
  .gallery-item:hover .gallery-item-overlay {
    opacity: 1;
  }

  /* Lightbox */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5,15,30,0.96);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeInOverlay 0.2s ease;
    padding: 20px;
  }
  .lightbox-img {
    max-width: 90vw;
    max-height: 88vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    animation: slideUpModal 0.25s ease;
  }
  .lightbox-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.12);
    border: none;
    color: #fff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
    z-index: 2001;
  }
  .lightbox-btn:hover { background: rgba(255,255,255,0.25); }
  .lightbox-btn.prev { left: 16px; }
  .lightbox-btn.next { right: 16px; }
  .lightbox-close {
    position: fixed;
    top: 16px;
    right: 16px;
    background: rgba(255,255,255,0.12);
    border: none;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2001;
    transition: background 0.2s ease;
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.25); }
  .lightbox-counter {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif;
    z-index: 2001;
  }
  @media (max-width: 600px) {
    .lightbox-btn { width: 36px; height: 36px; font-size: 1rem; }
    .lightbox-btn.prev { left: 8px; }
    .lightbox-btn.next { right: 8px; }
  }
`;

const Gallery: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const id = "gallery-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = GALLERY_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null ? (i + 1) % IMAGES.length : null));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null,
        );
      if (e.key === "Escape") setLightboxIndex(null);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <section
      id="gallery"
      className="gallery-section"
      style={{ padding: "100px 5%", background: "#F3F8FF" }}
    >
      <div style={{ marginBottom: 48 }}>
        <div className="section-label">Our Work</div>
        <h2 className="section-title">See It to Believe It</h2>
        <p className="section-sub">
          Real jobs, real results — bikes and cars cleaned at our customers'
          doorsteps across South Kolkata.
        </p>
      </div>

      <div ref={ref} className="gallery-grid">
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className={`gallery-item fade-up${inView ? " visible" : ""}`}
            style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            onClick={() => setLightboxIndex(i)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="gallery-item-overlay">
              <span
                style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}
              >
                🔍 View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
          >
            ✕
          </button>
          <button
            className="lightbox-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + IMAGES.length) % IMAGES.length,
              );
            }}
          >
            ‹
          </button>
          <img
            className="lightbox-img"
            src={IMAGES[lightboxIndex].src}
            alt={IMAGES[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-btn next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % IMAGES.length);
            }}
          >
            ›
          </button>
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
