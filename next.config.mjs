/** @type {import('next').NextConfig} */
const nextConfig = {
  // The football database lives in data/ — never bundle it; read via fs at runtime.
  outputFileTracingExcludes: { "*": ["./data/**"] },
};

export default nextConfig;
