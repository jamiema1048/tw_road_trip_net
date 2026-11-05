import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthorized(request: NextRequest) {
  const username = process.env.DEV_ADMIN_USERNAME;
  const password = process.env.DEV_ADMIN_PASSWORD;
  const authorization = request.headers.get("authorization");

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

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  if (!isAuthorized(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Development Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
