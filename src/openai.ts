import { Configuration, OpenAIApi } from "openai";
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
    additionalPrompt,
  }: {
    content: string;
    patch: string;
    additionalPrompt?: string;
  }) {
    const settings = Settings.getInstance();
    const contentWithLines = content
      .split("\n")
      .map((line, index) => `${index + 1}: ${line}`)
      .join("\n");
    const prompt = `Suggest between one and three content updates to the following article to fix grammar and spelling errors as well as fix redundant words/sentences and rewrite where necessary.
The suggestion must contain the entire line from the original content with the suggested change in it.

${additionalPrompt || ""}
 
Here is the original content:
${contentWithLines}

Patch diff provided so that only the changed lines need to be returned:
${patch}
End of patch diff provided

Remember to keep suggest the entire line and not just the change.
Please to ot suggest adding spaces or tabs to the beginning of a paragraph.
`;
    console.log("settings.model", settings.model);
    console.log("settings.temperature", settings.temperature);
    console.log("settings.topP", settings.topP);

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
                  "The suggestions to be made. This list must contain at least one suggestion but no more than three suggestions",
                items: {
                  type: "object",
                  properties: {
                    suggestion: {
                      type: "string",
                      description:
                        "The entire line of original content with the suggest change(s)",
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
    console.log("res.status", res.status);
    const args = res.data.choices[0].message?.function_call?.arguments || "";
    const json = JSON.parse(args);
    const suggestions = json.suggestions;
    console.log("suggestions", suggestions);
    return { suggestions, error: false } as {
      suggestions: { line: number; suggestion: string }[];
      error: boolean;
    };
  }
}
