/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";

function setMetaTag(attr: "property" | "name", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function getShareableProductUrl(productId: string | number): string {
  return `${window.location.origin}/product/${encodeURIComponent(String(productId))}`;
}

export function updateDocumentProductMeta(product: any) {
  if (!product) return;

  const cleanName = String(product.name ?? "Product").trim();
  const title = `${cleanName} | OneStore`;
  const description = String(
    product.productDetails ||
      (Array.isArray(product.features) ? product.features.filter(Boolean).join(", ") : "") ||
      "Shop quality products on OneStore."
  )
    .trim()
    .slice(0, 220);
  const url = getShareableProductUrl(product.id);
  const imageUrl = product.image
    ? new URL(String(product.image), window.location.origin).href
    : `${window.location.origin}/img/banner1.png`;

  document.title = title;
  setMetaTag("name", "description", description);
  setMetaTag("property", "og:type", "product");
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  setMetaTag("property", "og:image", imageUrl);
  setMetaTag("property", "og:url", url);
  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
  setMetaTag("name", "twitter:image", imageUrl);
}

export async function copyProductLink(product: any): Promise<void> {
  if (!product?.id) return;
  const url = getShareableProductUrl(product.id);
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Product link copied to clipboard!");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.success("Product link copied to clipboard!");
  }
}

export async function shareProduct(product: any): Promise<void> {
  if (!product?.id) return;
  const url = getShareableProductUrl(product.id);
  const title = `${String(product.name ?? "Product").trim()} | OneStore`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, url });
      return;
    } catch (err: any) {
      if (err?.name === "AbortError") return;
    }
  }

  await copyProductLink(product);
}
