import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './ComboBox.css';

function ComboBox({
  id,
  className,
  options = [],
  value,
  onChange,
  onQueryChange,
  allowCustom = false,
  onCreateCustom,
  placeholder = '',
  disabled = false,
  inputMode,
  ariaLabel,
}) {
  const listboxId = useId();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const displayText = String(selectedOption?.label ?? value ?? '');

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (wrapperRef.current?.contains(event.target)) return;

      setOpen(false);
      setDirty(false);
      setHighlighted(-1);
      setQuery(displayText);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open, displayText]);

  const term = query.trim().toLowerCase();

  const visibleOptions = useMemo(() => {
    if (!dirty || !term) return options;

    return options.filter(
      (option) =>
        String(option.label).toLowerCase().includes(term) ||
        String(option.value).toLowerCase().includes(term)
    );
  }, [options, dirty, term]);

  const hasExactMatch = options.some(
    (option) =>
      String(option.label).toLowerCase() === term ||
      String(option.value).toLowerCase() === term
  );

  const showCustom = Boolean(allowCustom && dirty && term && !hasExactMatch);
  const itemCount = visibleOptions.length + (showCustom ? 1 : 0);

  useEffect(() => {
    if (!open || highlighted < 0) return;

    const option = wrapperRef.current?.querySelector(
      `[data-index="${highlighted}"]`
    );

    option?.scrollIntoView({ block: 'nearest' });
  }, [open, highlighted]);

  function resetInput() {
    setOpen(false);
    setDirty(false);
    setHighlighted(-1);
    setQuery(displayText);
  }

  function handleFocus(event) {
    if (disabled) return;

    setOpen(true);
    setDirty(false);
    setHighlighted(-1);
    setQuery(displayText);
    event.currentTarget.select();
  }

  function handleChange(event) {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setDirty(true);
    setOpen(true);
    setHighlighted(-1);
    onQueryChange?.(nextQuery);
  }

  function selectOption(option) {
    onChange?.(option.value, option);
    setQuery(String(option.label ?? option.value ?? ''));
    setOpen(false);
    setDirty(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  }

  function createCustom() {
    const label = query.trim();
    if (!label) return;

    if (onCreateCustom) {
      onCreateCustom(label);
    } else {
      onChange?.(label, { value: label, label, custom: true });
    }

    setQuery(label);
    setOpen(false);
    setDirty(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setDirty(false);
        setQuery(displayText);
        setHighlighted(itemCount > 0 ? 0 : -1);
        return;
      }

      if (itemCount === 0) return;

      setHighlighted((previous) =>
        previous < itemCount - 1 ? previous + 1 : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        setDirty(false);
        setQuery(displayText);
        setHighlighted(itemCount > 0 ? itemCount - 1 : -1);
        return;
      }

      if (itemCount === 0) return;

      setHighlighted((previous) =>
        previous > 0 ? previous - 1 : itemCount - 1
      );
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      resetInput();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (!open) {
        inputRef.current?.blur();
        return;
      }

      if (highlighted >= 0 && highlighted < visibleOptions.length) {
        selectOption(visibleOptions[highlighted]);
        return;
      }

      if (highlighted === visibleOptions.length && showCustom) {
        createCustom();
        return;
      }

      const exactOption = options.find(
        (option) =>
          String(option.label).toLowerCase() === term ||
          String(option.value).toLowerCase() === term
      );

      if (exactOption) {
        selectOption(exactOption);
        return;
      }

      if (allowCustom && term) {
        createCustom();
        return;
      }

      resetInput();
      inputRef.current?.blur();
      return;
    }

    if (event.key === 'Tab') {
      resetInput();
    }
  }

  const activeDescendant =
    open && highlighted >= 0 && highlighted < itemCount
      ? `${listboxId}-option-${highlighted}`
      : undefined;

  return (
    <div
      className={`comboBox${className ? ` ${className}` : ''}`}
      ref={wrapperRef}
    >
      <input
        ref={inputRef}
        id={id}
        className="comboBoxInput"
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        inputMode={inputMode}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeDescendant}
        placeholder={placeholder}
        value={open ? query : displayText}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      {open && (
        <ul className="comboBoxList" id={listboxId} role="listbox">
          {visibleOptions.map((option, index) => (
            <li
              key={`${option.value}-${index}`}
              id={`${listboxId}-option-${index}`}
              data-index={index}
              className={`comboBoxOption${
                option.value === value ? ' is-selected' : ''
              }${highlighted === index ? ' is-highlighted' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </li>
          ))}

          {showCustom && (
            <li
              id={`${listboxId}-option-${visibleOptions.length}`}
              data-index={visibleOptions.length}
              className={`comboBoxOption comboBoxAdd${
                highlighted === visibleOptions.length ? ' is-highlighted' : ''
              }`}
              role="option"
              aria-selected={false}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlighted(visibleOptions.length)}
              onClick={createCustom}
            >
              + Add &quot;{query.trim()}&quot;
            </li>
          )}

          {itemCount === 0 && (
            <li className="comboBoxEmpty" role="presentation">
              No matches
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default ComboBox;
