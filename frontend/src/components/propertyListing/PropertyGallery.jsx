import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * PropertyGallery
 * 
 * Mosaic: 1 large + up to 4 supporting tiles.
 * Handles 1–5+ images gracefully (no empty tiles).
 * Clicking any image opens a keyboard-navigable lightbox.
 *
 * MODAL DECISION: This component implements its own lightweight
 * focus-trap lightbox instead of using src/components/ui/Modal.jsx.
 * Reason: the gallery lightbox needs arrow-key navigation between images,
 * a carousel track, and full-screen dark backdrop — which differ from
 * the generic dialog shape of ui/Modal. The old propertyListing/Modal.jsx
 * (GSAP-based, no keyboard nav, no focus trap) is NOT used and will be
 * left in place but no longer imported anywhere in this phase.
 * Result: one lightbox system, zero competing modal imports in scope.
 */
const PropertyGallery = ({ images, propertyName }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const triggerRef = useRef(null); // the tile that was clicked
  const closeBtnRef = useRef(null);
  const lightboxRef = useRef(null);

  /* Clamp images to display at most 5 tiles */
  const displayImages = images.slice(0, 5);
  const hasMore = images.length > 5;

  /* ── Open lightbox ── */
  const openLightbox = useCallback((index, triggerEl) => {
    triggerRef.current = triggerEl;
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  /* ── Close lightbox ── */
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    // Return focus to trigger
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  /* ── Navigate ── */
  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  /* ── Keyboard & body-scroll lock ── */
  useEffect(() => {
    if (!lightboxOpen) return;

    document.body.style.overflow = "hidden";
    // Focus the close button on open
    setTimeout(() => closeBtnRef.current?.focus(), 50);

    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    /* Focus trap */
    const handleFocusTrap = (e) => {
      if (!lightboxRef.current) return;
      const focusable = lightboxRef.current.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keydown", handleFocusTrap);
    };
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  /* ── Mosaic layout class based on image count ── */
  const mosaicClass =
    displayImages.length === 1
      ? "pd-gallery-single"
      : displayImages.length === 2
      ? "pd-gallery-two"
      : displayImages.length === 3
      ? "pd-gallery-three"
      : displayImages.length === 4
      ? "pd-gallery-four"
      : "pd-gallery-five";

  return (
    <section className="pd-gallery-section" aria-label="Property photos">
      <div className={`pd-gallery-mosaic ${mosaicClass}`}>
        {displayImages.map((img, idx) => {
          const isLast = idx === displayImages.length - 1;
          return (
            <button
              key={idx}
              className={`pd-gallery-tile ${idx === 0 ? "pd-tile-main" : "pd-tile-sub"}`}
              onClick={(e) => openLightbox(idx, e.currentTarget)}
              aria-label={`${propertyName}, photo ${idx + 1} of ${images.length}`}
              type="button"
            >
              <img
                src={img.url}
                alt={`${propertyName}, photo ${idx + 1} of ${images.length}`}
                className="pd-gallery-img"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add("pd-tile-broken");
                }}
              />
              {/* Overlay button on last tile when there are more */}
              {isLast && hasMore && (
                <span className="pd-gallery-more" aria-hidden="true">
                  +{images.length - 5} photos
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          className="pd-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxIndex + 1} of ${images.length}`}
          onClick={closeLightbox}
          ref={lightboxRef}
        >
          <div
            className="pd-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="pd-lightbox-close"
              onClick={closeLightbox}
              ref={closeBtnRef}
              aria-label="Close photo viewer"
              type="button"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="pd-lightbox-counter" aria-live="polite">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Image */}
            <div className="pd-lightbox-img-wrap">
              <img
                key={lightboxIndex}
                src={images[lightboxIndex].url}
                alt={`${propertyName}, photo ${lightboxIndex + 1} of ${images.length}`}
                className="pd-lightbox-img"
                loading="eager"
              />
            </div>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  className="pd-lightbox-nav pd-lightbox-prev"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  type="button"
                >
                  ‹
                </button>
                <button
                  className="pd-lightbox-nav pd-lightbox-next"
                  onClick={goNext}
                  aria-label="Next photo"
                  type="button"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyGallery;
