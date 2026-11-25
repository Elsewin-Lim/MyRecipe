import { useEffect, useRef, useState } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';
import ComboBox from '../ComboBox/ComboBox';
import { ingredientLibrary } from '../../data/recipe';
import { INGREDIENT_OPTIONS, UNIT_OPTIONS } from '../../data/ingredientOptions';
import {
  clearRecipeDraft,
  getRecipeDraftKey,
  readRecipeDraft,
  writeRecipeDraft,
} from '../../data/recipeDraft';
import {
  combineSeconds,
  instructionSeconds,
  instructionText,
  splitSeconds,
} from '../../data/recipeModel';
import { useStore } from '../../context/useStore';

const ingredientById = new Map(
  ingredientLibrary.map((ingredient) => [ingredient.id, ingredient])
);

const DEFAULT_INGREDIENT_ID = ingredientLibrary[0]?.id ?? '';

function createIngredientRow(item) {
  if (typeof item === 'string') {
    const name = item.trim();
    const match =
      ingredientById.get(name) ??
      ingredientLibrary.find(
        (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()
      );

    if (!match) {
      return {
        id: `custom:${crypto.randomUUID()}`,
        name,
        quantity: 1,
        unit: '',
      };
    }

    return { id: match.id, quantity: 1, unit: match.unit ?? '' };
  }

  const libraryItem = item?.id ? ingredientById.get(item.id) : undefined;

  return {
    id: item?.id ?? DEFAULT_INGREDIENT_ID,
    quantity: item?.quantity ?? 1,
    name: item?.name,
    unit: item?.unit ?? libraryItem?.unit ?? '',
  };
}

function createInstructionRow(step) {
  const { hours, minutes, seconds } = splitSeconds(instructionSeconds(step));

  return { text: instructionText(step), hours, minutes, seconds };
}

function createInstructionDraftRow(row) {
  return {
    text: typeof row?.text === 'string' ? row.text : '',
    hours: row?.hours ?? 0,
    minutes: row?.minutes ?? 0,
    seconds: row?.seconds ?? 0,
  };
}

function RecipeForm({
  onAddRecipe,
  editingRecipe,
  onUpdateRecipe,
  onCancelEdit,
}) {
  const isEditing = Boolean(editingRecipe);
  const { showToast } = useStore();
  const draftKey = getRecipeDraftKey(editingRecipe);
  const skipDraftWriteRef = useRef(false);
  const [initialDraft] = useState(() => readRecipeDraft(draftKey));

  const [title, setTitle] = useState(() =>
    initialDraft ? initialDraft.title : (editingRecipe?.title ?? '')
  );
  const [category, setCategory] = useState(() =>
    initialDraft
      ? initialDraft.category
      : (editingRecipe?.category ?? 'Breakfast')
  );
  const [ingredientRows, setIngredientRows] = useState(() => {
    if (initialDraft?.ingredientRows) {
      return initialDraft.ingredientRows.length > 0
        ? initialDraft.ingredientRows.map(createIngredientRow)
        : [createIngredientRow({ id: DEFAULT_INGREDIENT_ID, quantity: 1 })];
    }

    const ingredients = editingRecipe?.ingredients ?? [];
    return ingredients.length > 0
      ? ingredients.map(createIngredientRow)
      : [createIngredientRow({ id: DEFAULT_INGREDIENT_ID, quantity: 1 })];
  });
  const [instructionRows, setInstructionRows] = useState(() => {
    if (initialDraft?.instructionRows) {
      return initialDraft.instructionRows.length > 0
        ? initialDraft.instructionRows.map(createInstructionDraftRow)
        : [createInstructionRow()];
    }

    const instructions = editingRecipe?.instructions ?? [];
    return instructions.length > 0
      ? instructions.map(createInstructionRow)
      : [createInstructionRow()];
  });
  const [images, setImages] = useState(() =>
    initialDraft ? initialDraft.images : (editingRecipe?.images ?? [])
  );

  useEffect(() => {
    if (skipDraftWriteRef.current) {
      skipDraftWriteRef.current = false;
      return;
    }

    writeRecipeDraft(draftKey, {
      title,
      category,
      ingredientRows,
      instructionRows,
      images,
    });
  }, [draftKey, title, category, ingredientRows, instructionRows, images]);

  const updateIngredientRow = (index, changes) => {
    setIngredientRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...changes } : row
      )
    );
  };

  const addIngredientRow = () => {
    setIngredientRows((previous) => [
      ...previous,
      createIngredientRow({ id: DEFAULT_INGREDIENT_ID, quantity: 1 }),
    ]);
  };

  const removeIngredientRow = (index) => {
    setIngredientRows((previous) =>
      previous.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const updateInstructionRow = (index, changes) => {
    setInstructionRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...changes } : row
      )
    );
  };

  const addInstructionRow = () => {
    setInstructionRows((previous) => [...previous, createInstructionRow()]);
  };

  const removeInstructionRow = (index) => {
    setInstructionRows((previous) =>
      previous.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientList = ingredientRows
      .map((row) => {
        const quantity = Number(row.quantity);
        const unit = String(row.unit ?? '').trim();
        const ingredient = { id: row.id, quantity };

        if (!ingredientById.has(row.id) && row.name) {
          ingredient.name = row.name;
        }

        if (unit) ingredient.unit = unit;

        return ingredient;
      })
      .filter(
        (item) => item.id && Number.isFinite(item.quantity) && item.quantity > 0
      );

    if (!title.trim() || ingredientList.length === 0) {
      showToast('Fill in the title and at least one ingredient.', {
        type: 'error',
      });
      return;
    }

    const instructionList = instructionRows
      .map((row) => ({
        text: row.text.trim(),
        seconds: combineSeconds(row.hours, row.minutes, row.seconds),
      }))
      .filter((step) => step.text);

    const totalSeconds = instructionList.reduce(
      (total, step) => total + step.seconds,
      0
    );

    const cookingTime =
      totalSeconds > 0
        ? Math.max(1, Math.round(totalSeconds / 60))
        : Number(editingRecipe?.cookingTime) || 0;

    const recipe = {
      title: title.trim(),
      category,
      cookingTime,
      ingredients: ingredientList,
      instructions: instructionList,
      images,
    };

    try {
      const saved = isEditing
        ? await onUpdateRecipe({
            ...editingRecipe,
            ...recipe,
          })
        : await onAddRecipe({
            id: crypto.randomUUID(),
            ...recipe,
          });

      if (saved === false) return;

      skipDraftWriteRef.current = true;
      clearRecipeDraft(draftKey);

      setTitle('');
      setCategory('Breakfast');
      setIngredientRows([createIngredientRow({ id: DEFAULT_INGREDIENT_ID })]);
      setInstructionRows([createInstructionRow()]);
      setImages([]);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <h2>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>

      <label htmlFor="recipe-title">Recipe title</label>

      <input
        id="recipe-title"
        type="text"
        placeholder="e.g. Chicken Curry"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="recipe-category">Category</label>

      <select
        id="recipe-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Dessert">Dessert</option>
      </select>

      <fieldset className="recipe-ingredient-rows">
        <legend>Ingredients</legend>

        {ingredientRows.map((row, index) => {
          const ingredient = ingredientById.get(row.id);
          const ingredientOptions =
            ingredient || !row.name
              ? INGREDIENT_OPTIONS
              : [...INGREDIENT_OPTIONS, { value: row.id, label: row.name }];

          return (
            <div className="ingredient-row" key={index}>
              <ComboBox
                className="ingredient-name"
                ariaLabel={`Ingredient ${index + 1}`}
                options={ingredientOptions}
                value={row.id}
                placeholder="Ingredient"
                allowCustom
                onChange={(nextValue) => {
                  const libraryItem = ingredientById.get(nextValue);

                  updateIngredientRow(index, {
                    id: nextValue,
                    name: undefined,
                    unit: libraryItem?.unit ?? '',
                  });
                }}
                onCreateCustom={(label) =>
                  updateIngredientRow(index, {
                    id: `custom:${crypto.randomUUID()}`,
                    name: label,
                  })
                }
              />

              <input
                className="ingredient-quantity"
                type="number"
                aria-label={`Quantity for ingredient ${index + 1}`}
                placeholder="Qty"
                min="0"
                step="any"
                value={row.quantity}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  updateIngredientRow(index, { quantity: e.target.value })
                }
              />

              <ComboBox
                className="ingredient-unit-field"
                ariaLabel={`Unit for ingredient ${index + 1}`}
                options={UNIT_OPTIONS}
                value={String(row.unit ?? '')}
                placeholder="Unit"
                allowCustom
                onChange={(nextValue) =>
                  updateIngredientRow(index, { unit: nextValue })
                }
                onQueryChange={(nextValue) =>
                  updateIngredientRow(index, { unit: nextValue })
                }
              />

              <button
                type="button"
                className="ingredient-remove"
                onClick={() => removeIngredientRow(index)}
                disabled={ingredientRows.length === 1}
              >
                Remove
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="ingredient-add"
          onClick={addIngredientRow}
        >
          + Add ingredient
        </button>
      </fieldset>

      <fieldset className="recipe-instruction-rows">
        <legend>Instructions</legend>

        {instructionRows.map((row, index) => (
          <div className="instruction-row" key={index}>
            <input
              className="instruction-text"
              type="text"
              aria-label={`Step ${index + 1} description`}
              placeholder="Describe this step"
              value={row.text}
              onChange={(e) =>
                updateInstructionRow(index, { text: e.target.value })
              }
            />

            <div className="instruction-time">
              <label className="instruction-time-field">
                Hours
                <input
                  type="number"
                  aria-label={`Step ${index + 1} hours`}
                  min="0"
                  step="1"
                  value={row.hours}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    updateInstructionRow(index, { hours: e.target.value })
                  }
                />
              </label>

              <label className="instruction-time-field">
                Minutes
                <input
                  type="number"
                  aria-label={`Step ${index + 1} minutes`}
                  min="0"
                  step="1"
                  value={row.minutes}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    updateInstructionRow(index, { minutes: e.target.value })
                  }
                />
              </label>

              <label className="instruction-time-field">
                Seconds
                <input
                  type="number"
                  aria-label={`Step ${index + 1} seconds`}
                  min="0"
                  step="1"
                  value={row.seconds}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    updateInstructionRow(index, { seconds: e.target.value })
                  }
                />
              </label>

              <button
                type="button"
                className="ingredient-remove"
                onClick={() => removeInstructionRow(index)}
                disabled={instructionRows.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="instruction-add"
          onClick={addInstructionRow}
        >
          + Add step
        </button>
      </fieldset>

      <label>Recipe images</label>

      <ImageUploader images={images} onChange={setImages} />

      <button type="submit">
        {isEditing ? 'Update Recipe' : 'Add Recipe'}
      </button>

      {isEditing && (
        <button type="button" className="cancel-button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default RecipeForm;
