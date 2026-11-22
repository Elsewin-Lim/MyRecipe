import './FlipNotepad.css';
import {
  dateKey,
  formatMonthYear,
  formatWeekday,
  parseDateKey,
} from './flipNotepadStorage';
import { useFlipNotepad } from './useFlipNotepad';

const RINGS = Array.from({ length: 12 }, (_, index) => index);

export default function FlipNotepad({
  initialDate,
  storagePrefix,
  theme,
  className = '',
  style,
}) {
  const {
    current,
    draft,
    stageRef,
    textareaRef,
    goToDate,
    goToToday,
    step,
    handleInput,
  } = useFlipNotepad({ initialDate, storagePrefix });

  const rootClassName = ['FlipNotepad', className].filter(Boolean).join(' ');

  return (
    <section
      className={rootClassName}
      data-theme={theme}
      style={style}
      aria-label="Flip notepad"
    >
      <div className="FlipNotepad__stage" ref={stageRef}>
        <div className="FlipNotepad__rings" aria-hidden="true">
          {RINGS.map((index) => (
            <i key={index} />
          ))}
        </div>

        <div className="FlipNotepad__sheet">
          <header className="FlipNotepad__header">
            <div className="FlipNotepad__num">{current.getDate()}</div>
            <div>
              <div className="FlipNotepad__mon">{formatMonthYear(current)}</div>
              <div className="FlipNotepad__wd">{formatWeekday(current)}</div>
            </div>
          </header>

          <textarea
            className="FlipNotepad__text"
            ref={textareaRef}
            value={draft}
            onChange={handleInput}
            placeholder="Write your notes for today…"
            aria-label="Notes for this day"
            spellCheck
          />
        </div>
      </div>

      <nav className="FlipNotepad__nav" aria-label="Notepad navigation">
        <button
          type="button"
          onClick={() => step(-1)}
          title="Previous day (Alt + ←)"
        >
          ← Previous day
        </button>

        <button type="button" onClick={goToToday}>
          Today
        </button>

        <input
          type="date"
          value={dateKey(current)}
          onChange={(event) => {
            const date = parseDateKey(event.target.value);
            if (date) goToDate(date);
          }}
          aria-label="Jump to a date"
        />

        <button
          type="button"
          onClick={() => step(1)}
          title="Next day (Alt + →)"
        >
          Next day →
        </button>
      </nav>

      <div className="FlipNotepad__hint">
        Notes save automatically in this browser.
      </div>
    </section>
  );
}
