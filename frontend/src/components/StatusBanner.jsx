export default function StatusBanner({ error, success, onClear }) {
  if (!error && !success) return null;
  return (
    <div className={`banner ${error ? 'banner--error' : 'banner--ok'}`} role="status">
      <span>{error || success}</span>
      <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
        Cerrar
      </button>
    </div>
  );
}
