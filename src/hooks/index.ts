import { useState, useEffect, useRef, RefObject } from 'react';

// ─── useScrolled: track if page has scrolled past threshold ───
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}

// ─── useInView: animate element when it enters viewport ───────
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate once
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// ─── useEmailJS: lazy-load EmailJS SDK ────────────────────────
export function useEmailJS(publicKey: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if ((window as any).emailjs) {
      (window as any).emailjs.init(publicKey);
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      (window as any).emailjs.init(publicKey);
      setReady(true);
    };
    document.head.appendChild(script);
  }, [publicKey]);

  return ready;
}
