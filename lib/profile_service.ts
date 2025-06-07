/**
 * Service for fetching user profile data.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

export interface UserProfileData {
  skills?: string;
  experience?: string;
  background?: string;
  personality?: string;
  [key: string]: any;
  source?: "notion" | "local";
}

/**
 * Helper to extract Notion page ID from URL.
 */
function extractNotionPageId(url: string): string | null {
  const match = url.match(/[0-9a-fA-F]{32}/);
  if (match) return match[0];
  const dashed = url.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  if (dashed) return dashed[0].replace(/-/g, "");
  return null;
}

/**
 * Helper to extract rich text from Notion block.
 */
function extractRichText(block: any): string {
  if (!block) return "";
  if (block.type === "paragraph" && block.paragraph?.text) {
    return block.paragraph.text.map((t: any) => t.plain_text).join(" ");
  }
  if (block.type === "bulleted_list_item" && block.bulleted_list_item?.text) {
    return "• " + block.bulleted_list_item.text.map((t: any) => t.plain_text).join(" ");
  }
  if (block.type === "numbered_list_item" && block.numbered_list_item?.text) {
    return (block.numbered_list_item.text.map((t: any) => t.plain_text).join(" "));
  }
  if (block.type === "table_row" && block.table_row?.cells) {
    return block.table_row.cells.map((cell: any[]) => cell.map((t: any) => t.plain_text).join(" ")).join(" | ");
  }
  return "";
}

/**
 * In-memory cache for Notion profile data.
 */
let notionProfileCache: { data: UserProfileData | null; timestamp: number } | null = null;
const NOTION_PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches user profile data from Notion, falling back to local files if needed.
 * Now handles lists, tables, and rich text.
 * Uses in-memory cache for performance.
 */
export async function fetchUserProfile(): Promise<UserProfileData | null> {
  const notionUrl = process.env.USER_PROFILE_NOTION_URL;
  const notionApiKey = process.env.NOTION_API_KEY;

  // Check cache first
  if (
    notionProfileCache &&
    Date.now() - notionProfileCache.timestamp < NOTION_PROFILE_CACHE_TTL_MS
  ) {
    return notionProfileCache.data;
  }

  if (notionUrl && notionApiKey) {
    try {
      console.log("[PROFILE_SERVICE] Attempting Notion profile fetch...");
      const pageId = extractNotionPageId(notionUrl);
      if (!pageId) throw new Error("Could not extract Notion page ID from URL.");

      // Fetch the Notion page content using the Notion API
      const notionRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
        headers: {
          "Authorization": `Bearer ${notionApiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      });

      if (!notionRes.ok) {
        console.error(`[PROFILE_SERVICE] Notion API fetch failed: ${notionRes.status} ${notionRes.statusText}`);
        throw new Error(`Failed to fetch Notion page: ${notionRes.statusText}`);
      }
      const notionData = await notionRes.json();

      // Parse the Notion blocks for profile fields, handling lists, tables, and rich text
      let currentField = "";
      const profileData: UserProfileData = {};
      let tableRows: string[] = [];

      if (Array.isArray(notionData.results)) {
        for (let i = 0; i < notionData.results.length; i++) {
          const block = notionData.results[i];
          // Headings as field markers
          if (block.type === "heading_2" && block.heading_2?.text?.[0]?.plain_text) {
            currentField = block.heading_2.text[0].plain_text.trim().toLowerCase();
            continue;
          }
          // Table rows
          if (block.type === "table_row") {
            tableRows.push(extractRichText(block));
            continue;
          }
          // Lists and paragraphs
          if (currentField) {
            if (!profileData[currentField]) profileData[currentField] = "";
            profileData[currentField] += (profileData[currentField] ? "\n" : "") + extractRichText(block);
          }
        }
      }

      // Attach table data if present
      if (tableRows.length && currentField) {
        profileData[currentField] += "\n" + tableRows.join("\n");
      }

      // Map common fields to canonical keys
      const canonical: UserProfileData = {
        skills: profileData["skills"] || profileData["skillset"] || undefined,
        experience: profileData["experience"] || undefined,
        background: profileData["background"] || undefined,
        personality: profileData["personality"] || undefined,
        source: "notion",
      };

      // Attach all parsed fields for LLM context expansion
      Object.assign(canonical, profileData);

      // If at least one field is present, cache and return
      if (Object.keys(profileData).length > 0) {
        console.log("[PROFILE_SERVICE] Notion profile fetch succeeded. Fields:", Object.keys(profileData));
        notionProfileCache = { data: canonical, timestamp: Date.now() };
        return canonical;
      } else {
        console.warn("[PROFILE_SERVICE] Notion profile fetch returned no usable fields.");
      }
      // Otherwise, fall through to local file fallback

    } catch (error) {
      console.error('[PROFILE_SERVICE] Error fetching user profile from Notion:', error);
      // Fall through to local file fallback
    }
  } else {
    if (!notionUrl) console.warn("[PROFILE_SERVICE] USER_PROFILE_NOTION_URL not set.");
    if (!notionApiKey) console.warn("[PROFILE_SERVICE] NOTION_API_KEY not set.");
  }

  // Fallback: fetch from local files
  try {
    console.log("[PROFILE_SERVICE] Attempting local file fallback...");
    const profileTextPath = path.join(process.cwd(), 'orion_python_backend', 'Tomide_Adeoye_Profile.txt');
    const personalityTextPath = path.join(process.cwd(), 'orion_python_backend', 'Tomide_Adeoye_personality.txt');

    const profileContent = await readFile(profileTextPath, 'utf-8');
    const personalityContent = await readFile(personalityTextPath, 'utf-8');

    const profileData: UserProfileData = {
      skills: profileContent,
      experience: profileContent,
      background: profileContent,
      personality: personalityContent,
      source: "local",
    };

    console.log("[PROFILE_SERVICE] Local file fallback succeeded.");
    return profileData;

  } catch (error) {
    console.error('[PROFILE_SERVICE] Error fetching user profile from local files:', error);
    return null;
  }
}
