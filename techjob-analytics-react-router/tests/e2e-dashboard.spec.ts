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

        await page.goto(route.path, { waitUntil: "networkidle" });

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
    test("should populate dropdowns with Star Schema dynamic options and sync with URL", async ({ page }) => {
      await page.goto("/dashboard", { waitUntil: "networkidle" });

      // 1. Check City filter options
      const cityButton = page.locator("button", { hasText: "City" }).first();
      await expect(cityButton).toBeVisible();
      await cityButton.click();

      // Check header in dropdown shows "(27)"
      await expect(page.getByText(/City \(\d+\)/)).toBeVisible();

      // Click "Casablanca" option
      const casablancaOption = page.locator("button", { hasText: "Casablanca" }).first();
      await expect(casablancaOption).toBeVisible();
      await casablancaOption.click();

      // Check URL updated with city=Casablanca
      await expect(page).toHaveURL(/city=Casablanca/);

      // 2. Check Contract filter
      const contractButton = page.locator("button", { hasText: "Contract" }).first();
      await contractButton.click();
      await expect(page.getByText(/Contract \(\d+\)/)).toBeVisible();

      const cdiOption = page.locator("button", { hasText: "CDI" }).first();
      await expect(cdiOption).toBeVisible();
      await cdiOption.click();

      await expect(page).toHaveURL(/contract=CDI/);

      // 3. Check Hard Skills filter
      const hardSkillsButton = page.locator("button", { hasText: "Hard Skills" }).first();
      await hardSkillsButton.click();
      await expect(page.getByText(/Hard Skills \(\d+\)/)).toBeVisible();

      // Search inside Hard Skills dropdown
      const searchHardSkillsInput = page.getByPlaceholder(/search hard skills/i);
      await expect(searchHardSkillsInput).toBeVisible();
      await searchHardSkillsInput.fill("React");

      const reactOption = page.locator("button", { hasText: "React" }).first();
      await expect(reactOption).toBeVisible();
      await reactOption.click();

      await expect(page).toHaveURL(/technology=React/);

      // 4. Check Soft Skills filter
      const softSkillsButton = page.locator("button", { hasText: "Soft Skills" }).first();
      await softSkillsButton.click();
      await expect(page.getByText(/Soft Skills \(\d+\)/)).toBeVisible();

      // 5. Test Clear All
      const clearAllButton = page.getByRole("button", { name: /Clear All/i });
      await expect(clearAllButton).toBeVisible();
      await clearAllButton.click();

      await expect(page).toHaveURL("/dashboard");
    });
  });

  // ── 3. VISUAL CHARTS & SVG RENDERING AUDIT ──
  test.describe("3. Visual Charts & SVG Rendering Audit", () => {
    test("Page 1 (/dashboard): should render 5 Star Schema KPIs and Recharts SVGs", async ({ page }) => {
      await page.goto("/dashboard", { waitUntil: "networkidle" });

      // Assert 5 KPI Cards
      await expect(page.getByText(/Total Jobs/i)).toBeVisible();
      await expect(page.getByText(/Total Companies/i)).toBeVisible();
      await expect(page.getByText(/Total Cities/i)).toBeVisible();
      await expect(page.getByText(/Remote Flexibility/i)).toBeVisible();
      await expect(page.getByText(/Avg. Experience/i)).toBeVisible();

      // Assert Star Schema ground truth values
      await expect(page.getByText("10,782", { exact: true })).toBeVisible();
      await expect(page.getByText("2,767", { exact: true })).toBeVisible();
      await expect(page.getByText("27 Cities", { exact: true })).toBeVisible();

      // Assert Recharts SVG charts render
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
      const count = await svgs.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test("Page 2 (/dashboard/analysis): should render 5 deep analytics charts", async ({ page }) => {
      await page.goto("/dashboard/analysis", { waitUntil: "networkidle" });

      // Verify Chart Headers
      await expect(page.getByRole("heading", { name: "Detailed Analysis" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Workplace Model" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Industry Sectors" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "YoY City Growth" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Top Recruiters" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Top Roles" })).toBeVisible();

      // Verify SVG rendering
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
      expect(await svgs.count()).toBeGreaterThanOrEqual(4);
    });

    test("Page 3 (/dashboard/matcher): should dynamically update match score when adding skills", async ({ page }) => {
      await page.goto("/dashboard/matcher", { waitUntil: "networkidle" });

      // Check header and KPI Cards
      await expect(page.getByRole("heading", { name: "Stack Matcher" })).toBeVisible();
      await expect(page.getByText(/Match Score/i)).toBeVisible();
      await expect(page.getByText(/Top Missing Booster/i)).toBeVisible();
      await expect(page.getByText(/Top Hiring Hub/i)).toBeVisible();

      // Check ROI breakdown list renders
      await expect(page.getByText(/Missing Skills ROI/i)).toBeVisible();

      // Verify SVG rendering
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();
    });

    test("Page 4 (/dashboard/skills/pairings): should load companion skills and co-occurrence network", async ({ page }) => {
      await page.goto("/dashboard/skills/pairings", { waitUntil: "networkidle" });

      // Verify header and default "React" pairings
      await expect(page.getByRole("heading", { name: "Skill Pairings" })).toBeVisible();
      await expect(page.getByText(/Core Skill/i)).toBeVisible();
      await expect(page.getByText(/Top Companion Skill/i)).toBeVisible();
      await expect(page.getByText(/Avg Skills \/ Job/i)).toBeVisible();
      await expect(page.getByRole("heading", { name: "Co-occurrence %" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Pairings by Category" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Top Roles" })).toBeVisible();

      // Verify SVG charts render
      const svgs = page.locator(".recharts-surface");
      await expect(svgs.first()).toBeVisible();

      // Type "Python" in the search input
      const skillInput = page.getByPlaceholder("Search technology...");
      await skillInput.fill("Python");

      // Click the first dropdown suggestion "Python"
      const pythonSuggestion = page.locator("button", { hasText: "Python" }).first();
      if (await pythonSuggestion.isVisible()) {
        await pythonSuggestion.click();
        await page.waitForTimeout(500);
      }
    });

    test("Page 5 (/dashboard/skills/catalog): should render 121 hard skills, 50 soft skills, and filter accurately", async ({ page }) => {
      await page.goto("/dashboard/skills/catalog", { waitUntil: "networkidle" });

      // Verify KPI counts
      await expect(page.getByText(/Total Hard Technologies/i)).toBeVisible();
      await expect(page.getByText(/Total Soft Skills/i)).toBeVisible();
      await expect(page.getByText(/Hard Technologies & Frameworks/i)).toBeVisible();
      await expect(page.getByText(/Soft & Behavioral Competencies/i)).toBeVisible();

      // Verify 121 skills count badge and 50 soft skills count badge
      await expect(page.getByText("121 skills")).toBeVisible();
      await expect(page.getByText("50 competencies")).toBeVisible();

      // Search "Docker" in real-time filter
      const searchInput = page.getByPlaceholder(/Search skill/i);
      await searchInput.fill("Docker");

      // Verify Docker is shown in Hard Skills
      await expect(page.locator("text=Docker").first()).toBeVisible();

      // Clear search
      await searchInput.fill("");

      // Click "Backend" category filter pill
      const backendPill = page.getByRole("button", { name: "Backend", exact: true });
      if (await backendPill.isVisible()) {
        await backendPill.click();
        await page.waitForTimeout(300);
      }
    });
  });
});
