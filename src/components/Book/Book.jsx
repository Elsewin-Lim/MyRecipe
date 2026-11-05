import HTMLFlipBook from 'react-pageflip-enhanced';
import React from 'react';
import './Book.css';
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="Page" ref={ref}>
      <h1>Page Header</h1>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});

function MyBook() {
  return (
    <HTMLFlipBook
      className="RecipeBook"
      width={350}
      height={500}
      showCover={true}
      size="stretch"
    >
      <Page number="1">Page text</Page>
      <Page number="2">Page text</Page>
      <Page number="3">Page text</Page>
      <Page number="4">Page text</Page>
    </HTMLFlipBook>
  );
}

export default MyBook;
