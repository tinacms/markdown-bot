export function parseGithubComment(content: string) {
  const contentLower = content.toLowerCase();
  if (!contentLower.includes("ai fix:")) return false;

  // const AfterAiFix = contentLower.split("ai fix:")[1].trim();
  // Below code does the same as above but it ignores case
  const searchTxt = "ai fix:";
  const regEscape = (v: string) =>
    v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const AfterAiFix = content
    .split(new RegExp(regEscape(searchTxt), "ig"))[1]
    .trim();

  const fileNames = AfterAiFix.split(",")
    // trim whitespace
    .map((x) => x.trim())
    // remove empty strings
    .filter(Boolean);
  if (fileNames.length === 0) return false;
  return fileNames;
}
