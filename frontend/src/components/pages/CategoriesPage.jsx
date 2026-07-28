import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import Modal from '../Modal';
import PageHeader from '../PageHeader';
import StatusBanner from '../StatusBanner';
import { formatDate } from '../../utils/format';

const emptyForm = { name: '', description: '' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => setCategories(await api.getCategories());

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || '' });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateCategory(editingId, form);
        setSuccess('Categoría actualizada');
      } else {
        await api.createCategory(form);
        setSuccess('Categoría creada');
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.deleteCategory(id);
      setSuccess('Categoría eliminada');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="muted">Cargando categorías…</p>;

  return (
    <div className="page">
      <PageHeader
        eyebrow="分類"
        title="Categorías"
        lead="Organiza el inventario en grupos: café, matcha, dulces e insumos."
        actions={
          <button type="button" className="btn btn--primary" onClick={openCreate}>
            Nueva categoría
          </button>
        }
      />

      <StatusBanner error={error} success={success} onClear={() => { setError(''); setSuccess(''); }} />

      <div className="cards-grid">
        {categories.map((c) => (
          <article key={c.id} className="panel category-card">
            <h3>{c.name}</h3>
            <p className="muted">{c.description || 'Sin descripción'}</p>
            <p className="category-card__meta">
              {c.productCount} producto{c.productCount === 1 ? '' : 's'} · {formatDate(c.createdAt)}
            </p>
            <div className="actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => openEdit(c)}>
                Editar
              </button>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => remove(c.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {open ? (
        <Modal title={editingId ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label className="full">
              Nombre
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
