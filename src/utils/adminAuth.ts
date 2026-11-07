import { v4 } from "uuid";
import { supabase } from "../DB/supabase";

const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  bmp: "image/bmp",
};

export function isSupportedImageFile(file: File): boolean {
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return Boolean(EXTENSION_MIME_MAP[ext]);
}

export function prepareProductImageUpload(file: File): {
  fileName: string;
  contentType: string;
} {
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const cleanExt = rawExt.replace(/[^a-z0-9]/g, "") || "jpg";
  const normalizedExt = cleanExt === "jfif" ? "jpg" : cleanExt;

  let contentType = file.type;
  if (!contentType || contentType === "image/jpg" || !contentType.startsWith("image/")) {
    contentType = EXTENSION_MIME_MAP[rawExt] ?? "image/jpeg";
  }

  return {
    fileName: `${v4()}.${normalizedExt}`,
    contentType,
  };
}

export async function verifyAdminSession(): Promise<{
  ok: boolean;
  userId: string | null;
  reason?: string;
}> {
  try {
    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      session = refreshed.session;
    }

    const uid = session?.user?.id ?? null;
    if (!uid) {
      localStorage.removeItem("one_store_admin");
      return {
        ok: false,
        userId: null,
        reason: "Your admin session has expired. Please sign in again.",
      };
    }

    const { data: userRow, error: userError } = await supabase
      .from("user")
      .select("role, admin")
      .eq("id", uid)
      .maybeSingle();

    if (userError) {
      // Fallback: if select on `admin` column failed because `admin` column doesn't exist, check `role` only
      const { data: roleRow, error: roleError } = await supabase
        .from("user")
        .select("role")
        .eq("id", uid)
        .maybeSingle();

      if (roleError || !roleRow) {
        localStorage.removeItem("one_store_admin");
        return {
          ok: false,
          userId: null,
          reason: "Unable to verify admin account. Please sign in again.",
        };
      }

      const isRoleAdmin = String(roleRow.role ?? "").toLowerCase() === "admin";
      if (!isRoleAdmin) {
        localStorage.removeItem("one_store_admin");
        return {
          ok: false,
          userId: null,
          reason: "Current browser session is not an admin account. Please sign in to Admin.",
        };
      }

      localStorage.setItem("one_store_admin", uid);
      return { ok: true, userId: uid };
    }

    const isAdmin =
      userRow?.admin === true ||
      String(userRow?.role ?? "").toLowerCase() === "admin";

    if (!userRow || !isAdmin) {
      localStorage.removeItem("one_store_admin");
      return {
        ok: false,
        userId: null,
        reason: "Current browser session is not an admin account. Please sign in to Admin.",
      };
    }

    localStorage.setItem("one_store_admin", uid);
    return { ok: true, userId: uid };
  } catch (err) {
    console.error("verifyAdminSession error:", err);
    return {
      ok: false,
      userId: null,
      reason: "Session check failed. Please sign in again.",
    };
  }
}
