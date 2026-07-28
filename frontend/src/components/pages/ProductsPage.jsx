import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Modal from '../Modal';
import PageHeader from '../PageHeader';
import StatusBanner from '../StatusBanner';
import { formatClp } from '../../utils/format';

const emptyForm = {
  name: '',
  sku: '',
  description: '',
  categoryId: '',
  unitPrice: '',
  unit: 'unidad',
  stockQuantity: 0,
  minStock: 5,
  active: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(prods);
    setCategories(cats);
  };

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.sku, p.categoryName].join(' ').toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ? String(categories[0].id) : '' });
    setOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categoryId: String(product.categoryId),
      unitPrice: String(product.unitPrice),
      unit: product.unit,
      stockQuantity: product.stockQuantity,
      minStock: product.minStock,
      active: product.active,
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      categoryId: Number(form.categoryId),
      unitPrice: Number(form.unitPrice),
      unit: form.unit,
      stockQuantity: Number(form.stockQuantity),
      minStock: Number(form.minStock),
      active: form.active,
    };
    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccess('Producto actualizado');
      } else {
        await api.createProduct(payload);
        setSuccess('Producto creado');
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este producto y su historial de stock?')) return;
    try {
      await api.deleteProduct(id);
      setSuccess('Producto eliminado');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="muted">Cargando productos…</p>;

  return (
    <div className="page">
      <PageHeader
        eyebrow="商品"
        title="Productos"
        lead="CRUD completo del catálogo de inventario: SKU, categoría, precio y umbral de stock."
        actions={
          <button type="button" className="btn btn--primary" onClick={openCreate} disabled={!categories.length}>
            Nuevo producto
          </button>
        }
      />

      <StatusBanner error={error} success={success} onClear={() => { setError(''); setSuccess(''); }} />

      {!categories.length ? (
        <p className="banner banner--error">Crea al menos una categoría antes de agregar productos.</p>
      ) : null}

      <div className="toolbar">
        <input
          className="input"
          placeholder="Buscar por nombre, SKU o categoría…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <article className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.sku}</td>
                  <td>{p.categoryName}</td>
                  <td>{formatClp(p.unitPrice)}</td>
                  <td className={p.lowStock ? 'stock-low' : ''}>
                    {p.stockQuantity} {p.unit}
                    {p.lowStock ? ' · bajo' : ''}
                  </td>
                  <td>
                    <span className={`badge ${p.active ? 'badge--ok' : 'badge--muted'}`}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => openEdit(p)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn--danger btn--sm" onClick={() => remove(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {open ? (
        <Modal title={editingId ? 'Editar producto' : 'Nuevo producto'} onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label>
              Nombre
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              SKU
              <input className="input" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </label>
            <label>
              Categoría
              <select className="input" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Seleccionar…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Precio (CLP)
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                required
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              />
            </label>
            <label>
              Unidad
              <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </label>
            <label>
              Stock
              <input
                className="input"
                type="number"
                min="0"
                required
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </label>
            <label>
              Stock mínimo
              <input
                className="input"
                type="number"
                min="0"
                required
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: e.target.value })}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Producto activo
            </label>
            <label className="full">
              Descripción
              <textarea
                className="input"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <div className="form-actions full">
              <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
