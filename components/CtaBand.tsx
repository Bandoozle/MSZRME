import Link from "next/link";

export default function CtaBand({
  title, text, label = "Start free trial", href = "/#signup",
  reassure = "14-day free trial \u00b7 No credit card required",
}: { title: string; text: string; label?: string; href?: string; reassure?: string | null }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link className="btn btn-lg" href={href}>{label}</Link>
        {reassure ? <p className="reassure light">{reassure}</p> : null}
      </div>
    </section>
  );
}
