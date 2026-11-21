import HTMLFlipBook from 'react-pageflip-enhanced';
import './Book.css';
import './Pages/Page.css';
import FrontCover from './Covers/FrontCover';
import BackCover from './Covers/BackCover';
import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import { useStore } from '../../context/useStore';
import BookPage from './Pagination/BookPage';
import { useBookPagination } from './useBookPagination';
import {
  DEFAULT_BOOK_PAGE_KEY,
  readBookPage,
  resolveStartPage,
  writeBookPage,
} from './bookPageStorage';

const BASE_WIDTH = 350;
const BASE_HEIGHT = 500;
const PLACEHOLDER_PAGE =
  '<div class="book-page-content" style="box-sizing:border-box;height:100%;overflow:hidden;padding:16px"><div class="book-content">Laying out the recipe book…</div></div>';

function Book({
  children,
  contentKey,
  storageKey = DEFAULT_BOOK_PAGE_KEY,
  width = BASE_WIDTH,
  height = BASE_HEIGHT,
  className = 'RecipeBook',
  onInit,
  onChangeOrientation,
  onFlip,
  ...flipProps
}) {
  const instanceContentKey = useId();
  const resolvedContentKey = contentKey ?? instanceContentKey;
  const book = useRef(null);
  const sourceRef = useRef(null);
  const stageRef = useRef(null);
  const { setValue, showToast } = useStore();

  useEffect(() => {
    setValue('book', book);
  }, [setValue]);

  const handlePaginationError = useCallback(() => {
    showToast('The book could not be laid out. Try reloading.', {
      id: 'book-pagination-error',
      type: 'error',
      duration: 0,
    });
  }, [showToast]);

  const getBoundsRect = useCallback(() => {
    const flip = book.current?.pageFlip?.();
    return flip?.getBoundsRect?.() ?? null;
  }, []);

  const syncScale = useCallback(() => {
    const rect = getBoundsRect();
    const stage = stageRef.current;

    if (!rect?.pageWidth || !rect?.height || !stage) return;

    const scale = Math.min(rect.pageWidth / width, rect.height / height);
    stage.style.setProperty('--book-page-scale', String(scale));
  }, [getBoundsRect, width, height]);

  const { pages, mountKey } = useBookPagination({
    sourceRef,
    contentKey: resolvedContentKey,
    pageWidth: width,
    pageHeight: height,
    onError: handlePaginationError,
  });

  const startPage = useMemo(() => {
    if (pages === null) return 0;

    return resolveStartPage(readBookPage(storageKey), pages.length);
  }, [pages, storageKey]);

  const handleFlip = useCallback(
    (event) => {
      onFlip?.(event);

      if (pages === null) return;

      const flip = book.current?.pageFlip?.();
      const page =
        typeof event?.data === 'number'
          ? event.data
          : flip?.getCurrentPageIndex?.();
      const total = flip?.getPageCount?.();

      if (!Number.isInteger(page) || !Number.isInteger(total) || total <= 0) {
        return;
      }

      if (total !== pages.length + 2) return;

      writeBookPage(storageKey, page, total);
    },
    [onFlip, pages, storageKey]
  );

  const handleInit = useCallback(
    (event) => {
      onInit?.(event);
      requestAnimationFrame(syncScale);
    },
    [onInit, syncScale]
  );

  const handleOrientation = useCallback(
    (event) => {
      onChangeOrientation?.(event);
      requestAnimationFrame(syncScale);
    },
    [onChangeOrientation, syncScale]
  );

  useEffect(() => {
    let frame = 0;

    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncScale);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [syncScale]);

  const flipbookChildren = useMemo(() => {
    const body =
      pages === null
        ? [<BookPage key="placeholder" index={0} html={PLACEHOLDER_PAGE} />]
        : pages.map((html, index) => (
            <BookPage key={`page-${index}`} index={index} html={html} />
          ));

    return [
      <FrontCover key="front-cover" />,
      ...body,
      <BackCover key="back-cover" />,
    ];
  }, [pages]);

  return (
    <>
      <div ref={sourceRef} className="book-source" aria-hidden="true">
        {children}
      </div>

      <div
        ref={stageRef}
        className="book-stage"
        style={{
          '--book-page-width': `${width}px`,
          '--book-page-height': `${height}px`,
        }}
      >
        <HTMLFlipBook
          {...flipProps}
          key={mountKey}
          className={className}
          width={width}
          height={height}
          showCover={true}
          size="stretch"
          startPage={startPage}
          onInit={handleInit}
          onFlip={handleFlip}
          onChangeOrientation={handleOrientation}
          ref={book}
        >
          {flipbookChildren}
        </HTMLFlipBook>
      </div>
    </>
  );
}

export default Book;
