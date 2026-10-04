import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTACT_EMAIL, SITE_URL, SUPPORT_EMAIL } from "../site/config.mjs";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const dist = join(root, "dist");
const site = join(root, "site");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const mailto = (address, label = address) => `<a href="mailto:${escapeHtml(address)}">${escapeHtml(label)}</a>`;

const mark = `<img class="brand-mark" src="/mark.svg" alt="" width="36" height="36">`;

const header = () => `
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="/" aria-label="Robot Arms LLC home">
        ${mark}
        <span class="brand-wordmark">Robot Arms LLC</span>
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/#products">Products</a>
        <a href="/about/">About</a>
        <a href="/support/">Support</a>
        <a class="nav-utility" href="/games/">Play</a>
      </nav>
    </div>
  </header>`;

const footer = () => `
  <footer class="site-footer">
    <div class="shell">
      <div class="footer-top">
        <div>
          <a class="brand" href="/" aria-label="Robot Arms LLC home">
            ${mark}
            <span class="brand-wordmark">Robot Arms LLC</span>
          </a>
          <p>Independent software for learning, making, and keeping things moving.</p>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="/seedshelf/">SeedShelf</a>
          <a href="/pathweaver/">Pathweaver</a>
          <a href="/support/">Support</a>
          <a href="/privacy/">Privacy</a>
          <a href="/games/">Games</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Robot Arms LLC</span>
        <span>${mailto(CONTACT_EMAIL, CONTACT_EMAIL)}</span>
      </div>
    </div>
  </footer>`;

const layout = ({ title, description, path, body, noindex = false }) => {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f4f0e8">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Robot Arms LLC">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  <main id="main">${body}</main>
  ${footer()}
</body>
</html>
`;
};

const homeDiagram = `
<div class="diagram-wrap" role="img" aria-label="A technical line drawing showing ideas moving from a shelf through three connected nodes">
  <svg class="diagram" viewBox="0 0 520 520" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <rect width="520" height="520" fill="#fbfaf6"/>
    <path d="M84 117H432M84 207H432M84 297H432M84 387H432" stroke="#d7d4ca" stroke-width="2"/>
    <path d="M113 91V413M407 91V413" stroke="#0e332e" stroke-width="3"/>
    <path d="M113 91h294M113 413h294" stroke="#0e332e" stroke-width="3"/>
    <path d="M160 117v90M207 117v90M254 117v90M301 117v90M348 117v90" stroke="#b9b7ad" stroke-width="2"/>
    <path d="M160 297v90M207 297v90M254 297v90M301 297v90M348 297v90" stroke="#b9b7ad" stroke-width="2"/>
    <path d="M160 177C210 241 253 251 302 211C340 181 369 196 390 251" fill="none" stroke="#d96532" stroke-width="3" stroke-dasharray="7 9"/>
    <circle cx="160" cy="177" r="9" fill="#d96532"/>
    <circle cx="302" cy="211" r="9" fill="#0e332e"/>
    <circle cx="390" cy="251" r="9" fill="#b9873a"/>
    <path d="M160 177l-16-24M302 211l20-24M390 251l24-5" stroke="#0e332e" stroke-width="2"/>
    <text x="132" y="137" fill="#36534d" font-size="13" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">observe</text>
    <text x="320" y="175" fill="#36534d" font-size="13" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">organize</text>
    <text x="417" y="246" fill="#36534d" font-size="13" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">connect</text>
    <path d="M84 448h348" stroke="#b9b7ad" stroke-width="2"/>
    <path d="M84 448v-8M171 448v-8M258 448v-8M345 448v-8M432 448v-8" stroke="#b9b7ad" stroke-width="2"/>
    <text x="84" y="477" fill="#6b8272" font-size="12" letter-spacing="2" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">SMALL SYSTEMS / HUMAN SCALE</text>
  </svg>
  <span class="diagram-label">A working sketch</span>
</div>`;

const home = `
  <section class="shell hero">
    <div>
      <p class="eyebrow">Robot Arms LLC / independent software studio</p>
      <h1>Software for curious minds &amp; useful work.</h1>
      <p class="lede">Robot Arms makes focused software for organizing real work, following good questions, and giving ideas room to grow.</p>
      <div class="button-row">
        <a class="button" href="#products">See the work</a>
        <a class="button secondary" href="/about/">About the studio</a>
      </div>
      <p class="micro-note">Two products are in development. Both start small, stay clear, and earn their way forward.</p>
    </div>
    ${homeDiagram}
  </section>

  <section class="shell section-rule" id="products">
    <div class="section-intro">
      <p class="eyebrow">Current work</p>
      <div>
        <h2>Two directions, one studio.</h2>
        <p>Robot Arms works at the intersection of practical stewardship and open-ended learning, with a clear scope for each product.</p>
      </div>
    </div>
    <div class="product-list">
      <article class="product-row">
        <div class="product-index">01 / iPhone</div>
        <div>
          <h3>SeedShelf</h3>
          <p>A calm, offline inventory for seed-library coordinators. Track lots and packet movement, spot low stock, and make ordinary reports without an account or a cloud service.</p>
        </div>
        <div>
          <span class="product-status">In development</span><br>
          <a class="product-link" href="/seedshelf/">Read about SeedShelf</a>
        </div>
      </article>
      <article class="product-row">
        <div class="product-index">02 / curriculum</div>
        <div>
          <h3>Pathweaver</h3>
          <p>Explore connected ideas across a source-backed curriculum map. Find a starting point and see where a question can lead.</p>
        </div>
        <div>
          <span class="product-status">In development</span><br>
          <a class="product-link" href="/pathweaver/">Read about Pathweaver</a>
        </div>
      </article>
    </div>
  </section>

  <section class="shell section-rule studio-strip">
    <div>
      <p class="eyebrow">The studio</p>
      <h2>Small surfaces. Serious details.</h2>
    </div>
    <div class="studio-copy">
      <p>We like software that explains itself, keeps the important parts close at hand, and does not ask for more data than the job requires. That means simple exports, readable interfaces, and room for a person to stay in control.</p>
      <p>Robot Arms LLC is a small independent company. The products on this site are works in progress; availability and release timing will be shared when they are ready.</p>
    </div>
  </section>

  <section class="shell section-rule">
    <div class="legacy-callout">
      <div><strong>There is still a little magic here.</strong><br><p>Visit the family game lab and a few printable experiments from the earlier chapter.</p></div>
      <a class="button secondary" href="/games/">Open the game lab</a>
    </div>
  </section>`;

const seedShelf = `
  <section class="shell page-hero">
    <p class="eyebrow">Product / iPhone</p>
    <h1>Know what’s on your seed shelf.</h1>
    <p class="lede">An offline seed-library ledger for coordinators who need to know what arrived, what moved, and what needs attention next.</p>
    <div class="page-meta"><span>In development</span><span>iPhone</span><span>Offline by design</span></div>
  </section>
  <section class="shell content-grid">
    <aside>01 / product note</aside>
    <div class="content">
      <div class="feature-rail"><p>Packets are the unit. History stays visible. Reports stay ordinary.</p></div>
      <h2>A useful record of movement.</h2>
      <p>SeedShelf is being built for a seed-library coordinator who needs a focused tool rather than a general inventory platform. Record prepared packets coming in, going out, being withdrawn, or being counted. The app keeps that movement history and makes the current shelf easier to reconcile.</p>
      <dl class="spec-list">
        <div class="spec"><dt>Stock work</dt><dd>Lots, varieties, sources, storage labels, thresholds, and packet-level movement history.</dd></div>
        <div class="spec"><dt>Reports</dt><dd>Low-stock views, reconciliation, CSV export, individual packet labels, and printable PDF sheets.</dd></div>
        <div class="spec"><dt>Recovery</dt><dd>A complete Files backup and a staged restore flow designed to keep the previous library recoverable.</dd></div>
        <div class="spec"><dt>Model</dt><dd>One library and one location in the first release; additional locations and imports remain later work.</dd></div>
      </dl>
      <h2>Quiet by default.</h2>
      <p>The first release has no accounts, ads, analytics, or automatic upload. Library data lives in the app on your iPhone. Files or backups you explicitly export can leave the device through the provider you choose.</p>
      <p>SeedShelf is in development and is not yet available on the App Store. Release details will appear here when available.</p>
      <p><a class="product-link" href="/seedshelf/privacy/">Read the SeedShelf privacy detail</a></p>
    </div>
  </section>`;

const pathweaver = `
  <section class="shell page-hero">
    <p class="eyebrow">Product / curriculum</p>
    <h1>Pathweaver makes connections easier to see.</h1>
    <p class="lede">A curriculum map for tracing connections between learning topics and discovering what to explore next.</p>
    <div class="page-meta"><span>In development</span><span>Curriculum exploration</span><span>Source-backed</span></div>
  </section>
  <section class="shell content-grid">
    <aside>02 / product note</aside>
    <div class="content">
      <div class="feature-rail"><p>Follow a thread from a familiar idea to a new one, with the source and boundary still in view.</p></div>
      <h2>A map for curiosity.</h2>
      <p>Pathweaver is being shaped as a public, curriculum-only product. It brings reviewed educational content together so a learner, parent, or educator can notice useful connections across subjects and sources.</p>
      <h2>What the early surface is for.</h2>
      <ul>
        <li>Explore connected topics across subjects and sources.</li>
        <li>Start with a familiar idea and follow a question into a new area.</li>
        <li>See where a learning path begins before deciding where to go next.</li>
      </ul>
      <p>The public product is curriculum-only and does not include family profiles, child records, or automatic personalization.</p>
      <p>Pathweaver remains in development. Product scope, public access, and release timing are not final.</p>
    </div>
  </section>`;

const about = `
  <section class="shell page-hero">
    <p class="eyebrow">About / Robot Arms LLC</p>
    <h1>Software for the parts of life that deserve a good tool.</h1>
    <p class="lede">Robot Arms LLC is an independent software studio working on small, careful products for learning, making, and practical stewardship.</p>
  </section>
  <section class="shell content-grid">
    <aside>Studio note</aside>
    <div class="content">
      <h2>Build the useful layer.</h2>
      <p>The best tools do not compete with the work. They give it shape: a clear record, a better handoff, a connection that was easy to miss. Robot Arms starts with that useful layer and keeps the surface understandable.</p>
      <p>Our current work is SeedShelf, an offline iPhone ledger for seed-library coordination, and Pathweaver, a curriculum exploration concept built around reviewed learning connections. Both are in development, and both are being built with deliberate limits.</p>
      <h2>Stay in touch.</h2>
      <p>For general company and product questions, write ${mailto(CONTACT_EMAIL)}. For SeedShelf help or product feedback, use ${mailto(SUPPORT_EMAIL)}.</p>
    </div>
  </section>`;

const support = `
  <section class="shell page-hero">
    <p class="eyebrow">Support / contact</p>
    <h1>Get in touch.</h1>
    <p class="lede">Robot Arms products are still in development. Use the right inbox for the question, and include only the context needed to help.</p>
  </section>
  <section class="shell content-grid">
    <aside>Support paths</aside>
    <div class="content">
      <h2>SeedShelf</h2>
      <p>For product questions, feedback, or release interest, write ${mailto(SUPPORT_EMAIL)}. Please do not send a live database, full backup, or other private library export unless we ask for a specific, redacted example.</p>
      <h2>Robot Arms LLC</h2>
      <p>For general company and product questions, write ${mailto(CONTACT_EMAIL)}.</p>
      <h2>Before launch</h2>
      <p>There is no public release channel or guaranteed response time yet. We will update this page as the products move from development into a supported release.</p>
      <div class="feature-rail"><p>Never include passwords, signing credentials, payment details, or private family information in an email.</p></div>
    </div>
  </section>`;

const privacy = `
  <section class="shell page-hero">
    <p class="eyebrow">Privacy / company site</p>
    <h1>Your privacy.</h1>
    <p class="lede">This page describes the current Robot Arms LLC website and its separate legacy routes. It will be updated before any product release.</p>
    <div class="page-meta"><span>Last updated October 2026</span><span>Robot Arms LLC</span></div>
  </section>
  <section class="shell content-grid">
    <aside>Website policy</aside>
    <div class="content">
      <h2>The new company site</h2>
      <p>The pages under the Robot Arms LLC home, product, support, and privacy routes are static pages. They do not ask for an account, add advertising or analytics, set a site cookie, or use a tracking pixel. They use no remote web fonts or third-party form service.</p>
      <p>This site is hosted on Cloudflare. Cloudflare may process ordinary request information such as an IP address, request time, URL, user-agent, and security events in its logs. Robot Arms LLC does not add an application database or a separate visitor profile to this site.</p>
      <h2>Contact messages</h2>
      <p>Email sent to ${mailto(CONTACT_EMAIL)} or ${mailto(SUPPORT_EMAIL)} is routed by Cloudflare Email Routing and delivered to Gmail for Robot Arms LLC to read and answer. Cloudflare and Google may retain message information according to their services and settings. Use the minimum information needed for the question. Do not send credentials, payment details, private family records, or a complete app backup as an unsolicited attachment.</p>
      <h2>Legacy games and prints</h2>
      <p>The earlier family game lab at <a href="/games/">/games/</a> is a separate legacy page. It keeps its original inline browser games, loads Google Fonts, and can use the browser's optional speech-synthesis feature when a visitor asks it to narrate a story. Those browser features are distinct from the new company pages. The print gallery at <a href="/prints.html">/prints.html</a> also loads Google Fonts and serves downloadable model files supplied by the site owner.</p>
      <h2>Changes and questions</h2>
      <p>This is a bounded description of the current static site, not a promise that future app behavior will have the same data practices. Product-specific details live on the <a href="/seedshelf/privacy/">SeedShelf privacy page</a>. Questions about this site can be sent to ${mailto(CONTACT_EMAIL)}.</p>
    </div>
  </section>`;

const seedShelfPrivacy = `
  <section class="shell page-hero">
    <p class="eyebrow">SeedShelf / privacy detail</p>
    <h1>A ledger that stays on the device.</h1>
    <p class="lede">The current SeedShelf design stores coordinator-entered library information locally and does not operate a developer-run account or sync service.</p>
    <div class="page-meta"><span>Pre-release description</span><span>In development</span></div>
  </section>
  <section class="shell content-grid">
    <aside>Product policy</aside>
    <div class="content">
      <h2>Information stored</h2>
      <p>SeedShelf stores library and location labels, lot names, variety and source notes, an optional year, storage labels, stock thresholds, packet movements, reasons, and timestamps. It does not ask for patron identity or contact information. A person can still enter personal information into a free-text field, so the coordinator should use those fields carefully.</p>
      <h2>What the first release does not include</h2>
      <ul>
        <li>No accounts, automatic upload, or cloud synchronization.</li>
        <li>No ads or analytics. The app does not request contacts, camera, microphone, location, or full photo-library permission.</li>
        <li>No automatic upload of the active library or movement history.</li>
      </ul>
      <h2>Files, backups, and deletion</h2>
      <p>The active library and retained recovery generations live in the app sandbox and receive iOS file protection. OS-managed device backups may include app data according to the user's settings. A backup or CSV explicitly exported to Files or shared can leave the device through the provider the user selects; exported backup and CSV files are not encrypted by SeedShelf.</p>
      <p>Deleting the app removes its sandbox. Save a backup outside the SeedShelf folder in Files before uninstalling if the library needs to be recovered later.</p>
      <p>This policy describes the current prerelease app. We will update it if its data practices change.</p>
      <h2>Questions</h2>
      <p>For product support, write ${mailto(SUPPORT_EMAIL)}. The app is still in development, so this page describes the current prerelease design.</p>
    </div>
  </section>`;

const notFound = `
  <section class="shell not-found">
    <p class="eyebrow">404 / route not found</p>
    <h1>That path wandered off.</h1>
    <p class="lede">The page may have moved, or it may still be a sketch on the workbench.</p>
    <div class="button-row"><a class="button" href="/">Return home</a><a class="button secondary" href="/support/">Contact support</a></div>
  </section>`;

const routes = [
  ["/", "Robot Arms LLC — Independent software studio", "Robot Arms LLC builds focused software for learning, making, and practical stewardship.", home],
  ["/seedshelf/", "SeedShelf — Robot Arms LLC", "SeedShelf is an offline iPhone ledger for seed-library coordinators. In development.", seedShelf],
  ["/pathweaver/", "Pathweaver — Robot Arms LLC", "Pathweaver is a curriculum exploration concept built around source-backed learning connections. In development.", pathweaver],
  ["/about/", "About Robot Arms LLC", "Robot Arms LLC is an independent software studio building small, careful products.", about],
  ["/support/", "Support — Robot Arms LLC", "Contact Robot Arms LLC about SeedShelf, Pathweaver, and the company site.", support],
  ["/privacy/", "Privacy — Robot Arms LLC", "Current privacy details for the Robot Arms LLC company site and its legacy routes.", privacy],
  ["/seedshelf/privacy/", "SeedShelf privacy — Robot Arms LLC", "Privacy details for the pre-release SeedShelf iPhone app.", seedShelfPrivacy],
  ["/404.html", "Page not found — Robot Arms LLC", "The requested Robot Arms LLC page could not be found.", notFound, true],
];

async function copyTree(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) await copyTree(from, to);
    else if (entry.isFile()) await cp(from, to);
  }
}

async function copyPublicAssets() {
  const publicDir = join(root, "public");
  const allowed = new Set(["favicon.svg", "_headers"]);
  for (const entry of await readdir(publicDir, { withFileTypes: true })) {
    if (!allowed.has(entry.name) || !entry.isFile()) continue;
    await cp(join(publicDir, entry.name), join(dist, entry.name));
  }
  await cp(join(site, "styles.css"), join(dist, "styles.css"));
  await cp(join(site, "mark.svg"), join(dist, "mark.svg"));
}

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await copyPublicAssets();

  for (const [path, title, description, body, noindex = false] of routes) {
    const target = path === "/" ? join(dist, "index.html") : join(dist, path.replace(/^\//, ""), path.endsWith("/") ? "index.html" : "");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, layout({ title, description, path, body, noindex }), "utf8");
  }

  // Legacy routes are copied explicitly so docs, source, and build tooling never ship.
  await mkdir(join(dist, "games"), { recursive: true });
  await cp(join(root, "games", "index.html"), join(dist, "games", "index.html"));
  await cp(join(root, "prints.html"), join(dist, "prints.html"));
  await copyTree(join(root, "prints"), join(dist, "prints"));
  await copyTree(join(root, "unhinged"), join(dist, "unhinged"));

  await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /unhinged/\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");
  await writeFile(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter(([, , , , noindex]) => !noindex).map(([path]) => `  <url><loc>${SITE_URL}${path === "/" ? "/" : path}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");

  console.log(`Built ${routes.length - 1} public pages and preserved legacy routes in ${relative(root, dist)}/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
