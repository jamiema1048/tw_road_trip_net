import { headers } from "next/headers";
import { notFound } from "next/navigation";

function hasValidBasicAuth(authorization: string | null) {
  const username = process.env.DEV_ADMIN_USERNAME;
  const password = process.env.DEV_ADMIN_PASSWORD;

  if (!username || !password || !authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const [providedUsername, providedPassword] = atob(
      authorization.slice("Basic ".length),
    ).split(":");

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

export async function requireDevelopmentAdmin() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  if (!process.env.DEV_ADMIN_USERNAME || !process.env.DEV_ADMIN_PASSWORD) {
    throw new Error(
      "請在 .env.local 設定 DEV_ADMIN_USERNAME 與 DEV_ADMIN_PASSWORD。",
    );
  }

  const authorization = (await headers()).get("authorization");
  if (!hasValidBasicAuth(authorization)) {
    throw new Error("未授權的管理操作。");
  }
}
