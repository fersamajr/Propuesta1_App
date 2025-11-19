import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // ⬅️ Importamos tu configuración de API

function Contacto() {
    const navigate = useNavigate();
    
    // 1. Estados para guardar lo que escribe el usuario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras envía

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 2. Llamada real al Backend
            await api.post('/contact', formData);
            
            setEnviado(true);
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (error) {
            console.error("Error enviando mensaje", error);
            alert("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Estilos (Reutilizados de tu código)
    const containerStyle = { minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const navBarStyle = { width: 550, display: 'flex', justifyContent: 'space-between', marginBottom: 40, marginTop: 20 };
    const btnNavStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border:'none', cursor:'pointer' };
    
    return (
        <div style={containerStyle}>
            {/* Barra superior */}
            <div style={navBarStyle}>
                <button style={btnNavStyle} onClick={() => navigate('/')}>Inicio</button>
                <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8, border:'none' }}>Logo</button>
                <button style={btnNavStyle} onClick={() => navigate('/login')}>Iniciar sesión</button>
            </div>

            {/* Contenido central */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                <h2 style={{color: '#1e293b'}}>Contáctanos</h2>
                
                {enviado ? (
                    <div style={{ background: '#dcfce7', color: '#166534', padding: 30, borderRadius: 10, textAlign:'center', border: '1px solid #86efac' }}>
                        <h3 style={{marginTop:0}}>¡Mensaje Enviado! 🚀</h3>
                        <p>Gracias por escribirnos. Te responderemos a la brevedad.</p>
                        <small>Redirigiendo al inicio...</small>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: 350, background: '#f5f3ff', padding: 30, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{marginBottom: 15}}>
                            <label style={{display:'block', marginBottom:5, fontWeight:'bold', color:'#555'}}>Nombre:</label>
                            <input 
                                type="text" 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                style={{ width: '100%', padding: 10, borderRadius: 8, background: '#e0e7ff', border: '1px solid #c7d2fe' }} 
                                required 
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div style={{marginBottom: 15}}>
                            <label style={{display:'block', marginBottom:5, fontWeight:'bold', color:'#555'}}>Email o Teléfono:</label>
                            <input 
                                type="text" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%', padding: 10, borderRadius: 8, background: '#e0e7ff', border: '1px solid #c7d2fe' }} 
                                required 
                                placeholder="contacto@ejemplo.com"
                            />
                        </div>
                        <div style={{marginBottom: 20}}>
                            <label style={{display:'block', marginBottom:5, fontWeight:'bold', color:'#555'}}>¿Cómo podemos ayudarte?</label>
                            <textarea 
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                style={{ width: '100%', padding: 10, borderRadius: 8, background: '#e0e7ff', border: '1px solid #c7d2fe', minHeight: 100, fontFamily: 'inherit' }} 
                                required 
                                placeholder="Escribe tu mensaje aquí..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                background: loading ? '#cbd5e1' : '#a78Bfa', 
                                color: '#222', 
                                width: '100%', 
                                padding: 12, 
                                borderRadius: 8,
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            {loading ? 'Enviando...' : 'Enviar Mensaje'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Contacto;