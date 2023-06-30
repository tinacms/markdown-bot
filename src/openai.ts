import { Configuration, OpenAIApi } from "openai";
import { parseSuggestions } from "./util/parseSuggestions";
import { Settings } from "./settings";

export class OpenAI {
  openai: OpenAIApi;
  constructor({ apiKey }: { apiKey: string }) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async makeSuggestions({
    content,
    patch,
  }: {
    content: string;
    patch: string;
  }) {
    const settings = Settings.getInstance();
    const contentWithLines = content
      .split("\n")
      .map((line, index) => `${index + 1}: ${line}`)
      .join("\n");
    const prompt = `Take the following post that is in markdown format and suggest brief edits to fix grammar and make the content clearer. 

Here is the content:
${contentWithLines}

Patch diff provided so that only the changed lines need to be returned:
${patch}
End of patch diff provided
`;
    console.log("settings.model", settings.model);
    console.log("settings.temperature", settings.temperature);
    console.log("settings.topP", settings.topP);

    console.log({ prompt });

    const res = await this.openai.createChatCompletion({
      function_call: { name: "makeSuggestions" },
      functions: [
        {
          name: "makeSuggestions",
          description: "Make suggestions for a given post",
          parameters: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                description:
                  "The suggestions to be made. This list must contain at least 1 suggestion",
                items: {
                  type: "object",
                  properties: {
                    suggestion: {
                      type: "string",
                      description:
                        "The entire content of the line to be suggested with the suggestion in it",
                    },
                    line: {
                      type: "number",
                      description:
                        "The line number of the content to be suggested",
                    },
                  },
                },
              },
            },
          },
        },
      ],
      model: settings.model,
      temperature: settings.temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const args = res.data.choices[0].message?.function_call?.arguments || "";
    const json = JSON.parse(args);
    const suggestions = json.suggestions;
    console.log({ suggestions });
    return { suggestions, error: false } as {
      suggestions: { line: number; suggestion: string }[];
      error: boolean;
    };
  }
  async makeSuggestionsOld({
    content,
    patch,
  }: {
    content: string;
    patch: string;
  }) {
    const settings = Settings.getInstance();
    const contentWithLines = content
      .split("\n")
      .map((line, index) => `${index + 1}: ${line}`)
      .join("\n");
    const prompt = `Take the following post that is in markdown format and suggest brief edits to fix grammar and make the content clearer. The suggestion should contain the entire line with the changes and nothing else. The suggestions should be returned in the following format:
  
line: {line number} 
suggestion: {suggestion}

Only return the output in this format and nothing else. Return at least 3 suggestions.

Start of content to be edited:
${contentWithLines}
End of content to be edited

Patch diff provided so that only the changed lines need to be returned:
${patch}
End of patch diff provided
`;
    console.log({ prompt });
    // Add line numbers to the content

    const res = await this.openai.createChatCompletion({
      model: settings.model,
      temperature: settings.temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const newContent = res.data.choices[0].message?.content || "";
    console.log({ newContent });

    try {
      const suggestions = parseSuggestions(newContent);
      return { error: false, content: newContent, suggestions };
    } catch (e) {
      console.log({ e });
      return {
        error: true,
        message: "Error parsing AI response",
        content: newContent,
        suggestions: [] as { line: number; suggestion: string }[],
      };
    }
  }
}
