import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Modal from '../Modal';
import PageHeader from '../PageHeader';
import StatusBanner from '../StatusBanner';
import { formatDate } from '../../utils/format';
import { MOVEMENT_LABELS } from '../../utils/constants';

const emptyForm = {
  productId: '',
  type: 'IN',
  quantity: 1,
  newStock: '',
  reason: '',
};

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [prods, moves] = await Promise.all([api.getProducts(), api.getMovements()]);
    setProducts(prods);
    setMovements(moves);
  };

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openMove = () => {
    setForm({
      ...emptyForm,
      productId: products[0]?.id ? String(products[0].id) : '',
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      productId: Number(form.productId),
      type: form.type,
      quantity: Number(form.quantity) || 1,
      reason: form.reason,
    };
    if (form.type === 'ADJUSTMENT') {
      payload.newStock = Number(form.newStock);
      payload.quantity = Math.max(1, Math.abs(payload.newStock - (products.find((p) => p.id === payload.productId)?.stockQuantity ?? 0)) || 1);
    }
    try {
      await api.createMovement(payload);
      setSuccess('Movimiento registrado');
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="muted">Cargando stock…</p>;

  return (
    <div className="page">
      <PageHeader
        eyebrow="在庫"
        title="Stock"
        lead="Registra entradas, salidas y ajustes. Cada movimiento actualiza el inventario y dispara alertas si corresponde."
        actions={
          <button type="button" className="btn btn--primary" onClick={openMove} disabled={!products.length}>
            Nuevo movimiento
          </button>
        }
      />

      <StatusBanner error={error} success={success} onClear={() => { setError(''); setSuccess(''); }} />

      <section className="grid-2">
        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Niveles actuales</h3>
              <p className="panel__sub">Stock por producto</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div className="muted tiny">{p.sku}</div>
                    </td>
                    <td className={p.lowStock ? 'stock-low' : ''}>
                      {p.stockQuantity} {p.unit}
                    </td>
                    <td>{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel__head">
            <div>
              <h3 className="panel__title">Historial</h3>
              <p className="panel__sub">Últimos movimientos</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>De → A</th>
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
                    <td>
                      {m.previousStock} → {m.newStock}
                    </td>
                    <td>{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {open ? (
        <Modal title="Registrar movimiento" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label className="full">
              Producto
              <select
                className="input"
                required
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stockQuantity} {p.unit})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="IN">Entrada</option>
                <option value="OUT">Salida</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </label>
            {form.type === 'ADJUSTMENT' ? (
              <label>
                Stock resultante
                <input
                  className="input"
                  type="number"
                  min="0"
                  required
                  value={form.newStock}
                  onChange={(e) => setForm({ ...form, newStock: e.target.value })}
                />
              </label>
            ) : (
              <label>
                Cantidad
                <input
                  className="input"
                  type="number"
                  min="1"
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </label>
            )}
            <label className="full">
              Motivo
              <input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </label>
            <div className="form-actions full">
              <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Registrar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
