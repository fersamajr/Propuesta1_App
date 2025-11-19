import React, { useState, useEffect } from 'react';
import api from '../api/api'; // ⬅️ Importar api
import { useNavigate } from 'react-router-dom';

function Bienvenida() {
    // ... (Estados y funciones iguales) ...
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

        // 1. Cargar Perfil (Ruta relativa)
        api.get('/profile/me', config)
            .then(res => setProfile(res.data))
            .catch(err => console.error('Error perfil', err));

        // 2. Cargar Dashboard (Rutas relativas)
        const fetchData = async () => {
            try {
                const [pedidosRes, invRes, predRes] = await Promise.allSettled([
                    api.get('/pedidos/me', config),     // ⬅️ URL Relativa
                    api.get('/inventario/me', config),  // ⬅️ URL Relativa
                    api.get('/predicciones/me', config) // ⬅️ URL Relativa
                ]);
                // ... (Resto de la lógica de procesamiento igual) ...
                // --- PROCESAR PEDIDOS ---
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
                // --- PROCESAR INVENTARIO ---
                let stock = '0 Kg';
                if (invRes.status === 'fulfilled' && invRes.value.data) {
                    stock = `${invRes.value.data.cantidad} Kg`;
                }
                // --- PROCESAR PREDICCIONES ---
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

    // ... (Resto del renderizado visual se mantiene IDÉNTICO) ...
    const username = profile ? `${profile.firstName} ${profile.lastName}` : 'Usuario';
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    const mainBtnStyle = { width: '100%', margin: '10px 0', background: '#a78Bfa', color: '#222', padding: '15px', borderRadius: 8, fontSize: 17, fontWeight: 500, border: 'none', cursor: 'pointer' };
    const infoCardStyle = { background: '#f472b6', padding: '15px 10px', borderRadius: 8, marginBottom: 10, textAlign: 'center', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.2s' };
    const infoTitleStyle = { fontSize: 13, fontWeight: 'bold', marginBottom: 5 };
    const infoValueStyle = { fontSize: 16, fontWeight: '600' };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* ... (JSX de tu Bienvenida.jsx) ... */}
            <div style={{ width: 650, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
                <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}>Soporte</button>
                <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8 }}>Logo</button>
                <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }} onClick={handleLogout}>Exit</button>
            </div>
            <div style={{ width: 900, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: 200 }}>
                    <button style={{ background: '#a78Bfa', color: '#222', padding: 10, borderRadius: 8, marginBottom: 8, width: 48, fontSize: 18, cursor: 'pointer' }} onClick={() => setMenuOpen(s => !s)}>≡</button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, left: 0, width: 190, background: '#f3f4f6', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '10px 0', zIndex: 10 }}>
                            <button style={menuBtnStyle} onClick={() => navigate('/analisis-negocio')}>Análisis de Negocio</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/solicitud-pedido')}>Solicitudes de pedidos</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/pagos')}>Pagos</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/predicciones')}>Predicciones</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/inventario')}>Inventario</button>
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, margin: '0 20px' }}>
                    <h2 style={{ color: '#6b7280', fontWeight: 600, marginBottom: 26 }}>Bienvenido "{username}"</h2>
                    <div style={{ background: '#f5f3ff', padding: 30, borderRadius: 12, width: 380, boxShadow: '0 2px 12px #0001' }}>
                        <h3 style={{ marginBottom: 16, color: '#78549b' }}>Atajos</h3>
                        <button style={mainBtnStyle} onClick={() => navigate('/solicitud-pedido')}>Hacer pedido</button>
                        <button style={mainBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Ver todos los pedidos</button>
                        <button style={mainBtnStyle} onClick={() => navigate('/pagos')}>Saldo Actual</button>
                        <button style={mainBtnStyle} onClick={() => navigate('/predicciones')}>Predicciones (Beta)</button>
                    </div>
                </div>
                <div style={{ width: 150, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h4 style={{ textAlign: 'center', color: '#555', marginBottom: 5 }}>Información General</h4>
                    <div style={infoCardStyle} onClick={() => navigate('/pedidos-anteriores')} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <span style={infoTitleStyle}>Último pedido</span>
                        <span style={infoValueStyle}>{dashboardData.ultimoPedido}</span>
                    </div>
                    <div style={infoCardStyle} onClick={() => navigate('/pedidos-anteriores')} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <span style={infoTitleStyle}>Pedidos Pendientes</span>
                        <span style={infoValueStyle}>{dashboardData.pedidosPendientes}</span>
                    </div>
                    <div style={infoCardStyle} onClick={() => navigate('/inventario')} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <span style={infoTitleStyle}>Inventario</span>
                        <span style={infoValueStyle}>{dashboardData.inventario}</span>
                    </div>
                    <div style={infoCardStyle} onClick={() => navigate('/predicciones')} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <span style={infoTitleStyle}>Próximo Pedido</span>
                        <span style={infoValueStyle}>{dashboardData.proximoPedido}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Bienvenida;