import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

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

    // --- Estilos ---
    const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const topBtnStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };
    
    // Estilos del menú lateral
    const menuBtnStyle = (isActive) => ({
        width: '90%', margin: '8px auto', background: isActive ? '#c4b5fd' : '#f1f5f9', color: isActive ? '#333' : '#334155', padding: '10px', 
        borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal'
    });
    
    // Estilo para las tarjetas (Basado en la sugerencia anterior)
    const cardBaseStyle = {
        width: '100%',
        background: '#fff', 
        borderRadius: 16,
        padding: 30,
        marginBottom: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
    };

    const labelStyle = { 
        fontSize: 14, 
        fontWeight: '500', 
        color: '#6b7280', 
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };
    
    // Helper para dar color a los valores
    const getValueStyle = (isDanger) => ({
        fontSize: 32, 
        fontWeight: 'bold', 
        color: isDanger ? '#dc2626' : '#10b981'
    });

    return (
        <div style={PAGE_CONTAINER}>
            
            {/* Barra Superior */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>
                <Link to="/bienvenida" style={topBtnStyle}>Volver</Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoCafe} alt="Logo" style={logoImgStyle} />
                </div>
                <button style={{...topBtnStyle, background: '#ef4444'}} onClick={handleLogout}>Exit</button>
            </div>

            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between' }}>
                
                {/* Menú Lateral */}
                <div style={{ position: 'relative', width: 220, paddingRight: 20 }}>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#a78Bfa', color: '#fff', padding: 10, borderRadius: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}>≡</button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, width: 190, background: '#fff', borderRadius: 12, padding: '5px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10 }}>
                            <button style={menuBtnStyle(false)} onClick={() => navigate('/bienvenida')}>Inicio</button>
                            <button style={menuBtnStyle(false)} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                            <button style={menuBtnStyle(true)}>Pagos</button>
                        </div>
                    )}
                </div>

                {/* Área Central - Menu de Pagos */}
                <div style={{ flex: 1, maxWidth: 500, margin: '0 auto' }}>
                    <h2 style={{ color: '#1e293b', textAlign: 'center', marginBottom: 30, fontSize: 32 }}>💰 Resumen de Pagos</h2>

                    {loading ? <p style={{textAlign: 'center'}}>Cargando información financiera...</p> : (
                        <>
                            {/* 1. Cantidad por pagar */}
                            <div style={{...cardBaseStyle, borderLeft: '5px solid #dc2626'}}>
                                <span style={labelStyle}>Cantidad por pagar</span>
                                <span style={getValueStyle(true)}>
                                    ${(resumen?.saldoPorPagar || 0).toLocaleString('es-MX')} <span style={{fontSize: 20}}>MXN</span>
                                </span>
                            </div>

                            {/* 2. kg por pagar */}
                            <div style={{...cardBaseStyle, borderLeft: '5px solid #fb923c'}}>
                                <span style={labelStyle}>kg por pagar</span>
                                <span style={{...getValueStyle(false), color: '#fb923c'}}>
                                    {resumen?.kgPorPagar || 0} <span style={{fontSize: 20}}>Kg</span>
                                </span>
                            </div>

                            {/* 3. Ultimo pago */}
                            <div style={{...cardBaseStyle, borderLeft: '5px solid #10b981'}}>
                                <span style={labelStyle}>Último pago registrado</span>
                                <span style={{...getValueStyle(false), color: '#10b981', fontSize: 24}}>
                                    {resumen?.ultimoPago 
                                        ? `$${resumen.ultimoPago.cantidad.toLocaleString('es-MX')} `
                                        : 'Sin registros'}
                                </span>
                                {resumen?.ultimoPago && (
                                    <span style={{fontSize: 14, color: '#6b7280', marginTop: 5}}>
                                        el {new Date(resumen.ultimoPago.fecha).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
                
                {/* Espaciador derecho */}
                <div style={{ width: 220 }}></div>
            </div>
        </div>
    );
}

export default Pagos;