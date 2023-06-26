export function parseSuggestions(input: string) {
  const lines = input.trim().split("\n");
  const suggestions = [];

  let lineNumber = null;
  let suggestion = null;

  for (const line of lines) {
    if (line.trim().startsWith("line:")) {
      lineNumber = parseInt(line.split(":")[1].trim());
    } else if (line.trim().startsWith("suggestion:")) {
      suggestion = line.split(":")[1].trim();

      if (lineNumber !== null && suggestion !== null) {
        suggestions.push({ line: lineNumber, suggestion });
        lineNumber = null;
        suggestion = null;
      }
    }
  }

  return suggestions;
}
