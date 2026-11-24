import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { getAllRecipes } from '../../data/recipeDatabase';
import { useStore } from '../../context/useStore';
import './TODO.css';

function TimerInput({ hour, setHour, minute, setMinute, second, setSecond }) {
  const handleTime = (event) => {
    const raw = event.target.value;
    const id = event.target.id;

    if (raw === '') {
      if (id === 'timer-hours') setHour(0);
      if (id === 'timer-minutes') setMinute(0);
      if (id === 'timer-seconds') setSecond(0);
      return;
    }
    const cleaned = raw.replace(/^0+(?=\d)/, '');
    const time = Math.floor(Math.max(0, Number(cleaned)));
    if (Number.isNaN(time)) return;
    if (id === 'timer-seconds') {
      const extraMinutes = Math.floor(time / 60);
      const totalMinutes = minute + extraMinutes;
      const extraHours = Math.floor(totalMinutes / 60);

      setSecond(time % 60);
      setMinute(totalMinutes % 60);
      if (extraHours > 0) {
        setHour((prev) => prev + extraHours);
      }
    } else if (id === 'timer-minutes') {
      const extraHours = Math.floor(time / 60);
      setMinute(time % 60);
      if (extraHours > 0) {
        setHour((prev) => prev + extraHours);
      }
    } else if (id === 'timer-hours') {
      setHour(time);
    }
  };
  return (
    <div className="cookingTimerFields">
      <div className="cookingTimerField">
        <label htmlFor="timer-hours">Hours</label>
        <input
          id="timer-hours"
          name="hours"
          type="number"
          value={hour}
          min="0"
          max="60"
          step="1"
          onFocus={(e) => e.target.select()}
          onChange={handleTime}
          placeholder="0"
        />
      </div>

      <div className="cookingTimerField">
        <label htmlFor="timer-minutes">Minutes</label>
        <input
          id="timer-minutes"
          name="minutes"
          type="number"
          value={minute}
          min="0"
          max="60"
          step="1"
          onFocus={(e) => e.target.select()}
          onChange={handleTime}
          placeholder="0"
        />
      </div>

      <div className="cookingTimerField">
        <label htmlFor="timer-seconds">Seconds</label>
        <input
          id="timer-seconds"
          name="seconds"
          type="number"
          value={second}
          min="0"
          step="1"
          onFocus={(e) => e.target.select()}
          onChange={handleTime}
          placeholder="0"
        />
      </div>
    </div>
  );
}

function CookingTimer({ resetRef }) {
  const [endsAt, setEndsAt] = useState(null);
  const [secondsLeft, setSecondLeft] = useState(0);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const { showToast } = useStore();

  useEffect(() => {
    if (endsAt === null) return;

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondLeft(remaining);

      if (remaining === 0) {
        setEndsAt(null);
        showToast('Cooking timer finished', {
          id: 'cooking-timer-done',
          type: 'success',
        });
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [endsAt, showToast]);

  function startTimer(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const hours = Number(fields.get('hours'));
    const minutes = Number(fields.get('minutes'));
    const extraSeconds = Number(fields.get('seconds'));
    const seconds = hours * 3600 + minutes * 60 + extraSeconds;
    if (!Number.isFinite(seconds) || seconds <= 0) {
      showToast('Set a timer longer than zero', {
        id: 'cooking-timer-invalid',
        type: 'warning',
      });
      return;
    }

    setSecondLeft(seconds);
    setEndsAt(Date.now() + seconds * 1000);
    showToast('Cooking timer started', {
      id: 'cooking-timer-start',
      type: 'success',
    });
  }

  function resetTimer() {
    setEndsAt(null);
    setSecondLeft(0);
    setHour(0);
    setMinute(0);
    setSecond(0);
    showToast('Cooking timer reset', {
      id: 'cooking-timer-reset',
      type: 'info',
    });
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetTimer;
  });

  const display = [
    Math.floor(secondsLeft / 3600),
    Math.floor((secondsLeft % 3600) / 60),
    secondsLeft % 60,
  ]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  return (
    <section className="cookingTimer">
      <h2>Cooking Timer</h2>
      <div className="cookingTimerDisplay" role="timer">
        {display}
      </div>
      <form onSubmit={startTimer}>
        <TimerInput
          hour={hour}
          setHour={setHour}
          minute={minute}
          setMinute={setMinute}
          second={second}
          setSecond={setSecond}
        />

        <div className="cookingTimerActions">
          <button className="cookingTimerStart" type="submit">
            Start
          </button>
          <button
            className="cookingTimerReset"
            type="button"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

function CookingGuide({ recipe }) {
  const [stepIndex, setStepIndex] = useState(0);
  const timerResetRef = useRef(null);
  const steps = recipe.instructions ?? [];
  const hasSteps = steps.length > 0;
  const finished = hasSteps && stepIndex === steps.length;

  return (
    <main className="cookingGuide">
      <h1>{recipe.title ?? recipe.name}</h1>
      <CookingTimer resetRef={timerResetRef} />
      <div className={`cookingGuideRow${hasSteps ? '' : ' single'}`}>
        <section className="cookingStep" aria-live="polite">
          {finished ? (
            <h2>Recipe Complete!</h2>
          ) : hasSteps ? (
            <>
              <h2>
                Step {stepIndex + 1} of {steps.length}
              </h2>
              <p>{steps[stepIndex]}</p>
            </>
          ) : (
            <p>Cooking instructions haven't been added for this recipe yet.</p>
          )}
        </section>

        {hasSteps && (
          <>
            <div className="cookingDivider" aria-hidden="true" />

            <div className="cookingStepControls">
              <button
                className="cookingNext"
                type="button"
                onClick={() => {
                  const isFinishing =
                    !finished && stepIndex === steps.length - 1;
                  setStepIndex(finished ? 0 : stepIndex + 1);
                  if (isFinishing || finished) {
                    timerResetRef.current?.();
                  }
                }}
              >
                {finished
                  ? 'Start over'
                  : stepIndex === steps.length - 1
                    ? 'Finish recipe'
                    : 'Next step →'}
              </button>

              <button
                className="cookingNext"
                type="button"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
              >
                ← Previous step
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function TODO() {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('recipe');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAllRecipes()
      .then((storedRecipes) => {
        if (active) setRecipes(storedRecipes);
      })
      .catch((error) => {
        console.error('Error loading recipes:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="cookingGuide empty">
        <h1>Cooking instructions</h1>
        <p>Loading recipes…</p>
      </main>
    );
  }

  const recipe = recipes.find((item) => String(item.id) === recipeId);

  if (!recipe) {
    return (
      <main className="cookingGuide empty">
        <h1>Cooking instructions</h1>
        <p>Open a recipe card and click Instruction to get started.</p>
      </main>
    );
  }

  return <CookingGuide key={recipe.id} recipe={recipe} />;
}
