/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [new URL("https://jzltbuavmmiafpifrdme.supabase.co/**")],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};
