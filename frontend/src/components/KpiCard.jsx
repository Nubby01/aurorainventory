export default function KpiCard({ label, value, hint, tone = 'sakura' }) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      {hint ? (
        <div className="kpi-card__meta">
          <span className="kpi-card__hint">{hint}</span>
        </div>
      ) : null}
    </article>
  );
}
