import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NAV_ITEMS } from '../utils/constants';

export default function Topbar({ activeView, onMenuToggle }) {
  const title = NAV_ITEMS.find((item) => item.id === activeView)?.label ?? 'Inventario';
  const today = format(new Date(), "EEEE d 'de' MMMM · yyyy", { locale: es });

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="topbar__menu" aria-label="Abrir menú" onClick={onMenuToggle}>
          <span />
          <span />
          <span />
        </button>
        <div>
          <p className="topbar__eyebrow">在庫 · Inventario</p>
          <h1 className="topbar__title">{title}</h1>
        </div>
      </div>

      <div className="topbar__right">
        <p className="topbar__date">{today}</p>
        <div className="topbar__user" title="Administrador">
          <span className="topbar__avatar" aria-hidden="true">
            A
          </span>
          <span className="topbar__name">Anthara</span>
        </div>
      </div>
    </header>
  );
}
