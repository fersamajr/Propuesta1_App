import React, { useState, useEffect } from 'react';
import api from '../api/api';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar el nuevo Layout

// ---------------------------------------------
// Componente Auxiliar: Tarjeta de Acceso (Adaptado de Admin)
// ---------------------------------------------
const ClientMenuCard = ({ icon, title, desc, onClick, color }) => (
    <div 
        onClick={onClick}
        style={{ 
            background: '#334155', 
            padding: 15, 
            borderRadius: 16,
            width: 150, 
            textAlign: 'center', 
            cursor: 'pointer', 
            border: color ? `2px solid ${color}` : '1px solid #475569', 
            transition: 'transform 0.2s', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minHeight: 150, 
            color: '#fff' 
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = '#475569';
            e.currentTarget.style.transform = 'translateY(-5px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = '#334155';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ fontSize: 38, marginBottom: 8 }}>{icon}</div> 
        <div style={{ fontSize: 16, fontWeight: 'bold', color: color || '#a78Bfa', marginBottom: 4 }}>{title}</div> 
        <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0 }}>{desc}</p> 
    </div>
);

// ---------------------------------------------
// Componente Auxiliar: Widget KPI (Adaptado de Admin)
// ---------------------------------------------
const KPIWidget = ({ title, value, color, icon, onClick, note }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div 
            style={{
                flex: '1 1 200px', 
                background: '#334155', 
                padding: 20, 
                borderRadius: 16, 
                borderLeft: `6px solid ${color}`, 
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                color: '#fff',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s',
                ...(isHovered ? { transform: 'scale(1.03)' } : {})
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div>
                <div style={{fontSize: 12, color:'#94a3b8', textTransform:'uppercase'}}>{title}</div>
                <div style={{fontSize: 28, fontWeight:'bold', color: value === '...' ? '#cbd5e1' : color}}>{value}</div>
                {note && <div style={{fontSize: 10, color:'#94a3b8', marginTop: 3}}>{note}</div>}
            </div>
            <div style={{fontSize: 30}}>{icon}</div>
        </div>
    );
};


// ---------------------------------------------
// COMPONENTE BIENVENIDA (Dashboard Cliente)
// ---------------------------------------------
function Bienvenida() {
    
    // ❌ Eliminado: useState(profile), handleLogout, useEffect(cargar perfil)
    
    const [dashboardData, setDashboardData] = useState({
        ultimoPedido: '...',
        pedidosPendientes: '...',
=======
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

// --- ESTILOS COMPARTIDOS ---
const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const HEADER_LINK_STYLE = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
const HEADER_LOGO_STYLE = { background: 'transparent', padding: '10px 55px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const MENU_BTN_BASE = { width: '90%', margin: '8px auto', background: '#f1f5f9', color: '#334155', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' };
const INFO_CARD_BASE = { 
    background: '#fff', padding: '15px 10px', borderRadius: 12, marginBottom: 10, 
    textAlign: 'center', color: '#333', cursor: 'pointer', display: 'flex', 
    flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s',
    borderLeft: '4px solid #f472b6'
};

function MenuButton({ onClick, children, isActive }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button 
            onClick={onClick} 
            style={{ 
                ...MENU_BTN_BASE, 
                ...(isHovered ? { background: '#e2e8f0' } : {}),
                ...(isActive ? { background: '#c4b5fd', color: '#333', fontWeight: 'bold' } : {}) 
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
}

function InfoCard({ title, value, onClick, color }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div 
            onClick={onClick} 
            style={{ 
                ...INFO_CARD_BASE, 
                borderLeft: `4px solid ${color}`,
                ...(isHovered ? { transform: 'scale(1.05)' } : {}) 
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 5, color: '#6b7280' }}>{title}</span>
            <span style={{ fontSize: 16, fontWeight: '600', color: color }}>{value}</span>
        </div>
    );
}

function Bienvenida() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        ultimoPedido: 'Cargando...',
        pedidosPendientes: 0,
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
        inventario: '...',
        proximoPedido: '...'
    });
    const navigate = useNavigate();

<<<<<<< HEAD
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return; // Layout se encarga de esto

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Cargar Dashboard (Mantiene la funcionalidad)
=======
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        api.get('/profile/me', config)
            .then(res => setProfile(res.data))
            .catch(err => console.error('Error perfil', err));

>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
        const fetchData = async () => {
            try {
                const [pedidosRes, invRes, predRes] = await Promise.allSettled([
                    api.get('/pedidos/me', config),
                    api.get('/inventario/me', config),
                    api.get('/predicciones/me', config)
                ]);
                
                let ultimo = 'Sin datos';
                let pendientes = 0;
                if (pedidosRes.status === 'fulfilled') {
                    const pedidos = pedidosRes.value.data;
                    pendientes = pedidos.filter(p => !p.entregado).length;
                    if (pedidos.length > 0) {
                        const sortedPedidos = pedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        const fechaUltimo = new Date(sortedPedidos[0].createdAt);
                        ultimo = fechaUltimo.toLocaleDateString(); 
                    }
                }
                
                let stock = '0 Kg';
                if (invRes.status === 'fulfilled' && invRes.value.data) {
                    stock = `${invRes.value.data.cantidad} Kg`;
                }
                
                let proximo = 'No calculado';
                if (predRes.status === 'fulfilled') {
                    const preds = predRes.value.data;
                    if (preds.length > 0) {
                        const fechaPred = new Date(preds[0].fecha);
                        proximo = fechaPred.toLocaleDateString();
                    }
                }
                setDashboardData({ ultimoPedido: ultimo, pedidosPendientes: pendientes, inventario: stock, proximoPedido: proximo });
            } catch (error) {
                console.error("Error cargando dashboard", error);
            }
        };
        fetchData();
    }, [navigate]);

<<<<<<< HEAD
    // --- ESTILOS DE ESTRUCTURA ---
    const GRID_WRAPPER_STYLE = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, maxWidth: '100%', width: '100%' };
    
    // Contenedor para las dos columnas
    const TWO_COLUMN_CONTAINER = { 
        display: 'flex', 
        gap: 30, 
        width: '100%', 
        maxWidth: 1000, 
        marginBottom: 40,
        flexWrap: 'wrap', 
        justifyContent: 'center' 
    };

    // Estilo para cada columna
    const COLUMN_STYLE = { 
        flex: '1 1 480px', 
        minWidth: '450px' 
    };

    return (
        <ClientLayout> {/* 🆕 Ahora usa el layout */}
            
            <div style={TWO_COLUMN_CONTAINER}>

                {/* COLUMNA 1: ACCESOS RÁPIDOS (Izquierda) */}
                <div style={COLUMN_STYLE}>
                    <h2 style={{color: '#a78Bfa', marginBottom: 20, fontSize: 20, textAlign: 'center'}}>Accesos Rápidos</h2>
                    <div style={GRID_WRAPPER_STYLE}>
                        
                        <ClientMenuCard 
                            icon="📝" 
                            title="Hacer Pedido" 
                            desc="Solicita tu nuevo envío de café." 
                            onClick={() => navigate('/solicitud-pedido')} 
                            color="#10b981" 
                        />
                        <ClientMenuCard 
                            icon="📊" 
                            title="Análisis de Negocio" 
                            desc="Estadísticas de tu consumo." 
                            onClick={() => navigate('/analisis-negocio')} 
                            color="#3b82f6" 
                        />
                        <ClientMenuCard 
                            icon="🛒" 
                            title="Historial de Pedidos" 
                            desc="Revisa tus pedidos anteriores." 
                            onClick={() => navigate('/pedidos-anteriores')} 
                            color="#a78Bfa" 
                        />
                        <ClientMenuCard 
                            icon="💰" 
                            title="Pagos y Saldo" 
                            desc="Consulta tu estado de cuenta." 
                            onClick={() => navigate('/pagos')} 
                            color="#f59e0b" 
                        />
                        <ClientMenuCard 
                            icon="🔮" 
                            title="Predicciones" 
                            desc="Consulta tu demanda futura." 
                            onClick={() => navigate('/predicciones')} 
                            color="#c084fc" 
                        />
                        <ClientMenuCard 
                            icon="📦" 
                            title="Inventario" 
                            desc="Actualiza tu stock disponible." 
                            onClick={() => navigate('/inventario')} 
                            color="#f43f5e" 
                        />
                    </div>
                </div>

                {/* COLUMNA 2: PULSO DEL NEGOCIO (Derecha) */}
                <div style={COLUMN_STYLE}>
                    <h2 style={{color: '#cbd5e1', marginBottom: 20, fontSize: 20, textAlign: 'center'}}>Pulso del Negocio</h2>
                    <div style={{ ...GRID_WRAPPER_STYLE, gap: '15px' }}>
                        
                        <KPIWidget 
                            title="Pedidos Pendientes" 
                            value={dashboardData.pedidosPendientes} 
                            color="#f43f5e" 
                            icon="📦" 
                            onClick={() => navigate('/pedidos-anteriores')}
                        />
                        
                        <KPIWidget 
                            title="Inventario Actual" 
                            value={dashboardData.inventario} 
                            color="#10b981" 
                            icon="☕" 
                            onClick={() => navigate('/inventario')}
                            note={dashboardData.inventario === '...' ? 'Cargando...' : 'Stock disponible'}
                        />

                        <KPIWidget 
                            title="Próxima Compra" 
                            value={dashboardData.proximoPedido} 
                            color="#f59e0b" 
                            icon="🔮" 
                            onClick={() => navigate('/predicciones')}
                            note={dashboardData.proximoPedido === '...' ? 'Calculando...' : 'Predicción de fecha'}
                        />
                        
                        <KPIWidget 
                            title="Último Pedido" 
                            value={dashboardData.ultimoPedido} 
                            color="#3b82f6" 
                            icon="📅" 
                            onClick={() => navigate('/pedidos-anteriores')}
                            note={dashboardData.ultimoPedido === '...' ? 'Cargando...' : 'Fecha de creación'}
                        />
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

=======
    const username = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Usuario';
    const logoImgStyle = { maxHeight: 40, width: 'auto' };

    const MAIN_BTN_STYLE = { 
        width: '100%', margin: '10px 0', background: '#a78Bfa', color: '#fff', 
        padding: '15px', borderRadius: 8, fontSize: 17, fontWeight: 600, 
        border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'background 0.2s, transform 0.2s'
    };

    return (
        <div style={PAGE_CONTAINER}>
            
            {/* Barra Superior */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
                <Link to="/contacto" style={{ ...HEADER_LINK_STYLE, background: '#7dd3fc', color: '#222' }}>Soporte</Link>
                
                <div style={HEADER_LOGO_STYLE}>
                    <img src={logoCafe} alt="Logo" style={logoImgStyle} />
                </div>
                
                <button style={HEADER_LINK_STYLE} onClick={handleLogout}>Exit</button>
            </div>

            <div style={{ width: 900, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                {/* 1. MENÚ LATERAL */}
                <div style={{ position: 'relative', width: 220, paddingRight: 20 }}>
                    <button style={{ background: '#a78Bfa', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, width: 48, fontSize: 18, cursor: 'pointer', border: 'none' }} onClick={() => setMenuOpen(s => !s)}>≡</button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, left: 0, width: 190, background: '#fff', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '5px 0', zIndex: 10 }}>
                            <MenuButton onClick={() => navigate('/analisis-negocio')}>Análisis de Negocio</MenuButton>
                            <MenuButton onClick={() => navigate('/solicitud-pedido')}>Hacer Pedido</MenuButton>
                            <MenuButton onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</MenuButton>
                            <MenuButton onClick={() => navigate('/pagos')}>Pagos</MenuButton>
                            <MenuButton onClick={() => navigate('/predicciones')}>Predicciones</MenuButton>
                            <MenuButton onClick={() => navigate('/inventario')}>Inventario</MenuButton>
                        </div>
                    )}
                </div>
                
                {/* 2. CONTENIDO PRINCIPAL / ATAJOS */}
                <div style={{ flex: 1, margin: '0 20px' }}>
                    <h2 style={{ color: '#6b7280', fontWeight: 600, marginBottom: 26, fontSize: 24 }}>Bienvenido "{username}"</h2>
                    
                    <div style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #c4b5fd', boxShadow: '0 4px 20px rgba(167, 139, 250, 0.1)', width: 400 }}>
                        <h3 style={{ marginBottom: 16, color: '#78549b' }}>🚀 Atajos</h3>
                        <button style={MAIN_BTN_STYLE} onClick={() => navigate('/solicitud-pedido')}>Hacer pedido</button>
                        <button style={MAIN_BTN_STYLE} onClick={() => navigate('/pedidos-anteriores')}>Ver todos los pedidos</button>
                        <button style={MAIN_BTN_STYLE} onClick={() => navigate('/pagos')}>Saldo Actual</button>
                        <button style={MAIN_BTN_STYLE} onClick={() => navigate('/predicciones')}>Predicciones (Beta)</button>
                    </div>
                </div>
                
                {/* 3. INFO CARDS */}
                <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h4 style={{ textAlign: 'center', color: '#555', marginBottom: 5 }}>Información General</h4>
                    <InfoCard title="Último pedido" value={dashboardData.ultimoPedido} onClick={() => navigate('/pedidos-anteriores')} color="#f472b6" />
                    <InfoCard title="Pedidos Pendientes" value={dashboardData.pedidosPendientes} onClick={() => navigate('/pedidos-anteriores')} color="#fb923c" />
                    <InfoCard title="Inventario" value={dashboardData.inventario} onClick={() => navigate('/inventario')} color="#10b981" />
                    <InfoCard title="Próximo Pedido" value={dashboardData.proximoPedido} onClick={() => navigate('/predicciones')} color="#3b82f6" />
                </div>
            </div>
        </div>
    );
}
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
export default Bienvenida;