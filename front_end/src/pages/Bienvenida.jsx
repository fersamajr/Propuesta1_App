import React, { useState, useEffect } from 'react';
import api from '../api/api';
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
        inventario: '...',
        proximoPedido: '...'
    });
    const navigate = useNavigate();

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
export default Bienvenida;