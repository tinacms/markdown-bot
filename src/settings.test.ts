import { Settings } from "./settings";

describe("Settings", () => {
  beforeEach(() => {
    // reset the singleton
    // @ts-ignore
    Settings.instance = null;
    delete process.env.MODEL;
    delete process.env.TEMPERATURE;
    delete process.env.TOP_P;
    delete process.env.GITHUB_TOKEN;
    delete process.env.OPENAI_API_KEY;
  });
  it("should set defaults", () => {
    const settings = Settings.getInstance();
    settings.setDefaults({
      model: "test",
      temperature: 0.5,
      githubToken: "test",
      openaiKey: "test",
      topP: 0.5,
    });
    expect(settings.defaultsSet).toBe(true);
    expect(settings.model).toBe("test");
    expect(settings.temperature).toBe(0.5);
    expect(settings.topP).toBe(0.5);
    expect(settings.githubToken).toBe("test");
    expect(settings.openaiKey).toBe("test");
  });

  it("should set defaults from env", () => {
    process.env.MODEL = "test";
    process.env.TEMPERATURE = "0.5";
    process.env.TOP_P = "0.5";
    process.env.GITHUB_TOKEN = "test";
    process.env.OPENAI_API_KEY = "test";
    const settings = Settings.getInstance();
    settings.setDefaults({});
    expect(settings.defaultsSet).toBe(true);
    expect(settings.model).toBe("test");
    expect(settings.temperature).toBe(0.5);
    expect(settings.topP).toBe(0.5);
    expect(settings.githubToken).toBe("test");
    expect(settings.openaiKey).toBe("test");
  });
  it("Should initially have set defaults to false", () => {
    const settings = Settings.getInstance();
    expect(settings.defaultsSet).toBe(false);
  });
  it("Should be a singleton", () => {
    const settings = Settings.getInstance();
    const settings2 = Settings.getInstance();
    expect(settings).toBe(settings2);
  });
});
