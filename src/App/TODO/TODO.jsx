import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { recipes } from '../../data/recipe';
import './TODO.css';

function CookingTimer() {
  const [endsAt, setEndsAt] = useState(null);
  const [secondsLeft, setSecondLeft] = useState(0);

  useEffect(() => {
    if (endsAt === null) return;

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondLeft(remaining);

      if (remaining === 0) setEndsAt(null);
    }, 250);

    return () => window.clearInterval(interval);
  }, [endsAt]);

  function startTimer(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const hours = Number(fields.get('hours'));
    const minutes = Number(fields.get('minutes'));
    const extraSeconds = Number(fields.get('seconds'));
    const seconds = hours * 3600 + minutes * 60 + extraSeconds;
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    setSecondLeft(seconds);
    setEndsAt(Date.now() + seconds * 1000);
  }

  function resetTimer() {
    setEndsAt(null);
    setSecondLeft(0);
  }

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
        <label htmlFor="timer-hours">Hours</label>
        <input
          id="timer-hours"
          name="hours"
          type="number"
          min="0"
          step="1"
          placeholder="0"
        />

        <label htmlFor="timer-minutes">Minutes</label>
        <input
          id="timer-minutes"
          name="minutes"
          type="number"
          min="0"
          step="1"
          placeholder="0"
        />

        <label htmlFor="timer-seconds">Seconds</label>
        <input
          id="timer-seconds"
          name="seconds"
          type="number"
          min="0"
          step="1"
          placeholder="0"
        />
        <button type="submit">Start</button>
        <button type="button" onClick={resetTimer}>
          Reset
        </button>
      </form>
    </section>
  );
}

function CookingGuide({ recipe }) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = recipe.instructions ?? [];
  const hasSteps = steps.length > 0;
  const finished = hasSteps && stepIndex === steps.length;

  return (
    <main className="cookingGuide">
      <h1>{recipe.name}</h1>
      <CookingTimer />
      <div className="cookingGuideRow">
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
          <div className="cookingStepControls">
            <button
              className="cookingNext"
              type="buttom"
              onClick={() => setStepIndex(finished ? 0 : stepIndex + 1)}
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
        )}
      </div>
    </main>
  );
}

export default function TODO() {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('recipe');
  const recipe = recipes.find((item) => String(item.id) === recipeId);

  if (!recipe) {
    return (
      <main className="cookingGuide">
        <h1>Cooking instructions</h1>
        <p>Open a recipe card and click Instruction to get started.</p>
      </main>
    );
  }

  return <CookingGuide key={recipe.id} recipe={recipe} />;
}
