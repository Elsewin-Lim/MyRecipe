import { useState } from 'react';
import './book-test.css';
import {
  TEST_IMAGES,
  TEST_LONG_VALUE,
  TEST_PARAGRAPHS,
  TEST_TABLE_ROWS,
  TEST_TEXTAREA_TEXT,
} from './bookTestData';

function ControlledNote() {
  const [value, setValue] = useState(
    'This textarea is controlled by React. Its current value is held in state.'
  );

  return (
    <textarea
      className="book-test__textarea"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      rows={4}
    />
  );
}

function ImageSection() {
  return (
    <article className="book-test__entry">
      <h2>Images</h2>
      <p>
        These images have different aspect ratios. The wide one should stay with
        its caption, and the tall one should not be split across two pages.
      </p>

      <figure className="book-test__figure">
        <img src={TEST_IMAGES.hero} alt="Wide test" loading="eager" />
        <figcaption>A wide image with a caption.</figcaption>
      </figure>

      <figure className="book-test__figure book-test__figure--tall">
        <img src={TEST_IMAGES.page} alt="Tall test" loading="eager" />
        <figcaption>A tall image, kept together with its caption.</figcaption>
      </figure>

      <div className="book-test__image-row">
        <img src={TEST_IMAGES.icon} alt="Icon test" loading="eager" />
        <img src={TEST_IMAGES.page} alt="Small page test" loading="eager" />
        <img src={TEST_IMAGES.hero} alt="Small hero test" loading="eager" />
      </div>
    </article>
  );
}

function TextareaSection() {
  return (
    <article className="book-test__entry">
      <h2>Textareas and inputs</h2>

      <label className="book-test__label">
        Uncontrolled textarea with a default value
        <textarea
          className="book-test__textarea"
          defaultValue={TEST_TEXTAREA_TEXT}
          rows={6}
        />
      </label>

      <label className="book-test__label">
        Controlled textarea
        <ControlledNote />
      </label>

      <label className="book-test__label">
        Single-line input
        <input
          className="book-test__input"
          defaultValue="An input, not a textarea"
        />
      </label>
    </article>
  );
}

function TableSection() {
  return (
    <article className="book-test__entry">
      <h2>Table</h2>

      <table className="book-test__table">
        <tbody>
          {TEST_TABLE_ROWS.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) =>
                rowIndex === 0 ? (
                  <th key={cellIndex}>{cell}</th>
                ) : (
                  <td key={cellIndex}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

function LongValueSection() {
  return (
    <article className="book-test__entry book-test__entry--forced">
      <h2>Long unbroken value</h2>
      <p className="book-test__long-value">{TEST_LONG_VALUE}</p>
    </article>
  );
}

function ForcedBreakSection() {
  return (
    <article className="book-test__entry book-test__entry--forced">
      <h2>Forced page break</h2>
      <p>
        This entry has <code>break-before: page</code>. It should always start a
        new page, even if the previous page still has room.
      </p>
    </article>
  );
}

function NoBreakSection() {
  return (
    <article className="book-test__entry">
      <h2>Break-inside: avoid</h2>
      <div className="book-test__no-break">
        <p>
          This box contains a textarea and should be kept on one page. If it is
          near the bottom of a page, the whole box should move.
        </p>
        <textarea
          className="book-test__textarea"
          defaultValue={TEST_TEXTAREA_TEXT}
          rows={5}
        />
      </div>
    </article>
  );
}

export default function BookTestContent() {
  return (
    <>
      <article className="book-test__entry book-test__entry--first">
        <h1>Book pagination test</h1>
        <p className="book-test__meta">
          Images, textareas, tables, forced breaks, and long unbroken values.
        </p>

        {TEST_PARAGRAPHS.slice(0, 2).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      <ImageSection />
      <TextareaSection />
      <TableSection />
      <LongValueSection />

      <article className="book-test__entry">
        <h2>Repeated long content</h2>
        {TEST_PARAGRAPHS.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      <ForcedBreakSection />
      <NoBreakSection />

      <article className="book-test__entry">
        <h2>Tail content</h2>
        {TEST_PARAGRAPHS.slice(0, 3).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
    </>
  );
}
