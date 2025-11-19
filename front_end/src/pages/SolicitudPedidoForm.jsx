import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function SolicitudPedidoForm() {
    const navigate = useNavigate();
    // Campos requeridos por createSolicitudPedidoDto
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
                'solicitud-pedidos/me', // ⬅️ Endpoint protegido por JWT
                {
                    grano: Number(grano),
                    molido: Number(molido),
                    fechaEntrega: fechaEntrega,
                    notas: notas,
                },
                {
                    headers: { Authorization: `Bearer ${token}` } // ⬅️ Token del usuario
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

    // Estilos para mantener la coherencia visual
    const inputStyle = {
        width: '100%', padding: '10px', marginBottom: 16, borderRadius: 8, background: '#e5e7eb', fontSize: 16, border: '1px solid #d1d5db',
    };
    const buttonStyle = {
        width: '100%', background: '#a78Bfa', color: '#222', padding: '12px', borderRadius: 8, fontWeight: 500,
        fontSize: 16, border: 'none', marginBottom: 12, marginTop: 20
    };
    const cardStyle = {
        width: 500, background: '#fff', borderRadius: 16, border: '2px solid #d1d5db', padding: 32, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'center'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff' }}>
            {/* Barra superior (simulada) */}
            <div style={{
                width: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 40, position: 'absolute', top: 20
            }}>
                <button
                    style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}
                    onClick={() => navigate('/bienvenida')}
                >
                    Volver
                </button>
                <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8 }}>Logo</button>
                <button
                    style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}
                    onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                >
                    Cerrar Sesion
                </button>
            </div>

            <div style={cardStyle}>
                <h2 style={{ color: '#78549b', marginBottom: 30 }}>Solicitudes de Pedido</h2>

                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Cantidad Molido (Kg)</label>
                    <input
                        type="number"
                        min="0"
                        value={molido}
                        onChange={e => setMolido(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Cantidad Grano (Kg)</label>
                    <input
                        type="number"
                        min="0"
                        value={grano}
                        onChange={e => setGrano(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Fecha de entrega</label>
                    <input
                        type="date"
                        value={fechaEntrega}
                        onChange={e => setFechaEntrega(e.target.value)}
                        style={inputStyle}
                        required
                    />
                    
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Notas adicionales</label>
                    <textarea
                        value={notas}
                        onChange={e => setNotas(e.target.value)}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        rows="3"
                    />

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Generando...' : 'Generar el pedido'}
                    </button>
                    
                    {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
                    {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: 8 }}>{message}</div>}
                </form>
            </div>
        </div>
    );
}

export default SolicitudPedidoForm;