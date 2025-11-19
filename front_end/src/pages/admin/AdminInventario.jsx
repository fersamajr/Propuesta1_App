import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminInventario() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('global'); // 'global' | 'personal'
    
    // --- ESTADOS INVENTARIO GLOBAL ---
    const [inventariosGlobal, setInventariosGlobal] = useState([]);
    const [loadingGlobal, setLoadingGlobal] = useState(false);

    // --- ESTADOS INVENTARIO PERSONAL ---
    const [miInventario, setMiInventario] = useState({ cantidad: 0, ultimaCantidad: 0 });
    const [inputMolido, setInputMolido] = useState('');
    const [inputGrano, setInputGrano] = useState('');
    const [message, setMessage] = useState('');
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    useEffect(() => {
        if (activeTab === 'global') {
            fetchGlobal();
        } else {
            fetchPersonal();
        }
    }, [activeTab]);

// 1. FETCH GLOBAL (Solo Clientes)
    const fetchGlobal = async () => {
        setLoadingGlobal(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/inventario', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // 🔍 FILTRO: Excluir al Admin de la lista global
            // Solo pasamos los que tengan rol 'Cliente' (o que NO sean Admin)
            const soloClientes = response.data.filter(inv => inv.usuario?.rol === 'Cliente');
            
            // Ordenamos por cantidad (menor a mayor para ver urgencias)
            const sorted = soloClientes.sort((a, b) => a.cantidad - b.cantidad);
            
            setInventariosGlobal(sorted);
        } catch (error) {
            console.error("Error global", error);
        } finally {
            setLoadingGlobal(false);
        }
    };

    // 2. FETCH PERSONAL (Mi propio stock)
    const fetchPersonal = async () => {
        setLoadingPersonal(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/inventario/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setMiInventario(response.data);
            }
        } catch (error) {
            console.error("Error personal", error);
        } finally {
            setLoadingPersonal(false);
        }
    };

    // 3. ACTUALIZAR PERSONAL
    const handleUpdatePersonal = async () => {
        const token = localStorage.getItem('token');
        const nuevoMolido = parseFloat(inputMolido) || 0;
        const nuevoGrano = parseFloat(inputGrano) || 0;
        const nuevoTotal = nuevoMolido + nuevoGrano;

        if (nuevoTotal <= 0) return setMessage('⚠️ Ingresa una cantidad válida.');

        try {
            const payload = { cantidad: nuevoTotal, ultimaCantidad: miInventario.cantidad };
            
            // Intentamos PATCH, si falla POST (lógica robusta)
            let response;
            try {
                response = await api.patch('/inventario/me', payload, { headers: { Authorization: `Bearer ${token}` } });
            } catch {
                response = await api.post('/inventario/me', payload, { headers: { Authorization: `Bearer ${token}` } });
            }

            setMiInventario(response.data);
            setMessage('✅ Inventario actualizado.');
            setInputMolido('');
            setInputGrano('');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('❌ Error al actualizar.');
        }
    };

    // Estilos
    const containerStyle = { minHeight: '100vh', background: '#f1f5f9', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
    const thStyle = { background: '#334155', color: '#fff', padding: 15, textAlign: 'left' };
    const tdStyle = { padding: 15, borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' };
    
    // Estilos Tabs
    const tabContainerStyle = { display: 'flex', marginBottom: 20, background: '#e2e8f0', padding: 5, borderRadius: 8 };
    const tabStyle = (active) => ({
        padding: '10px 20px',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 'bold',
        background: active ? '#fff' : 'transparent',
        color: active ? '#334155' : '#64748b',
        boxShadow: active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        transition: '0.2s'
    });

    // Estilos Personal
    const cardPersonalStyle = { background: '#fff', padding: 30, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: 500, width: '100%', textAlign: 'center' };
    const inputStyle = { width: '100%', padding: 12, marginBottom: 15, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 };

    // Helper Stock
    const getStockStatus = (kg) => {
        if (kg <= 5) return { color: '#dc2626', bg: '#fee2e2', label: 'CRÍTICO' };
        if (kg <= 10) return { color: '#d97706', bg: '#fef3c7', label: 'BAJO' };
        return { color: '#166534', bg: '#dcfce7', label: 'OK' };
    };

    return (
        <div style={containerStyle}>
            <div style={{width: '100%', maxWidth: 1000}}>
                <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
                    <h2 style={{ color: '#1e293b', margin:0 }}>Gestión de Inventario</h2>
                    
                    {/* PESTAÑAS */}
                    <div style={tabContainerStyle}>
                        <div style={tabStyle(activeTab === 'global')} onClick={() => setActiveTab('global')}>
                            🌎 Global (Clientes)
                        </div>
                        <div style={tabStyle(activeTab === 'personal')} onClick={() => setActiveTab('personal')}>
                            👤 Mi Inventario
                        </div>
                    </div>
                </div>

                {/* --- VISTA GLOBAL --- */}
                {activeTab === 'global' && (
                    <>
                        <p style={{ color: '#64748b', marginBottom: 15 }}>Monitoreo de stock en posesión de los clientes.</p>
                        {loadingGlobal ? <p>Cargando...</p> : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Cliente</th>
                                        <th style={thStyle}>Stock Actual</th>
                                        <th style={thStyle}>Estatus</th>
                                        <th style={thStyle}>Registro Anterior</th>
                                        <th style={thStyle}>Última Actualización</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventariosGlobal.map((inv) => {
                                        const status = getStockStatus(inv.cantidad);
                                        return (
                                            <tr key={inv.id} style={{ background: '#fff' }}>
                                                <td style={tdStyle}>
                                                    <div style={{fontWeight:'bold'}}>{inv.usuario?.username}</div>
                                                    <div style={{fontSize:11, color:'#64748b'}}>{inv.usuario?.email}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{fontSize: 16, fontWeight: 'bold', color: '#0f172a'}}>{inv.cantidad} Kg</span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{ background: status.bg, color: status.color, padding: '4px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}><span style={{color: '#64748b'}}>{inv.ultimaCantidad} Kg</span></td>
                                                <td style={tdStyle}>
                                                    {new Date(inv.updatedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {inventariosGlobal.length === 0 && <tr><td colSpan="5" style={{padding:20, textAlign:'center'}}>No hay datos.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {/* --- VISTA PERSONAL --- */}
                {activeTab === 'personal' && (
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <div style={cardPersonalStyle}>
                            <h3 style={{color: '#78549b', marginBottom: 20}}>Mi Stock Disponible</h3>
                            
                            <div style={{background:'#f3e8ff', padding:20, borderRadius:12, marginBottom:30}}>
                                <span style={{fontSize: 14, color:'#6b21a8', display:'block', marginBottom:5}}>CANTIDAD ACTUAL</span>
                                <span style={{fontSize: 48, fontWeight:'bold', color:'#581c87'}}>
                                    {miInventario.cantidad} <span style={{fontSize:20}}>Kg</span>
                                </span>
                            </div>

                            <div style={{textAlign:'left'}}>
                                <label style={{fontWeight:'bold', color:'#475569', display:'block', marginBottom:5}}>Actualizar Molido (Kg)</label>
                                <input type="number" style={inputStyle} value={inputMolido} onChange={(e) => setInputMolido(e.target.value)} placeholder="0" />
                                
                                <label style={{fontWeight:'bold', color:'#475569', display:'block', marginBottom:5}}>Actualizar Grano (Kg)</label>
                                <input type="number" style={inputStyle} value={inputGrano} onChange={(e) => setInputGrano(e.target.value)} placeholder="0" />

                                <button 
                                    onClick={handleUpdatePersonal}
                                    style={{ width: '100%', padding: '15px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginTop: 10 }}
                                    disabled={loadingPersonal}
                                >
                                    {loadingPersonal ? 'Guardando...' : 'Actualizar Mi Stock'}
                                </button>
                                {message && <p style={{textAlign:'center', marginTop:15, fontWeight:'bold', color: message.includes('Error') ? 'red' : 'green'}}>{message}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminInventario;