/**
 * ScrollAnimations.js
 * ─────────────────────────────────────────────
 * Invisible utility component. Runs once on mount
 * and watches all .fade-up elements on the page.
 *
 * How it works:
 *  1. Finds every element with class "fade-up"
 *  2. Attaches an IntersectionObserver to each one
 *  3. When an element enters the viewport (10% visible,
 *     at least 40px from the bottom edge), adds "visible"
 *  4. CSS in globals.css transitions opacity + translateY
 *     when "visible" is added
 *
 * To change when animation triggers:
 *  - threshold: 0.08 → triggers when 8% of element is visible
 *  - rootMargin bottom -40px → element must be 40px above fold
 *
 * To disable scroll animations entirely:
 *  - Remove <ScrollAnimations /> from page.js
 *  - Remove .fade-up classes from component JSX
 * ─────────────────────────────────────────────
 */
'use client';
import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        // Add .visible when element enters viewport → triggers CSS animation
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      {
        threshold: 0.08,              // 8% of element must be visible
        rootMargin: '0px 0px -40px 0px' // 40px buffer from bottom of viewport
      }
    );

    els.forEach(el => observer.observe(el));

    // Cleanup: stop observing when component unmounts
    return () => observer.disconnect();
  }, []);

  // Renders nothing — purely a side-effect component
  return null;
}
