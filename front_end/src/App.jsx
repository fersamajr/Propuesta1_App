// src/App.jsx

import React, { useEffect } from 'react'; // ⬅️ Añadir useEffect
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // ⬅️ Añadir useNavigate
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

// -------------------------------------------------------------
// 🆕 1. COMPONENTE DE REDIRECCIÓN CONDICIONAL (AuthRedirect)
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
// 2. COMPONENTE HOME (Corregido el Link de "Iniciar sesión")
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
        
        {/* ⬅️ CAMBIO: La ruta de "Iniciar sesión" debe apuntar al formulario de login */}
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
// 3. COMPONENTE APP (Aplicación del AuthRedirect)
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
                    <Route path='/predicciones' element={<Predicciones />}/> {/* ⬅️ Nueva Ruta */}
                    {/* ⬅️ 2. NUEVA RUTA DINÁMICA */}
                    <Route path='/pedidos/:id' element={<DetallePedido />}/>
                    <Route path='/inventario' element={<Inventario />}/> {/* ⬅️ Nueva Ruta */}
                    <Route path='/pagos' element={<Pagos />}/> {/* ⬅️ Nueva ruta */} 
                    <Route path='/analisis-negocio' element={<AnalisisNegocio />}/>
                </Routes>
            </AuthRedirect>
        </Router>
    );
}

export default App;