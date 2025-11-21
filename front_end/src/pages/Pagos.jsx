import React, { useState, useEffect } from 'react';
import api from '../api/api';
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}

export default Pagos;