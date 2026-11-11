import React from 'react';
import './Page.css';
const Page = React.forwardRef((props, ref) => {
  const {
    number,
    children,
    className: libraryClassName,
    style: libraryStyle,
    ...restOfProps
  } = props;
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={`Page ${libraryClassName || ''} ${number % 2 === 0 ? 'page-left' : 'page-right'}`}
      style={{ ...libraryStyle }}
    >
      <h1>Page Header</h1>
      <div>{children}</div>
      <p>Page number: {number}</p>
    </div>
  );
});

export default Page;
