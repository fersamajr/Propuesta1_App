import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminPagos() {
    const [pagos, setPagos] = useState([]);
    const [usuarios, setUsuarios] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ESTADOS PARA MODAL Y CREACIÓN
    const [showModal, setShowModal] = useState(false);
    const [newPago, setNewPago] = useState({
        usuarioId: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0] 
    });

    // 🆕 ESTADOS PARA FILTRADO
    const [searchClient, setSearchClient] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [pagosRes, usersRes] = await Promise.all([
                api.get('/pagos', config),
                api.get('/users', config)
            ]);

            if (Array.isArray(pagosRes.data)) {
                // Aseguramos que el usuario esté adjunto al pago para los filtros
                const pagosConUsuario = pagosRes.data.map(p => ({
                    ...p,
                    usuario: usersRes.data.find(u => u.id === p.usuarioId) || p.usuario
                }));
                const sortedPagos = pagosConUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setPagos(sortedPagos);
            }

            if (Array.isArray(usersRes.data)) {
                const clientes = usersRes.data.filter(u => u.rol && u.rol.toLowerCase() === 'cliente' && u.isActive !== false);
                setUsuarios(clientes);
            }

        } catch (error) {
            console.error("❌ Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🆕 FUNCIÓN PARA ELIMINAR PAGO (Feature 1)
    const handleDeletePago = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar este registro de pago? Esto afectará el saldo de pedidos.")) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/pagos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Pago eliminado correctamente. Saldo recalculado.');
            fetchData(); 
        } catch (error) {
            console.error("Error eliminando pago", error);
            alert("Error al eliminar el pago.");
        }
    };

    // 🆕 FUNCIÓN PARA CREAR PAGO (Fix 2: Bug de Fecha)
    const handleCreatePago = async (e) => {
        e.preventDefault();
        if (!newPago.usuarioId || !newPago.cantidad) {
            alert("Selecciona un cliente y una cantidad.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // ⚠️ FIX DEL BUG DE FECHA: Agregamos T12:00:00 para forzar la fecha al mediodía UTC
            // Esto evita que al convertir a la zona horaria local (-6h) se regrese al día anterior (medianoche).
            const fechaCorregida = new Date(newPago.fecha + 'T12:00:00'); 

            await api.post('/pagos', {
                usuarioId: newPago.usuarioId,
                cantidad: parseFloat(newPago.cantidad),
                fecha: fechaCorregida
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Pago registrado correctamente. Pedidos actualizados.');
            setShowModal(false);
            setNewPago({ usuarioId: '', cantidad: '', fecha: new Date().toISOString().split('T')[0] });
            fetchData(); 

        } catch (error) {
            console.error("Error creando pago", error);
            alert("Error al registrar el pago. Verifica los datos.");
        }
    };

    // 🆕 LÓGICA DE FILTRADO (Feature 3)
    const pagosFiltrados = pagos.filter(p => {
        const text = searchClient.toLowerCase();
        
        // 1. Filtro por Cliente/Email
        const matchClient = (p.usuario?.username?.toLowerCase().includes(text) || 
                            p.usuario?.email?.toLowerCase().includes(text) || 
                            p.usuario?.perfil?.restaurant?.toLowerCase().includes(text) ||
                            p.id?.toLowerCase().includes(text)
                            );

        if (!matchClient) return false;

        // 2. Filtro por Rango de Fechas
        const paymentDate = new Date(p.fecha).getTime();
        const start = dateStart ? new Date(dateStart + 'T00:00:00').getTime() : -Infinity;
        // La fecha de fin se ajusta al final del día para incluir el día seleccionado
        const end = dateEnd ? new Date(dateEnd + 'T23:59:59').getTime() : Infinity; 

        return paymentDate >= start && paymentDate <= end;
    });


    // Estilos
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 };
    const thStyle = { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333' };
    const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContent = { background: '#fff', padding: 30, borderRadius: 12, width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
    const inputStyle = { width: '100%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 };
    const labelStyle = { display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#475569', fontSize: 13 };
    const totalIngresos = pagos.reduce((acc, p) => acc + (p.cantidad || 0), 0);
    const filterInputStyle = { padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h2 style={{ color: '#1e293b', margin: 0 }}>Pagos Globales</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Historial de ingresos registrados.</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>TOTAL INGRESOS</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#166534' }}>${totalIngresos.toLocaleString('es-MX')}</div>
                </div>
            </div>

            {/* BARRA DE ACCIONES Y FILTROS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{ background: '#8b5cf6', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Registrar Nuevo Pago
                </button>

                {/* CONTENEDOR DE FILTROS */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', padding: '8px 15px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar cliente/email..." 
                        value={searchClient}
                        onChange={(e) => setSearchClient(e.target.value)}
                        style={filterInputStyle}
                    />
                    <label style={{fontSize: 12, color: '#475569'}}>Desde:</label>
                    <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} style={filterInputStyle} />
                    <label style={{fontSize: 12, color: '#475569'}}>Hasta:</label>
                    <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} style={filterInputStyle} />
                </div>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div style={{overflowX: 'auto'}}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Cliente</th>
                                <th style={thStyle}>Monto</th>
                                <th style={thStyle}>ID Pago</th>
                                <th style={thStyle}>Acciones</th> {/* 🆕 NUEVA COLUMNA */}
                            </tr>
                        </thead>
                        <tbody>
                            {pagosFiltrados.length > 0 ? pagosFiltrados.map(p => (
                                <tr key={p.id} style={{ background: '#fff' }}>
                                    <td style={{...tdStyle, fontWeight:'bold'}}>{new Date(p.fecha).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        {p.usuario?.username || 'Desconocido'}
                                        <div style={{fontSize: 11, color: '#666'}}>{p.usuario?.email}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 15, fontWeight: 'bold' }}>
                                            ${(p.cantidad || 0).toLocaleString('es-MX')}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.id.split('-')[0]}...</span>
                                    </td>
                                    {/* 🆕 BOTÓN DE ELIMINAR */}
                                    <td style={tdStyle}>
                                        <button 
                                            onClick={() => handleDeletePago(p.id)} 
                                            style={{ background: '#ef4444', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: 20, color: '#666'}}>
                                        No hay pagos registrados con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- MODAL REGISTRAR PAGO --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3 style={{marginBottom: 20, color: '#1e293b'}}>Registrar Pago</h3>
                        <form onSubmit={handleCreatePago}>
                            
                            <label style={labelStyle}>Cliente:</label>
                            <select 
                                value={newPago.usuarioId} 
                                onChange={(e) => setNewPago({...newPago, usuarioId: e.target.value})}
                                style={inputStyle}
                                required
                            >
                                <option value="">-- Seleccionar Cliente --</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.username} {u.perfil?.restaurant ? `(${u.perfil.restaurant})` : ''}
                                    </option>
                                ))}
                            </select>
                            
                            <label style={labelStyle}>Monto ($ MXN):</label>
                            <input 
                                type="number" 
                                value={newPago.cantidad}
                                onChange={(e) => setNewPago({...newPago, cantidad: e.target.value})}
                                style={inputStyle}
                                placeholder="Ej. 5000"
                                required
                                min="0"
                            />

                            <label style={labelStyle}>Fecha del Pago:</label>
                            {/* Input mantiene el formato YYYY-MM-DD */}
                            <input 
                                type="date" 
                                value={newPago.fecha}
                                onChange={(e) => setNewPago({...newPago, fecha: e.target.value})}
                                style={inputStyle}
                                required
                            />

                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20}}>
                                <button type="button" onClick={() => setShowModal(false)} style={{padding:'10px 20px', background:'#ef4444', color:'#fff', border:'none', borderRadius:6, cursor:'pointer'}}>Cancelar</button>
                                <button type="submit" style={{padding:'10px 20px', background:'#22c55e', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:'bold'}}>Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPagos;