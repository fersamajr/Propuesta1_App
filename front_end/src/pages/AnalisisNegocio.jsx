import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ClientLayout from '../components/ClientLayout';
import { useNavigate } from 'react-router-dom';

// ⬇️ IMPORTANTE: Restaurar la importación completa de Recharts para los gráficos
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';

function AnalisisNegocio() {
    // ❌ Eliminado: useState(profile), handleLogout
    
    // El state ahora contiene la estructura completa de datos analíticos
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Petición de datos analíticos
        api.get('/pedidos/analytics/me', config)
            .then(res => {
                // Pre-procesar los datos para las gráficas de Pastel (Pie)
                const pieData = res.data ? [ 
                    { name: 'Grano', value: res.data.resumenTotal.grano }, 
                    { name: 'Molido', value: res.data.resumenTotal.molido } 
                ] : [];

                setData({ ...res.data, pieData: pieData });
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching analysis data', err);
                setLoading(false);
            });
    }, []);

    // Colores para las gráficas
    const COLORS = ['#78549b', '#7dd3fc']; // Lila y Cyan

    // --- Estilos de Tarjeta (Consistente con el tema oscuro) ---
    const cardGraphStyle = { 
        width: '100%', 
        background: '#334155', // Fondo oscuro
        borderRadius: 16, 
        border: '1px solid #475569', // Borde sutil
        padding: 25, 
        marginBottom: 25, 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        color: '#fff' 
    };

    // --- Estilo Tabla (Adaptado al tema oscuro) ---
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 15, fontSize: 14, color: '#cbd5e1' };
    const thStyle = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #a78Bfa', color: '#a78Bfa', fontSize: 14 };
    const tdStyle = { padding: '10px', borderBottom: '1px solid #475569', color: '#cbd5e1' };


    return (
        <ClientLayout title="Análisis de Negocio">
            <div style={{ width: '100%', maxWidth: 950, margin: '0 auto' }}>
                
                {loading ? <p style={{textAlign: 'center'}}>Procesando datos...</p> : (
                    <>
                        <h2 style={{ color: '#cbd5e1', marginBottom: 30, textAlign: 'center' }}>Tu Desempeño y Consumo</h2>
                        
                        {/* 1. GRÁFICA DE PROYECCIÓN (Línea) */}
                        <div style={cardGraphStyle}>
                            <h3 style={{ textAlign: 'center', color: '#7dd3fc', marginBottom: 15, fontSize: 20 }}>🔮 Proyección Próximos 3 Meses (Kg)</h3>
                            <div style={{ height: 250 }}>
                                {/* Asumiendo que 'data.proyeccion' existe y tiene elementos */}
                                {data?.proyeccion?.length > 0 ? ( 
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.proyeccion}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> 
                                            <XAxis dataKey="mes" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                            <Line type="monotone" dataKey="estimado" stroke="#10b981" strokeWidth={3} name="Kg Estimados" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : <p style={{textAlign:'center', color:'#888', paddingTop: 80}}>No hay predicciones futuras suficientes.</p>}
                            </div>
                        </div>

                        {/* 2. TABLA COMPARATIVA */}
                        <div style={cardGraphStyle}>
                            <h3 style={{ textAlign: 'center', color: '#7dd3fc', marginBottom: 15, fontSize: 20 }}>📊 Comparativa Anual (Kg)</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Mes</th>
                                        <th style={thStyle}>2024 (Act)</th>
                                        <th style={thStyle}>2023 (Ant)</th>
                                        <th style={thStyle}>Cambio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Asumiendo que 'data.comparativa' existe */}
                                    {data?.comparativa?.length > 0 ? data.comparativa.map((row, i) => (
                                        <tr key={i}>
                                            <td style={{...tdStyle, fontWeight: 'bold'}}>{row.mes}</td>
                                            <td style={tdStyle}>{row.actual} Kg</td>
                                            <td style={tdStyle}>{row.anterior} Kg</td>
                                            <td style={{
                                                ...tdStyle, 
                                                color: parseFloat(row.cambio) >= 0 ? '#10b981' : '#ef4444', 
                                                fontWeight: 'bold'
                                            }}>
                                                {parseFloat(row.cambio) > 0 ? '+' : ''}{row.cambio}%
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="4" style={{textAlign:'center', padding: 20}}>Sin datos históricos suficientes</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        {/* 3. Historial Completo (Barras) */}
                        <div style={cardGraphStyle}>
                            <h4 style={{textAlign: 'center', fontSize: 20, color: '#7dd3fc', marginBottom: 15}}>Historial de Consumo (Kg)</h4>
                            <div style={{ height: 300 }}>
                                {/* Asumiendo que 'data.historialConsumo' existe */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.historialConsumo}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" />
                                        <XAxis dataKey="mes" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                        <Bar dataKey="kg" fill="#a78Bfa" radius={[4, 4, 0, 0]} name="Kg Consumidos" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 4. Preferencias (Pastel/Donut) */}
                        <div style={cardGraphStyle}>
                            <h4 style={{textAlign: 'center', fontSize: 20, color: '#7dd3fc', marginBottom: 15}}>Preferencias de Producto</h4>
                            <div style={{ height: 350, display: 'flex', justifyContent: 'center' }}>
                                {/* Usando los datos pre-procesados en el state */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={data?.pieData} 
                                            cx="50%" 
                                            cy="45%" 
                                            innerRadius={70} 
                                            outerRadius={110} 
                                            paddingAngle={3}
                                            dataKey="value"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {/* Usar los colores definidos */}
                                            {data?.pieData?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)} 
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ClientLayout>
    );
}

export default AnalisisNegocio;