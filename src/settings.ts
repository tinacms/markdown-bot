/**
 * Settings Singleton class
 *
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */

const DEFAULT_MODEL = "gpt-3.5-turbo";
const DEFAULT_TEMPERATURE = 1;
const DEFAULT_TOP_P = 1;
export class Settings {
  public defaultsSet = false;
  private static instance: Settings;

  public openaiKey?: string;

  public githubToken?: string;

  public model: string = DEFAULT_MODEL;
  public temperature: number = DEFAULT_TEMPERATURE;
  public topP: number = DEFAULT_TOP_P;

  /**
   * The Settings's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * Get the instance of the Settings class
   */
  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }
  setDefaults({
    model,
    temperature,
    githubToken,
    openaiKey,
    topP,
  }: {
    model?: string;
    temperature?: number;
    githubToken?: string;
    openaiKey?: string;
    topP?: number;
  }) {
    if (model || process.env.MODEL) {
      this.model = model || process.env.MODEL || DEFAULT_MODEL;
    }
    if (temperature || process.env.TEMPERATURE) {
      const temperatureNumber = Number(
        temperature || process.env.TEMPERATURE || DEFAULT_TEMPERATURE
      );
      this.temperature = temperatureNumber;
    }
    if (topP || process.env.TOP_P) {
      const topPNumber = Number(topP || process.env.TOP_P || DEFAULT_TOP_P);
      this.topP = topPNumber;
    }
    if (githubToken || process.env.GITHUB_TOKEN) {
      this.githubToken = githubToken || process.env.GITHUB_TOKEN;
    }
    if (openaiKey || process.env.OPENAI_API_KEY) {
      this.openaiKey = openaiKey || process.env.OPENAI_API_KEY;
    }

    // handles when using the action and the with block
    if (!process.env.GITHUB_TOKEN) {
      process.env.GITHUB_TOKEN = this.githubToken;
    }
    console.log("Using values:");
    console.log({ model: this.model, temperature: this.temperature });
    this.defaultsSet = true;
  }

  setGithubToken(token: string) {
    if (!token) return;
    if (this.githubToken) return;
    this.githubToken = token;
  }
  setOpenAIKey(key: string) {
    if (!key) return;
    if (this.openaiKey) return;
    this.openaiKey = key;
  }
}
