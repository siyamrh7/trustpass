import type { NextConfig } from "next";

// Static export so the site can be hosted on GitHub Pages.
// BASE_PATH is set by the GitHub Actions workflow to "/<repo-name>".
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
