/**
 * Vercel Edge Middleware - Cookie-based Login Protection
 * Intercepts requests and redirects to a custom login page if the user is not authenticated.
 */
export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Handle POST /login-submit - process the login form submission
  if (path === '/login-submit' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      const username = formData.get('username');
      const password = formData.get('password');

      const expectedUser = process.env.AUTH_USER;
      const expectedPass = process.env.AUTH_PASS;

      // Safety check: if env vars are not configured yet, show a clear configuration error
      if (!expectedUser || !expectedPass) {
        console.error('AUTH_USER or AUTH_PASS environment variables are not set.');
        return new Response(null, {
          status: 302,
          headers: {
            'Location': new URL('/login.html?error=config', request.url).toString(),
          },
        });
      }

      if (username === expectedUser && password === expectedPass) {
        // Correct credentials -> set HttpOnly cookie and redirect to root (/)
        const sessionToken = btoa(username + ':' + password);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': new URL('/', request.url).toString(),
            'Set-Cookie': `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`, // 30 days
          },
        });
      } else {
        // Invalid credentials -> redirect to login page with error query param
        return new Response(null, {
          status: 302,
          headers: {
            'Location': new URL('/login.html?error=invalid', request.url).toString(),
          },
        });
      }
    } catch (err) {
      console.error('Error handling login POST:', err);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': new URL('/login.html?error=error', request.url).toString(),
        },
      });
    }
  }

  // 2. For all other routes, check if they have a valid cookie session
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [key, value] = c.trim().split('=');
    if (key) cookies[key] = value;
  });

  const authSession = cookies['auth_session'];
  const expectedSession = (process.env.AUTH_USER && process.env.AUTH_PASS)
    ? btoa(process.env.AUTH_USER + ':' + process.env.AUTH_PASS)
    : null;

  if (authSession && expectedSession && authSession === expectedSession) {
    // Authenticated successfully -> pass-through to static files
    return new Response(null, {
      headers: {
        'x-middleware-next': '1',
      },
    });
  }

  // Not authenticated -> Redirect (302) to /login.html
  return new Response(null, {
    status: 302,
    headers: {
      'Location': new URL('/login.html', request.url).toString(),
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - css (static files)
     * - js (static files)
     * - pdf_images (extracted images)
     * - favicon.ico (favicon)
     * - robots.txt (robots file)
     * - notion-page_merged.pdf (main PDF file)
     * - login.html (allow accessing login page directly)
     */
    '/((?!css|js|pdf_images|favicon\\.ico|robots\\.txt|notion-page_merged\\.pdf|login\\.html).*)',
  ],
};
