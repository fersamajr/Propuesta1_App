import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. ESTADOS PARA FILTROS
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos'); // opciones: todos, falta_entrega, falta_pago, completados

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/pedidos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const sorted = response.data.sort((a, b) => {
                if (!a.fechaEntrega) return 1; 
                if (!b.fechaEntrega) return -1;
                return new Date(a.fechaEntrega) - new Date(b.fechaEntrega);
            });
            setPedidos(sorted);
        } catch (error) {
            console.error("Error fetching pedidos", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. LÓGICA DE FILTRADO
    const pedidosFiltrados = pedidos.filter(p => {
        // A. Filtro de Texto (Nombre Cliente o ID)
        const texto = busqueda.toLowerCase();
        const cliente = p.usuario?.username?.toLowerCase() || '';
        const idPedido = p.id.toLowerCase();
        const coincideTexto = cliente.includes(texto) || idPedido.includes(texto);

        if (!coincideTexto) return false;

        // B. Filtro de Estado (Select)
        if (filtroEstado === 'falta_entrega') return !p.entregado;
        if (filtroEstado === 'falta_pago') return !p.pagado;
        if (filtroEstado === 'completados') return p.entregado && p.pagado;
        
        return true; // 'todos'
    });

    const toggleStatus = async (id, field, currentValue) => {
        try {
            const token = localStorage.getItem('token');
            const payload = { [field]: !currentValue }; 
            await api.patch(`/pedidos/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPedidos();
        } catch (error) {
            console.error("Error updating pedido", error);
            alert("Error al actualizar el pedido");
        }
    };

    const handleDateChange = async (id, newDate) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/pedidos/${id}`, { fechaEntrega: newDate }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPedidos(); 
        } catch (error) {
            console.error("Error updating date", error);
            alert("Error al cambiar la fecha");
        }
    };

    // Estilos
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 };
    const thStyle = { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' };
    const btnActionStyle = (active) => ({
        padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: 12,
        background: active ? '#bbf7d0' : '#fecaca',
        color: active ? '#166534' : '#991b1b',
        width: '100%'
    });
    
    // Estilos Inputs
    const inputContainerStyle = { display: 'flex', gap: 15, marginBottom: 20, background: '#fff', padding: 15, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
    const inputStyle = { padding: '10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, flex: 1 };
    const selectStyle = { padding: '10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, width: 200, cursor: 'pointer' };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
            
            <h2 style={{ color: '#1e293b' }}>Gestión de Pedidos Globales</h2>

            {/* 3. INTERFAZ DE FILTROS */}
            <div style={inputContainerStyle}>
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por cliente o ID..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={inputStyle}
                />
                
                <select 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    style={selectStyle}
                >
                    <option value="todos">📝 Todos los Pedidos</option>
                    <option value="falta_entrega">🚚 Pendientes de Entrega</option>
                    <option value="falta_pago">💰 Pendientes de Pago</option>
                    <option value="completados">✅ Finalizados (Todo OK)</option>
                </select>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div style={{overflowX: 'auto'}}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID / Cliente</th>
                                <th style={thStyle}>Detalle (Kg)</th>
                                <th style={thStyle}>F. Solicitada</th>
                                <th style={thStyle}>F. Entrega (Admin)</th>
                                <th style={thStyle}>Entrega</th>
                                <th style={thStyle}>Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Usamos 'pedidosFiltrados' en lugar de 'pedidos' */}
                            {pedidosFiltrados.length > 0 ? pedidosFiltrados.map(p => {
                                const isLate = p.fechaEntrega && new Date(p.fechaEntrega) < new Date() && !p.entregado;
                                const fechaValue = p.fechaEntrega ? new Date(p.fechaEntrega).toISOString().split('T')[0] : '';

                                return (
                                    <tr key={p.id} style={{ background: isLate ? '#fff1f2' : 'transparent' }}>
                                        <td style={tdStyle}>
                                            <div style={{fontWeight: 'bold'}}>{p.usuario?.username || 'Cliente'}</div>
                                            <div style={{fontSize: 11, color: '#666'}}>{p.id.split('-')[0]}...</div>
                                        </td>
                                        <td style={tdStyle}>
                                            {p.solicitudPedido ? (
                                                <div style={{fontSize: 13}}>
                                                    <div>☕ G: {p.solicitudPedido.grano}</div>
                                                    <div>🧪 M: {p.solicitudPedido.molido}</div>
                                                </div>
                                            ) : 'N/A'}
                                        </td>
                                        
                                        <td style={tdStyle}>
                                            {p.solicitudPedido?.fechaEntrega ? (
                                                <span style={{color: '#64748b'}}>
                                                    {new Date(p.solicitudPedido.fechaEntrega).toLocaleDateString()}
                                                </span>
                                            ) : <span style={{color:'#94a3b8', fontStyle:'italic'}}>No especificada</span>}
                                        </td>

                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <input 
                                                    type="date"
                                                    value={fechaValue}
                                                    onChange={(e) => handleDateChange(p.id, e.target.value)}
                                                    style={{
                                                        padding: '5px',
                                                        borderRadius: '4px',
                                                        border: isLate ? '1px solid #ef4444' : '1px solid #cbd5e1',
                                                        color: isLate ? '#dc2626' : '#334155',
                                                        fontWeight: isLate ? 'bold' : 'normal',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                {isLate && <span style={{fontSize: 10, color: 'red', marginTop: 2}}>⚠️ ATRASADO</span>}
                                            </div>
                                        </td>

                                        <td style={tdStyle}>
                                            <button 
                                                style={btnActionStyle(p.entregado)}
                                                onClick={() => toggleStatus(p.id, 'entregado', p.entregado)}
                                            >
                                                {p.entregado ? 'ENTREGADO' : 'PENDIENTE'}
                                            </button>
                                        </td>
                                        <td style={tdStyle}>
                                            <button 
                                                style={btnActionStyle(p.pagado)}
                                                onClick={() => toggleStatus(p.id, 'pagado', p.pagado)}
                                            >
                                                {p.pagado ? 'PAGADO' : 'PENDIENTE'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" style={{padding: 30, textAlign:'center', color: '#64748b'}}>
                                        No se encontraron pedidos con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPedidos;