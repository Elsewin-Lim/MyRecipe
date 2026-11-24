import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAllRecipes } from '../../data/recipeDatabase';
import {
  clearCookingSession,
  getCookingSession,
  updateCookingStep,
} from '../../data/cookingSession';
import {
  instructionSeconds,
  instructionText,
  splitSeconds,
} from '../../data/recipeModel';
import { useStore } from '../../context/useStore';
import { useTimer } from '../../context/timerContext';
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

function CookingTimer({ initialSeconds = 0 }) {
  const { isRunning, remainingSeconds, hasFinished, startTimer, clearTimer } =
    useTimer();
  const [second, setSecond] = useState(
    () => splitSeconds(initialSeconds).seconds
  );
  const [minute, setMinute] = useState(
    () => splitSeconds(initialSeconds).minutes
  );
  const [hour, setHour] = useState(() => splitSeconds(initialSeconds).hours);
  const defaultTime = splitSeconds(initialSeconds);
  const { showToast } = useStore();
  const displaySeconds = isRunning
    ? remainingSeconds
    : hasFinished
      ? 0
      : initialSeconds;

  function handleStartTimer(event) {
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

    startTimer(seconds);
    showToast('Cooking timer started', {
      id: 'cooking-timer-start',
      type: 'success',
    });
  }

  function handleResetTimer() {
    clearTimer();
    setHour(defaultTime.hours);
    setMinute(defaultTime.minutes);
    setSecond(defaultTime.seconds);
    showToast('Cooking timer reset', {
      id: 'cooking-timer-reset',
      type: 'info',
    });
  }

  const display = [
    Math.floor(displaySeconds / 3600),
    Math.floor((displaySeconds % 3600) / 60),
    displaySeconds % 60,
  ]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  return (
    <section className="cookingTimer">
      <h2>Cooking Timer</h2>
      <div className="cookingTimerDisplay" role="timer">
        {display}
      </div>
      <form onSubmit={handleStartTimer}>
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
            onClick={handleResetTimer}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

function CookingGuide({ recipe, initialStepIndex = 0 }) {
  const navigate = useNavigate();
  const { clearTimer } = useTimer();
  const steps = (recipe.instructions ?? [])
    .map((step) => ({
      text: instructionText(step),
      seconds: instructionSeconds(step),
    }))
    .filter((step) => step.text);
  const hasSteps = steps.length > 0;
  const lastStepIndex = Math.max(0, steps.length - 1);
  const safeInitialStep = Math.min(
    Math.max(0, initialStepIndex),
    lastStepIndex
  );
  const [stepIndex, setStepIndex] = useState(safeInitialStep);
  const currentStep = hasSteps ? steps[stepIndex] : null;
  const isLastStep = hasSteps && stepIndex === lastStepIndex;
  const currentStepSeconds = currentStep?.seconds ?? 0;

  function handleNext() {
    if (!hasSteps) return;

    if (isLastStep) {
      clearTimer();
      clearCookingSession();
      navigate('/MyRecipe');
      return;
    }

    const nextIndex = stepIndex + 1;

    clearTimer();
    setStepIndex(nextIndex);
    updateCookingStep(recipe.id, nextIndex);
  }

  function handlePrevious() {
    if (!hasSteps || stepIndex === 0) return;

    const previousIndex = stepIndex - 1;

    clearTimer();
    setStepIndex(previousIndex);
    updateCookingStep(recipe.id, previousIndex);
  }

  return (
    <main className="cookingGuide">
      <h1>{recipe.title ?? recipe.name}</h1>
      <CookingTimer key={stepIndex} initialSeconds={currentStepSeconds} />
      <div className={`cookingGuideRow${hasSteps ? '' : ' single'}`}>
        <section className="cookingStep" aria-live="polite">
          {hasSteps ? (
            <>
              <h2>
                Step {stepIndex + 1} of {steps.length}
              </h2>
              <p>{currentStep.text}</p>
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
                onClick={handleNext}
              >
                {isLastStep ? 'Finish recipe' : 'Next step →'}
              </button>

              <button
                className="cookingNext"
                type="button"
                disabled={stepIndex === 0}
                onClick={handlePrevious}
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
  const [session] = useState(() => getCookingSession());
  const recipeId = session?.recipeId ?? null;
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
        <p>Open a recipe card and click Cook to get started.</p>
      </main>
    );
  }

  return (
    <CookingGuide
      key={recipe.id}
      recipe={recipe}
      initialStepIndex={session?.stepIndex ?? 0}
    />
  );
}
