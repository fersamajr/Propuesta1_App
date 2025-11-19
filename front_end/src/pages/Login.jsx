import React, { useState } from 'react';
import api from '../api/api'; 
import { useNavigate, Link } from 'react-router-dom';
import styles from '../Home.module.css'; 
import logoCafe from '../assets/logo-cafe-tech.png';

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

    // --- Estilos CSS en el componente (Para el Formulario) ---
    const formCardStyle = { 
        width: 380, 
        background: '#fff', 
        borderRadius: 16, 
        border: '1px solid #d1d5db', 
        padding: 32, 
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
    };
    
    const welcomeBannerStyle = { 
        background: '#f5f3ff', 
        borderRadius: 8, 
        marginBottom: 18, 
        padding: '10px 0', 
        width: '100%', 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: '#6d28d9'
    };
    
    const inputStyle = { 
        width: '100%', 
        padding: 12, 
        marginBottom: 18, 
        borderRadius: 8, 
        background: '#f8fafc', 
        fontSize: 16, 
        border: '1px solid #d1d5db' 
    };
    
    const submitButtonStyle = { 
        width: '100%', 
        background: '#a78Bfa', 
        color: '#fff',
        padding: 14, 
        borderRadius: 8, 
        fontWeight: 'bold', 
        fontSize: 16, 
        border: 'none', 
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'background 0.2s'
    };
    
    const secondaryButtonStyle = { 
        width: '100%', 
        background: '#e0e7ff',
        color: '#4f46e5',
        padding: 10, 
        borderRadius: 8, 
        fontSize: 14, 
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Barra superior (Usando Home.module.css) */}
            <nav className={styles.topBar} style={{width: 550, borderBottom: 'none'}}> 
                <Link to="/contacto" className={styles.navLink}>Contáctanos</Link>
                <Link to="/" className={styles.logoLink}>
                    <img src={logoCafe} alt="Logo de Café" className={styles.logo} />
                </Link>
                <Link to="/" className={styles.navLink}>Inicio</Link>
            </nav>
            
            {/* Card central */}
            <div style={formCardStyle}>
                <div style={welcomeBannerStyle}>👋 Hola de regreso :)</div>
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 'bold', color: '#475569' }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                    
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 'bold', color: '#475569' }}>Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
                    
                    <button type="submit" style={submitButtonStyle}>Ingresar</button>
                    
                    {error && <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: 8, fontSize: 14 }}>{error}</div>}
                </form>
                <button style={secondaryButtonStyle}>Olvidé mi contraseña</button>
            </div>
        </div>
    );
}

export default Login;