/** @type {import('next').NextConfig} */

// Define these at the top for clarity
const repo = 'excercise-equilibrium-master'; // YOUR REPOSITORY NAME
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Configure Next.js to produce a static site
  output: 'export',
  
  // Set the basePath for GitHub Pages
  basePath: isProd ? `/${repo}` : '',

  // Set the assetPrefix for GitHub Pages
  assetPrefix: isProd ? `/${repo}/` : '',
  
  // Required for static export with external images.
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