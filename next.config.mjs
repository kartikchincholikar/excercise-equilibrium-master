/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to produce a static site
  output: 'export',
  
  // Required for static export with external images.
  // This disables Next.js's default image optimization.
  images: {
    unoptimized: true,
  },
  
  // Keep your other configs if needed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;