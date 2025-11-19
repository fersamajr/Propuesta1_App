import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

function Inventario() {
    const navigate = useNavigate();
    const [cantidadActual, setCantidadActual] = useState(0);
    const [ultimaCantidad, setUltimaCantidad] = useState(0);
    
    const [inputMolido, setInputMolido] = useState('');
    const [inputGrano, setInputGrano] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    // 1. Cargar Inventario al inicio
    useEffect(() => {
        const fetchInventario = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await api.get('/inventario/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setCantidadActual(response.data.cantidad || 0);
                    setUltimaCantidad(response.data.ultimaCantidad || 0);
                }
            } catch (error) {
                console.error("Error cargando inventario", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventario();
    }, [navigate]);

    // 2. Actualizar Inventario
    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        
        const nuevoMolido = parseFloat(inputMolido) || 0;
        const nuevoGrano = parseFloat(inputGrano) || 0;
        const nuevoTotal = nuevoMolido + nuevoGrano;

        if (nuevoTotal <= 0) {
            setMessage('⚠️ Por favor ingresa una cantidad válida.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const payload = {
                cantidad: nuevoTotal,
                ultimaCantidad: cantidadActual
            };

            let response;
            try {
                response = await api.patch('/inventario/me', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                response = await api.post('/inventario/me', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setCantidadActual(response.data.cantidad);
            setUltimaCantidad(response.data.ultimaCantidad);
            setMessage('✅ Inventario actualizado correctamente.');
            setInputMolido('');
            setInputGrano('');
            
            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            console.error(error);
            setMessage('❌ Error al actualizar inventario.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // --- Estilos ---
    const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const topBtnStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };
    const menuBtnStyle = (isActive) => ({
        width: '90%', margin: '8px auto', background: isActive ? '#c4b5fd' : '#f1f5f9', color: isActive ? '#333' : '#334155', padding: '10px', 
        borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal'
    });
    
    // Mejorar Tarjeta de Display
    const displayCardStyle = {
        width: '100%', minHeight: 180, background: '#fff', borderRadius: 16, border: '1px solid #c4b5fd', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 30,
        boxShadow: '0 4px 15px rgba(167, 139, 250, 0.1)',
        borderLeft: '5px solid #a78Bfa'
    };

    // Mejorar Estilos de Formulario
    const inputStyle = {
        width: '100%', padding: '12px', borderRadius: 8, background: '#e5e7eb', 
        border: '1px solid #cbd5e1', fontSize: 16, outline: 'none'
    };
    
    const labelStyle = { width: 150, fontWeight: 'bold', fontSize: 16, color: '#475569' };
    
    const updateButtonStyle = { 
        width: '100%', padding: '15px', background: '#a78Bfa', color: '#fff', border: 'none', 
        borderRadius: 12, fontSize: 18, fontWeight: 'bold', cursor: 'pointer', marginTop: 20,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };
    
    // Status color
    const getStatusColor = (kg) => {
        if (kg < 5) return '#dc2626'; // Red - Crítico
        if (kg < 10) return '#fb923c'; // Orange - Bajo
        return '#10b981'; // Green - Normal
    };
    
    const statusColor = getStatusColor(cantidadActual);

    return (
        <div style={PAGE_CONTAINER}>
            
            {/* Barra Superior */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>
                <Link to="/bienvenida" style={topBtnStyle}>Regresar</Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoCafe} alt="Logo" style={logoImgStyle} />
                </div>
                <button style={{...topBtnStyle, background: '#ef4444'}} onClick={handleLogout}>Exit</button>
            </div>

            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between' }}>
                
                {/* Menú Lateral */}
                <div style={{ position: 'relative', width: 220, paddingRight: 20 }}>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#a78Bfa', color: '#fff', padding: 10, borderRadius: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}>≡</button>
                    {menuOpen && (
                         <div style={{ position: 'absolute', top: 45, width: 190, background: '#fff', borderRadius: 12, padding: '5px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10 }}>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/bienvenida')}>Inicio</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/predicciones')}>Predicciones</button>
                             <button style={menuBtnStyle(true)}>Inventario</button>
                        </div>
                    )}
                </div>

                {/* Área Central */}
                <div style={{ flex: 1, maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#1e293b', marginBottom: 20, fontSize: 32 }}>📦 Mi Inventario</h2>

                    {/* Tarjeta de Cantidad Actual */}
                    <div style={{...displayCardStyle, borderLeft: `5px solid ${statusColor}`}}>
                        <span style={{ fontSize: 16, fontWeight: '500', color: '#6b7280', marginBottom: 10 }}>STOCK ACTUAL</span>
                        <span style={{ fontSize: 48, fontWeight: 'bold', color: statusColor }}>
                            {loading ? '...' : `${cantidadActual} `} <span style={{fontSize: 24}}>Kg</span>
                        </span>
                        <span style={{ fontSize: 12, color: '#666' }}>(Último registro: {ultimaCantidad} Kg)</span>
                    </div>

                    <h3 style={{ color: '#475569', fontSize: 24, marginBottom: 20 }}>Actualizar Stock</h3>

                    {/* Formulario */}
                    <div style={{ width: '100%', background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <label style={labelStyle}>Molido (Kg)</label>
                            <input 
                                type="number" 
                                style={inputStyle} 
                                value={inputMolido}
                                onChange={(e) => setInputMolido(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
                            <label style={labelStyle}>Grano (Kg)</label>
                            <input 
                                type="number" 
                                style={inputStyle} 
                                value={inputGrano}
                                onChange={(e) => setInputGrano(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <button onClick={handleUpdate} style={updateButtonStyle}>
                            Actualizar
                        </button>

                        {message && <p style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold', color: message.includes('✅') ? '#10b981' : '#dc2626' }}>{message}</p>}
                    </div>
                </div>

                {/* Espaciador derecho */}
                <div style={{ width: 220 }}></div>
            </div>
        </div>
    );
}

export default Inventario;