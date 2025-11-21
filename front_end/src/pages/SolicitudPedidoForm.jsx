import React, { useState } from 'react';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout
import { useNavigate } from 'react-router-dom';

function SolicitudPedidoForm() {
    const navigate = useNavigate();
    // Campos requeridos
    const [grano, setGrano] = useState(0); 
    const [molido, setMolido] = useState(0);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión.');
            setLoading(false);
            return;
        }

        // Validación simple para asegurar que se pide algo
        if (Number(grano) <= 0 && Number(molido) <= 0) {
            setError('La cantidad de grano o molido debe ser mayor a cero.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(
                'solicitud-pedidos/me', 
                {
                    grano: Number(grano),
                    molido: Number(molido),
                    fechaEntrega: fechaEntrega,
                    notas: notas,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage('✅ ¡Solicitud de pedido creada con éxito! Revisaremos tu pedido y enviaremos una confirmación por correo.');
            
            // Redirigir al dashboard después de un breve mensaje
            setTimeout(() => {
                navigate('/bienvenida');
            }, 3000);

        } catch (err) {
            console.error('Error al crear solicitud:', err.response?.data);
            setError(err.response?.data?.message || 'Error al enviar la solicitud de pedido. Revisa los datos.');
        } finally {
            setLoading(false);
        }
    };

    // --- Estilos Adaptados al Tema Oscuro ---
    const containerStyle = {
        width: '100%',
        maxWidth: 600,
        padding: 30,
        background: '#334155', // Fondo de tarjeta oscuro
        borderRadius: 16,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: '#fff',
        margin: '0 auto'
    };

    const inputStyle = {
        width: '100%', padding: '12px', marginBottom: 18, borderRadius: 8, background: '#1e293b', // Fondo del input más oscuro
        fontSize: 16, border: '1px solid #475569', outline: 'none', color: '#fff'
    };
    
    const labelStyle = { marginBottom: 5, display: 'block', fontWeight: 'bold', color: '#cbd5e1' };

    const buttonStyle = {
        width: '100%', background: loading ? '#475569' : '#10b981', color: loading ? '#94a3b8' : '#1e293b', 
        padding: '14px', borderRadius: 8, fontWeight: 'bold', fontSize: 17, border: 'none', 
        marginTop: 20, cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s'
    };

    return (
        <ClientLayout title="Solicitar Nuevo Pedido">
            <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
                <div style={containerStyle}>
                    <h2 style={{ color: '#a78Bfa', borderBottom: '1px solid #475569', paddingBottom: 10, marginBottom: 30, textAlign: 'center' }}>
                        Detalles del Pedido
                    </h2>

                    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                        
                        <label style={labelStyle}>Cantidad Molido (Kg)</label>
                        <input type="number" min="0" value={molido} onChange={e => setMolido(e.target.value)} style={inputStyle} required />

                        <label style={labelStyle}>Cantidad Grano (Kg)</label>
                        <input type="number" min="0" value={grano} onChange={e => setGrano(e.target.value)} style={inputStyle} required />

                        <label style={labelStyle}>Fecha de entrega sugerida</label>
                        <input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} style={inputStyle} required />
                        
                        <label style={labelStyle}>Notas adicionales</label>
                        <textarea value={notas} onChange={e => setNotas(e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} />

                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Generando Solicitud...' : 'Confirmar y Enviar Pedido'}
                        </button>
                        
                        {error && <div style={{ color: '#ef4444', textAlign: 'center', marginTop: 15 }}>{error}</div>}
                        {message && <div style={{ color: '#10b981', textAlign: 'center', marginTop: 15 }}>{message}</div>}
                    </form>
                </div>
            </div>
        </ClientLayout>
    );
}

export default SolicitudPedidoForm;