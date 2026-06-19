type DashboardPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function DashboardPlaceholder({
  eyebrow,
  title,
  description,
}: DashboardPlaceholderProps) {
  return (
    <section className="stack-lg">
      <div className="section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="section-copy">{description}</p>
      </div>

      <div className="info-card">
        <h2>Suggested next files</h2>
        <ul className="clean-list">
          <li>Route UI belongs inside `src/app`.</li>
          <li>Feature logic belongs in `src/features`.</li>
          <li>Supabase helpers belong in `src/lib/supabase`.</li>
          <li>Shared types belong in `src/types`.</li>
        </ul>
      </div>
    </section>
  );
}
