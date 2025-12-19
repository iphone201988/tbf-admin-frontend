import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <div className="privacy-hero">
          <img src="/assets/Splash.png" alt="TBF logo" className="privacy-logo" />
          <div>
            <h1 className="privacy-title">Privacy Policy</h1>
            <p className="privacy-subtitle">Effective: December 2025</p>
          </div>
        </div>

        <section className="privacy-section">
          <h2>Introduction</h2>
          <p>
            This Privacy Policy explains how TBF collects, uses, and protects information when you
            access or use our services, including the TBF admin panel and voting experiences.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Information We Collect</h2>
          <ul>
            <li>Account details you provide, such as name and login email.</li>
            <li>Device identifiers (e.g., unique device ID) and technical diagnostics.</li>
            <li>Usage data, including interactions with polls, votes, and notifications.</li>
            <li>Optional location or device metadata you share with votes.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>How We Use Information</h2>
          <ul>
            <li>Operate and improve the TBF platform and administer polls.</li>
            <li>Prevent fraud, abuse, and duplicate voting.</li>
            <li>Send service notifications about polls, votes, and account activity.</li>
            <li>Comply with legal obligations and enforce our policies.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Cookies & Storage</h2>
          <p>
            We may use cookies or similar storage to keep you signed in, remember device identifiers,
            and measure usage. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Sharing</h2>
          <p>
            We do not sell your data. We may share limited information with service providers that
            help us deliver notifications, analytics, or hosting, subject to appropriate safeguards.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Data Retention</h2>
          <p>
            We retain information for as long as needed to provide the service, comply with our
            obligations, and resolve disputes. When no longer required, we take steps to delete or
            anonymize it.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Your Choices</h2>
          <ul>
            <li>Access, update, or request deletion of your account information.</li>
            <li>Opt out of non-essential notifications where available in the product.</li>
            <li>Manage cookies through your browser controls.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect your information.
            No system is 100% secure, so please use strong passwords and protect your devices.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions about this policy, reach out to our support team at
            {" "}
            <a href="mailto:support@tbf.com">support@tbf.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

