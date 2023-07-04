/**
 *
 * Returns everything after the search text in content and ignores the case
 *
 * EXAMPLE:
 *
 * ```ts
 * const content = "This is a test comment aI fiX: foo.md ";
 * const searchTxt = "ai fix:";
 * const afterSearchText = getAfterSearchTextIgnoreCase(content, searchTxt);
 * console.log(afterSearchText); // foo.md
 * ```
 *
 */
function getAfterSearchTextIgnoreCase(content: string, searchTxt: string) {
  const regEscape = (v: string) =>
    v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const afterSearchText = content
    .split(new RegExp(regEscape(searchTxt), "ig"))[1]
    .trim();
  return afterSearchText;
}

/**
 *
 * Returns everything before the search text in content and ignores the case
 *
 * EXAMPLE:
 *
 * ```ts
 * const content = "foo, bar, baz SEARCHTEXT: foo.md ";
 * const searchTxt = "SEARCHTEXT";
 * const afterSearchText = getBeforeSearchTextIgnoreCase(content, searchTxt);
 * console.log(afterSearchText); // foo, bar, baz
 * ```
 *
 */
function getBeforeSearchTextIgnoreCase(content: string, searchTxt: string) {
  const regEscape = (v: string) =>
    v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const afterSearchText = content
    .split(new RegExp(regEscape(searchTxt), "ig"))[0]
    .trim();
  return afterSearchText;
}

export function parseGithubComment(content: string) {
  const contentLower = content.toLowerCase();
  if (!contentLower.includes("ai fix:")) return false;

  // const afterAiFix = contentLower.split("ai fix:")[1].trim();
  // Below code does the same as above but it ignores case
  const afterAiFix = getAfterSearchTextIgnoreCase(content, "ai fix:");

  // We are using a prompt if the comment contains "prompt:"
  if (afterAiFix.toLowerCase().includes("prompt:")) {
    const prompt = getAfterSearchTextIgnoreCase(afterAiFix, "prompt:");
    const beforePrompt = getBeforeSearchTextIgnoreCase(afterAiFix, "prompt:");
    const fileNames = beforePrompt
      .split(",")
      // trim whitespace
      .map((x) => x.trim())
      // remove empty strings
      .filter(Boolean);
    if (fileNames.length === 0) return false;
    return { fileNames, prompt };
  }

  const fileNames = afterAiFix
    .split(",")
    // trim whitespace
    .map((x) => x.trim())
    // remove empty strings
    .filter(Boolean);
  if (fileNames.length === 0) return false;

  return { fileNames };
}
