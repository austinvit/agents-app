import { NextResponse } from 'next/server';

const allowedIPs = [];

export function middleware(req) {

  let allowedIPs = process.env.NEXT_PUBLIC_ALLOWED_IPS || "[]"
  allowedIPs = JSON.parse(allowedIPs)

  let ip = req.headers['x-forwarded-for'] || req.connection?req.connection.remoteAddress:'localhost'

  if (ip === '::1' || ip === '127.0.0.1') ip = 'localhost';

  console.log('ip',ip);
  console.log('allowedIPs',allowedIPs);

  // Get IP (works on Vercel, Railway, etc.)
  // const ip =
  //   req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  //   req.ip ||
  //   'unknown';

  if (allowedIPs[0] && !allowedIPs.includes(ip)) {
    // You can either send a 403 directly...
    // return new NextResponse('Access Denied', { status: 403 });

    // ...or redirect to a custom 403 page
    return NextResponse.redirect(new URL('/403', req.url));
  }

  return NextResponse.next();
// return NextResponse.redirect(new URL('/403', req.url));
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
      Run on all pages:
      '/' and '/about', '/dashboard', etc.
      You can limit to just '/api/:path*' if you want to only protect APIs.
    */
    '/',
  ],
};
