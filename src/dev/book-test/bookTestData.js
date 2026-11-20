import heroImage from '../../assets/hero.png';

export const BOOK_TEST_VERSION = 'v5';

export const TEST_IMAGES = {
  hero: heroImage,
  page: `${import.meta.env.BASE_URL}Page.webp`,
  icon: `${import.meta.env.BASE_URL}favicon-512.png`,
};

export const TEST_TEXTAREA_TEXT = `Line one: a short note.
Line two: a much longer note that should wrap inside the textarea.
Line three: the quick brown fox jumps over the lazy dog.
Line four: 0123456789 0123456789 0123456789 0123456789.
Line five: this text is here to give the textarea real height.`;

export const TEST_PARAGRAPHS = [
  'Pagination needs enough content to cross a page boundary. This paragraph exists only so the test book has a realistic amount of body copy to measure. It should flow naturally from one page to the next without clipping, overlapping the page edges, or leaving unexpected blank space.',
  'The next paragraph adds more height. A page that breaks correctly will continue this text on the following page, keeping the line height and margins intact. A page that breaks incorrectly will either clip the last line or push the entire block to a new page even though there was room for most of it.',
  'Images are a common source of pagination bugs because their dimensions are not known until the browser has loaded them. If the paginator runs before an image is decoded, it can reserve the wrong amount of space and make a bad break decision. The image section below is deliberately mixed with text.',
  'Tables are another good stress test. Cells can be taller than expected, captions can wrap, and a table that is allowed to split needs its header and rows handled sensibly. The table below is small enough to fit, but the long unbroken value after it is not.',
  'Fixed-height controls such as textareas do not grow with their content. If one lands near the bottom of a page, the paginator must decide whether to keep it together or move it. The CSS below uses break-inside: avoid on the textarea and its label so that the decision is visible.',
  'Repeated paragraphs are useful for checking that later pages behave the same as earlier pages. If page five is laid out differently from page two, something in the measurement or the stylesheet is inconsistent. This paragraph is repeated with small variations further down the test document.',
];

export const TEST_TABLE_ROWS = [
  ['Ingredient', 'Quantity', 'Notes'],
  ['Flour', '250 g', 'Sifted'],
  ['Butter', '120 g', 'Room temperature'],
  ['Sugar', '90 g', 'Fine grain'],
  ['Eggs', '2', 'Beaten'],
  ['Milk', '180 ml', 'Whole milk'],
  ['Salt', '1 pinch', 'Optional'],
];

export const TEST_LONG_VALUE = `https://example.com/${'very-long-unbroken-segment-\u200B'.repeat(10)}end`;
