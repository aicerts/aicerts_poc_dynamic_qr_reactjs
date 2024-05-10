/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "netcomlearning.s3.amazonaws.com",
            "images.netcomlearning.com",
            "img.youtube.com",
            "google.webp",
            "cdn.zeplin.io",
        ],
    }
}

module.exports = nextConfig
