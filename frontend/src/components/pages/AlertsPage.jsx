import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import PageHeader from '../PageHeader';
import StatusBanner from '../StatusBanner';
import { formatDate } from '../../utils/format';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('OPEN');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => setAlerts(await api.getAlerts());

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const resolve = async (id) => {
    try {
      await api.resolveAlert(id);
      setSuccess('Alerta marcada como resuelta');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const visible = alerts.filter((a) => (filter === 'ALL' ? true : a.status === filter));

  if (loading) return <p className="muted">Cargando alertas…</p>;

  return (
    <div className="page">
      <PageHeader
        eyebrow="警告"
        title="Alertas"
        lead="Avisos automáticos cuando un producto cae bajo su stock mínimo."
        actions={
          <div className="segmented">
            {[
              { id: 'OPEN', label: 'Abiertas' },
              { id: 'RESOLVED', label: 'Resueltas' },
              { id: 'ALL', label: 'Todas' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`segmented__btn ${filter === opt.id ? 'is-active' : ''}`}
                onClick={() => setFilter(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <StatusBanner error={error} success={success} onClear={() => { setError(''); setSuccess(''); }} />

      <div className="cards-grid">
        {visible.length === 0 ? <p className="muted">No hay alertas en este filtro.</p> : null}
        {visible.map((a) => (
          <article key={a.id} className={`panel alert-card ${a.status === 'OPEN' ? 'alert-card--open' : ''}`}>
            <div className="alert-card__head">
              <h3>{a.productName}</h3>
              <span className={`badge ${a.status === 'OPEN' ? 'badge--warn' : 'badge--ok'}`}>
                {a.status === 'OPEN' ? 'Abierta' : 'Resuelta'}
              </span>
            </div>
            <p>{a.message}</p>
            <p className="muted tiny">
              {a.productSku} · stock {a.stockAtAlert} / mín. {a.minStockAtAlert} · {formatDate(a.createdAt)}
            </p>
            {a.status === 'OPEN' ? (
              <button type="button" className="btn btn--primary btn--sm" onClick={() => resolve(a.id)}>
                Resolver
              </button>
            ) : (
              <p className="muted tiny">Resuelta: {formatDate(a.resolvedAt)}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
