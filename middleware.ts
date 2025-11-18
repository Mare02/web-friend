import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/auth/roles';
import { createD1Client } from '@/lib/db';

// Define routes that require admin access
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // For admin routes, require authentication and admin role
  if (isAdminRoute(req)) {
    // Protect the route (requires authentication)
    await auth.protect();

    try {
      // Get the authenticated user data
      const authData = await auth();

      if (!authData.userId) {
        // This shouldn't happen after auth.protect(), but safety check
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      // Try to get user email from database using userId
      // This is a fallback since middleware user access might be limited
      const db = createD1Client();
      const userProfile = await db.prepare(
        'SELECT email FROM user_profiles WHERE user_id = ?'
      ).bind(authData.userId).first<{ email: string }>();

      if (!userProfile?.email) {
        console.error('No email found in database for authenticated user:', authData.userId);
        // Redirect to home if we can't get user email
        return NextResponse.redirect(new URL('/', req.url));
      }

      const userEmail = userProfile.email;

      // Check if user has admin role
      const isAdmin = await isAdminUser(userEmail);

      if (!isAdmin) {
        console.log('User does not have admin role:', userEmail);
        // Redirect to home if user is authenticated but not admin
        return NextResponse.redirect(new URL('/', req.url));
      }

      // User is authenticated and has admin role - allow access
      return NextResponse.next();

    } catch (error) {
      console.error('Error during admin route authorization:', error);
      // On any error, deny access by default
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // For non-admin routes, allow normal processing
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};