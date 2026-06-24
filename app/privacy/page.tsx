import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MSZRME collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
      </section>
      <section className="section wrap" style={{ paddingTop: 30 }}>
        <div className="legal">
          <p className="updated">Last updated: June 2026</p>
          <div className="note"><strong>Template notice.</strong> This is placeholder policy language for layout purposes. Have it reviewed and finalized by legal counsel before MSZRME goes live.</div>

          <h2>What we collect</h2>
          <p>We collect the information you provide when you create an account, such as your name, email, and dealership details, along with the operational figures you log into the platform. We also collect basic technical data like device and usage information to keep the service secure and reliable.</p>

          <h2>How we use it</h2>
          <p>Your information is used to operate the platform, generate your KPIs and reports, deliver coaching, process billing, and improve the product. We do not sell your personal information.</p>

          <h2>Sharing</h2>
          <p>We share data only with service providers who help us run MSZRME (for example, hosting and payment processing), under agreements that require they protect it. We may disclose information where required by law.</p>

          <h2>Security</h2>
          <p>We use industry-standard safeguards to protect your data in transit and at rest. No system is perfectly secure, and we encourage strong, unique passwords for your account.</p>

          <h2>Your choices</h2>
          <p>You can access, correct, or export your data at any time, and you can request deletion of your account. Contact us to exercise any of these rights.</p>

          <h2>Contact</h2>
          <p>Questions about this policy can be sent to <a href="mailto:privacy@mszrme.com" style={{ color: "var(--green-link)" }}>privacy@mszrme.com</a>.</p>
        </div>
      </section>
    </>
  );
}
