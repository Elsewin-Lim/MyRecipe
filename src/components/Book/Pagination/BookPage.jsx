import React, { useEffect, useRef } from 'react';

const BookPage = React.forwardRef(function BookPage(props, ref) {
  const { index, html, className, style, ...rest } = props;
  const contentRef = useRef(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;

    function handleCarouselClick(event) {
      if (!(event.target instanceof Element)) return;

      const button = event.target.closest('[data-image-carousel-button]');
      if (!button || !root.contains(button)) return;

      const carousel = button.closest('[data-image-carousel]');
      const track = carousel?.querySelector('[data-image-carousel-track]');
      if (!track) return;

      event.preventDefault();
      event.stopPropagation();

      const direction =
        button.getAttribute('data-image-carousel-button') === 'prev' ? -1 : 1;

      track.scrollBy({
        left: direction * track.clientWidth,
        behavior: 'smooth',
      });
    }

    root.addEventListener('click', handleCarouselClick);

    return () => root.removeEventListener('click', handleCarouselClick);
  }, [html]);

  return (
    <div
      {...rest}
      ref={ref}
      className={`Page book-page ${
        index % 2 === 0 ? 'page-left' : 'page-right'
      } ${className || ''}`.trim()}
      style={style}
    >
      <div
        ref={contentRef}
        className="book-page-scaler"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});

export default BookPage;
