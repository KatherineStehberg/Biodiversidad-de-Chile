import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // The project is already TypeScript-clean. Keep legacy explicit-any debt
      // visible as warnings while deploy blockers are reduced incrementally.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["src/lib/mock-supabase.ts"],
    rules: {
      // This test double intentionally accepts multiple Supabase-shaped payloads.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
  {
    files: ["cypress/support/**/*.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },
  {
    files: ["features/step-definitions/**/*.js", "tests/playwright/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
];

export default eslintConfig;
