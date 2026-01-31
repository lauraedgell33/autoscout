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
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars with _ prefix (warning only for cleanup later)
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      // React hooks - keep as warnings
      "react-hooks/exhaustive-deps": "warn",
      // Allow require in config files
      "@typescript-eslint/no-require-imports": "off",
      // Quotes in JSX - keep as warning
      "react/no-unescaped-entities": "warn",
    },
  },
]);

export default eslintConfig;
