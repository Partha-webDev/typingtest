export function calculateStats(target: string, current: string, startTime: number) {
  // Calculate WPM
  const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
  const wordCount = current.length / 5; // standard word length
  const wpm = wordCount / timeElapsed;

  // Calculate accuracy
  let correctChars = 0;
  for (let i = 0; i < current.length; i++) {
    if (current[i] === target[i]) {
      correctChars++;
    }
  }
  const accuracy = (correctChars / current.length) * 100;

  return {
    wpm: isNaN(wpm) ? 0 : wpm,
    accuracy: isNaN(accuracy) ? 100 : accuracy,
  };
}
