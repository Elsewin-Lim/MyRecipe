import { useCallback, useEffect, useRef, useState } from 'react';
import { collectContentStyles } from '../../utils/collectContentStyles';
import { PAGE_PAD, paginateContent } from './Pagination/paginate';

const paginationCache = new Map();

function snapshotContent(source) {
  const content = document.createDocumentFragment();

  for (const node of Array.from(source.childNodes)) {
    content.appendChild(node.cloneNode(true));
  }

  return content;
}

async function waitForImages(content) {
  const images = Array.from(content.querySelectorAll?.('img') ?? []);

  await Promise.all(
    images.map(async (image) => {
      if (image.loading === 'lazy') image.loading = 'eager';

      const decoded = image.decode?.();
      if (decoded) await decoded.catch(() => undefined);
    })
  );

  if (document.fonts?.ready) await document.fonts.ready;
}

async function renderPages({ source, pageWidth, pageHeight }) {
  const content = snapshotContent(source);
  await waitForImages(content);

  const stylesheets = await collectContentStyles(source);
  const { pages } = await paginateContent(content, {
    pageWidth,
    pageHeight,
    pad: PAGE_PAD,
    stylesheets,
  });

  return pages.map((node) => node.outerHTML);
}

export function useBookPagination({
  sourceRef,
  contentKey,
  pageWidth,
  pageHeight,
  onError,
}) {
  const requestIdRef = useRef(0);
  const [pages, setPages] = useState(null);
  const [mountKey, setMountKey] = useState(0);

  const paginate = useCallback(async () => {
    const source = sourceRef.current;
    if (!source || !pageWidth || !pageHeight) return;

    const key = `${contentKey}:${pageWidth}x${pageHeight}`;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      if (!paginationCache.has(key)) {
        const task = renderPages({ source, pageWidth, pageHeight }).catch(
          (error) => {
            paginationCache.delete(key);
            throw error;
          }
        );

        paginationCache.set(key, task);

        for (const cacheKey of paginationCache.keys()) {
          if (!cacheKey.startsWith(`${contentKey}:`)) {
            paginationCache.delete(cacheKey);
          }
        }
      }

      const pageHtml = await paginationCache.get(key);
      if (requestId !== requestIdRef.current) return;

      setPages(pageHtml);
      setMountKey((value) => value + 1);
    } catch (error) {
      console.error('[Book] pagination failed', error);
      onError?.(error);
    }
  }, [contentKey, pageWidth, pageHeight, sourceRef, onError]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      paginate();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [paginate]);

  return { pages, mountKey };
}
