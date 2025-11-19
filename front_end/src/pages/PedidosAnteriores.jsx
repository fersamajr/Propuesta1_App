import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function PedidosAnteriores() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    // Función de Cerrar Sesión
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
    const topBtnStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border: 'none', cursor: 'pointer' };
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    const cardStyle = {
        width: '100%', maxWidth: 800, background: '#f5f3ff', borderRadius: 16, border: '2px solid #d1d5db', padding: 32,
        boxShadow: '0 2px 12px #0001', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'
    };
    
    // ✅ ESTILO ACTUALIZADO: Cursor de mano y transición suave
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
        cursor: 'pointer', // ⬅️ Indica que es clicable
        transition: 'transform 0.1s, background-color 0.2s' 
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* --- BARRA SUPERIOR --- */}
            <div style={{ width: 650, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
                <button style={topBtnStyle} onClick={() => navigate('/bienvenida')}>Volver</button>
                <button style={{ ...topBtnStyle, background: '#7dd3fc', padding: '10px 55px' }}>Logo</button>
                <button style={topBtnStyle} onClick={handleLogout}>Exit</button>
            </div>

            {/* --- CONTENEDOR PRINCIPAL --- */}
            <div style={{ width: 900, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                {/* MENÚ LATERAL */}
                <div style={{ position: 'relative', width: 200 }}>
                    <button
                        style={{ background: '#a78Bfa', color: '#222', padding: 10, borderRadius: 8, marginBottom: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}
                        onClick={() => setMenuOpen(s => !s)}
                    >
                        ≡
                    </button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, left: 0, width: 190, background: '#f3f4f6', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '10px 0', zIndex: 10 }}>
                            <button style={menuBtnStyle} onClick={() => navigate('/bienvenida')}>Inicio</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/solicitud-pedido')}>Hacer Pedido</button>
                            <button style={{...menuBtnStyle, background: '#c4b5fd'}}>Pedidos Anteriores</button>
                        </div>
                    )}
                </div>

                {/* ÁREA CENTRAL */}
                <div style={{ flex: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#222', fontFamily: 'cursive', marginBottom: 20 }}>Pedidos Anteriores</h2>
                    
                    <div style={cardStyle}>
                        {loading ? (
                            <p>Cargando pedidos...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : pedidos.length === 0 ? (
                            <p>No tienes pedidos registrados aún.</p>
                        ) : (
                            <div style={{ width: '100%', overflowY: 'auto', maxHeight: 500 }}>
                                {pedidos.map((pedido) => (
                                    <div 
                                        key={pedido.id} 
                                        style={itemStyle}
                                        // ✅ EVENTO ONCLICK: Navega a la pantalla de detalle usando el ID
                                        onClick={() => navigate(`/pedidos/${pedido.id}`)}
                                        
                                        // Opcional: Efecto visual simple al pasar el mouse
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#4b5563' }}>
                                                Fecha: {new Date(pedido.createdAt).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: 14, color: '#6b7280' }}>
                                                Entrega estimada: {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Pendiente'}
                                            </div>
                                            {pedido.notas && (
                                                <div style={{ fontSize: 13, fontStyle: 'italic', color: '#888' }}>"{pedido.notas}"</div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold',
                                                background: pedido.pagado ? '#bbf7d0' : '#fecaca',
                                                color: pedido.pagado ? '#166534' : '#991b1b',
                                                marginRight: 5
                                            }}>
                                                {pedido.pagado ? 'PAGADO' : 'PENDIENTE PAGO'}
                                            </span>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold',
                                                background: pedido.entregado ? '#bfdbfe' : '#e5e7eb',
                                                color: pedido.entregado ? '#1e40af' : '#374151'
                                            }}>
                                                {pedido.entregado ? 'ENTREGADO' : 'EN PROCESO'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedidosAnteriores;