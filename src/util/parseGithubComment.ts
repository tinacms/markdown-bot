export function parseGithubComment(content: string) {
  const contentLower = content.toLowerCase();
  if (!contentLower.includes("ai fix:")) return false;
  const AfterAiFix = contentLower.split("ai fix:")[1].trim();
  const fileNames = AfterAiFix.split(",")
    // trim whitespace
    .map((x) => x.trim())
    // remove empty strings
    .filter(Boolean);
  if (fileNames.length === 0) return false;
  return fileNames;
}
