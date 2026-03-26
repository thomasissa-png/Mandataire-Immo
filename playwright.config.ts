import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright E2E configuration for ImmoCrew.
 *
 * Why these choices:
 * - baseURL: localhost:3000 (Next.js dev server, started by webServer below)
 * - Chromium only in CI (speed), 3 browsers locally (thoroughness)
 * - Clerk auth is bypassed via route mocking — no real auth in E2E
 * - Timeouts calibrated for Next.js SSR cold start (30s action, 60s nav)
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/test-results",

  /* Parallel execution — safe because tests are isolated */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry flaky tests once in CI, never locally (catch flakiness early) */
  retries: process.env.CI ? 1 : 0,

  /* Limit parallel workers in CI to avoid resource contention */
  workers: process.env.CI ? 2 : undefined,

  /* HTML reporter for local dev, line reporter for CI logs */
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "e2e/playwright-report" }]]
    : [["html", { open: "on-failure", outputFolder: "e2e/playwright-report" }]],

  /* Shared settings for all projects */
  use: {
    baseURL: "http://localhost:3000",

    /* Collect trace on first retry — invaluable for debugging CI failures */
    trace: "on-first-retry",

    /* Screenshot on failure — visual evidence of what went wrong */
    screenshot: "only-on-failure",

    /* Viewport: desktop default, mobile tests override per-project */
    viewport: { width: 1280, height: 720 },

    /* French locale matching target audience */
    locale: "fr-FR",
  },

  projects: [
    /* Desktop — primary viewport (Sophie uses laptop at home) */
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    /* Tablet — secondary viewport (768px) */
    {
      name: "tablet",
      use: {
        ...devices["iPad Mini"],
      },
    },

    /* Mobile — critical viewport (Sophie checks between property visits) */
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],

  /* Start Next.js dev server before tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      /* Test environment variables — override real services */
      NODE_ENV: "test",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      /* Clerk test mode — publishable key for test instance */
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "sk_test_placeholder",
      /* Stripe test mode */
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
      /* PostHog — disabled in test */
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test_disabled",
    },
  },
})
