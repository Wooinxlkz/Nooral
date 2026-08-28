import { useEffect } from "react";

const BASE_TITLE = "NoorAl";
const BASE_DESC =
  "NoorAl — Your complete Quran companion. Read with Uthmanic script, translations, tafsir, track memorization, prayer times, ahadith, and more.";

export function useSEO(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    document.title = fullTitle;

    const desc = description ?? BASE_DESC;
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);

    let twTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", fullTitle);

    let twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", desc);

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description]);
}
