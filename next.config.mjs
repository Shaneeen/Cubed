/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Original Wix URL was misspelled ("tiral"); preserved for SEO.
        source: "/one-month-tiral",
        destination: "/one-month-trial",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
