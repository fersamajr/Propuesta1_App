import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

function PedidosAnteriores() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const fetchPedidos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            try {
                const response = await api.get('/pedidos/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPedidos(response.data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    handleLogout();
                } else {
                    setError('No se pudieron cargar los pedidos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    // --- Estilos ---
    const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const topBtnStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };
    
    // Mejorar estilos del menú lateral para consistencia
    const menuBtnStyle = (isActive) => ({
        width: '90%', margin: '8px auto', background: isActive ? '#c4b5fd' : '#f1f5f9', color: isActive ? '#333' : '#334155', padding: '10px', 
        borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal',
        transition: 'background 0.2s'
    });
    
    const cardContainerStyle = {
        width: '100%', maxWidth: 800, background: '#fff', borderRadius: 16, border: '1px solid #d1d5db', padding: 32,
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'
    };
    
    const itemStyle = {
        width: '100%', 
        background: '#fff', 
        marginBottom: 10, 
        padding: 15, 
        borderRadius: 8, 
        border: '1px solid #e5e7eb',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s, background-color 0.2s, box-shadow 0.2s'
    };
    
    // Estilo para el hover de los ítems
    const itemHoverStyle = {
        backgroundColor: '#f9fafb',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    };
    
    // Helper para los Badges
    const getBadgeStyle = (isPositive, text) => {
        const base = { padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold', marginLeft: 5 };
        if (text === 'PAGADO') return { ...base, background: '#dcfce7', color: '#16a34a' };
        if (text === 'PENDIENTE PAGO') return { ...base, background: '#fff7ed', color: '#d97706' };
        if (text === 'ENTREGADO') return { ...base, background: '#bfdbfe', color: '#1e40af' };
        if (text === 'EN PROCESO') return { ...base, background: '#e5e7eb', color: '#374151' };
    };

    return (
        <div style={PAGE_CONTAINER}>
            
            {/* --- BARRA SUPERIOR --- */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
                <Link to="/bienvenida" style={topBtnStyle}>Volver</Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoCafe} alt="Logo" style={logoImgStyle} />
                </div>
                <button style={{...topBtnStyle, background: '#ef4444'}} onClick={handleLogout}>Exit</button>
            </div>

            {/* --- CONTENEDOR PRINCIPAL --- */}
            <div style={{ width: 900, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                {/* MENÚ LATERAL */}
                <div style={{ position: 'relative', width: 220, paddingRight: 20 }}>
                    <button
                        style={{ background: '#a78Bfa', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}
                        onClick={() => setMenuOpen(s => !s)}
                    >
                        ≡
                    </button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, left: 0, width: 190, background: '#fff', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '5px 0', zIndex: 10 }}>
                            <button style={menuBtnStyle(false)} onClick={() => navigate('/bienvenida')}>Inicio</button>
                            <button style={menuBtnStyle(false)} onClick={() => navigate('/solicitud-pedido')}>Hacer Pedido</button>
                            <button style={menuBtnStyle(true)}>Pedidos Anteriores</button>
                        </div>
                    )}
                </div>

                {/* ÁREA CENTRAL */}
                <div style={{ flex: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#1e293b', fontFamily: 'serif', marginBottom: 20, fontSize: 32 }}>🛒 Historial de Pedidos</h2>
                    
                    <div style={cardContainerStyle}>
                        {loading ? (
                            <p>Cargando pedidos...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : pedidos.length === 0 ? (
                            <p>No tienes pedidos registrados aún.</p>
                        ) : (
                            <div style={{ width: '100%', overflowY: 'auto', maxHeight: 500 }}>
                                {pedidos.map((pedido) => {
                                    const statusPago = pedido.pagado ? 'PAGADO' : 'PENDIENTE PAGO';
                                    const statusEntrega = pedido.entregado ? 'ENTREGADO' : 'EN PROCESO';
                                    
                                    return (
                                        <div 
                                            key={pedido.id} 
                                            style={itemStyle}
                                            onClick={() => navigate(`/pedidos/${pedido.id}`)}
                                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, itemHoverStyle)}
                                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, {backgroundColor: '#fff', transform: 'translateY(0)', boxShadow: 'none'})}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#475569', fontSize: 16 }}>
                                                    Pedido #...{pedido.id.slice(-5)}
                                                </div>
                                                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 3 }}>
                                                    Entrega estimada: <strong>{pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Pendiente'}</strong>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                                <span style={getBadgeStyle(pedido.pagado, statusPago)}>{statusPago}</span>
                                                <span style={getBadgeStyle(pedido.entregado, statusEntrega)}>{statusEntrega}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedidosAnteriores;