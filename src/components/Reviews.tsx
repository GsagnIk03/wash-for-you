import React, { useEffect, useState } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { useInView } from "../hooks";
import { FALLBACK_REVIEWS } from "../data";
import type { ReviewItem } from "../types";

const GOOGLE_REVIEWS_URL = "https://share.google/5elS5dXojNOiuimz7";

interface ReviewsResponse {
  rating?: number;
  userRatingCount?: number;
  reviews: ReviewItem[];
}

type FetchState = "loading" | "ready" | "unavailable";

const Reviews: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [state, setState] = useState<FetchState>("loading");
  const [data, setData] = useState<ReviewsResponse>({
    reviews: FALLBACK_REVIEWS,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/get-reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Reviews unavailable");
        return res.json();
      })
      .then((json: ReviewsResponse) => {
        if (cancelled) return;
        if (json.reviews && json.reviews.length > 0) {
          setData(json);
          setState("ready");
        } else {
          setState(FALLBACK_REVIEWS.length > 0 ? "ready" : "unavailable");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState(FALLBACK_REVIEWS.length > 0 ? "ready" : "unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="reviews" style={{ padding: "100px 5%", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="section-label" style={{ justifyContent: "center" }}>
          Customer Reviews
        </div>
        <h2 className="section-title" style={{ textAlign: "center" }}>
          What Our Customers Say
        </h2>
        <p
          className="section-sub"
          style={{ textAlign: "center", margin: "0 auto" }}
        >
          Verified feedback from real bookings, straight from our Google
          Business Profile.
        </p>

        {typeof data.rating === "number" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
            }}
          >
            <StarRow rating={data.rating} size={18} />
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#0A2540",
              }}
            >
              {data.rating.toFixed(1)}
            </span>
            {typeof data.userRatingCount === "number" && (
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                ({data.userRatingCount} Google reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* This wrapper is always mounted (even while state === "loading") so
          the IntersectionObserver in useInView has a real element to attach
          to from the first render. Attaching `ref` only to the conditional
          "ready" branch meant the observer was never created, so cards
          stayed permanently invisible via .fade-up's opacity: 0. */}
      <div ref={ref}>
        {state === "loading" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 190,
                  borderRadius: 16,
                  background:
                    "linear-gradient(90deg, #F3F8FF 25%, #E8F1FB 37%, #F3F8FF 63%)",
                  backgroundSize: "400% 100%",
                  animation: "reviewsShimmer 1.4s ease infinite",
                }}
              />
            ))}
            <style>{`@keyframes reviewsShimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }`}</style>
          </div>
        )}

        {state === "ready" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {data.reviews.slice(0, 6).map((review, i) => (
              <ReviewCard
                key={i}
                review={review}
                delay={i * 80}
                inView={inView}
              />
            ))}
          </div>
        )}

        {state === "unavailable" && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "#F3F8FF",
              borderRadius: 16,
              color: "#4A6FA5",
              fontSize: "0.92rem",
            }}
          >
            Reviews will appear here shortly. In the meantime, see what
            customers are saying on our Google Business Profile.
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 36 }}>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#2979D8",
            textDecoration: "none",
            borderBottom: "2px solid transparent",
          }}
        >
          View all reviews on Google
          <ExternalLink size={15} strokeWidth={2.2} />
        </a>
      </div>
    </section>
  );
};

const StarRow: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 14,
}) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        strokeWidth={1.5}
        fill={n <= Math.round(rating) ? "#f59e0b" : "none"}
        color={n <= Math.round(rating) ? "#f59e0b" : "#cbd5e1"}
      />
    ))}
  </div>
);

const ReviewCard: React.FC<{
  review: ReviewItem;
  delay: number;
  inView: boolean;
}> = ({ review, delay, inView }) => {
  const initials = review.author
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`fade-up${inView ? " visible" : ""}`}
      style={{
        border: "1.5px solid #E8F1FB",
        borderRadius: 16,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transitionDelay: `${delay}ms`,
        background: "#fff",
      }}
    >
      <Quote size={20} strokeWidth={2} color="#3ECFCF" />
      <p
        style={{
          fontSize: "0.88rem",
          lineHeight: 1.7,
          color: "#334155",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {review.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {review.profilePhotoUrl ? (
          <img
            src={review.profilePhotoUrl}
            alt={review.author}
            referrerPolicy="no-referrer"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#E8F1FB",
              color: "#2979D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#0A2540",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {review.author}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 2,
            }}
          >
            <StarRow rating={review.rating} />
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              {review.relativeTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
