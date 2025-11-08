import nextConfig from "eslint-config-next";

const extraIgnores = {
  ignores: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
};

const config = [...nextConfig, extraIgnores];

export default config;
