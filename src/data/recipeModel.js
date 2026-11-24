export function instructionText(step) {
  if (typeof step === 'string') return step;
  return String(step?.text ?? '');
}

export function instructionSeconds(step) {
  if (typeof step === 'string') return 0;
  return Math.max(0, Math.floor(Number(step?.seconds) || 0));
}

export function combineSeconds(hours, minutes, seconds) {
  return (
    Math.max(0, Math.floor(Number(hours) || 0)) * 3600 +
    Math.max(0, Math.floor(Number(minutes) || 0)) * 60 +
    Math.max(0, Math.floor(Number(seconds) || 0))
  );
}

export function splitSeconds(totalSeconds) {
  const total = Math.max(0, Math.floor(Number(totalSeconds) || 0));

  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function formatSeconds(totalSeconds) {
  const { hours, minutes, seconds } = splitSeconds(totalSeconds);
  const parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

export function normalizeInstruction(step) {
  return {
    text: instructionText(step).trim(),
    seconds: instructionSeconds(step),
  };
}

export function normalizeInstructions(instructions) {
  return (instructions ?? [])
    .map(normalizeInstruction)
    .filter((step) => step.text);
}

export function totalInstructionSeconds(instructions) {
  return (instructions ?? []).reduce(
    (total, step) => total + instructionSeconds(step),
    0
  );
}
