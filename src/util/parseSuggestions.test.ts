import { parseSuggestions } from "./parseSuggestions";

describe("parseSuggestions", () => {
  it("should parse a single set of line numbers and suggestions", () => {
    const inputString = `
        line: 1
        suggestion: Fix a typo
        
        line: 5
        suggestion: Add a missing semicolon
      `;

    const expectedOutput = [
      { line: 1, suggestion: "Fix a typo" },
      { line: 5, suggestion: "Add a missing semicolon" },
    ];

    expect(parseSuggestions(inputString)).toEqual(expectedOutput);
  });

  it("should parse multiple sets of line numbers and suggestions", () => {
    const inputString = `
        line: 1
        suggestion: Fix a typo
        


        line: 5
        suggestion: Add a missing semicolon
        
        line: 2
        suggestion: Update variable names
        
        
        line: 7
        suggestion: Refactor code for readability
      `;

    const expectedOutput = [
      { line: 1, suggestion: "Fix a typo" },
      { line: 5, suggestion: "Add a missing semicolon" },
      { line: 2, suggestion: "Update variable names" },
      { line: 7, suggestion: "Refactor code for readability" },
    ];

    expect(parseSuggestions(inputString)).toEqual(expectedOutput);
  });
});
