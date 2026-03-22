export const SEO_SITE_NAME = "OWASP Timetable";
export const SEO_DEFAULT_OG_IMAGE = "/OwaspLogo.png";

const ENV_SITE_URL = (import.meta.env.VITE_SITE_URL || "").trim();

export const SEO_SITE_URL = ENV_SITE_URL.replace(/\/+$/, "");

export const toAbsoluteUrl = (value) => {
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;

  if (SEO_SITE_URL) {
    return `${SEO_SITE_URL}${normalizedPath}`;
  }

  if (typeof window !== "undefined") {
    return new URL(normalizedPath, window.location.origin).toString();
  }

  return normalizedPath;
};