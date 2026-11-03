import type { NextConfig } from "next";

function awsRemotePattern():
  | { protocol: "http" | "https"; hostname: string; pathname: string }[]
  | undefined {
  const raw = process.env.NEXT_PUBLIC_AWS_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    if (protocol !== "http" && protocol !== "https") return undefined;
    return [
      {
        protocol,
        hostname: url.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return undefined;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: awsRemotePattern() ?? [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
