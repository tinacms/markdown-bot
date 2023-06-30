import { parseGithubComment } from "./parseGithubComment";

describe("parseGithubComment", () => {
  it("Should return false if the comment does not contain 'ai fix:'", () => {
    const content = "This is a test comment";
    const result = parseGithubComment(content);
    expect(result).toEqual(false);

    const content2 = "This is a test comment ai fix";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(false);
  });

  it("Should return the file name if the comment contains 'ai fix:'", () => {
    const content = "ai fix: test.md";
    const result = parseGithubComment(content);
    expect(result).toEqual(["test.md"]);

    const content2 = "This is a test comment ai fix: foo.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["foo.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    const result3 = parseGithubComment(content3);
    expect(result3).toEqual(["foo/bar/baz.md"]);
  });

  it("Should return the list of file names if the comment contains 'ai fix:' followed by a list of file names separated by a ','", () => {
    const content = "ai fix: test.md, foo.md";
    const result = parseGithubComment(content);
    expect(result).toEqual(["test.md", "foo.md"]);

    const content2 = "This is a test comment ai fix: foo.md, bar.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["foo.md", "bar.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md, foo.md";
    const result3 = parseGithubComment(content3);
    expect(result3).toEqual(["foo/bar/baz.md", "foo.md"]);
  });
  it("Should always keep the case of the filename", () => {
    const content = "ai fix: TEST.md";
    const result = parseGithubComment(content);
    expect(result).toEqual(["TEST.md"]);

    const content2 = "This is a test comment ai fix: FOo.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["FOo.md"]);
  });

  it("Should trim the file names of any whitespace", () => {
    const content = "ai fix:     test.md,     foo.md    ";
    const result = parseGithubComment(content);
    expect(result).toEqual(["test.md", "foo.md"]);

    const content2 = "This is a test comment ai fix: foo.md, \n  \n  bar.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["foo.md", "bar.md"]);
  });

  it("Should recognize the prompt regardless of case", () => {
    const content = "AI FIX: test.md";
    const result = parseGithubComment(content);
    expect(result).toEqual(["test.md"]);

    const content2 = "This is a test comment AI FiX: foo.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["foo.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    const result3 = parseGithubComment(content3);
    expect(result3).toEqual(["foo/bar/baz.md"]);
  });

  it("Returns false if there are no files after the prompt", () => {
    const content = "ai fix:";
    const result = parseGithubComment(content);
    expect(result).toEqual(false);
  });

  it("Should work no matter the casing of the prompt", () => {
    const content = "AI FIX: test.md";
    const result = parseGithubComment(content);
    expect(result).toEqual(["test.md"]);

    const content2 = "This is a test comment AI FiX: foo.md ";
    const result2 = parseGithubComment(content2);
    expect(result2).toEqual(["foo.md"]);

    const content3 = "This is a test comment ai fix: foo/bar/baz.md";
    const result3 = parseGithubComment(content3);
    expect(result3).toEqual(["foo/bar/baz.md"]);
  });
});
