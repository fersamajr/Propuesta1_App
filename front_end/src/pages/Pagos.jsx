import React, { useState, useEffect } from 'react';
import api from '../api/api';
<<<<<<< HEAD
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout
import { useNavigate } from 'react-router-dom'; // Necesario para navegar si el token falla o si se agrega funcionalidad

function Pagos() {
    const [pagos, setPagos] = useState([]);
    const [resumen, setResumen] = useState(null); // Usaremos un resumen del saldo
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Necesario para la navegación interna si se agrega

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Cargar Resumen (saldo) y listado de Pagos.
        Promise.all([
            api.get('/pagos/resumen', config),
            api.get('/pagos/me', config) // Suponemos que tienes un endpoint para historial de pagos del cliente
        ])
        .then(([resumenRes, pagosRes]) => {
            setResumen(resumenRes.data);
            // Asumiendo que los pagos vienen con el campo 'fecha'
            const sortedPagos = pagosRes.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setPagos(sortedPagos);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching pagos/resumen', err);
            setLoading(false);
            // No hacemos navigate aquí, dejamos que ClientLayout maneje el error de auth.
        });
    }, []);
    
    // Calcular Saldo para la tarjeta principal
    const saldoPorPagar = resumen?.saldoPorPagar || 0;
    const kgPorPagar = resumen?.kgPorPagar || 0;

    // --- Estilos Adaptados al Tema Oscuro ---
    const containerStyle = {
        width: '100%',
        maxWidth: 1000,
        padding: 30,
        background: '#334155', // Fondo de tarjeta oscuro
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: '#fff',
    };
    
    // Tarjeta de Saldo Principal
    const saldoCardStyle = {
        padding: 25,
        marginBottom: 30,
        borderRadius: 16,
        background: saldoPorPagar > 0 ? '#dc2626' : '#10b981', // Rojo para deuda, verde para saldo cero
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    };
    
    // Tabla
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 20,
        fontSize: 14
    };
    
    const thStyle = {
        borderBottom: '2px solid #a78Bfa',
        padding: '12px 10px',
        textAlign: 'left',
        color: '#a78Bfa',
        background: '#475569' 
    };

    const tdStyle = {
        borderBottom: '1px solid #475569',
        padding: '10px',
        color: '#cbd5e1',
        verticalAlign: 'middle',
    };

    return (
        <ClientLayout title="Pagos y Saldo">
            <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
                <div style={containerStyle}>
                    <h3 style={{ color: '#7dd3fc', borderBottom: '1px solid #475569', paddingBottom: 10, margin: '0 0 20px 0' }}>
                        Resumen Financiero
                    </h3>
                    
                    {loading ? <p style={{textAlign: 'center'}}>Cargando información financiera...</p> : (
                        <>
                            {/* Tarjeta de Saldo Principal */}
                            <div style={saldoCardStyle}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {saldoPorPagar > 0 ? 'SALDO PENDIENTE' : 'SALDO AL DÍA'}
                                    </p>
                                    <h2 style={{ margin: '5px 0 0 0', fontSize: 40, color: '#fff' }}>
                                        ${saldoPorPagar.toLocaleString('es-MX')} <span style={{fontSize: 20}}>MXN</span>
                                    </h2>
                                </div>
                                
                                <div style={{textAlign: 'right'}}>
                                     <p style={{ margin: 0, fontSize: 12, fontWeight: 'bold' }}>
                                        Kg Pendientes
                                    </p>
                                    <p style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
                                        {kgPorPagar} Kg
                                    </p>
                                </div>
                            </div>
                            
                            {/* Botón de pago rápido (si hay deuda) */}
                            {saldoPorPagar > 0 && (
                                <div style={{textAlign: 'center', marginBottom: 30}}>
                                     <button 
                                        onClick={() => alert('Función de pago simulada.')} 
                                        style={{ padding: '12px 25px', background: '#fff', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
                                    >
                                        Pagar ${saldoPorPagar.toLocaleString('es-MX')} Ahora
                                    </button>
                                </div>
                            )}

                            <h4 style={{ color: '#cbd5e1', borderBottom: '1px solid #475569', paddingBottom: 10, margin: '30px 0 20px 0' }}>
                                Historial de Pagos
                            </h4>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Fecha</th>
                                            <th style={thStyle}>Monto Pagado</th>
                                            <th style={thStyle}>ID Transacción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagos.length > 0 ? pagos.map((p, index) => (
                                            <tr key={p.id || index}>
                                                <td style={tdStyle}>
                                                    {new Date(p.fecha).toLocaleDateString()}
                                                </td>
                                                <td style={{...tdStyle, color: '#10b981', fontWeight: 'bold'}}>
                                                    +${(p.cantidad || p.monto || 0).toLocaleString('es-MX')}
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{color: '#94a3b8', fontSize: 12}}>...{(p.id || p.transaccionId || 'N/A').slice(-8)}</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" style={{...tdStyle, textAlign: 'center'}}>No hay pagos registrados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
=======
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
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
                            </div>
                        </>
                    )}
                </div>
<<<<<<< HEAD
            </div>
        </ClientLayout>
=======
                
                {/* Espaciador derecho */}
                <div style={{ width: 220 }}></div>
            </div>
        </div>
>>>>>>> 28a3158b7b7b91bf1d58993e34678f55fa3e99ec
    );
}

export default Pagos;