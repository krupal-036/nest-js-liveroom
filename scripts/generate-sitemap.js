import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://nest-js-liveroom.vercel.app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../frontend/public");

const routes = [
    { path: "/", priority: 1.0, changefreq: "weekly" },
    { path: "/about", priority: 0.7, changefreq: "monthly" },
    { path: "/auth", priority: 0.3, changefreq: "monthly" }, 
];

function buildSitemap(entries) {
    const today = new Date().toISOString().split("T")[0];

    const urlEntries = entries
        .map(
            (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
        )
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function buildRobotsTxt() {
    return `User-agent: *
Allow: /
Disallow: /chat
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function writeFile(filename, content) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✔ wrote ${filePath}`);
}

function run() {
    console.log(`\n🚀 Generating sitemap for ${SITE_URL}...\n`);
    writeFile("sitemap.xml", buildSitemap(routes));
    writeFile("robots.txt", buildRobotsTxt());
    console.log(`\n✅ Done. ${routes.length} public URLs written to sitemap.xml.`);
}

run();