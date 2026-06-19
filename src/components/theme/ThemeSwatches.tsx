const swatches = [
  { name: "Ocean", value: "#5493cb" },
  { name: "Sky", value: "#9bd9f0" },
  { name: "Mint", value: "#99f6ff" },
  { name: "Lavender", value: "#b4c1ff" },
  { name: "Soft Blue", value: "#aaceff" },
  { name: "Indigo", value: "#3e59a1" },
  { name: "Twilight", value: "#4e5c96" },
  { name: "Royal", value: "#4e7abf" },
];

export function ThemeSwatches() {
  return (
    <section className="info-card stack-md">
      <div className="section-head">
        <p className="eyebrow">Theme Palette</p>
        <h3>Shared colors for both light and dark mode</h3>
        <p className="section-copy">
          These are the project base colors adapted from your reference palette.
        </p>
      </div>

      <div className="swatch-grid">
        {swatches.map((swatch) => (
          <div className="swatch-card" key={swatch.value}>
            <span
              className="swatch-chip"
              style={{ backgroundColor: swatch.value }}
              aria-hidden="true"
            />
            <div>
              <strong>{swatch.name}</strong>
              <p>{swatch.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
