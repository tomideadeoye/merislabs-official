import { fetchUserProfile, UserProfileData } from "../lib/profile_service";
import fs from "fs/promises";

// Mock environment variables
const OLD_ENV = process.env;

describe("fetchUserProfile", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should fetch and parse Notion profile data (mocked)", async () => {
    process.env.USER_PROFILE_NOTION_URL = "https://www.notion.so/merislabs/fakeprofileid1234567890abcdef1234567890abcdef";
    process.env.NOTION_API_KEY = "fake-key";

    // Mock fetch to return Notion blocks with lists, tables, and rich text
    jest.spyOn(global, "fetch" as any).mockImplementation(async (...args: any[]) => {
      return {
        ok: true,
        json: async () => ({
          results: [
            { type: "heading_2", heading_2: { text: [{ plain_text: "Skills" }] } },
            { type: "paragraph", paragraph: { text: [{ plain_text: "Python, TypeScript" }] } },
            { type: "bulleted_list_item", bulleted_list_item: { text: [{ plain_text: "Leadership" }] } },
            { type: "heading_2", heading_2: { text: [{ plain_text: "Experience" }] } },
            { type: "paragraph", paragraph: { text: [{ plain_text: "5 years in AI" }] } },
            { type: "table_row", table_row: { cells: [[{ plain_text: "Row1Col1" }], [{ plain_text: "Row1Col2" }]] } },
            { type: "heading_2", heading_2: { text: [{ plain_text: "Personality" }] } },
            { type: "paragraph", paragraph: { text: [{ plain_text: "Curious" }] } },
          ],
        }),
      } as any;
    });

    const profile: UserProfileData | null = await fetchUserProfile();
    expect(profile).not.toBeNull();
    expect(profile?.skills).toContain("Python");
    expect(profile?.skills).toContain("Leadership");
    expect(profile?.experience).toContain("5 years");
    expect(profile?.personality).toContain("Curious");
    expect(profile?.source).toBe("notion");
    (global.fetch as any).mockRestore();
  });

  it("should fall back to local files if Notion fetch fails", async () => {
    process.env.USER_PROFILE_NOTION_URL = "https://www.notion.so/merislabs/fakeprofileid1234567890abcdef1234567890abcdef";
    process.env.NOTION_API_KEY = "fake-key";

    jest.spyOn(global, "fetch" as any).mockImplementation(async () => {
      throw new Error("Notion fetch failed");
    });

    // Mock fs.readFile
    jest.spyOn(fs, "readFile").mockImplementation(async (...args: any[]) => {
      const file = args[0];
      if (file.includes("Profile")) return "Local Skills";
      if (file.includes("personality")) return "Local Personality";
      return "";
    });

    const profile: UserProfileData | null = await fetchUserProfile();
    expect(profile).not.toBeNull();
    expect(profile?.skills).toContain("Local Skills");
    expect(profile?.personality).toContain("Local Personality");
    expect(profile?.source).toBe("local");
    (global.fetch as any).mockRestore();
    (fs.readFile as any).mockRestore();
  });

  it("should cache Notion profile data and refresh after TTL", async () => {
    process.env.USER_PROFILE_NOTION_URL = "https://www.notion.so/merislabs/fakeprofileid1234567890abcdef1234567890abcdef";
    process.env.NOTION_API_KEY = "fake-key";

    let fetchCount = 0;
    jest.spyOn(global, "fetch" as any).mockImplementation(async () => {
      fetchCount++;
      return {
        ok: true,
        json: async () => ({
          results: [
            { type: "heading_2", heading_2: { text: [{ plain_text: "Skills" }] } },
            { type: "paragraph", paragraph: { text: [{ plain_text: "Python" }] } },
          ],
        }),
      } as any;
    });

    // First call populates cache
    const profile1 = await fetchUserProfile();
    expect(profile1?.skills).toContain("Python");
    expect(fetchCount).toBe(1);

    // Second call uses cache
    const profile2 = await fetchUserProfile();
    expect(profile2?.skills).toContain("Python");
    expect(fetchCount).toBe(1);

    // Simulate cache expiry
    const { notionProfileCache } = require("../lib/profile_service");
    if (notionProfileCache) notionProfileCache.timestamp = Date.now() - (11 * 60 * 1000);

    // Third call fetches again
    const profile3 = await fetchUserProfile();
    expect(profile3?.skills).toContain("Python");
    expect(fetchCount).toBe(2);

    (global.fetch as any).mockRestore();
  });
});
