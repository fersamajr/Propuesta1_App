import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Pagos() {
    const navigate = useNavigate();
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const fetchPagos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                // Llamamos al nuevo endpoint de resumen
                const response = await api.get('/pagos/resumen', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResumen(response.data);
            } catch (error) {
                console.error("Error cargando pagos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPagos();
    }, [navigate]);

    // Estilos
    const topBtnStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border: 'none', cursor: 'pointer' };
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    
    // Estilo para las tarjetas grandes moradas
    const bigCardStyle = {
        width: '100%',
        height: 120,
        background: '#e9d5ff', // Lila suave
        borderRadius: 16,
        border: '2px solid #222',
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '2px 2px 0px #000'
    };

    const labelStyle = { fontSize: 16, fontWeight: '500', color: '#4b5563', marginBottom: 5 };
    const valueStyle = { fontSize: 28, fontWeight: 'bold', color: '#1f2937' };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Barra Superior */}
            <div style={{ width: 650, display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>
                <button style={topBtnStyle} onClick={() => navigate('/bienvenida')}>Regresar</button>
                <button style={{ ...topBtnStyle, background: '#7dd3fc', padding: '10px 55px' }}>Logo</button>
                <button style={topBtnStyle} onClick={handleLogout}>Exit</button>
            </div>

            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between' }}>
                
                {/* Menú Lateral (Igual a los otros) */}
                <div style={{ position: 'relative', width: 200 }}>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#a78Bfa', padding: 10, borderRadius: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}>≡</button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, width: 190, background: '#f3f4f6', borderRadius: 12, padding: '10px 0', boxShadow: '0 2px 12px #0001', zIndex: 10 }}>
                            <button style={menuBtnStyle} onClick={() => navigate('/bienvenida')}>Inicio</button>
                            <button style={menuBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                            <button style={{...menuBtnStyle, background: '#c4b5fd'}}>Pagos</button>
                        </div>
                    )}
                </div>

                {/* Área Central - Menu de Pagos */}
                <div style={{ flex: 1, maxWidth: 500, margin: '0 auto' }}>
                    <h2 style={{ fontFamily: 'cursive', textAlign: 'center', marginBottom: 30, fontSize: 32 }}>Menu de pagos</h2>

                    {loading ? <p style={{textAlign: 'center'}}>Cargando información financiera...</p> : (
                        <>
                            {/* 1. Cantidad por pagar */}
                            <div style={bigCardStyle}>
                                <span style={labelStyle}>Cantidad por pagar</span>
                                <span style={valueStyle}>
                                    ${resumen?.saldoPorPagar?.toLocaleString('es-MX')} MXN
                                </span>
                            </div>

                            {/* 2. kg por pagar */}
                            <div style={bigCardStyle}>
                                <span style={labelStyle}>kg por pagar</span>
                                <span style={valueStyle}>
                                    {resumen?.kgPorPagar} Kg
                                </span>
                            </div>

                            {/* 3. Ultimo pago */}
                            <div style={bigCardStyle}>
                                <span style={labelStyle}>Ultimo pago</span>
                                <span style={valueStyle}>
                                    {resumen?.ultimoPago 
                                        ? `$${resumen.ultimoPago.cantidad} - ${new Date(resumen.ultimoPago.fecha).toLocaleDateString()}`
                                        : 'Sin registros'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Espaciador derecho para centrar */}
                <div style={{ width: 200 }}></div>
            </div>
        </div>
    );
}

export default Pagos;