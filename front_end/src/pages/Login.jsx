import React, { useState } from 'react';
import api from '../api/api'; 
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            
            const { accessToken, user } = response.data;

            if (!accessToken) {
                setError('No se recibió token válido');
                return;
            }

            localStorage.setItem('token', accessToken);
            if (onLoginSuccess) onLoginSuccess(accessToken);

            if (user && user.rol === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/bienvenida');
            }

        } catch (err) {
            console.error(err);
            setError('Email o contraseña incorrectos');
        }
    };

    // --- ESTILOS ADAPTADOS AL DASHBOARD AZULADO ---

    const dotAnimationCss = `
        @keyframes moveDots {
            0% { background-position: 0 0; }
            100% { background-position: 400px 400px; }
        }
        /* Esta animación usa puntos blancos semi-transparentes sobre el fondo oscuro */
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
        }
    `;

    const PAGE_CONTAINER = { 
        minHeight: '100vh', 
        background: '#1e293b', // Fondo Principal del Dashboard
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
    };
    
    // Botones de navegación (Cian de Acento)
    const navBarButtonStyle = { 
        background: '#7dd3fc', 
        color: '#1e293b', // Texto oscuro para contraste
        padding: '10px 25px', 
        borderRadius: 25, 
        border: '1px solid #7dd3fc', 
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        ':hover': {
            background: '#3b82f6', // Azul más oscuro al pasar el mouse
            color: '#fff',
            transform: 'translateY(-1px)'
        }
    };
    
    // Tarjeta del Formulario
    const formCardStyle = { 
        width: 480, 
        background: 'rgba(51, 65, 85, 0.95)', // Fondo de Tarjeta (#334155) transparente
        backdropFilter: 'blur(5px)', 
        borderRadius: 20, 
        border: '2px solid #475569', 
        padding: 45, 
        boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        zIndex: 10,
        color: '#cbd5e1' // Texto base claro
    };
    
    // Banner de Bienvenida (Lila de Acento)
    const welcomeBannerStyle = { 
        background: '#a78Bfa', // Lila Principal
        color: '#1e293b', // Texto oscuro
        borderRadius: 15, 
        marginBottom: 35, 
        padding: '15px 0', 
        width: '100%', 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 26,
        letterSpacing: '0.5px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
    };
    
    const inputStyle = { 
        width: '100%', 
        padding: 14, 
        marginBottom: 25, 
        borderRadius: 10, 
        background: '#1e293b', // Fondo de Input (BG de Página)
        fontSize: 18, 
        border: '1px solid #475569',
        color: '#cbd5e1',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        ':focus': {
            borderColor: '#a78Bfa', // Borde Lila al enfocar
            boxShadow: '0 0 0 3px rgba(167, 139, 250, 0.3)'
        }
    };
    
    // Botón Principal (Verde de Éxito)
    const submitButtonStyle = { 
        width: '100%', 
        background: '#10b981', // Verde de Éxito
        color: '#1e293b', 
        padding: 18, 
        borderRadius: 10, 
        fontWeight: 'bold', 
        fontSize: 20, 
        border: 'none', 
        marginBottom: 15,
        cursor: 'pointer',
        transition: 'background 0.3s ease, transform 0.2s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
        ':hover': {
            background: '#0e9e71',
            transform: 'translateY(-2px)'
        }
    };
    
    // Botón Secundario
    const secondaryButtonStyle = { 
        width: '100%', 
        background: 'transparent', 
        color: '#cbd5e1', 
        padding: 12, 
        borderRadius: 10, 
        fontSize: 16, 
        border: '1px solid #475569', // Borde Gris Sutil
        cursor: 'pointer',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        ':hover': {
            background: '#334155', // Fondo de tarjeta al pasar el mouse
            borderColor: '#a78Bfa'
        }
    };

    const labelStyle = { 
        marginBottom: 5, 
        display: 'block', 
        fontWeight: 'bold', 
        color: '#a78Bfa', // Etiqueta Lila
        fontSize: 16 
    };

    return (
        <div style={PAGE_CONTAINER} className="animated-background-dots">
            {/* Insertar la animación CSS directamente */}
            <style>{dotAnimationCss}</style>

            {/* Barra superior */}
            <div style={{ width: 550, display: 'flex', justifyContent: 'space-around', marginBottom: 70, zIndex: 10 }}>
                <Link to="/contacto" style={navBarButtonStyle}>Contactanos</Link>
                {/* Login resaltado con Lila */}
                <button style={{...navBarButtonStyle, background: '#a78Bfa', color: '#1e293b'}}>Login</button> 
                <Link to="/" style={navBarButtonStyle}>Inicio</Link>
            </div>
            
            {/* Card central */}
            <div style={formCardStyle}>
                <div style={welcomeBannerStyle}>
                    <span role="img" aria-label="wave">👋</span> ¡Bienvenido de vuelta!
                </div>
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                    
                    <label style={labelStyle}>Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
                    
                    <button type="submit" style={submitButtonStyle}>Ingresar</button>
                    
                    {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: 15, fontSize: 16 }}>{error}</div>}
                </form>
                <button style={secondaryButtonStyle}>Olvidé mi contraseña</button>
            </div>
        </div>
    );
}

export default Login;