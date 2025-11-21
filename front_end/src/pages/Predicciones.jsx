import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout'; // 🆕 Importar Layout
import { useNavigate } from 'react-router-dom';

function Predicciones() {
    const navigate = useNavigate();
    const [predicciones, setPredicciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el filtro de fecha
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        const fetchPredicciones = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await api.get('/predicciones/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Ordenar por fecha descendente
                setPredicciones(response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))); 
            } catch (error) {
                console.error("Error cargando predicciones", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredicciones();
    }, [navigate]);

    // Lógica de filtrado (se mantiene)
    const prediccionesFiltradas = predicciones.filter(p => {
        if (!fechaInicio && !fechaFin) return true;
        const fechaPrediccion = new Date(p.fecha).getTime();
        const inicio = fechaInicio ? new Date(fechaInicio).getTime() : -Infinity;
        // Ajustar fin para incluir el día completo
        const fin = fechaFin ? new Date(fechaFin + 'T23:59:59').getTime() : Infinity;
        return fechaPrediccion >= inicio && fechaPrediccion <= fin;
    });

    // --- Estilos Adaptados al Tema Oscuro ---
    const containerStyle = {
        width: '100%',
        maxWidth: 800,
        padding: 30,
        background: '#334155', // Fondo de tarjeta oscuro
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: '#fff',
    };
    
    // Estilos del filtro mejorados (Dark Theme)
    const filterContainerStyle = { 
        width: '100%', 
        marginBottom: 25, 
        display: 'flex', 
        gap: 15, 
        justifyContent: 'center', 
        background: '#1e293b', // Fondo más oscuro para el filtro
        padding: 15, 
        borderRadius: 12, 
        border: '1px solid #475569'
    };
    
    const inputStyle = { 
        padding: 8, 
        borderRadius: 5, 
        border: '1px solid #475569',
        background: '#334155',
        color: '#fff'
    };
    
    // Estilo para cada item de predicción (como tarjeta)
    const itemStyle = {
        width: '100%', 
        background: '#1e293b', 
        marginBottom: 12, 
        padding: 18, 
        borderRadius: 10, 
        borderLeft: '4px solid #c084fc', // Borde lila para resaltar
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        transition: 'box-shadow 0.2s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };
    
    const labelStyle = { fontSize: 12, fontWeight: 'bold', marginBottom: 2, color: '#94a3b8' };
    
    const clearButtonStyle = { 
        marginTop: 22, 
        padding: '8px 15px', 
        background: '#475569', 
        border: '1px solid #64748b', 
        borderRadius: 6, 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        color: '#cbd5e1' 
    };

    return (
        <ClientLayout title="Predicciones de Demanda">
            <div style={containerStyle}>
                <h3 style={{ color: '#a78Bfa', borderBottom: '1px solid #475569', paddingBottom: 10, margin: '0 0 20px 0' }}>
                    Tus Predicciones de Consumo Futuro
                </h3>
                
                {/* Controles de Filtro */}
                <div style={filterContainerStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>Desde:</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>Hasta:</label>
                        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={inputStyle} />
                    </div>
                    <button 
                        onClick={() => { setFechaInicio(''); setFechaFin(''); }} 
                        style={clearButtonStyle}
                    >
                        Limpiar
                    </button>
                </div>

                {/* Lista de Predicciones */}
                {loading ? (
                    <p style={{textAlign: 'center'}}>Cargando predicciones...</p>
                ) : prediccionesFiltradas.length === 0 ? (
                    <p style={{textAlign: 'center'}}>No se encontraron predicciones en este rango.</p>
                ) : (
                    <div style={{ width: '100%', overflowY: 'auto', maxHeight: 500, marginTop: 10 }}>
                        {prediccionesFiltradas.map((pred) => (
                            <div key={pred.id} style={itemStyle} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(192, 132, 252, 0.3)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#c084fc', fontSize: 18 }}>
                                        Fecha Sugerida: {new Date(pred.fecha).toLocaleDateString()}
                                    </div>
                                    <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 5 }}>
                                        Cantidad estimada: <strong style={{color: '#7dd3fc'}}>{pred.cantidad} Kg</strong>
                                    </div>
                                </div>
                                
                                <div style={{textAlign: 'right'}}>
                                    {pred.asociadaAPedido && (
                                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold' }}>
                                            ✅ Pedido Realizado
                                        </span>
                                    )}
                                    {!pred.asociadaAPedido && (
                                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold' }}>
                                            ⏳ Pendiente de Pedido
                                        </span>
                                    )}
                                    <div style={{fontSize: 11, color: '#94a3b8', marginTop: 5}}>
                                        ID Predicción: {pred.id.slice(-5)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}

export default Predicciones;