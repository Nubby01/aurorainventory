import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import DashboardPage from './components/pages/DashboardPage';
import ProductsPage from './components/pages/ProductsPage';
import CategoriesPage from './components/pages/CategoriesPage';
import StockPage from './components/pages/StockPage';
import AlertsPage from './components/pages/AlertsPage';
import ReportsPage from './components/pages/ReportsPage';
import './App.css';

const VIEWS = {
  dashboard: DashboardPage,
  products: ProductsPage,
  categories: CategoriesPage,
  stock: StockPage,
  alerts: AlertsPage,
  reports: ReportsPage,
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Page = VIEWS[view] ?? DashboardPage;

  return (
    <div className="app-shell">
      <div className="aurora" aria-hidden="true" />
      <Sidebar
        activeView={view}
        onNavigate={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <Topbar activeView={view} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="content">
          <Page onNavigate={setView} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
