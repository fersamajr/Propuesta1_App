import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function DetallePedido() {
    const { id } = useParams(); // 1. Obtenemos el ID de la URL
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetalle = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // 2. Consultamos el endpoint específico
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
    const cardStyle = { width: 600, background: '#fff', borderRadius: 16, border: '2px solid #d1d5db', padding: 32, boxShadow: '0 2px 12px #0001', position: 'relative' };
    const labelStyle = { fontWeight: 600, color: '#4b5563', marginTop: 10 };
    const valueStyle = { color: '#1f2937', marginBottom: 10, fontSize: 18 };
    const badgeStyle = (isPositive) => ({
        padding: '4px 12px', borderRadius: 12, fontSize: 14, fontWeight: 'bold', display: 'inline-block',
        background: isPositive ? '#bbf7d0' : '#fecaca', color: isPositive ? '#166534' : '#991b1b'
    });

    if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Cargando...</div>;
    if (error) return <div style={{textAlign: 'center', marginTop: 50, color: 'red'}}>{error}</div>;
    if (!pedido) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f3ff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <div style={cardStyle}>
                {/* Botón Cerrar */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer' }}
                >
                    ✕
                </button>

                <h2 style={{ color: '#78549b', marginBottom: 20, textAlign: 'center' }}>Detalle del Pedido</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                        <div style={labelStyle}>ID del Pedido</div>
                        <div style={{...valueStyle, fontSize: 14, color: '#9ca3af'}}>{pedido.id}</div>

                        <div style={labelStyle}>Fecha de Creación</div>
                        <div style={valueStyle}>{new Date(pedido.createdAt).toLocaleDateString()}</div>

                        <div style={labelStyle}>Fecha de Entrega Estimada</div>
                        <div style={valueStyle}>
                            {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Por definir'}
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Estado de Pago</div>
                        <div style={{ marginBottom: 15 }}>
                            <span style={badgeStyle(pedido.pagado)}>{pedido.pagado ? 'PAGADO' : 'PENDIENTE'}</span>
                        </div>

                        <div style={labelStyle}>Estado de Entrega</div>
                        <div style={{ marginBottom: 15 }}>
                            <span style={badgeStyle(pedido.entregado)}>{pedido.entregado ? 'ENTREGADO' : 'EN PROCESO'}</span>
                        </div>
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

                <h3 style={{ color: '#4b5563', fontSize: 18 }}>Detalles del Producto</h3>
                {/* Accedemos a la relación solicitudPedido para ver las cantidades */}
                {pedido.solicitudPedido ? (
                    <div style={{ background: '#f9fafb', padding: 15, borderRadius: 8, marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>☕ Café en Grano:</span>
                            <strong>{pedido.solicitudPedido.grano} Kg</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <span>🧪 Café Molido:</span>
                            <strong>{pedido.solicitudPedido.molido} Kg</strong>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontStyle: 'italic', color: '#6b7280' }}>No hay detalles de solicitud asociados.</p>
                )}

                {pedido.notas && (
                    <div style={{ marginTop: 20 }}>
                        <div style={labelStyle}>Notas:</div>
                        <div style={{ background: '#fffbeb', padding: 10, borderRadius: 8, border: '1px solid #fcd34d' }}>
                            {pedido.notas}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetallePedido;