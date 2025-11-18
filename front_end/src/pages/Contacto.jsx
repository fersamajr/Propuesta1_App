import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contacto() {
    const [enviado, setEnviado] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);

        // Aquí podrías agregar la llamada API si tu endpoint está disponible

        setTimeout(() => {
        navigate('/');
        }, 2000); // Redirige después de 2 segundos
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Barra superior */}
        <div style={{
            width: 550, display: 'flex', justifyContent: 'space-between', marginBottom: 40, marginTop: 20
        }}>
            <button
            style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}
            onClick={() => navigate('/')}
            >
            Inicio
            </button>
            <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8 }}>
            Logo
            </button>
            <button
            style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}
            onClick={() => navigate('/login')}
            >
            Iniciar sesión
            </button>
        </div>

        {/* Contenido central */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
            <h2>Contáctanos</h2>
            {enviado ? (
            <div style={{ background: '#a78Bfa', color: '#fff', padding: 20, borderRadius: 10 }}>
                ¡Tu mensaje ha sido enviado! Serás redireccionado a la página principal.
            </div>
            ) : (
            <form onSubmit={handleSubmit} style={{ width: 350, background: '#f5f3ff', padding: 20, borderRadius: 10 }}>
                <div>
                <label>Nombre:</label>
                <input type="text" style={{ width: '100%', marginBottom: 10, background: '#e0e7ff' }} required />
                </div>
                <div>
                <label>Email o Teléfono:</label>
                <input type="text" style={{ width: '100%', marginBottom: 10, background: '#e0e7ff' }} required />
                </div>
                <div>
                <label>Por qué nos contactas?</label>
                <input type="text" style={{ width: '100%', marginBottom: 10, background: '#e0e7ff' }} required />
                </div>
                <button type="submit" style={{
                background: '#a78Bfa', color: '#fff', width: '100%', padding: 10, borderRadius: 8
                }}>
                Enviar
                </button>
            </form>
            )}
        </div>
        </div>
    );
}

export default Contacto;
