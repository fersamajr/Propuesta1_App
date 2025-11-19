import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminSolicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const navigate = useNavigate();

    // --- ESTADOS DEL MODAL ---
    const [showModal, setShowModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [fechaEntregaFinal, setFechaEntregaFinal] = useState('');

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/solicitud-pedidos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Solo mostramos las que NO tienen pedido asociado
            const pendientes = response.data.filter(s => !s.pedido);
            setSolicitudes(pendientes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } catch (error) {
            console.error("Error cargando solicitudes", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. ABRIR EL MODAL: Cargar datos iniciales
    const handleOpenModal = (solicitud) => {
        setSelectedSolicitud(solicitud);
        
        // Tomamos la fecha sugerida por el cliente como valor inicial del input
        // Si el cliente no puso fecha, usamos la fecha de hoy
        let defaultDate = new Date().toISOString().split('T')[0]; 
        if (solicitud.fechaEntrega) {
            defaultDate = new Date(solicitud.fechaEntrega).toISOString().split('T')[0];
        }
        
        setFechaEntregaFinal(defaultDate);
        setShowModal(true);
    };

    // 2. CONFIRMAR: Crear el pedido con la fecha editada
    const handleConfirmarPedido = async () => {
        if (!selectedSolicitud) return;
        
        setProcessing(selectedSolicitud.id);
        setShowModal(false); // Cerramos modal

        try {
            const token = localStorage.getItem('token');
            
            // Construimos el objeto para crear el PEDIDO NUEVO
            const payload = {
                usuarioId: selectedSolicitud.usuario.id,
                solicitudId: selectedSolicitud.id,
                // ⚠️ AQUÍ ES EL CAMBIO: Usamos la fecha del input del Admin, no la de la solicitud
                fechaEntrega: new Date(fechaEntregaFinal), 
                entregado: false,
                pagado: false,
                notas: selectedSolicitud.notas
            };

            await api.post('/pedidos', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Pedido creado exitosamente.');
            fetchSolicitudes(); // Recargar lista

        } catch (error) {
            console.error("Error creando pedido", error);
            alert("Error al generar el pedido.");
        } finally {
            setProcessing(null);
            setSelectedSolicitud(null);
        }
    };

    // --- Estilos ---
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden' };
    const thStyle = { background: '#475569', color: '#fff', padding: 15, textAlign: 'left' };
    const tdStyle = { padding: 15, borderBottom: '1px solid #e2e8f0', color: '#333' };
    const btnStyle = { padding: '8px 15px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' };

    // Estilos Modal
    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContentStyle = { background: '#fff', padding: 30, borderRadius: 12, width: 400, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', textAlign: 'center' };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver</button>
            
            <h2 style={{ color: '#1e293b' }}>Solicitudes Pendientes</h2>

            {loading ? <p>Cargando...</p> : (
                solicitudes.length === 0 ? (
                    <div style={{ marginTop: 30, textAlign: 'center', color: '#64748b', fontSize: 18 }}>🎉 No hay solicitudes pendientes.</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Fecha Solicitud</th>
                                <th style={thStyle}>Cliente</th>
                                <th style={thStyle}>Requerimiento</th>
                                <th style={thStyle}>Entrega Sugerida</th>
                                <th style={thStyle}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map(s => (
                                <tr key={s.id}>
                                    <td style={tdStyle}>{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <strong>{s.usuario?.username || 'Desconocido'}</strong>
                                        <div style={{fontSize: 12, color: '#64748b'}}>{s.usuario?.email}</div>
                                    </td>
                                    <td style={tdStyle}>Grano: {s.grano}kg <br/> Molido: {s.molido}kg</td>
                                    <td style={tdStyle}>
                                        {s.fechaEntrega ? new Date(s.fechaEntrega).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={tdStyle}>
                                        <button 
                                            style={{...btnStyle, opacity: processing === s.id ? 0.7 : 1}}
                                            onClick={() => handleOpenModal(s)} // Abrimos modal
                                            disabled={processing === s.id}
                                        >
                                            {processing === s.id ? '...' : 'Revisar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            {/* --- MODAL --- */}
            {showModal && selectedSolicitud && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{marginBottom: 15}}>Crear Pedido</h3>
                        
                        <div style={{textAlign:'left', background:'#f8fafc', padding:15, borderRadius:8, marginBottom:15, fontSize: 14}}>
                            <p><strong>Cliente:</strong> {selectedSolicitud.usuario?.username}</p>
                            <p><strong>Total Kilos:</strong> {selectedSolicitud.grano + selectedSolicitud.molido} kg</p>
                            <p style={{color: '#64748b'}}>
                                <em>Fecha que pidió el cliente: {selectedSolicitud.fechaEntrega ? new Date(selectedSolicitud.fechaEntrega).toLocaleDateString() : 'Ninguna'}</em>
                            </p>
                        </div>

                        <label style={{display:'block', textAlign:'left', marginBottom:5, fontWeight:'bold'}}>
                            Confirmar Fecha de Entrega:
                        </label>
                        <input 
                            type="date" 
                            value={fechaEntregaFinal}
                            onChange={(e) => setFechaEntregaFinal(e.target.value)}
                            style={{width: '100%', padding: 10, borderRadius: 5, border: '1px solid #ccc', marginBottom: 20, fontSize:16}}
                        />

                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <button onClick={() => setShowModal(false)} style={{padding:'10px', background:'#ef4444', color:'#fff', border:'none', borderRadius:5, cursor:'pointer'}}>Cancelar</button>
                            <button onClick={handleConfirmarPedido} style={{padding:'10px', background:'#22c55e', color:'#fff', border:'none', borderRadius:5, cursor:'pointer', fontWeight:'bold'}}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSolicitudes;