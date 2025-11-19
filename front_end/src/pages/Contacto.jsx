import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'; 
import styles from '../Home.module.css';
import logoCafe from '../assets/logo-cafe-tech.png';

function Contacto() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

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
            await api.post('/contact', formData);
            
            setEnviado(true);
            
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

    // --- Estilos CSS en el componente (Para el Formulario) ---
    const formContainerStyle = { 
        width: 400,
        background: '#fff', 
        padding: 40,
        borderRadius: 16, 
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
    };
    
    const inputStyle = { 
        width: '100%', 
        padding: 12, 
        borderRadius: 8, 
        background: '#f8fafc',
        border: '1px solid #d1d5db', 
        fontSize: 16, 
        transition: 'border-color 0.2s'
    };
    
    const labelStyle = { 
        display:'block', 
        marginBottom: 5, 
        fontWeight:'bold', 
        color:'#475569'
    };
    
    const successStyle = { 
        background: '#dcfce7', 
        color: '#166534', 
        padding: 30, 
        borderRadius: 10, 
        textAlign:'center', 
        border: '1px solid #86efac' 
    };
    
    const submitButtonStyle = {
        background: loading ? '#cbd5e1' : '#a78Bfa', 
        color: '#fff',
        width: '100%', 
        padding: 14,
        borderRadius: 8,
        border: 'none',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: '0.2s'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Barra superior (Usando Home.module.css) */}
            <nav className={styles.topBar} style={{width: 550, borderBottom: 'none'}}> 
                <Link to="/" className={styles.navLink}>Inicio</Link>
                <Link to="/" className={styles.logoLink}>
                    <img src={logoCafe} alt="Logo de Café" className={styles.logo} />
                </Link>
                <Link to="/login" className={styles.navLink}>Iniciar sesión</Link>
            </nav>

            {/* Contenido central */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                <h2 style={{color: '#1e293b', fontSize: 32, marginBottom: 30}}>☕ Contáctanos</h2>
                
                {enviado ? (
                    <div style={successStyle}>
                        <h3 style={{marginTop:0}}>¡Mensaje Enviado! 🚀</h3>
                        <p>Gracias por escribirnos. Te responderemos a la brevedad.</p>
                        <small>Redirigiendo al inicio...</small>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={formContainerStyle}>
                        <div style={{marginBottom: 15}}>
                            <label style={labelStyle}>Nombre:</label>
                            <input 
                                type="text" 
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                style={inputStyle} 
                                required 
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div style={{marginBottom: 15}}>
                            <label style={labelStyle}>Email o Teléfono:</label>
                            <input 
                                type="text" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={inputStyle} 
                                required 
                                placeholder="contacto@ejemplo.com"
                            />
                        </div>
                        <div style={{marginBottom: 20}}>
                            <label style={labelStyle}>¿Cómo podemos ayudarte?</label>
                            <textarea 
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                style={{ ...inputStyle, minHeight: 120, fontFamily: 'inherit' }} 
                                required 
                                placeholder="Escribe tu mensaje aquí..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={submitButtonStyle}
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