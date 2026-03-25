import { getFileFromGitHub, updateFileOnGitHub } from "./github";

export interface ManagedLink {
  id: string;
  label: string;
  url: string;
  targetBlank: boolean;
  nofollow: boolean;
}

export interface LinksContent {
  links: ManagedLink[];
}

const SUPPORTED_LOCALES = ["en", "es", "fr"] as const;

function getDefaultLinks(locale: string): LinksContent {
  const defaults: Record<string, LinksContent> = {
    en: {
      links: [
        {
          id: "fifa-world-cup",
          label: "FIFA World Cup 2026",
          url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fifa-match-centre",
          label: "FIFA Match Centre",
          url: "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fire-tv-help",
          label: "Amazon Fire TV Help",
          url: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G6ZQJ2Y9N7K6E6R5",
          targetBlank: true,
          nofollow: true,
        },
      ],
    },
    es: {
      links: [
        {
          id: "fifa-world-cup",
          label: "Mundial FIFA 2026",
          url: "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fifa-match-centre",
          label: "Centro de Partidos FIFA",
          url: "https://www.fifa.com/fifaplus/es/tournaments/mens/worldcup",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fire-tv-help",
          label: "Ayuda de Amazon Fire TV",
          url: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G6ZQJ2Y9N7K6E6R5",
          targetBlank: true,
          nofollow: true,
        },
      ],
    },
    fr: {
      links: [
        {
          id: "fifa-world-cup",
          label: "Coupe du Monde FIFA 2026",
          url: "https://www.fifa.com/fr/tournaments/mens/worldcup/canadamexicousa2026",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fifa-match-centre",
          label: "Centre des Matchs FIFA",
          url: "https://www.fifa.com/fifaplus/fr/tournaments/mens/worldcup",
          targetBlank: true,
          nofollow: false,
        },
        {
          id: "fire-tv-help",
          label: "Aide Amazon Fire TV",
          url: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G6ZQJ2Y9N7K6E6R5",
          targetBlank: true,
          nofollow: true,
        },
      ],
    },
  };

  return defaults[locale] || defaults.en;
}

function mergeWithDefaults(locale: string, incoming: any): LinksContent {
  const defaults = getDefaultLinks(locale);

  if (!incoming || typeof incoming !== "object" || !Array.isArray(incoming.links)) {
    return defaults;
  }

  const normalized = incoming.links
    .filter((link: any) => link && typeof link === "object")
    .map((link: any, index: number): ManagedLink => ({
      id: String(link.id || `link-${index + 1}`),
      label: String(link.label || ""),
      url: String(link.url || ""),
      targetBlank: Boolean(link.targetBlank),
      nofollow: Boolean(link.nofollow),
    }))
    .filter((link: ManagedLink) => link.label && link.url);

  return { links: normalized.length > 0 ? normalized : defaults.links };
}

export async function getLinksFile(locale: string): Promise<{
  content: LinksContent;
  sha: string;
  path: string;
}> {
  const safeLocale = SUPPORTED_LOCALES.includes(locale as any) ? locale : "en";
  const filePath = `data/links/${safeLocale}.json`;

  try {
    const file = await getFileFromGitHub(filePath);
    const parsed = JSON.parse(file.content);
    return {
      content: mergeWithDefaults(safeLocale, parsed),
      sha: file.sha,
      path: file.path,
    };
  } catch (error: any) {
    if (error.message?.includes("404") || error.message?.includes("Not Found")) {
      return {
        content: getDefaultLinks(safeLocale),
        sha: "",
        path: filePath,
      };
    }
    throw error;
  }
}

export async function getAllLinks(): Promise<Record<string, { content: LinksContent; sha: string; path: string }>> {
  const data: Record<string, any> = {};

  for (const locale of SUPPORTED_LOCALES) {
    try {
      data[locale] = await getLinksFile(locale);
    } catch (error) {
      data[locale] = {
        content: getDefaultLinks(locale),
        sha: "",
        path: `data/links/${locale}.json`,
      };
    }
  }

  return data;
}

export async function updateLinksFile(locale: string, content: LinksContent, sha: string): Promise<void> {
  const safeLocale = SUPPORTED_LOCALES.includes(locale as any) ? locale : "en";
  const filePath = `data/links/${safeLocale}.json`;
  const normalized = mergeWithDefaults(safeLocale, content);

  await updateFileOnGitHub({
    path: filePath,
    content: JSON.stringify(normalized, null, 2),
    message: `Update ${safeLocale} managed links via admin dashboard`,
    sha: sha || undefined,
  });
}

