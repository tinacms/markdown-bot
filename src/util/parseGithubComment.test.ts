import { parseGithubComment } from "./parseGithubComment";

const assertResult = (content: string, expected: string[]) => {
  const result = parseGithubComment(content);
  expect(result).toBeTruthy();
  if (result) {
    expect(result.fileNames).toEqual(expected);
  }
};

const assertPrompt = (content: string, expected: string) => {
  const result = parseGithubComment(content);
  expect(result).toBeTruthy();
  if (result) {
    expect(result.prompt).toEqual(expected);
  }
};

describe("parseGithubComment", () => {
  it("Should return false if the comment does not contain 'ai fix:'", () => {
    const content = "This is a test comment";
    const result = parseGithubComment(content);
    expect(result).toEqual(false);

    const content2 = "This is a test comment ai fix";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(false);
  });
  it("Returns false if there are no files after the prompt", () => {
    const content = "ai fix:";
    const result = parseGithubComment(content);
    expect(result).toEqual(false);
  });

  it("Should return the file name if the comment contains 'ai fix:'", () => {
    const content = "ai fix: test.md";
    assertResult(content, ["test.md"]);

    const content2 = "This is a test comment ai fix: foo.md ";
    assertResult(content2, ["foo.md"]);
    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    assertResult(content3, ["foo/bar/baz.md"]);
  });

  it("Should return the list of file names if the comment contains 'ai fix:' followed by a list of file names separated by a ','", () => {
    const content = "ai fix: test.md, foo.md";
    assertResult(content, ["test.md", "foo.md"]);
    const content2 = "This is a test comment ai fix: foo.md, bar.md ";
    assertResult(content2, ["foo.md", "bar.md"]);
    const content3 = "This is a test comment ai fix: foo/bar/baz.md, foo.md";
    assertResult(content3, ["foo/bar/baz.md", "foo.md"]);
  });
  it("Should trim the file names of any whitespace", () => {
    const content = "ai fix:     test.md,     foo.md    ";
    assertResult(content, ["test.md", "foo.md"]);

    const content2 = "This is a test comment ai fix: foo.md, \n  \n  bar.md ";
    assertResult(content2, ["foo.md", "bar.md"]);
  });
  it("Should always keep the case of the filename", () => {
    const content = "ai fix: TEST.md";
    assertResult(content, ["TEST.md"]);

    const content2 = "This is a test comment ai fix: FOo.md ";
    assertResult(content2, ["FOo.md"]);
  });

  it("Should recognize the prompt regardless of case", () => {
    const content = "AI FIX: test.md";
    assertResult(content, ["test.md"]);

    const content2 = "This is a test comment AI FiX: foo.md ";
    assertResult(content2, ["foo.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    assertResult(content3, ["foo/bar/baz.md"]);
  });
  it("Should work no matter the casing of the prompt", () => {
    const content = "AI FIX: test.md";
    assertResult(content, ["test.md"]);

    const content2 = "This is a test comment AI FiX: foo.md ";
    assertResult(content2, ["foo.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    assertResult(content3, ["foo/bar/baz.md"]);
  });

  it("Should return a prompt if prompt: is used", () => {
    const content = `ai fix: foo.bar
  prompt: this is a prompt`;
    assertResult(content, ["foo.bar"]);
    assertPrompt(content, "this is a prompt");
  });
  it("Should return a prompt if prompt: is used and there are multiple files", () => {
    const content = `ai fix: foo.bar, bar.foo
  prompt: this is a prompt`;
    assertResult(content, ["foo.bar", "bar.foo"]);
    assertPrompt(content, "this is a prompt");
  });
  it("Should return a prompt if the prompt contains multiple lines", () => {
    const content = `ai fix: foo.bar, bar.foo
  prompt: this is a prompt
with multiple lines`;
    assertResult(content, ["foo.bar", "bar.foo"]);
    assertPrompt(content, "this is a prompt\nwith multiple lines");
  });
  it("Should return a prompt if no matter the casing of prompt", () => {
    const content = `ai fix: foo.bar, bar.foo PrompT: this is a prompt`;
    assertResult(content, ["foo.bar", "bar.foo"]);
    assertPrompt(content, "this is a prompt");

    const content2 = `ai fix: foo.bar, bar.foo PROMPT: THIS is a prompt`;
    assertResult(content2, ["foo.bar", "bar.foo"]);
    assertPrompt(content2, "THIS is a prompt");

    const content3 = `ai FiX: foo.baR, bar.Foo PROMPT: THIS is a prompt`;
    assertResult(content3, ["foo.baR", "bar.Foo"]);
    assertPrompt(content3, "THIS is a prompt");
  });
});
