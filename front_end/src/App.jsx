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
import imgDigital from './assets/Gemini_Generated_Image_pymf6zpymf6zpymf.png'

// 🚨 Módulos de Font Awesome 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

// 1. Inyectar Keyframes (Se mantienen)
const gradientDotKeyframes = `
        /* Keyframes para el movimiento del gradiente */
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Keyframes para el movimiento sutil de la textura de puntos */
        @keyframes moveDots {
            0% { background-position: 0 0; }
            100% { background-position: 400px 400px; }
        }
        
        /* Aplica la textura de puntos como un pseudo-elemento animado */
        .animated-background-dots::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(#ffffff20 1px, transparent 1px);
            background-size: 40px 40px;
            animation: moveDots 60s linear infinite;
            z-index: 0;
            pointer-events: none;
        }
`;


// -------------------------------------------------------------
// COMPONENTE HOME (Layout en Cascada con Animación)
// -------------------------------------------------------------
function Home() {
  return (
    <div className={`${styles.container} animated-background-dots`}> 
        <style>{gradientDotKeyframes}</style>
        
      {/* Barra Superior: Título a la izquierda, Links a la derecha */}
      <nav className={styles.topBar}>
        <span>El puente entre la tierra y la taza</span>
        <div className={styles.navLinksRight}>
          <Link to="/contacto" className={styles.navLink}>Contact Us</Link>
          <Link to="/login" className={`${styles.navLink} ${styles.login}`}>Login</Link>
        </div>
      </nav>

      {/* Contenedor de la Cuadrícula de Tarjetas */}
      <div className={styles.cardsGrid}>

        {/* 1. Tarjeta: Nosotros (Alianza y Calidad) */}
        <div className={styles.card}>
          <img 
            src="https://static.wixstatic.com/media/649d34_a89113b45de94bb4be7c102362481bef~mv2.jpg/v1/fill/w_1641,h_1080,al_c,q_85,enc_avif,quality_auto/649d34_a89113b45de94bb4be7c102362481bef~mv2.jpg" 
            alt="Plantación de café" 
            className={styles.cardImage} 
          />
          <div className={styles.cardContent}>
            <h3>Nosotros</h3>
            <p>
                Somos la alianza que eleva la calidad premium de nuestro café de denominación poblana. Nuestra plataforma te asegura Robustez, Disponibilidad y la Transparencia total en cada paso de tu operación.
            </p>
          </div>
        </div>
        
        {/* 2. Tarjeta: Nuestro Modelo (Logística y Flexibilidad) */}
        <div className={styles.card}>
          <img 
            src="https://static.wixstatic.com/media/649d34_ecd4686a0f034ac38d4202213fd051c9~mv2.jpg/v1/fill/w_1960,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/coffee-beans-in-a-coffee-machine-in-dark-colors-2024-11-26-15-38-53-utc.jpg" 
            alt="Granos de café" 
            className={styles.cardImage} 
          />
          <div className={styles.cardContent}>
            <h3>Nuestro Modelo</h3>
            <p>
                Tu cadena de suministro necesita Velocidad y Flexibilidad. Garantizamos la entrega de tu café en grano o molido en un periodo típico de solo 4 a 36 horas después de tu pedido, sin importar la hora del día.
            </p>
          </div>
        </div>

        {/* 3. Tarjeta: Enfoque Tecnológico (Digitalización y Sin Mínimos) */}
        <div className={styles.card}>
            <img 
            src={imgDigital} /* ⬅️ USANDO LA VARIABLE IMPORTADA */
            alt="Taza de café digital" 
            className={styles.cardImage} 
          />
          <div className={styles.cardContent}>
            <h3>Enfoque Tecnológico</h3>
            <p>
                Esta eficiencia es impulsada por nuestra Digitalización total que te da la libertad de no pedir consumos mínimos mensuales. Es la Eficiencia que mereces.
            </p>
          </div>
        </div>

      </div>

      {/* Footer con Ubicaciones e Instagram */}
      <footer className={styles.footer}>
        <p>Santiago de Querétaro, Qro</p>
        <p>Xicotepec de Juárez, Pue</p>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} className={styles.instagramIcon} />
        </a>
      </footer>
    </div>
  );
}


// -------------------------------------------------------------
// COMPONENTE APP (Se mantiene igual)
// -------------------------------------------------------------
function AuthRedirect({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (token && (window.location.pathname === '/' || window.location.pathname === '/login')) {
            navigate('/Bienvenida', { replace: true });
        }
    }, [token, navigate]);

    return children;
}


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
                    <Route path='/admin/solicitudes' element='/admin/solicitudes' />
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