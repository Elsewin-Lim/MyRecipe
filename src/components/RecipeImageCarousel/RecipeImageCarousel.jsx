import { useRef } from 'react';
import './RecipeImageCarousel.css';

function RecipeImageCarousel({
  images = [],
  title = 'Recipe',
  variant = 'card',
}) {
  const trackRef = useRef(null);
  const visibleImages = images.filter(Boolean);

  if (visibleImages.length === 0) return null;

  const className = `recipeImageCarousel recipeImageCarousel--${variant}`;

  if (visibleImages.length <= 2) {
    return (
      <div className={`${className} recipeImageCarousel--static`}>
        {visibleImages.map((src, index) => (
          <img
            key={`${index}-${String(src).slice(0, 24)}`}
            className="recipeImageCarouselImage"
            src={src}
            alt={`${title} — ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  function scrollByView(direction) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: 'smooth',
    });
  }

  return (
    <div className={className} data-image-carousel>
      <div
        className="recipeImageCarouselTrack"
        data-image-carousel-track
        ref={trackRef}
      >
        {visibleImages.map((src, index) => (
          <div
            className="recipeImageCarouselSlide"
            key={`${index}-${String(src).slice(0, 24)}`}
          >
            <img
              className="recipeImageCarouselImage"
              src={src}
              alt={`${title} — ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="recipeImageCarouselButton recipeImageCarouselButton--prev"
        data-image-carousel-button="prev"
        aria-label="Show previous image"
        onClick={() => scrollByView(-1)}
      >
        ‹
      </button>

      <button
        type="button"
        className="recipeImageCarouselButton recipeImageCarouselButton--next"
        data-image-carousel-button="next"
        aria-label="Show next image"
        onClick={() => scrollByView(1)}
      >
        ›
      </button>
    </div>
  );
}

export default RecipeImageCarousel;
