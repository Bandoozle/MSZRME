/** Renders nav icon SVG strings from ALL_NAV_DEFS (HTML-compatible). */
export function NavSvgIcon({ svg }: { svg: string }) {
  return (
    <div className="nav-ic">
      <span suppressHydrationWarning dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
