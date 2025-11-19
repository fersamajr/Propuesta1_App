import React, { useState } from 'react';
import api from '../api/api'; 
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Petición de Login
            const response = await api.post('/auth/login', { email, password });
            
            // Tu backend devuelve: { accessToken, refreshToken, user: { ... rol ... } }
            const { accessToken, user } = response.data;

            if (!accessToken) {
                setError('No se recibió token válido');
                return;
            }

            // 2. Guardar Token
            localStorage.setItem('token', accessToken);
            if (onLoginSuccess) onLoginSuccess(accessToken);

            // 3. 🔍 VERIFICACIÓN DE ROL DIRECTA
            // "El rol viene desde user" -> Usamos user.rol directamente de la respuesta
            console.log('Usuario logueado:', user);

            if (user && user.rol === 'Admin') {
                navigate('/admin'); // Panel de Administrador
            } else {
                navigate('/bienvenida'); // Panel de Cliente
            }

        } catch (err) {
            console.error(err);
            setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Barra superior */}
            <div style={{ width: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }} onClick={() => navigate('/contacto')}>Contactanos</button>
                <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8 }}>Logo</button>
                <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }} onClick={() => navigate('/')}>Inicio</button>
            </div>
            
            {/* Card central */}
            <div style={{ width: 350, background: '#fff', borderRadius: 16, border: '2px solid #d1d5db', padding: 32, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#f5f3ff', borderRadius: 8, marginBottom: 18, padding: '10px 0', width: '100%', textAlign: 'center', fontWeight: 500 }}>Hola de regreso :)</div>
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: 16, borderRadius: 8, background: '#e5e7eb', fontSize: 16, border: '1px solid #d1d5db' }} required />
                    
                    <label style={{ marginBottom: 4, display: 'block', fontWeight: 500 }}>Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: 20, borderRadius: 8, background: '#e5e7eb', fontSize: 16, border: '1px solid #d1d5db' }} required />
                    
                    <button type="submit" style={{ width: '100%', background: '#a78Bfa', color: '#222', padding: '12px', borderRadius: 8, fontWeight: 500, fontSize: 16, border: 'none', marginBottom: 12 }}>Ingresar</button>
                    
                    {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
                </form>
                <button style={{ width: '100%', background: '#c4b5fd', color: '#222', padding: '7px', borderRadius: 8, fontSize: 14, border: 'none' }}>Olvidé mi contraseña</button>
            </div>
        </div>
    );
}

export default Login;