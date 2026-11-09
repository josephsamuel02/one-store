import fs from "node:fs";
import path from "node:path";

let cachedHtmlByOrigin = new Map();

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeImageUrl(rawImage, origin) {
  if (!rawImage || typeof rawImage !== "string") {
    return `${origin}/img/banner1.png`;
  }
  try {
    return new URL(rawImage.trim(), origin).href;
  } catch {
    return `${origin}/img/banner1.png`;
  }
}

async function getBaseIndexHtml(origin) {
  if (cachedHtmlByOrigin.has(origin)) {
    return cachedHtmlByOrigin.get(origin);
  }

  const distPath = path.join(process.cwd(), "dist", "index.html");
  if (fs.existsSync(distPath)) {
    const diskHtml = fs.readFileSync(distPath, "utf8");
    cachedHtmlByOrigin.set(origin, diskHtml);
    return diskHtml;
  }

  const res = await fetch(`${origin}/index.html`);
  if (!res.ok) {
    throw new Error(`Failed to fetch index.html: ${res.status}`);
  }
  const html = await res.text();
  cachedHtmlByOrigin.set(origin, html);
  return html;
}

function buildProductMetaBlock({ product, productUrl, origin }) {
  const cleanName = String(product.name ?? "Product").replace(/\s+/g, " ").trim();
  const title = `${cleanName} | OneStore`;

  const parts = [];
  if (product.category) {
    const cat = String(product.category).replace(/_/g, " ");
    parts.push(cat.charAt(0).toUpperCase() + cat.slice(1));
  }

  const detailsText = String(product.productDetails ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const featuresText = Array.isArray(product.features)
    ? product.features.filter(Boolean).join(", ")
    : "";

  const bodySnippet = detailsText || featuresText || "Shop quality products on OneStore.";
  const rawDescription = (
    parts.length > 0 ? `${parts.join(" ")} — ${bodySnippet}` : bodySnippet
  ).slice(0, 240);

  const imageUrl = normalizeImageUrl(product.image, origin);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanName,
    image: [imageUrl],
    description: rawDescription,
  }).replace(/</g, "\\u003c");

  return `<!-- OG_META_START -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(rawDescription)}" />
    <link rel="canonical" href="${escapeHtml(productUrl)}" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="OneStore" />
    <meta property="og:url" content="${escapeHtml(productUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(rawDescription)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(cleanName)}" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(rawDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

    <script type="application/ld+json">${jsonLd}</script>
    <!-- OG_META_END -->`;
}

export default async function handler(req, res) {
  const proto = String(req.headers["x-forwarded-proto"] || "https")
    .split(",")[0]
    .trim();
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "onestore.ng")
    .split(",")[0]
    .trim();
  const origin = `${proto}://${host}`;

  const rawId = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
  const productId = String(rawId ?? "").trim();

  let html = "";
  try {
    html = await getBaseIndexHtml(origin);
  } catch (err) {
    console.error("Failed to load base index.html:", err);
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (productId && supabaseUrl && supabaseKey) {
    try {
      const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/products?id=eq.${encodeURIComponent(
        productId
      )}&select=id,name,image,productDetails,features,category&limit=1`;

      const supaRes = await fetch(endpoint, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Accept: "application/json",
        },
      });

      if (supaRes.ok) {
        const rows = await supaRes.json();
        const product = Array.isArray(rows) ? rows[0] : null;

        if (product) {
          const productUrl = `${origin}/product/${encodeURIComponent(product.id)}`;
          const metaBlock = buildProductMetaBlock({ product, productUrl, origin });

          if (html.includes("<!-- OG_META_START -->") && html.includes("<!-- OG_META_END -->")) {
            html = html.replace(
              /<!-- OG_META_START -->[\s\S]*?<!-- OG_META_END -->/,
              metaBlock
            );
          } else {
            html = html
              .replace(/<meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+|product:[^"]+|description)"[^>]*>\s*/gi, "")
              .replace(/<title>[\s\S]*?<\/title>/i, metaBlock);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching product metadata:", err);
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.end(html);
}
