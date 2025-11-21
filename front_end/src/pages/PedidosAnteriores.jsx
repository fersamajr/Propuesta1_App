import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout

function PedidosAnteriores() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPedidos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // El ClientLayout se encarga de la redirección principal
                return;
            }

            try {
                const response = await api.get('/pedidos/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Ordenar por fecha descendente
                const sortedPedidos = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPedidos(sortedPedidos);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los pedidos.');
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [navigate]);

    // --- Estilos Adaptados al Tema Oscuro ---
    const containerStyle = {
        width: '100%',
        maxWidth: 1000,
        padding: 30,
        background: '#334155', // Fondo de tarjeta oscuro
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: '#fff',
    };
    
    // Tabla
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 20,
        fontSize: 14
    };
    
    const thStyle = {
        borderBottom: '2px solid #7dd3fc', // Cyan para resaltar el header
        padding: '12px 10px',
        textAlign: 'left',
        color: '#fff',
        background: '#475569' // Un poco más claro que el fondo
    };

    const tdStyle = {
        borderBottom: '1px solid #475569',
        padding: '10px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
        cursor: 'pointer' // Mantiene el cursor en la fila
    };
    
    // Helper para los Badges (Mejorados para el tema oscuro)
    const getBadgeStyle = (isPositive, text) => {
        const base = { padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 'bold', display: 'inline-block' };
        if (text === 'PAGADO') return { ...base, background: '#dcfce7', color: '#16a34a' }; // Verde claro
        if (text === 'PENDIENTE PAGO') return { ...base, background: '#fff7ed', color: '#d97706' }; // Amarillo/Naranja
        if (text === 'ENTREGADO') return { ...base, background: '#bfdbfe', color: '#1e40af' }; // Azul claro
        if (text === 'EN PROCESO') return { ...base, background: '#e5e7eb', color: '#374151' }; // Gris
    };

    // Estilo para el hover de las filas
    const rowHoverStyle = {
        backgroundColor: '#1e293b', // Fondo del contenedor más oscuro
    };


    return (
        <ClientLayout title="Historial de Pedidos">
            <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
                <div style={containerStyle}>
                    <h3 style={{ color: '#a78Bfa', borderBottom: '1px solid #475569', paddingBottom: 10, margin: '0 0 20px 0' }}>
                        Tus Pedidos Anteriores
                    </h3>
                    
                    {loading ? (
                        <p style={{textAlign: 'center'}}>Cargando historial...</p>
                    ) : error ? (
                        <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
                    ) : pedidos.length === 0 ? (
                        <p style={{textAlign: 'center'}}>No tienes pedidos registrados aún.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>ID</th>
                                        <th style={thStyle}>Fecha Solicitud</th>
                                        <th style={thStyle}>Entrega Estimada</th>
                                        <th style={thStyle}>Total Kilos</th>
                                        <th style={thStyle}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map((pedido) => {
                                        const statusPago = pedido.pagado ? 'PAGADO' : 'PENDIENTE PAGO';
                                        const statusEntrega = pedido.entregado ? 'ENTREGADO' : 'EN PROCESO';
                                        
                                        return (
                                            <tr 
                                                key={pedido.id} 
                                                // Asumiendo que el ID del pedido se usa para la ruta, puede ser pedido._id si la API usa Mongo
                                                onClick={() => navigate(`/pedidos/${pedido.id || pedido._id}`)} 
                                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, rowHoverStyle)}
                                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, {backgroundColor: 'transparent'})}
                                                style={{transition: 'background-color 0.2s'}}
                                            >
                                                <td style={tdStyle}><span style={{fontWeight: 'bold', color: '#fff'}}>...{(pedido.id || pedido._id).slice(-6)}</span></td>
                                                <td style={tdStyle}>
                                                    {new Date(pedido.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={tdStyle}>
                                                    {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Pendiente'}
                                                </td>
                                                <td style={tdStyle}>
                                                     {pedido.solicitudPedido ? (pedido.solicitudPedido.grano + pedido.solicitudPedido.molido) : (pedido.cantidad || 0)} Kg
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                                        <span style={getBadgeStyle(pedido.pagado, statusPago)}>{statusPago}</span>
                                                        <span style={getBadgeStyle(pedido.entregado, statusEntrega)}>{statusEntrega}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}

export default PedidosAnteriores;