// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./modules/AuthService";

type Role = keyof typeof roleBasePrivateRoutes;

const authRoutes = ["/signup", "/signin"];
const roleBasePrivateRoutes = {
  USER: [/^\/user/],
  ADMIN: [/^\/admin/],
};

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          `${process.env.FRONTEND_URL}/signin?redirectPath=${pathname}`,
          req.url
        )
      );
    }
  }

  if (userInfo?.role && roleBasePrivateRoutes[userInfo?.role as Role]) {
    const routes = roleBasePrivateRoutes[userInfo?.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect( new URL('/',req.url));
};

// ✅ Middleware works only on these routes
export const config = {
  matcher: ["/admin", "/admin/:page","/user", "/user/:page"],
};
