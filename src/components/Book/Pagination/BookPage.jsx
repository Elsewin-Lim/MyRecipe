import React from 'react';

const BookPage = React.forwardRef(function BookPage(props, ref) {
  const { index, html, className, style, ...rest } = props;

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
        className="book-page-scaler"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});

export default BookPage;
