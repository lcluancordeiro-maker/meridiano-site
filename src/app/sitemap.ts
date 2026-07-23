import type { MetadataRoute } from "next";
import { levels, getTopicsForLevel } from "@/data/curriculum";
import { MATHEMATICIANS } from "@/data/mathematicians";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calculadora`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/quadro`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/foto`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/turmas`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/assinatura`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const trilhaRoutes: MetadataRoute.Sitemap = levels
    .filter((level) => level.available)
    .flatMap((level) => {
      const levelUrl = { url: `${SITE_URL}/trilha/${level.id}`, changeFrequency: "monthly" as const, priority: 0.7 };
      const topicUrls = getTopicsForLevel(level.id).map((topic) => ({
        url: `${SITE_URL}/trilha/${level.id}/${topic.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
      return [levelUrl, ...topicUrls];
    });

  const matematicosRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/matematicos`, changeFrequency: "monthly", priority: 0.5 },
    ...MATHEMATICIANS.map((figure) => ({
      url: `${SITE_URL}/matematicos/${figure.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];

  const caminhoRoutes: MetadataRoute.Sitemap = levels
    .filter((level) => level.available)
    .flatMap((level) =>
      getTopicsForLevel(level.id).map((topic) => ({
        url: `${SITE_URL}/caminho/${level.id}/${topic.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.3,
      }))
    );

  return [...staticRoutes, ...trilhaRoutes, ...matematicosRoutes, ...caminhoRoutes];
}
