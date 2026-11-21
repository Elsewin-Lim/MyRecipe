import './book-paged.css';

export const PAGE_PAD = 16;

const CONTENT_STYLE_HREF = 'book-paged.css';

function buildPageStyles(pageWidth, pageHeight, pad) {
  return `
@page {
  size: ${pageWidth}px ${pageHeight}px;
  margin: ${pad}px;
}

.pagedjs_pages {
  margin: 0 !important;
}

.pagedjs_page {
  margin: 0 !important;
  box-shadow: none !important;
}

.pagedjs_pagebox {
  box-shadow: none !important;
}
`;
}

function extractPages(flow, pad) {
  return flow.pages.map((page) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'book-page-content';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.height = '100%';
    wrapper.style.overflow = 'hidden';
    wrapper.style.padding = `${pad}px`;

    if (page && page.area) {
      const source = page.area.querySelector(':scope > div') || page.area;
      Array.from(source.childNodes).forEach((node) => {
        wrapper.appendChild(node.cloneNode(true));
      });
    }

    if (wrapper.lastElementChild) {
      wrapper.lastElementChild.style.marginBottom = '0';
    }

    return wrapper;
  });
}

export async function paginateContent(
  content,
  { pageWidth, pageHeight, pad = PAGE_PAD, stylesheets = [] } = {}
) {
  if (!content) {
    throw new Error('paginateContent requires a content element');
  }
  if (!pageWidth || !pageHeight) {
    throw new Error('paginateContent requires pageWidth and pageHeight');
  }

  const width = Math.floor(pageWidth);
  const height = Math.floor(pageHeight);
  const contentStylesheets = Array.isArray(stylesheets)
    ? stylesheets
    : [stylesheets];

  const staging = document.createElement('div');
  staging.className = 'book-pagination-staging';
  staging.setAttribute('aria-hidden', 'true');
  staging.style.cssText = 'position:absolute;left:-100000px;top:0;';
  document.body.appendChild(staging);

  const { Previewer } = await import('pagedjs');
  const previewer = new Previewer();
  let flow;

  try {
    const allStylesheets = [
      ...contentStylesheets,
      { [CONTENT_STYLE_HREF]: buildPageStyles(width, height, pad) },
    ];

    flow = await previewer.preview(content, allStylesheets, staging);

    return { pages: extractPages(flow, pad), total: flow.total };
  } finally {
    if (flow && Array.isArray(flow.pages)) {
      flow.pages.forEach((page) => {
        try {
          page.removeListeners?.();
        } catch {
          // Cleanup is best-effort.
        }
      });
    }

    staging.remove();

    try {
      previewer.polisher.destroy();
    } catch {
      // Cleanup is best-effort.
    }
  }
}
