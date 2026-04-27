import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".claude/**",
      ".next/**",
      ".vercel/**",
      "build/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "scripts/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
