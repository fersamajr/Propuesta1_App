import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

function SolicitudPedidoForm() {
    const navigate = useNavigate();
    const [grano, setGrano] = useState(0); 
    const [molido, setMolido] = useState(0);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

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

        if (Number(grano) <= 0 && Number(molido) <= 0) {
            setError('La cantidad de grano o molido debe ser mayor a cero.');
            setLoading(false);
            return;
        }

        try {
            await api.post(
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

    // --- Estilos ---
    const pageContainerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff' };
    const navBarStyle = { width: 550, display: 'flex', justifyContent: 'space-between', marginBottom: 40, position: 'absolute', top: 20 };
    const btnNavStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const cardStyle = {
        width: 500, background: '#fff', borderRadius: 16, border: '1px solid #c4b5fd', padding: 40, 
        boxShadow: '0 8px 25px rgba(167, 139, 250, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center'
    };
    const inputStyle = {
        width: '100%', padding: '12px', marginBottom: 18, borderRadius: 8, background: '#f8fafc', 
        fontSize: 16, border: '1px solid #d1d5db', outline: 'none'
    };
    const buttonStyle = {
        width: '100%', background: loading ? '#cbd5e1' : '#a78Bfa', color: loading ? '#64748b' : '#fff', 
        padding: '14px', borderRadius: 8, fontWeight: 'bold', fontSize: 17, border: 'none', 
        marginTop: 20, cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s'
    };
    const labelStyle = { marginBottom: 5, display: 'block', fontWeight: 'bold', color: '#475569' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };

    return (
        <div style={pageContainerStyle}>
            {/* Barra superior */}
            <div style={navBarStyle}>
                <Link style={btnNavStyle} to="/bienvenida">Volver</Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoCafe} alt="Logo" style={logoImgStyle} />
                </div>
                <button style={{...btnNavStyle, background: '#ef4444'}} onClick={handleLogout}>Cerrar Sesión</button>
            </div>

            <div style={cardStyle}>
                <h2 style={{ color: '#78549b', marginBottom: 30, fontSize: 32 }}>📝 Solicitud de Pedido</h2>
                <p style={{color: '#64748b', textAlign:'center', marginTop:-15, marginBottom: 25}}>Indica las cantidades deseadas y una fecha de entrega.</p>

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
                        {loading ? 'Generando...' : 'Generar el pedido'}
                    </button>
                    
                    {error && <div style={{ color: '#dc2626', textAlign: 'center', marginTop: 10 }}>{error}</div>}
                    {message && <div style={{ color: '#16a34a', textAlign: 'center', marginTop: 10 }}>{message}</div>}
                </form>
            </div>
        </div>
    );
}

export default SolicitudPedidoForm;