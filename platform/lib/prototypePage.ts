/** Run a prototype render*() into #feed-wrap, or show a visible fallback. */
export function runPrototypePage(
  page: string,
  label: string,
  renderKey: string
): void {
  const feedWrap = document.getElementById("feed-wrap");
  if (!feedWrap) return;

  const win = window as unknown as {
    currentPage?: string;
    _macFix?: () => void;
    [key: string]: unknown;
  };

  const renderFn = win[renderKey];
  if (typeof renderFn === "function") {
    win.currentPage = page;
    (renderFn as () => void)();
    if (typeof win._macFix === "function") win._macFix();
    return;
  }

  feedWrap.innerHTML = `
    <div style="padding:40px 32px;text-align:center;max-width:420px;margin:40px auto;
      background:rgba(255,255,255,0.9);border-radius:18px;border:1px dashed rgba(0,0,0,0.1)">
      <div style="font-size:28px;margin-bottom:12px">🚧</div>
      <div style="font-size:17px;font-weight:700;color:#0A160A;margin-bottom:8px">${label}</div>
      <div style="font-size:13px;color:rgba(0,0,0,0.5);line-height:1.6">
        Waiting for <code style="font-family:monospace;font-size:12px;background:rgba(0,0,0,0.06);
        padding:2px 6px;border-radius:4px">mszrme-dealer-runtime.js</code> in <code>public/</code>.
      </div>
    </div>`;
}
