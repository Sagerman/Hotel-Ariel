import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import HabitacionesPage from './pages/HabitacionesPage';
import ClientesPage from './pages/ClientesPage';
import HistorialPage from './pages/HistorialPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="habitaciones" element={<HabitacionesPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="configuracion" element={<div className="p-8 text-foreground">Configuración Page - Coming Soon</div>} />
          <Route path="historial" element={<HistorialPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
