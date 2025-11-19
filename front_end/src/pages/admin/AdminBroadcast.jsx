import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminBroadcast() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ asunto: '', mensaje: '' });
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if(!window.confirm("¿Estás seguro de enviar este mensaje a TODOS los clientes?")) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/users/admin/broadcast', form, { // Ajusta la URL según donde pusiste el endpoint
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Anuncio enviado correctamente a la base de clientes.');
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('❌ Error al enviar el anuncio.');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = { minHeight: '100vh', background: '#f1f5f9', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const cardStyle = { background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', width: '100%', maxWidth: 600 };
    const inputStyle = { width: '100%', padding: 12, marginBottom: 20, borderRadius: 8, border: '1px solid #cbd5e1' };

    return (
        <div style={containerStyle}>
            <button onClick={() => navigate('/admin')} style={{ alignSelf:'flex-start', marginBottom: 20, padding: '8px 16px', cursor: 'pointer' }}>⬅ Volver</button>
            
            <div style={cardStyle}>
                <h2 style={{ color: '#78549b', marginBottom: 10, textAlign:'center' }}>📢 Sistema de Anuncios</h2>
                <p style={{textAlign:'center', color:'#64748b', marginBottom:30}}>Envía notificaciones por correo a todos tus clientes activos.</p>
                
                <form onSubmit={handleSend}>
                    <label style={{fontWeight:'bold', display:'block', marginBottom:5}}>Asunto del Correo</label>
                    <input 
                        type="text" 
                        value={form.asunto} 
                        onChange={e => setForm({...form, asunto: e.target.value})} 
                        style={inputStyle} 
                        placeholder="Ej: Aviso de vacaciones, Cambio de precios..." 
                        required
                    />

                    <label style={{fontWeight:'bold', display:'block', marginBottom:5}}>Mensaje</label>
                    <textarea 
                        value={form.mensaje} 
                        onChange={e => setForm({...form, mensaje: e.target.value})} 
                        style={{...inputStyle, minHeight: 150, fontFamily:'sans-serif'}} 
                        placeholder="Escribe el contenido del anuncio aquí..." 
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: 15, background: loading ? '#cbd5e1' : '#a78Bfa', color: '#222', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Enviando correos...' : 'Enviar Anuncio Masivo'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminBroadcast;