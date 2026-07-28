import { COFFEE_URL, BOOKING_URL, DASHBOARD_URL } from '../utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dash-footer">
      <p>
        © {year} Aurora Coffee · Sistema de inventario.
        <br />
        Diseño y desarrollo:{' '}
        <a href="https://github.com/Nubby01" target="_blank" rel="noopener noreferrer">
          Anthara Sáez
        </a>
        {' · '}
        <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer">
          Aurora Coffee
        </a>
        {' · '}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Booking
        </a>
        {' · '}
        <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
          Dashboard
        </a>
      </p>
    </footer>
  );
}
