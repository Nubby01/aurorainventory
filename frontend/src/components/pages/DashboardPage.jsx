import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import KpiCard from '../KpiCard';
import PageHeader from '../PageHeader';
import { formatClp, formatDate } from '../../utils/format';
import { MOVEMENT_LABELS } from '../../utils/constants';

export default function DashboardPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [report, moves] = await Promise.all([api.getReportSummary(), api.getMovements()]);
        if (!alive) return;
        setSummary(report);
        setMovements(moves.slice(0, 6));
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <p className="muted">Cargando resumen…</p>;
  }

  if (error) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="接続"
          title="Sin conexión al API"
          lead={`No se pudo contactar el backend: ${error}. Revisa que la API en Railway esté online y que CORS permita este dominio.`}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="概要"
        title="Resumen del inventario"
        lead="Vista general de productos, valor en stock, alertas y movimientos recientes de Aurora Coffee."
      />

      <section className="kpi-grid">
        <KpiCard label="Productos activos" value={summary.activeProducts} hint={`${summary.totalProducts} totales`} tone="coffee" />
        <KpiCard label="Valor inventario" value={formatClp(summary.inventoryValue)} hint="Precio × unidades" tone="sakura" />
        <KpiCard label="Stock bajo" value={summary.lowStockCount} hint="Bajo el mínimo" tone="mocha" />
        <KpiCard label="Alertas abiertas" value={summary.openAlerts} hint="Requieren atención" tone="matcha" />
      </section>

      <section className="grid-2">
        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Stock crítico</h3>
              <p className="panel__sub">Productos bajo el umbral mínimo</p>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onNavigate('alerts')}>
              Ver alertas
            </button>
          </div>
          {summary.topLowStock?.length ? (
            <ul className="rank-list">
              {summary.topLowStock.map((p, i) => (
                <li key={p.id} className="rank-list__item">
                  <span className="rank-list__pos">{i + 1}</span>
                  <div className="rank-list__info">
                    <strong>{p.name}</strong>
                    <span>
                      {p.sku} · mín. {p.minStock}
                    </span>
                  </div>
                  <div className="rank-list__stats">
                    <strong className="stock-low">{p.stockQuantity}</strong>
                    <span>{p.unit}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No hay productos con stock bajo. ✿</p>
          )}
        </article>

        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Movimientos recientes</h3>
              <p className="panel__sub">{summary.movementsLast7Days} en los últimos 7 días</p>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onNavigate('stock')}>
              Ver stock
            </button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cant.</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td>{m.productName}</td>
                    <td>
                      <span className={`badge badge--${m.type.toLowerCase()}`}>{MOVEMENT_LABELS[m.type]}</span>
                    </td>
                    <td>{m.quantity}</td>
                    <td>{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
