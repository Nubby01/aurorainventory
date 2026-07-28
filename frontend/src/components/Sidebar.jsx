import { NAV_ITEMS, COFFEE_URL, BOOKING_URL, DASHBOARD_URL } from '../utils/constants';

export default function Sidebar({ activeView, onNavigate, open, onClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Navegación del inventario">
        <div className="sidebar__brand">
          <a className="brand" href={COFFEE_URL} target="_blank" rel="noopener noreferrer">
            <span className="brand__mark" aria-hidden="true">
              ✿
            </span>
            <span className="brand__text">
              Aurora<span>Inventory</span>
            </span>
          </a>
          <p className="sidebar__tag">Inventario de Aurora Coffee</p>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__link ${activeView === item.id ? 'is-active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__links">
          <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer">
            Sitio web
          </a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            Reservas
          </a>
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
            Dashboard
          </a>
        </div>
      </aside>
    </>
  );
}
