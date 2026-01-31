import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Non-production/example artifacts outside src/
    "EXAMPLE_USAGE.tsx",
    "components/**",
    
    // Config and scripts
    "*.config.js",
    "*.config.ts",
    "scripts/**",
    "jest.setup.js",
  ]),
  // Custom rules
  {
    rules: {
      // Allow any in specific cases (will fix gradually)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused vars for MVP (will clean up later)
      "@typescript-eslint/no-unused-vars": "off",
      // React hooks - keep as warnings
      "react-hooks/exhaustive-deps": "warn",
      // Allow require in config files
      "@typescript-eslint/no-require-imports": "off",
      // Quotes in JSX - turn off for now
      "react/no-unescaped-entities": "off",
      // Allow <img> for external images (many can't be optimized by Next.js)
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
