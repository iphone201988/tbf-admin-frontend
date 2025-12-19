import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const palette = {
    bg: "#f0fdff",
    accent: "#00E6FE",
    secondary: "#00b7ff",
    text: "#1E1E1E",
    subtext: "#6b6b6b",
    border: "#D2D2D2",
    cardBg: "#D9FBFF",
    cardBorder: "#8DF4FF",
    lightBg: "#e6faff",
    headerBg: "rgba(240, 253, 255, 0.95)",
  };

  const handleCreatePoll = () => {
    navigate("/admin/login");
  };

  const handleDownloadApp = () => {
    window.open("https://apps.apple.com", "_blank");
  };

  const features = [
    {
      icon: "📊",
      title: "Easy Creation",
      description: "Create engaging polls in seconds with our intuitive interface. No technical skills required.",
    },
    {
      icon: "🔗",
      title: "Instant Sharing",
      description: "Share your polls with anyone, anywhere. Get responses from your audience in real-time.",
    },
    {
      icon: "📈",
      title: "Real-time Analytics",
      description: "Watch results update live as votes come in. Make data-driven decisions instantly.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your polls are secure and private. Control who can see and participate in your polls.",
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Works seamlessly on web and mobile. Access your polls from any device, anywhere.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Get instant results with our optimized platform. No delays, no waiting.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Poll",
      description: "Sign up and create your first poll in seconds. Add questions and options with ease.",
    },
    {
      number: "02",
      title: "Share with Audience",
      description: "Get a unique link to share with your audience. Works on any platform or device.",
    },
    {
      number: "03",
      title: "Collect Responses",
      description: "Watch responses come in real-time. See results update instantly as people vote.",
    },
    {
      number: "04",
      title: "Analyze Results",
      description: "View detailed analytics and insights. Make informed decisions based on data.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.lightBg} 100%)` }}>
      {/* Navigation Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: palette.headerBg,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${palette.cardBorder}`,
          padding: "16px 0",
          boxShadow: "0 2px 8px rgba(0, 230, 254, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: palette.accent,
                padding: "8px 12px",
                borderRadius: 12,
              }}
            >
              <img src="/assets/tbf_logo.svg" alt="TBF Logo" style={{ width: 80, display: "block" }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: palette.text }}>TBF</span>
          </div>
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a
              href="/privacy-policy"
              style={{
                color: palette.subtext,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = palette.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = palette.subtext;
              }}
            >
              Privacy Policy
            </a>
            {/* <button
              onClick={handleCreatePoll}
              style={{
                padding: "10px 24px",
                background: `linear-gradient(90deg, ${palette.accent}, ${palette.secondary})`,
                color: "white",
                border: "none",
                borderRadius: 24,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 230, 254, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Get Started
            </button> */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 24px",
          background: `linear-gradient(135deg, ${palette.bg} 0%, rgba(0, 230, 254, 0.05) 50%, ${palette.lightBg} 100%)`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
              padding: "12px 24px",
              borderRadius: 50,
              marginBottom: 32,
              fontSize: 14,
              fontWeight: 600,
              color: palette.accent,
            }}
          >
            ✨ Create, Share, Analyze
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              color: palette.text,
              margin: "0 0 24px 0",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Engage Your Audience with
            <br />
            <span style={{ color: palette.accent }}>Interactive Polls</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              color: palette.subtext,
              margin: "0 auto 48px",
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            Create beautiful polls, share them instantly, and get real-time feedback from your audience.
            Make data-driven decisions with confidence.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        
            <button
              onClick={handleDownloadApp}
              style={{
                padding: "16px 32px",
                border: `2px solid ${palette.accent}`,
                background: "transparent",
                color: palette.accent,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = palette.accent;
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = palette.accent;
              }}
            >
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "100px 24px", background: `linear-gradient(180deg, ${palette.lightBg} 0%, ${palette.bg} 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: palette.text,
                margin: "0 0 16px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Everything You Need to Create
              <br />
              <span style={{ color: palette.accent }}>Engaging Polls</span>
            </h2>
            <p
              style={{
                fontSize: 18,
                color: palette.subtext,
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Powerful features designed to help you create, share, and analyze polls effortlessly.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                  borderRadius: 20,
                  padding: 32,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 230, 254, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: palette.text,
                    margin: "0 0 12px 0",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: 15, color: palette.subtext, margin: 0, lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "100px 24px", background: `linear-gradient(180deg, ${palette.bg} 0%, rgba(0, 230, 254, 0.08) 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: palette.text,
                margin: "0 0 16px 0",
                letterSpacing: "-0.02em",
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: 18,
                color: palette.subtext,
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Get started in minutes. It's that simple.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 40,
            }}
          >
            {steps.map((step, idx) => (
              <div key={idx} style={{ textAlign: "center", position: "relative" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: `linear-gradient(135deg, ${palette.accent}, ${palette.secondary})`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "white",
                    boxShadow: "0 4px 16px rgba(0, 230, 254, 0.3)",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: palette.text,
                    margin: "0 0 12px 0",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, color: palette.subtext, margin: 0, lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "100px 24px",
          background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.secondary} 100%)`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              color: "white",
              margin: "0 0 24px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.9)",
              margin: "0 0 40px 0",
              lineHeight: 1.6,
            }}
          >
            Join thousands of users creating engaging polls and making data-driven decisions.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            
            <button
              onClick={handleDownloadApp}
              style={{
                padding: "16px 32px",
                border: "2px solid white",
                background: "transparent",
                color: "white",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Download Mobile App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px 24px 40px",
          background: palette.text,
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 40,
              marginBottom: 40,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    background: palette.accent,
                    padding: "8px 12px",
                    borderRadius: 12,
                  }}
                >
                  <img src="/assets/tbf_logo.svg" alt="TBF Logo" style={{ width: 60, display: "block" }} />
                </div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>TBF</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6, margin: 0 }}>
                Create, share, and analyze polls effortlessly. Engage your audience with interactive polls.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>Product</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                <li>
                  <a
                    href="/privacy-policy"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = palette.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              paddingTop: 40,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            © {new Date().getFullYear()} TBF. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
