'use client';

import {useEffect, useState} from 'react';

/**
 * Floating "back to top" arrow.
 *
 * Appears in the bottom-right (bottom-left in RTL) once the user has
 * scrolled past ~600px. Click triggers a smooth scroll to the top.
 * Hidden behind a CSS transition so it fades in/out without layout shift.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className={`scroll-to-top-btn ${visible ? 'is-visible' : ''}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 28px;
          inset-inline-end: 28px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-line);
          background: rgba(10, 11, 13, 0.78);
          color: var(--color-sun);
          border-radius: 999px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 220ms ease, transform 220ms ease, border-color 220ms ease, color 220ms ease;
          pointer-events: none;
          z-index: 80;
          box-shadow: 0 6px 20px -10px rgba(0, 0, 0, 0.6);
        }
        .scroll-to-top-btn.is-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .scroll-to-top-btn:hover {
          border-color: var(--color-sun);
          color: var(--color-ink);
          background: rgba(232, 169, 72, 0.16);
        }
        @media (max-width: 640px) {
          .scroll-to-top-btn {
            bottom: 20px;
            inset-inline-end: 20px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </button>
  );
}
