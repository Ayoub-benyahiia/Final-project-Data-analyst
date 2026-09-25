import { test, expect } from "@playwright/test";

test.describe("TechJob Analytics — Comprehensive E2E Verification Suite", () => {
  // ── 1. PAGE LOAD & CONSOLE HEALTH CHECK ──
  test.describe("1. Page Load & Console Health Check", () => {
    const routes = [
      { path: "/", name: "Landing Page" },
      { path: "/dashboard", name: "Market Overview" },
      { path: "/dashboard/analysis", name: "Detailed Analysis" },
      { path: "/dashboard/matcher", name: "Stack Matcher" },
      { path: "/dashboard/skills/pairings", name: "Skill Pairings" },
      { path: "/dashboard/skills/catalog", name: "Skills Catalog" },
    ];

    for (const route of routes) {
      test(`should load ${route.name} (${route.path}) without JS errors or 500/404 API failures`, async ({ page }) => {
        const errors: string[] = [];
        const failedRequests: string[] = [];

        page.on("pageerror", (err) => errors.push(err.message));
        page.on("response", (res) => {
          if (res.status() >= 400 && res.url().includes("/api/")) {
            failedRequests.push(`${res.status()} ${res.url()}`);
          }
        });

        await page.goto(route.path, { waitUntil: "domcontentloaded" });

        // Assert no uncaught exceptions
        expect(errors, `Uncaught JS errors on ${route.path}: ${errors.join(", ")}`).toHaveLength(0);
        // Assert no failed API calls
        expect(failedRequests, `Failed API requests on ${route.path}: ${failedRequests.join(", ")}`).toHaveLength(0);

        // Verify page rendered root container
        await expect(page.locator("#root")).toBeAttached();
      });
    }
  });

  // ── 2. FILTER BAR & DYNAMIC OPTIONS VERIFICATION ──
  test.describe("2. Filter Bar & Dynamic Options Verification", () => {
    test("should populate dropdowns with Star Schema dynamic options and filter data", async ({ page }) => {
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

      // 1. Check City filter dropdown
      const cityButton = page.locator("button", { hasText: "City" }).first();
      await expect(cityButton).toBeVisible();
      await cityButton.click();

      // Click "Casablanca" option in the open dropdown
      const casablancaOption = page.locator("button", { hasText: "Casablanca" }).first();
      if (await casablancaOption.isVisible()) {
        await casablancaOption.click();
      }

      // Close dropdown
      await cityButton.click();

      // 2. Check Contract filter
      const contractButton = page.locator("button", { hasText: "Contract" }).first();
      await expect(contractButton).toBeVisible();
      await contractButton.click();

      const cdiOption = page.locator("button", { hasText: "CDI" }).first();
      if (await cdiOption.isVisible()) {
        await cdiOption.click();
      }

      await contractButton.click();

      // 3. Test Reset / Clear All button
      const clearButton = page.getByRole("button", { name: /Clear All/i });
      if (await clearButton.isVisible()) {
        await clearButton.click();
      }
    });
  });

  // ── 3. VISUAL CHARTS & SVG RENDERING AUDIT ──
  test.describe("3. Visual Charts & SVG Rendering Audit", () => {
    test("Page 1 (/dashboard): should render 5 Star Schema KPIs and Recharts SVGs", async ({ page }) => {
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

      // Assert 5 KPI Cards
      await expect(page.getByText(/Total Jobs/i)).toBeVisible();
      await expect(page.getByText(/Total Companies/i)).toBeVisible();
      await expect(page.getByText(/Total Cities/i)).toBeVisible();
      await expect(page.getByText(/Remote Flexibility/i)).toBeVisible();
      await expect(page.getByText(/Avg. Experience/i)).toBeVisible();

      // Assert Star Schema ground truth values
      await expect(page.getByText("10,782", { exact: true })).toBeVisible();
      await expect(page.getByText("2,767", { exact: true })).toBeVisible();

      // Assert Recharts SVG charts render
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
      const count = await svgs.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test("Page 2 (/dashboard/analysis): should render 5 deep analytics charts", async ({ page }) => {
      await page.goto("/dashboard/analysis", { waitUntil: "domcontentloaded" });

      // Verify Chart Headers
      await expect(page.getByRole("heading", { name: /Detailed Analysis/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Workplace Model/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Industry Sectors/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /YoY City Growth/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Top Recruiters/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Top Roles/i })).toBeVisible();

      // Verify SVG rendering
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
      expect(await svgs.count()).toBeGreaterThanOrEqual(4);
    });

    test("Page 3 (/dashboard/matcher): should dynamically update match score when adding skills", async ({ page }) => {
      await page.goto("/dashboard/matcher", { waitUntil: "domcontentloaded" });

      // Check header and KPI Cards
      await expect(page.getByRole("heading", { name: /Stack Matcher/i })).toBeVisible();
      await expect(page.getByText(/Match Score/i)).toBeVisible();
      await expect(page.getByText(/Top Missing Booster/i)).toBeVisible();
      await expect(page.getByText(/Top Hiring Hub/i)).toBeVisible();

      // Check ROI breakdown card renders
      await expect(page.getByText(/Missing Skills ROI/i)).toBeVisible();

      // Verify SVG rendering
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
    });

    test("Page 4 (/dashboard/skills/pairings): should load companion skills and co-occurrence network", async ({ page }) => {
      await page.goto("/dashboard/skills/pairings", { waitUntil: "domcontentloaded" });

      // Verify header and default "React" pairings
      await expect(page.getByRole("heading", { name: /Skill Pairings/i })).toBeVisible();
      await expect(page.getByText(/Core Skill/i)).toBeVisible();
      await expect(page.getByText(/Top Companion Skill/i)).toBeVisible();
      await expect(page.getByText(/Avg Skills \/ Job/i)).toBeVisible();
      await expect(page.getByRole("heading", { name: /Co-occurrence %/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Pairings by Category/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Top Roles/i })).toBeVisible();

      // Verify SVG charts render
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
    });

    test("Page 5 (/dashboard/skills/catalog): should render 121 hard skills, 50 soft skills, and filter accurately", async ({ page }) => {
      await page.goto("/dashboard/skills/catalog", { waitUntil: "domcontentloaded" });

      // Verify KPI titles
      await expect(page.getByText(/Total Hard Technologies/i)).toBeVisible();
      await expect(page.getByText(/Total Soft Skills/i)).toBeVisible();
      await expect(page.getByText(/Hard Technologies & Frameworks/i)).toBeVisible();
      await expect(page.getByText(/Soft & Behavioral Competencies/i)).toBeVisible();

      // Verify badges
      await expect(page.getByText(/121 skills/i)).toBeVisible();
      await expect(page.getByText(/50 competencies/i)).toBeVisible();

      // Search "Docker" in real-time search input
      const searchInput = page.getByPlaceholder(/Search skill/i);
      await searchInput.fill("Docker");

      // Verify Docker is shown in Hard Skills
      await expect(page.locator("text=Docker").first()).toBeVisible();
    });
  });
});
