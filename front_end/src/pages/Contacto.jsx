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

    // --- ESTILOS CONSISTENTES CON EL DASHBOARD ---

    // 1. CSS Global COMPLETO para Inyección
    const fullCssInjection = `
        /* Keyframes para el movimiento del gradiente */
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Keyframes para el movimiento sutil de la textura de puntos */
        @keyframes moveDots {
            0% { background-position: 0 0; }
            100% { background-position: 400px 400px; }
        }
        
        /* Aplica la textura de puntos como un pseudo-elemento animado */
        .animated-background-dots::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(#ffffff20 1px, transparent 1px);
            background-size: 40px 40px;
            animation: moveDots 60s linear infinite;
            z-index: 0;
            pointer-events: none;
        }
    `;

    const PAGE_CONTAINER = { 
        minHeight: '100vh', 
        background: 'linear-gradient(270deg, #1e293b, #1e293b, #1e293b)', 
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
    };
    
    const navBarButtonStyle = { 
        background: '#7dd3fc', 
        color: '#1e293b', 
        padding: '10px 25px', 
        borderRadius: 25, 
        border: '1px solid #7dd3fc', 
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        ':hover': {
            background: '#3b82f6', 
            color: '#fff',
            transform: 'translateY(-1px)'
        }
    };
    
    // Tarjeta del Formulario
    const formCardStyle = { 
        width: 550, 
        background: 'rgba(51, 65, 85, 0.95)', 
        backdropFilter: 'blur(5px)', 
        borderRadius: 20, 
        border: '2px solid #475569', 
        padding: 40, 
        boxShadow: '0 12px 30px rgba(0,0,0,0.6)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        zIndex: 10, 
        color: '#cbd5e1' 
    };
    
    // Título en Recuadro Morado
    const titleBoxStyle = {
        background: '#a78Bfa', 
        color: '#1e293b', 
        borderRadius: 15,
        marginBottom: 35, 
        padding: '15px 0',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 26,
        letterSpacing: '0.5px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    };


    const inputStyle = { 
        width: '100%', 
        padding: 14, 
        marginBottom: 25, 
        borderRadius: 10, 
        background: '#1e293b', 
        fontSize: 18, 
        border: '1px solid #475569',
        color: '#fff',
        transition: 'border-color 0.3s ease',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        fontFamily: 'inherit'
    };
    
    // Botón Principal (Verde de Acento)
    const submitButtonStyle = { 
        width: '100%', 
        background: loading ? '#475569' : '#10b981', 
        color: loading ? '#94a3b8' : '#1e293b', 
        padding: 18, 
        borderRadius: 10, 
        fontWeight: 'bold', 
        fontSize: 20, 
        border: 'none', 
        marginTop: 15,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s ease, transform 0.2s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
        opacity: loading ? 0.8 : 1,
        ':hover': {
            background: loading ? '#475569' : '#0e9e71',
            transform: loading ? 'none' : 'translateY(-2px)'
        }
    };
    
    const labelStyle = { 
        marginBottom: 5, 
        display: 'block', 
        fontWeight: 'bold', 
        color: '#a78Bfa', 
        fontSize: 16 
    };
    
    const successStyle = { 
        background: '#10b981', 
        color: '#1e293b', 
        padding: 30, 
        borderRadius: 10, 
        textAlign:'center', 
        border: '1px solid #10b981',
        boxShadow: '0 5px 15px rgba(16, 185, 129, 0.5)'
    };


    return (
        <div style={PAGE_CONTAINER} className="animated-background-dots">
            {/* 1. Inyectar Keyframes y Pseudo-Elemento para la animación de fondo */}
            <style>{fullCssInjection}</style>

            {/* Barra superior */}
            <div style={{ width: 550, display: 'flex', justifyContent: 'space-around', marginBottom: 60, zIndex: 10 }}>
                <Link to="/" style={navBarButtonStyle}>Inicio</Link>
                <button style={{...navBarButtonStyle, background: '#a78Bfa', color: '#1e293b'}}>Contáctanos</button> 
                <Link to="/login" style={navBarButtonStyle}>Iniciar sesión</Link>
            </div>
            
            {/* Card central */}
            <div style={formCardStyle}>
                
                {/* Título en Recuadro Morado */}
                <div style={titleBoxStyle}>
                    <span role="img" aria-label="waving hand">👋</span> ¡Contáctanos!
                </div>
                
                {enviado ? (
                    <div style={successStyle}>
                        <h3 style={{marginTop:0}}>¡Mensaje Enviado! ✅</h3>
                        <p>Gracias por escribirnos. Te responderemos a la brevedad.</p>
                        <small>Redirigiendo al inicio...</small>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        
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
                        
                        <label style={labelStyle}>Mensaje:</label>
                        <textarea 
                            name="mensaje"
                            value={formData.mensaje}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} 
                            required 
                            placeholder="Escribe tu mensaje aquí..."
                        />
                        
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