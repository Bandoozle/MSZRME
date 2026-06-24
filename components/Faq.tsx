export interface FaqItem { q: string; a: string; }

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((it, i) => (
        <details key={i} open={i === 0}>
          <summary>{it.q}<span className="pm" /></summary>
          <div className="ans">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
