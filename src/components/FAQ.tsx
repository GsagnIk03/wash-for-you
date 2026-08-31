import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemData {
  question: string;
  answer: React.ReactNode;
}

// Scrolls to the Service Areas chips inside the "Why Us" section — used by
// the "Which areas do you cover?" answer instead of repeating the list here,
// so the two never drift out of sync.
const ServiceAreasLink: React.FC = () => (
  <button
    type="button"
    className="faq-inline-link"
    onClick={() =>
      document
        .getElementById("service-areas")
        ?.scrollIntoView({ behavior: "smooth" })
    }
  >
    Service Areas section
  </button>
);

const FAQ_ITEMS: FAQItemData[] = [
  {
    question: "Do you wash bikes?",
    answer: (
      <>
        Yes — bike-only bookings are currently serviceable in Jadavpur,
        Baghajatin, Ajaynagar, and Jadavpur P.S. If you book a bike wash
        alongside a car wash, there's no location restriction on the bike —
        we'll cover it wherever the car wash is serviceable.
      </>
    ),
  },
  {
    question: "Do I need to provide water?",
    answer: <>Yes, customers need to provide water and an electrical point.</>,
  },
  {
    question: "How long does a wash take?",
    answer: (
      <>
        It depends on the add-ons you've selected alongside the wash. Without
        any add-ons, Rapid Wash takes up to 45 minutes. Basic Interior &amp;
        Exterior takes approximately 1 to 1.5 hours. Advance Interior &amp;
        Exterior takes approximately 2 to 2.5 hours, and the Premium Spa takes
        around 3 hours. Bike washes typically take up to 30 minutes.
      </>
    ),
  },
  {
    question: "Do you wash commercial vans?",
    answer: <>No.</>,
  },
  {
    question: "Do you come to apartments?",
    answer: (
      <>
        Yes — only when an electrical point and water source are close to where
        the car is kept.
      </>
    ),
  },
  {
    question: "Can I book a same-day wash?",
    answer: <>Absolutely!</>,
  },
  {
    question: "Which areas do you cover?",
    answer: (
      <>
        Please refer to the <ServiceAreasLink /> above to see the full list of
        neighbourhoods we currently cover.
      </>
    ),
  },
  {
    question: "Can I cancel / reschedule?",
    answer: (
      <>
        Yes, but that should be done either over WhatsApp or by calling our
        technicians/support directly.
      </>
    ),
  },
];

const FAQ_CSS = `
  .faq-list { max-width: 780px; margin-top: 40px; }
  .faq-item {
    border-bottom: 1px solid rgba(41,121,216,0.14);
  }
  .faq-item:first-child { border-top: 1px solid rgba(41,121,216,0.14); }
  .faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 4px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0A2540;
  }
  .faq-question:hover { color: #2979D8; }
  .faq-chevron {
    flex-shrink: 0;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    color: #2979D8;
  }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-answer-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .faq-answer-wrap.open { grid-template-rows: 1fr; }
  .faq-answer-inner { overflow: hidden; }
  .faq-answer {
    padding: 0 4px 22px;
    font-size: 0.92rem;
    line-height: 1.75;
    color: #4A6FA5;
    max-width: 640px;
  }
  .faq-inline-link {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    font-weight: 700;
    color: #2979D8;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }
  .faq-inline-link:hover { color: #0A2540; }
`;

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  React.useEffect(() => {
    const id = "faq-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = FAQ_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <section id="faq" style={{ padding: "100px 5%", background: "#F3F8FF" }}>
      <div className="section-label">Got Questions?</div>
      <h2 className="section-title">Frequently Asked Questions</h2>
      <p className="section-sub">
        The things customers most often ask us before booking a doorstep wash.
      </p>

      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <FAQRow
            key={item.question}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
          />
        ))}
      </div>
    </section>
  );
};

const FAQRow: React.FC<{
  item: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => (
  <div className="faq-item">
    <button
      type="button"
      className="faq-question"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      {item.question}
      <ChevronDown
        size={19}
        strokeWidth={2.3}
        className={`faq-chevron${isOpen ? " open" : ""}`}
      />
    </button>
    <div className={`faq-answer-wrap${isOpen ? " open" : ""}`}>
      <div className="faq-answer-inner">
        <p className="faq-answer">{item.answer}</p>
      </div>
    </div>
  </div>
);

export default FAQ;
