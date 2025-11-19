import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminPredicciones() {
    const navigate = useNavigate();
    const [predicciones, setPredicciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    
    const [filteredPredicciones, setFilteredPredicciones] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    
    const [loading, setLoading] = useState(true);

    // --- ESTADOS MODAL ASOCIACIÓN ---
    const [showModal, setShowModal] = useState(false);
    const [selectedPrediccion, setSelectedPrediccion] = useState(null);
    const [selectedPedidoId, setSelectedPedidoId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // Efecto para filtrar cuando cambia el select de usuario o la data
    useEffect(() => {
        if (selectedUser) {
            setFilteredPredicciones(predicciones.filter(p => p.usuario?.id === selectedUser));
        } else {
            setFilteredPredicciones(predicciones);
        }
    }, [selectedUser, predicciones]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [predRes, userRes, pedRes] = await Promise.all([
                api.get('/predicciones', config),
                api.get('/users', config),
                api.get('/pedidos', config)
            ]);

            // 1. Predicciones (Ordenadas por fecha más reciente)
            setPredicciones(predRes.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
            
            // 2. Usuarios (Solo clientes)
            setUsuarios(userRes.data.filter(u => u.rol === 'Cliente'));

            // 3. Pedidos (Todos, para tenerlos listos)
            setPedidos(pedRes.data);

        } catch (error) {
            console.error("Error cargando datos", error);
        } finally {
            setLoading(false);
        }
    };

    // ABRIR MODAL: Filtrar pedidos que pertenezcan al mismo cliente de la predicción
    const handleOpenAssociate = (prediccion) => {
        setSelectedPrediccion(prediccion);
        setSelectedPedidoId(''); // Reset selection
        setShowModal(true);
    };

    // GUARDAR ASOCIACIÓN
    const handleAssociate = async () => {
        if (!selectedPedidoId) return alert("Selecciona un pedido");

        try {
            const token = localStorage.getItem('token');
            
            // Actualizamos la predicción poniéndole el ID del pedido
            await api.patch(`/predicciones/${selectedPrediccion.id}`, {
                pedidoId: selectedPedidoId,
                asociadaAPedido: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Predicción vinculada correctamente");
            setShowModal(false);
            fetchData(); // Recargar datos

        } catch (error) {
            console.error("Error asociando", error);
            alert("Error al vincular");
        }
    };

    // Estilos
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 };
    const thStyle = { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' };
    const selectStyle = { padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', width: 300 };
    
    // Modal Styles
    const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContent = { background: '#fff', padding: 30, borderRadius: 12, width: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };


    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#1e293b' }}>Análisis de Predicciones</h2>
                
                {/* FILTRO DE CLIENTE */}
                <select 
                    style={selectStyle}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">-- Ver Todos los Clientes --</option>
                    {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.username} ({u.perfil?.restaurant || '-'})</option>
                    ))}
                </select>
            </div>

            {loading ? <p>Cargando datos...</p> : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Fecha Predicha</th>
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>Estimación (Kg)</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPredicciones.map(pred => (
                            <tr key={pred.id} style={{ background: pred.pedidoId ? '#f0fdf4' : '#fff' }}>
                                <td style={tdStyle}>
                                    <div style={{fontWeight: 'bold'}}>{new Date(pred.fecha).toLocaleDateString()}</div>
                                </td>
                                <td style={tdStyle}>
                                    {pred.usuario?.username}
                                    <div style={{fontSize:11, color:'#64748b'}}>{pred.usuario?.perfil?.restaurant}</div>
                                </td>
                                <td style={tdStyle}>
                                    {pred.cantidad} Kg
                                </td>
                                <td style={tdStyle}>
                                    {pred.pedidoId ? (
                                        <span style={{color: '#166534', fontWeight:'bold', fontSize:12}}>✅ ASOCIADA</span>
                                    ) : (
                                        <span style={{color: '#ca8a04', fontWeight:'bold', fontSize:12}}>⏳ PENDIENTE</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {!pred.pedidoId && (
                                        <button 
                                            onClick={() => handleOpenAssociate(pred)}
                                            style={{padding:'5px 10px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:5, cursor:'pointer'}}
                                        >
                                            🔗 Asociar Pedido
                                        </button>
                                    )}
                                    {pred.pedidoId && <span style={{fontSize:11, color:'#666'}}>ID Pedido: ...{pred.pedidoId.slice(-5)}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* --- MODAL DE ASOCIACIÓN --- */}
            {showModal && selectedPrediccion && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3 style={{color: '#1e293b', marginBottom: 15}}>Vincular Pedido Real</h3>
                        
                        <div style={{background:'#f8fafc', padding:15, borderRadius:8, marginBottom:20, fontSize:14}}>
                            <p><strong>Predicción para:</strong> {selectedPrediccion.usuario?.username}</p>
                            <p><strong>Fecha Estimada:</strong> {new Date(selectedPrediccion.fecha).toLocaleDateString()}</p>
                            <p><strong>Cantidad Estimada:</strong> {selectedPrediccion.cantidad} Kg</p>
                        </div>

                        <label style={{display:'block', marginBottom:5, fontWeight:'bold', color:'#475569'}}>Selecciona el Pedido Real:</label>
                        <select 
                            style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1', marginBottom:20}}
                            value={selectedPedidoId}
                            onChange={(e) => setSelectedPedidoId(e.target.value)}
                        >
                            <option value="">-- Seleccionar Pedido --</option>
                            {/* FILTRAR: Solo pedidos de ESTE cliente */}
                            {pedidos
                                .filter(p => p.usuario?.id === selectedPrediccion.usuario?.id)
                                // Opcional: Filtrar solo los que no tienen predicción ya asignada si quisieras ser estricto
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map(p => {
                                    const totalKg = p.solicitudPedido ? (p.solicitudPedido.grano + p.solicitudPedido.molido) : 0;
                                    return (
                                        <option key={p.id} value={p.id}>
                                            {new Date(p.createdAt).toLocaleDateString()} - Total: {totalKg} Kg 
                                            {p.entregado ? ' (Entregado)' : ' (Pendiente)'}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                            <button onClick={() => setShowModal(false)} style={{padding:'10px 20px', background:'#ef4444', color:'#fff', border:'none', borderRadius:6, cursor:'pointer'}}>Cancelar</button>
                            <button onClick={handleAssociate} style={{padding:'10px 20px', background:'#22c55e', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:'bold'}}>Guardar Vínculo</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminPredicciones;