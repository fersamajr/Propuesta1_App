import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminSaldos() {
    const [saldos, setSaldos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSaldos();
    }, []);

    const fetchSaldos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/pagos/saldos-globales', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Ordenar: Morosos primero (los que tienen alerta), luego por monto de deuda
            const sorted = response.data.sort((a, b) => {
                // Calcular días de antigüedad para ordenamiento
                const getDays = (item) => {
                    if (item.saldoPorPagar <= 0 || !item.ultimaEntrega) return -1;
                    return (new Date() - new Date(item.ultimaEntrega)) / (1000 * 60 * 60 * 24);
                };
                return getDays(b) - getDays(a);
            });
            
            setSaldos(sorted);
        } catch (error) {
            console.error("Error cargando saldos", error);
        } finally {
            setLoading(false);
        }
    };

    const deudaTotal = saldos.reduce((acc, curr) => acc + curr.saldoPorPagar, 0);
    const kgTotales = saldos.reduce((acc, curr) => acc + curr.kgPorPagar, 0);

    // Estilos
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 };
    const thStyle = { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' };
    const cardKpiStyle = { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center', border: '1px solid #e2e8f0' };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
            
            <h2 style={{ color: '#1e293b', marginBottom: 20 }}>Estado de Cuenta Global</h2>

            <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                <div style={cardKpiStyle}>
                    <h3 style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Deuda Total Clientes</h3>
                    <p style={{ fontSize: 28, fontWeight: 'bold', color: '#dc2626', margin: '10px 0' }}>
                        ${deudaTotal.toLocaleString('es-MX')}
                    </p>
                </div>
                <div style={cardKpiStyle}>
                    <h3 style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Café Pendiente de Pago</h3>
                    <p style={{ fontSize: 28, fontWeight: 'bold', color: '#475569', margin: '10px 0' }}>
                        {kgTotales.toFixed(2)} Kg
                    </p>
                </div>
            </div>

            {loading ? <p>Calculando finanzas...</p> : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Cliente / Negocio</th>
                            <th style={thStyle}>Estatus</th> {/* ⬅️ Nueva Columna Visual */}
                            <th style={thStyle}>Deuda ($)</th>
                            <th style={thStyle}>Deuda (Kg)</th>
                            <th style={thStyle}>Última Entrega</th>
                            <th style={thStyle}>Último Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saldos.map((s, index) => {
                            // LÓGICA DE ALERTA MOROSO
                            // Si debe dinero Y (no tiene entregas recientes O la última fue hace > 30 días)
                            const now = new Date();
                            const lastDelivery = s.ultimaEntrega ? new Date(s.ultimaEntrega) : null;
                            let daysSinceDelivery = 0;
                            
                            if (lastDelivery) {
                                daysSinceDelivery = Math.floor((now - lastDelivery) / (1000 * 60 * 60 * 24));
                            }

                            const isOverdue = s.saldoPorPagar > 0 && daysSinceDelivery > 30;
                            
                            return (
                                <tr key={index} style={{ background: isOverdue ? '#fff1f2' : (s.saldoPorPagar === 0 ? '#f0fdf4' : '#fff') }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{s.cliente.negocio}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{s.cliente.username}</div>
                                    </td>
                                    
                                    {/* 🚨 ALERTA VISUAL */}
                                    <td style={tdStyle}>
                                        {isOverdue ? (
                                            <span style={{ background:'#fee2e2', color:'#b91c1c', padding:'4px 8px', borderRadius:12, fontSize:11, fontWeight:'bold', border:'1px solid #fca5a5' }}>
                                                ⚠️ VENCIDO (+{daysSinceDelivery} días)
                                            </span>
                                        ) : s.saldoPorPagar > 0 ? (
                                            <span style={{ background:'#fff7ed', color:'#c2410c', padding:'4px 8px', borderRadius:12, fontSize:11, fontWeight:'bold' }}>
                                                PENDIENTE
                                            </span>
                                        ) : (
                                            <span style={{ background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:12, fontSize:11, fontWeight:'bold' }}>
                                                AL DÍA
                                            </span>
                                        )}
                                    </td>

                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 'bold', fontSize: 16, color: s.saldoPorPagar > 0 ? '#000' : '#166534' }}>
                                            ${s.saldoPorPagar.toLocaleString('es-MX')}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '500' }}>{s.kgPorPagar} Kg</div>
                                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Precio: ${s.precioAcordado}</div>
                                    </td>
                                    
                                    {/* Nueva info de referencia */}
                                    <td style={tdStyle}>
                                        {s.ultimaEntrega ? new Date(s.ultimaEntrega).toLocaleDateString() : '-'}
                                    </td>

                                    <td style={tdStyle}>
                                        {s.ultimoPago ? (
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#166534' }}>+${s.ultimoPago.cantidad}</div>
                                                <div style={{ fontSize: 11, color: '#64748b' }}>
                                                    {new Date(s.ultimoPago.fecha).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Sin pagos</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminSaldos;