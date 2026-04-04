import { Helmet } from "react-helmet-async";
import {
  SEO_SITE_NAME,
  SEO_DEFAULT_OG_IMAGE,
  toAbsoluteUrl,
} from "@/lib/seo.config";

export default function Seo({
  title,
  description,
  keywords = [],
  path,
  image = SEO_DEFAULT_OG_IMAGE,
  type = "website",
  robots = "index, follow",
  structuredData,
}) {
  const pageTitle = title ? `${title} | ${SEO_SITE_NAME}` : SEO_SITE_NAME;
  const canonicalPath =
    path ??
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/");
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrl = toAbsoluteUrl(image);
  const keywordsContent = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywordsContent ? <meta name="keywords" content={keywordsContent} /> : null}
      <meta name="robots" content={robots} />

      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SEO_SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl ? <meta property="og:image:alt" content={pageTitle} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
      {imageUrl ? <meta name="twitter:image:alt" content={pageTitle} /> : null}

      {structuredData ? (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      ) : null}
    </Helmet>
  );
}