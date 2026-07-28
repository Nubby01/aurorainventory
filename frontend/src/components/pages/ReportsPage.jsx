import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import KpiCard from '../KpiCard';
import PageHeader from '../PageHeader';
import { formatClp } from '../../utils/format';

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getReportSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Generando reportes…</p>;
  if (error) return <p className="banner banner--error">{error}</p>;

  const maxValue = Math.max(...(summary.byCategory?.map((c) => Number(c.stockValue)) || [1]), 1);

  return (
    <div className="page">
      <PageHeader
        eyebrow="報告"
        title="Reportes"
        lead="Indicadores de valor de inventario, distribución por categoría y productos críticos."
      />

      <section className="kpi-grid">
        <KpiCard label="Categorías" value={summary.totalCategories} tone="coffee" />
        <KpiCard label="Productos activos" value={summary.activeProducts} tone="sakura" />
        <KpiCard label="Movimientos (7d)" value={summary.movementsLast7Days} tone="mocha" />
        <KpiCard label="Valor total" value={formatClp(summary.inventoryValue)} tone="matcha" />
      </section>

      <section className="grid-2">
        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Valor por categoría</h3>
              <p className="panel__sub">Unidades × precio unitario</p>
            </div>
          </div>
          <ul className="bar-list">
            {summary.byCategory.map((c) => (
              <li key={c.categoryId}>
                <div className="bar-list__meta">
                  <strong>{c.categoryName}</strong>
                  <span>
                    {c.productCount} prod. · {c.totalUnits} u. · {formatClp(c.stockValue)}
                  </span>
                </div>
                <div className="bar-list__track">
                  <div
                    className="bar-list__fill"
                    style={{ width: `${Math.max(6, (Number(c.stockValue) / maxValue) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Prioridad de reposición</h3>
              <p className="panel__sub">Top stock bajo</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Mín.</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {summary.topLowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="stock-low">{p.stockQuantity}</td>
                    <td>{p.minStock}</td>
                    <td>{formatClp(p.unitPrice * p.stockQuantity)}</td>
                  </tr>
                ))}
                {!summary.topLowStock.length ? (
                  <tr>
                    <td colSpan={4}>Sin productos críticos</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
