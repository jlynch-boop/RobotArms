import { createHash } from "node:crypto";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const dist = join(root, "dist");
const requiredFiles = [
  "index.html",
  "404.html",
  "styles.css",
  "favicon.svg",
  "mark.svg",
  "robots.txt",
  "sitemap.xml",
  "seedshelf/index.html",
  "seedshelf/privacy/index.html",
  "pathweaver/index.html",
  "about/index.html",
  "support/index.html",
  "privacy/index.html",
  "games/index.html",
  "prints.html",
  "unhinged/index.html",
  "prints/rocket.stl",
  "prints/star.stl",
  "prints/robot_head.stl",
  "prints/nametag.stl",
];

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function fileDigest(path) { return digest(await readFile(path)); }

async function listFiles(directory, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await listFiles(path, name));
    else if (entry.isFile()) result.push(name);
  }
  return result;
}

function routeToFile(urlPath) {
  const clean = urlPath.split("#", 1)[0].split("?", 1)[0];
  if (!clean || clean === "/") return "index.html";
  if (clean.endsWith("/")) return `${clean.slice(1)}index.html`;
  return clean.slice(1);
}

async function validateInternalLinks() {
  const pages = [
    "index.html",
    "seedshelf/index.html",
    "seedshelf/privacy/index.html",
    "pathweaver/index.html",
    "about/index.html",
    "support/index.html",
    "privacy/index.html",
    "404.html",
    "games/index.html",
    "prints.html",
  ];
  for (const page of pages) {
    const html = await readFile(join(dist, page), "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/mailto:")) continue;
      const targetFile = routeToFile(target);
      check(await exists(join(dist, targetFile)), `${page} points to missing ${target}`);
    }
  }
}

async function main() {
  check(await exists(dist), "dist/ is missing; run npm run build first");
  if (failures.length) return finish();

  for (const file of requiredFiles) check(await exists(join(dist, file)), `missing generated route or asset: ${file}`);
  check((await readFile(join(dist, "games/index.html"), "utf8")).includes('href="/prints.html"'), "legacy game hub does not preserve the absolute prints link");
  check((await readFile(join(dist, "prints.html"), "utf8")).includes('href="/games/"'), "legacy prints page does not link back to /games/");
  check(!(await readFile(join(dist, "styles.css"), "utf8")).includes("fonts.googleapis.com"), "new company styles unexpectedly depend on a remote font");
  check(!(await readFile(join(dist, "index.html"), "utf8")).includes("CONTACT_EMAIL_PENDING"), "company home contains the contact placeholder");
  check((await readFile(join(dist, "404.html"), "utf8")).includes('name="robots" content="noindex, nofollow"'), "404 page should be noindex");

  const copiedLegacy = [
    ["games/index.html", "games/index.html"],
    ["prints.html", "prints.html"],
    ["unhinged/index.html", "unhinged/index.html"],
  ];
  for (const [source, output] of copiedLegacy) {
    check(await fileDigest(join(root, source)) === await fileDigest(join(dist, output)), `${output} was changed during build`);
  }
  for (const file of await listFiles(join(root, "prints"))) {
    check(await fileDigest(join(root, "prints", file)) === await fileDigest(join(dist, "prints", file)), `prints/${file} was changed during build`);
  }

  const shipped = await listFiles(dist);
  const forbidden = shipped.filter((file) => /(?:^|\/)(?:docs|scripts|site|SeedShelf|node_modules)(?:\/|$)|(?:package\.json|wrangler\.jsonc|config\.mjs)$/.test(file));
  check(forbidden.length === 0, `private/build source shipped: ${forbidden.join(", ")}`);
  check((await readFile(join(dist, "sitemap.xml"), "utf8")).includes("https://robotarms.ai/seedshelf/"), "sitemap is missing the SeedShelf route");
  check((await readFile(join(dist, "robots.txt"), "utf8")).includes("Disallow: /unhinged/"), "robots.txt does not keep the legacy unhinged route out of the index");

  await validateInternalLinks();
  finish(shipped.length);
}

function finish(shipped = 0) {
  if (failures.length) {
    console.error(`Validation failed with ${failures.length} issue(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${shipped} published files, preserved legacy bytes, and checked internal links.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
