import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
    ];
    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Content-Security-Policy",
        // Next's static hydration and the theme bootstrap require inline scripts.
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self'",
          "connect-src 'self' https://formspree.io https://cloudflareinsights.com",
          "frame-src https://challenges.cloudflare.com",
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "form-action 'self' https://formspree.io",
          "upgrade-insecure-requests",
        ].join("; "),
      });
    }
    const policy = securityHeaders.find(
      (header) => header.key === "Content-Security-Policy",
    );
    return [
      { source: "/:path*", headers: securityHeaders },
      // Only the StackHUD case study embeds our local, self-contained replay.
      ...(policy
        ? [
            {
              source: "/projects/stackhud",
              headers: [
                {
                  ...policy,
                  value: policy.value.replace(
                    "frame-src https://challenges.cloudflare.com",
                    "frame-src 'self' https://challenges.cloudflare.com",
                  ),
                },
              ],
            },
          ]
        : []),
      {
        source: "/demos/stackhud/replay.html",
        headers: [
          // Keep Cloudflare's automatic analytics out of the isolated demo.
          { key: "Cache-Control", value: "public, max-age=0, no-transform" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
