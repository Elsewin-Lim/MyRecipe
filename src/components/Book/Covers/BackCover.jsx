import React from 'react';
import '../Book.css';
import './BackCover.css';

const REPO_URL = 'https://github.com/Elsewin-Lim/MyRecipe';
const CONTRIBUTORS_URL =
  'https://contrib.rocks/image?repo=Elsewin-Lim/MyRecipe';

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
      className={`BackCover ${libraryClassName || ''}`.trim()}
      style={{ ...libraryStyle }}
    >
      <img
        className="Cover"
        src={`${import.meta.env.BASE_URL}BackCover.webp`}
        alt=""
      />

      <div className="BackCover__content">
        <div className="BackCover__summary">
          <p className="BackCover__blurb">
            A collaborative cookbook for the browser. Flip through recipes,
            follow each step, and take the shopping list with you.
          </p>

          <span className="BackCover__rule" aria-hidden="true" />

          <p className="BackCover__label">Contributors</p>

          <a
            className="BackCover__contributors"
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View MyRecipe contributors on GitHub"
          >
            <img
              src={CONTRIBUTORS_URL}
              alt="MyRecipe contributors"
              loading="lazy"
            />
          </a>
        </div>

        <div className="BackCover__footer">
          <a
            className="BackCover__repo"
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/Elsewin-Lim/MyRecipe
          </a>

          <div className="BackCover__colophon">
            <span className="BackCover__barcode" aria-hidden="true" />
            <span className="BackCover__edition">MyRecipe · Open Source</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BackCover;
