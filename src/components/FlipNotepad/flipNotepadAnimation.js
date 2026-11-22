import { formatMonthYear, formatWeekday } from './flipNotepadStorage';

export const FLIP_DURATION = 950;
export const FLIP_EASING = 'cubic-bezier(.45,.05,.35,1)';

const createDayHeader = (date) => {
  const header = document.createElement('header');
  header.className = 'FlipNotepad__header';

  const number = document.createElement('div');
  number.className = 'FlipNotepad__num';
  number.textContent = String(date.getDate());

  const meta = document.createElement('div');

  const month = document.createElement('div');
  month.className = 'FlipNotepad__mon';
  month.textContent = formatMonthYear(date);

  const weekday = document.createElement('div');
  weekday.className = 'FlipNotepad__wd';
  weekday.textContent = formatWeekday(date);

  meta.append(month, weekday);
  header.append(number, meta);

  return header;
};

export const createFlipElement = (stage, date, text) => {
  const flip = document.createElement('div');
  flip.className = 'FlipNotepad__flip';

  const front = document.createElement('div');
  front.className = 'FlipNotepad__face';

  const body = document.createElement('div');
  body.className = 'FlipNotepad__text';
  body.textContent = text;

  front.append(createDayHeader(date), body);

  const back = document.createElement('div');
  back.className = 'FlipNotepad__face FlipNotepad__face--back';

  flip.append(front, back);
  stage.append(flip);

  return flip;
};

export const spinFlip = (flip, up) => {
  flip.querySelectorAll('.FlipNotepad__face').forEach((face) => {
    face.animate(
      up
        ? [{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }]
        : [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }],
      { duration: FLIP_DURATION, easing: 'linear', fill: 'forwards' }
    );
  });

  return flip.animate(
    up
      ? [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }]
      : [{ transform: 'rotateX(180deg)' }, { transform: 'rotateX(0deg)' }],
    {
      duration: FLIP_DURATION,
      easing: FLIP_EASING,
      fill: 'forwards',
    }
  );
};
