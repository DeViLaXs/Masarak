// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authService } from "./services/authService";
import { useMe } from "./hooks/useAuth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
 
  const pathname = request.nextUrl.pathname;
 
  // منع أي شخص يحاول فتح /otp
  if (pathname.startsWith("/otp")) {
    if (token) {
      // إذا لا يوجد توكن → redirect إلى login
      // if(token.role === "Admin"){
      //   return NextResponse.redirect(new URL("/admin", request.url));
      // }
      
      // if(token.role === "Company"){
      //   return NextResponse.redirect(new URL("/company", request.url));
      // }
      return NextResponse.redirect(new URL("/company", request.url));
    } else {
      // لا يوجد token → redirect إلى الصفحة السابقة إذا موجودة
      const referer = request.headers.get("referer");
      if (referer) {
        return NextResponse.redirect(referer);
      } else {
        // fallback → landing page
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

// نحدد فقط route /otp
export const config = {
  matcher: ["/otp"],
};
