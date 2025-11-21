import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout
import { useNavigate } from 'react-router-dom';

function Inventario() {
    const navigate = useNavigate();
    const [cantidadActual, setCantidadActual] = useState(0);
    const [ultimaCantidad, setUltimaCantidad] = useState(0);
    
    // Inputs del formulario
    const [inputMolido, setInputMolido] = useState('');
    const [inputGrano, setInputGrano] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // 1. Cargar Inventario al inicio
    useEffect(() => {
        const fetchInventario = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await api.get('/inventario/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Si existe inventario, seteamos los valores. Si es null, es 0.
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

    // 2. Actualizar Inventario (Mantiene la funcionalidad)
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
                // Intentamos actualizar
                response = await api.patch('/inventario/me', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                // Si falla (ej. 404), intentamos crear
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

    // --- Lógica de Color (Preservada) ---
    const getStatusColor = (kg) => {
        if (kg < 5) return '#ef4444'; // Red - Crítico
        if (kg < 10) return '#fb923c'; // Orange - Bajo
        return '#10b981'; // Green - Normal
    };
    
    const statusColor = getStatusColor(cantidadActual);

    // --- Estilos Adaptados al Tema Oscuro ---
    const containerStyle = {
        width: '100%',
        maxWidth: 600,
        padding: 30,
        background: '#334155', 
        borderRadius: 16,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: '#fff',
    };
    
    // Tarjeta de Display con borde de estado
    const displayCardStyle = {
        width: '95%', minHeight: 150, background: '#1e293b', borderRadius: 12, 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        alignItems: 'center', marginBottom: 30, padding: 20,
        border: `2px solid ${statusColor}`, // Borde basado en el estado
        boxShadow: `0 0 10px ${statusColor}50` // Sombra sutil del color de estado
    };

    const inputStyle = {
        width: '100%', padding: '12px', borderRadius: 8, background: '#1e293b', 
        border: '1px solid #475569', fontSize: 16, outline: 'none', color: '#fff'
    };
    
    const labelStyle = { width: 150, fontWeight: 'bold', fontSize: 16, color: '#a78Bfa' };
    
    const updateButtonStyle = { 
        width: '100%', padding: '15px', background: '#a78Bfa', color: '#1e293b', 
        border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 'bold', 
        cursor: 'pointer', marginTop: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    };
    
    const formGroupStyle = { 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 20,
        background: '#334155', // Para diferenciar el fondo del layout
        padding: '10px 0'
    };

    return (
        <ClientLayout title="Mi Inventario de Café">
            <div style={containerStyle}>
                <h2 style={{ color: '#7dd3fc', borderBottom: '1px solid #475569', paddingBottom: 10, margin: '0 0 20px 0', textAlign: 'center' }}>
                    Estado del Stock
                </h2>

                {/* Tarjeta de Cantidad Actual */}
                <div style={displayCardStyle}>
                    <span style={{ fontSize: 16, fontWeight: '500', color: '#cbd5e1', marginBottom: 10 }}>STOCK ACTUAL TOTAL</span>
                    <span style={{ fontSize: 48, fontWeight: 'bold', color: statusColor }}>
                        {loading ? '...' : `${cantidadActual} `} <span style={{fontSize: 24}}>Kg</span>
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>(Último registro: {ultimaCantidad} Kg)</span>
                </div>

                <h3 style={{ color: '#cbd5e1', marginBottom: 20, fontSize: 24, textAlign: 'center' }}>Reportar Stock</h3>

                {/* Formulario */}
                <div style={{ width: '100%' }}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Cantidad Molido</label>
                        <input 
                            type="number" 
                            style={inputStyle} 
                            value={inputMolido}
                            onChange={(e) => setInputMolido(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Cantidad Grano</label>
                        <input 
                            type="number" 
                            style={inputStyle} 
                            value={inputGrano}
                            onChange={(e) => setInputGrano(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <button 
                        onClick={handleUpdate} 
                        style={updateButtonStyle}
                    >
                        Actualizar Inventario
                    </button>

                    {message && <p style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold', color: message.includes('✅') ? '#10b981' : '#ef4444' }}>{message}</p>}
                </div>
            </div>
        </ClientLayout>
    );
}

export default Inventario;