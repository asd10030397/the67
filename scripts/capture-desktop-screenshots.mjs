import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "screenshots", "desktop-ux-after");
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";

const viewports = [
  { name: "1440p", width: 2560, height: 1440 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "ultrawide", width: 3440, height: 1440 },
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });

  await page.goto(`${baseUrl}/genesis`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(outDir, `genesis-${viewport.name}.png`),
    fullPage: true,
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  for (let i = 0; i < 6; i += 1) {
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await page.waitForTimeout(900);
  }
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, `landing-gallery-${viewport.name}.png`),
    fullPage: false,
  });

  await page.close();
}

await browser.close();
console.log(`Screenshots saved to ${outDir}`);
