// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Bienvenida from './pages/Bienvenida';
import Contacto from './pages/Contacto';
import logoCafe from './assets/logo-cafe-tech.png'
import styles from './Home.module.css';
import SolicitudPedidoForm from './pages/SolicitudPedidoForm';
import PedidosAnteriores from './pages/PedidosAnteriores';
import DetallePedido from './pages/DetallePedido';
import Pagos from './pages/Pagos';
import Predicciones from './pages/Predicciones';
import Inventario from './pages/Inventario';
import AnalisisNegocio from './pages/AnalisisNegocio';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSolicitudes from './pages/admin/AdminSolicitudes';
import AdminClientes from './pages/admin/AdminClientes';
import AdminPagos from './pages/admin/AdminPagos';
import AdminSaldos from './pages/admin/AdminSaldos';
import AdminPredicciones from './pages/admin/AdminPredicciones';
import AdminDesviaciones from './pages/admin/AdminDesviaciones';
import AdminInventario from './pages/admin/AdminInventario';
import AdminPlaneador from './pages/admin/AdminPlaneador';
import AdminBroadcast from './pages/admin/AdminBroadcast';

// -------------------------------------------------------------
// COMPONENTE DE REDIRECCIÓN CONDICIONAL (AuthRedirect)
// -------------------------------------------------------------
function AuthRedirect({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        // Verifica si hay un token y si el usuario intenta acceder a rutas públicas
        if (token && (window.location.pathname === '/' || window.location.pathname === '/login')) {
            // Si está logueado, lo envía a Bienvenida
            navigate('/Bienvenida', { replace: true });
        }
    }, [token, navigate]);

    // Renderiza el contenido (Routes) para que la navegación siga su curso normal
    return children;
}


// -------------------------------------------------------------
// COMPONENTE HOME (Ahora usa el CSS Module limpio)
// -------------------------------------------------------------
function Home() {
  return (
    <div className={styles.container}> 
      <nav className={styles.topBar}>
        <Link to="/contacto" className={styles.navLink}>
          Contáctanos
        </Link>
        
        <Link to="/" className={styles.logoLink}>
          <img 
            src={logoCafe}
            alt="Grano de café" 
            className={styles.logo} 
          />
        </Link>
        
        <Link to="/login" className={styles.navLink}>
          Iniciar sesión
        </Link>
      </nav>

      <div className={styles.heroSection}>
        <h2>Información de la empresa</h2>
        <p>Aquí puedes poner texto corto, descripción y tus servicios principales.</p>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// COMPONENTE APP
// -------------------------------------------------------------
function App() {
    return (
        <Router>
            <AuthRedirect>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path='/Bienvenida' element={<Bienvenida />}/>
                    <Route path='/Contacto' element={<Contacto />}/>
                    <Route path='/solicitud-pedido' element={<SolicitudPedidoForm />}/>
                    <Route path='/pedidos-anteriores' element={<PedidosAnteriores />}/>
                    <Route path='/predicciones' element={<Predicciones />}/>
                    <Route path='/pedidos/:id' element={<DetallePedido />}/>
                    <Route path='/inventario' element={<Inventario />}/>
                    <Route path='/pagos' element={<Pagos />}/>
                    <Route path='/analisis-negocio' element={<AnalisisNegocio />}/>
                    
                    {/* Rutas de Admin (sin modificar contenido) */}
                    <Route path='/admin' element={<AdminDashboard />} />
                    <Route path='/admin/pedidos' element={<AdminPedidos />} />
                    <Route path='/admin/solicitudes' element={<AdminSolicitudes />} />
                    <Route path='/admin/clientes' element={<AdminClientes />} />
                    <Route path='/admin/pagos' element={<AdminPagos />} />
                    <Route path='/admin/saldos' element={<AdminSaldos />} />
                    <Route path='/admin/predicciones' element={<AdminPredicciones />} />
                    <Route path='/admin/desviaciones' element={<AdminDesviaciones />} />
                    <Route path='/admin/inventario' element={<AdminInventario />} />
                    <Route path='/admin/planeador' element={<AdminPlaneador />} />
                    <Route path='/admin/broadcast' element={<AdminBroadcast />} />
                </Routes>
            </AuthRedirect>
        </Router>
    );
}

export default App;