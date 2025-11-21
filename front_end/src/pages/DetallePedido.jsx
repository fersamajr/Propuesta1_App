import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout
=======
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec

function DetallePedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
<<<<<<< HEAD
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        api.get(`/pedidos/${id}`, config)
            .then(res => {
                setPedido(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching pedido detail', err);
                setError('No se pudo cargar la información del pedido.');
                setLoading(false);
            });
    }, [id, navigate]);

    // --- Estilos Adaptados al Tema Oscuro ---
    const cardStyle = { 
        width: 650,
        background: '#334155', // Fondo de tarjeta oscuro
        borderRadius: 16, 
        padding: 40,
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        position: 'relative',
        margin: '0 auto'
    };
    
    // Texto/Etiquetas
    const labelStyle = { fontWeight: 600, color: '#94a3b8', marginTop: 15, fontSize: 14 };
    const valueStyle = { color: '#fff', marginBottom: 10, fontSize: 18, fontWeight: 'bold' };
    
    // Badges de Estado
=======
        const fetchDetalle = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.get(`/pedidos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPedido(response.data);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la información del pedido.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetalle();
    }, [id, navigate]);

    // --- Estilos ---
    const cardStyle = { 
        width: 650,
        background: '#fff', 
        borderRadius: 16, 
        border: '1px solid #c4b5fd', 
        padding: 40,
        boxShadow: '0 8px 25px rgba(167, 139, 250, 0.15)',
        position: 'relative' 
    };
    const labelStyle = { fontWeight: 600, color: '#64748b', marginTop: 15, fontSize: 14 };
    const valueStyle = { color: '#1e293b', marginBottom: 10, fontSize: 18, fontWeight: 'bold' };
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
    const badgeStyle = (isPositive) => ({
        padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 'bold', display: 'inline-block',
        background: isPositive ? '#dcfce7' : '#fee2e2', color: isPositive ? '#16a34a' : '#dc2626'
    });
<<<<<<< HEAD
    
    // Caja para notas
    const noteStyle = { background: '#1e293b', padding: 15, borderRadius: 8, border: '1px solid #475569', color: '#cbd5e1' };
    
    // Contenedor de Kilos
    const productDetailStyle = { background: '#1e293b', padding: 15, borderRadius: 8, marginTop: 15, border: '1px solid #475569' };


    if (loading) {
        return <ClientLayout title="Detalle del Pedido"><div style={cardStyle}>Cargando detalle del pedido...</div></ClientLayout>;
    }

    if (error) {
        return <ClientLayout title="Detalle del Pedido"><div style={{...cardStyle, textAlign: 'center', color: '#ef4444'}}>{error}</div></ClientLayout>;
    }
    
    if (!pedido) return null;

    return (
        <ClientLayout title={`Pedido #${id.substring(0, 8).toUpperCase()}`}>
            <div style={cardStyle}>
                <h2 style={{ color: '#a78Bfa', marginBottom: 20, textAlign: 'center', fontSize: 32 }}>Detalle del Pedido</h2>
                <div style={{textAlign:'center', color:'#9ca3af', marginBottom: 30}}>ID Completo: {pedido.id}</div>
                
                {/* GRUPO DE DATOS PRINCIPALES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderBottom: '1px solid #475569', paddingBottom: 20 }}>
=======
    const noteStyle = { background: '#fffbeb', padding: 15, borderRadius: 8, border: '1px solid #fcd34d', color: '#b45309' };

    if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Cargando...</div>;
    if (error) return <div style={{textAlign: 'center', marginTop: 50, color: 'red'}}>{error}</div>;
    if (!pedido) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f3ff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <div style={cardStyle}>
                
                {/* Botón Volver/Cerrar */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ position: 'absolute', top: 20, left: 20, background: '#e2e8f0', border: 'none', padding: '8px 15px', borderRadius: 8, cursor: 'pointer', color: '#475569', fontWeight: 'bold' }}
                >
                    ⬅ Volver
                </button>

                <h2 style={{ color: '#78549b', marginBottom: 20, textAlign: 'center', fontSize: 32 }}>Detalle del Pedido</h2>
                <div style={{textAlign:'center', color:'#9ca3af', marginBottom: 30}}>ID: {pedido.id}</div>
                
                {/* GRUPO DE DATOS PRINCIPALES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderBottom: '1px solid #e5e7eb', paddingBottom: 20 }}>
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
                    
                    <div>
                        <div style={labelStyle}>Fecha de Creación</div>
                        <div style={valueStyle}>{new Date(pedido.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Fecha de Entrega Estimada</div>
                        <div style={valueStyle}>
                            {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Por definir'}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Estado de Pago</div>
                        <div style={{ marginTop: 5 }}>
                            <span style={badgeStyle(pedido.pagado)}>{pedido.pagado ? '✅ PAGADO' : '❌ PENDIENTE'}</span>
                        </div>
                    </div>
                    <div>
                        <div style={labelStyle}>Estado de Entrega</div>
                        <div style={{ marginTop: 5 }}>
                            <span style={badgeStyle(pedido.entregado)}>{pedido.entregado ? '🚚 ENTREGADO' : '⏳ EN PROCESO'}</span>
                        </div>
                    </div>
                </div>

                {/* DETALLES DEL PRODUCTO */}
<<<<<<< HEAD
                <h3 style={{ color: '#7dd3fc', fontSize: 24, marginTop: 30 }}>📦 Detalles del Producto</h3>
                {pedido.solicitudPedido ? (
                    <div style={productDetailStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>
                            <span>☕ Café en Grano:</span>
                            <strong style={{color: '#a78Bfa'}}>{pedido.solicitudPedido.grano} Kg</strong>
=======
                <h3 style={{ color: '#475569', fontSize: 24, marginTop: 30 }}>📦 Detalles del Producto</h3>
                {pedido.solicitudPedido ? (
                    <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginTop: 15, border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>
                            <span>☕ Café en Grano:</span>
                            <strong style={{color: '#78549b'}}>{pedido.solicitudPedido.grano} Kg</strong>
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16 }}>
                            <span>🧪 Café Molido:</span>
                            <strong style={{color: '#7dd3fc'}}>{pedido.solicitudPedido.molido} Kg</strong>
                        </div>
<<<<<<< HEAD
                        <div style={{ borderTop: '1px dashed #475569', marginTop: 15, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
                            <span>Total Kilos:</span>
                            <strong style={{color: '#fff'}}>{pedido.solicitudPedido.grano + pedido.solicitudPedido.molido} Kg</strong>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontStyle: 'italic', color: '#94a3b8', marginTop: 10 }}>No hay detalles de solicitud asociados.</p>
=======
                        <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: 15, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
                            <span>Total Kilos:</span>
                            <strong style={{color: '#1e293b'}}>{pedido.solicitudPedido.grano + pedido.solicitudPedido.molido} Kg</strong>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontStyle: 'italic', color: '#6b7280', marginTop: 10 }}>No hay detalles de solicitud asociados.</p>
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
                )}

                {pedido.notas && (
                    <div style={{ marginTop: 30 }}>
                        <div style={labelStyle}>Notas del Cliente:</div>
                        <div style={noteStyle}>
                            {pedido.notas}
                        </div>
                    </div>
                )}
<<<<<<< HEAD
                
                {/* Botón Volver al Historial */}
                <button 
                    onClick={() => navigate('/pedidos-anteriores')} 
                    style={{ marginTop: 30, padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Volver al Historial
                </button>
            </div>
        </ClientLayout>
=======
            </div>
        </div>
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
    );
}

export default DetallePedido;