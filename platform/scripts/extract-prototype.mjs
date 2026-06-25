/**
 * Extract platform.css and login wallpaper from MSZRME-Platform-V2.html.
 * Usage: node scripts/extract-prototype.mjs [path-to-html]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const platformRoot = path.resolve(__dirname, "..");
const publicDir = path.join(platformRoot, "public");
const stylesDir = path.join(platformRoot, "styles");

const defaultHtml = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "MSZRME-Platform-V2.html"
);
const htmlPath = process.argv[2] || defaultHtml;

if (!fs.existsSync(htmlPath)) {
  console.error("HTML not found:", htmlPath);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");

function extractBetween(startMarker, endMarker, from = 0) {
  const start = html.indexOf(startMarker, from);
  if (start === -1) throw new Error(`Start marker not found: ${startMarker}`);
  const end = html.indexOf(endMarker, start + startMarker.length);
  if (end === -1) throw new Error(`End marker not found: ${endMarker}`);
  return html.slice(start, end + endMarker.length);
}

const sfproBlock = extractBetween('<style id="sfpro-embed">', "</style>");
const mainStyleStart = html.indexOf("<style>", html.indexOf("</style>") + 1);
const mainStyleEnd = html.indexOf("</style>", mainStyleStart);
const mainStyleBlock = html.slice(mainStyleStart, mainStyleEnd + "</style>".length);
const css =
  sfproBlock.replace(/^<style id="sfpro-embed">/, "").replace(/<\/style>$/, "") +
  "\n\n" +
  mainStyleBlock.replace(/^<style>/, "").replace(/<\/style>$/, "");

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(stylesDir, { recursive: true });

const loginScreenCss = `

/* ── LOGIN SCREEN (V2 inline → CSS) ─────────────────────────── */
#login-screen{
  position:fixed;inset:0;z-index:9999;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
  background:#3a2818 url("/images/login-wallpaper.jpg") center center / cover no-repeat;
}
#login-screen label{
  font-size:12px!important;font-weight:500!important;
  color:rgba(0,0,0,0.55)!important;letter-spacing:-0.005em!important;
  margin-bottom:4px!important;text-transform:none!important;
}
#login-screen input[type="email"],
#login-screen input[type="password"]{
  width:100%!important;padding:0 9px!important;height:26px!important;
  border-radius:6px!important;border:0.5px solid rgba(0,0,0,0.24)!important;
  background:rgba(255,255,255,0.90)!important;font-size:13px!important;
  color:#1C1C1E!important;
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro','Inter',sans-serif!important;
  letter-spacing:-0.008em!important;box-sizing:border-box!important;
  box-shadow:none!important;-webkit-appearance:none!important;margin-bottom:0!important;
}
#login-screen input[type="email"]:focus,
#login-screen input[type="password"]:focus{
  border-color:#00694A!important;
  box-shadow:0 0 0 4px rgba(0,105,74,0.14)!important;
}
#login-screen button{
  width:100%!important;height:26px!important;border-radius:6px!important;
  background:linear-gradient(180deg,#0099FF,#0071EF)!important;
  border:0.5px solid rgba(0,80,180,0.5)!important;color:white!important;
  font-size:13px!important;font-weight:500!important;padding:0!important;
  box-shadow:0 1px 0 rgba(255,255,255,0.28) inset, 0 0.5px 0 rgba(0,0,0,0.10)!important;
}
`;
const fullCss = css + loginScreenCss;
fs.writeFileSync(path.join(stylesDir, "platform.css"), fullCss);

const wpMatch = html.match(
  /background:#3a2818 url\('data:image\/jpeg;base64,([^']+)'\)/
);
if (wpMatch) {
  const imagesDir = path.join(publicDir, "images");
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.writeFileSync(
    path.join(imagesDir, "login-wallpaper.jpg"),
    Buffer.from(wpMatch[1], "base64")
  );
}

console.log("Extracted:");
console.log("  styles/platform.css", (fullCss.length / 1024).toFixed(1), "KB");
if (wpMatch) console.log("  public/images/login-wallpaper.jpg");
