import React from 'react';
import '../Book.css';
const BackCover = React.forwardRef((props, ref) => {
  const {
    className: libraryClassName,
    style: libraryStyle,
    ...restOfProps
  } = props;
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={`${libraryClassName || ''}`}
      style={{ ...libraryStyle }}
    >
      <video
        className="Cover"
        src={`${import.meta.env.BASE_URL}Cover.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
});

export default BackCover;
