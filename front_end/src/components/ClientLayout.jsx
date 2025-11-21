import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const CONTAINER_STYLE = { 
    minHeight: '100vh', 
    background: '#1e293b', 
    color: '#fff', 
    padding: 20, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' 
};

const HEADER_WRAPPER_STYLE = { 
    width: '100%', 
    maxWidth: 1000, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
};

function ClientLayout({ title, children }) {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Cargar perfil una vez para el saludo en el header
        api.get('/profile/me', config)
            .then(res => setProfile(res.data))
            .catch(err => {
                console.error('Error cargando perfil', err);
                // Si la carga falla, podrías forzar el logout si es por token expirado.
            });
    }, [navigate]);

    const username = profile ? (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.username) : 'Cliente';
    const displayTitle = title || `Bienvenido, ${username}`;

    return (
        <div style={CONTAINER_STYLE}>
            
            {/* HEADER (Título, Soporte, Salir) */}
            <div style={HEADER_WRAPPER_STYLE}>
                <h1 style={{ color: '#a78Bfa', margin: 0, fontSize: 24 }}>{displayTitle}</h1>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    
                    {/* Botón de Dashboard, visible en todas las sub-páginas */}
                    {title && displayTitle.indexOf('Bienvenido') === -1 && (
                         <button 
                            onClick={() => navigate('/bienvenida')} 
                            style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Dashboard
                        </button>
                    )}

                    <Link to="/contacto" style={{ background: '#7dd3fc', color: '#222', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}>Soporte</Link>
                    <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Salir</button>
                </div>
            </div>

            {/* Contenido específico de la página */}
            {children}
            
        </div>
    );
}

export default ClientLayout;