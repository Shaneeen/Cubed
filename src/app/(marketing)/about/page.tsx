"use client";

import { useState } from "react";

type Tab = "about" | "contact";

export default function AboutContactPage() {
  const [tab, setTab] = useState<Tab>("about");

  return (
    <section className="stack-lg">
      <div className="nav-tabs" role="tablist" aria-label="About & Contact">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "about"}
          className={tab === "about" ? "nav-tab nav-tab-active" : "nav-tab"}
          onClick={() => setTab("about")}
        >
          About
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "contact"}
          className={tab === "contact" ? "nav-tab nav-tab-active" : "nav-tab"}
          onClick={() => setTab("contact")}
        >
          Contact
        </button>
      </div>

      {tab === "about" ? (
        <div className="hero-panel" id="about" role="tabpanel">
          <div className="hero-copy">
            <p className="eyebrow">About</p>
            <h1>About Cube Sprout</h1>
            <p className="hero-text">
              Cube Sprout gives small entrepreneurs an affordable retail space inside shared
              malls. The story, mission, and team behind Cube Sprout — content pending migration
              from the existing site.
            </p>
          </div>
          <div className="hero-card">
            <p className="card-label">Status</p>
            <ul className="clean-list">
              <li>Copy for this page is being migrated from the existing Cube Sprout site.</li>
              <li>Structure and links reflect the final site map — wording is placeholder.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="hero-panel" id="contact" role="tabpanel">
          <div className="hero-copy">
            <p className="eyebrow">Contact</p>
            <h1>Contact</h1>
            <p className="hero-text">
              Get in touch with Cube Sprout or browse frequently asked questions.
            </p>
          </div>
          <div className="hero-card">
            <p className="card-label">Status</p>
            <ul className="clean-list">
              <li>Contact details and the FAQ link are pending migration.</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
