import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      include: [
        "src/app/api/**/*.ts",
        "src/components/landing/**/*.tsx",
        "src/lib/enrich-property.ts",
      ],
      exclude: ["src/__tests__/**"],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
    env: {
      STRIPE_SECRET_KEY: "sk_test_fake_key_for_tests",
      STRIPE_WEBHOOK_SECRET: "whsec_test_fake_secret",
      STRIPE_PRICE_MENSUEL: "price_test_mensuel",
      STRIPE_PRICE_LANCEMENT: "price_test_lancement",
      STRIPE_PRICE_BOOST: "price_test_boost",
      NEXTAUTH_SECRET: "test-secret-do-not-use-in-production",
      NEXTAUTH_URL: "http://localhost:3000",
      DATABASE_URL: "postgresql://test:test@localhost:5432/testdb",
      NEXT_PUBLIC_APP_URL: "https://immocrew.fr",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key",
      NEXT_PUBLIC_POSTHOG_HOST: "https://eu.posthog.com",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
