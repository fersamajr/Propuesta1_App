import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
// ⬇️ IMPORTANTE: Agregar LineChart, Line y CartesianGrid
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';

function AnalisisNegocio() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            try {
                const response = await api.get('/pedidos/analytics/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error("Error analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // Colores y datos auxiliares
    const pieData = data ? [ { name: 'Grano', value: data.resumenTotal.grano }, { name: 'Molido', value: data.resumenTotal.molido } ] : [];
    const COLORS = ['#a78Bfa', '#7dd3fc'];

    // Estilos
    const topBtnStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border: 'none', cursor: 'pointer' };
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    const cardGraphStyle = { width: '100%', background: '#fff', borderRadius: 16, border: '2px solid #e5e7eb', padding: 20, marginBottom: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
    
    // Estilo Tabla
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 10 };
    const thStyle = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #e5e7eb', color: '#6b7280' };
    const tdStyle = { padding: '10px', borderBottom: '1px solid #f3f4f6' };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Barra Superior */}
            <div style={{ width: 650, display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>
                <button style={topBtnStyle} onClick={() => navigate('/bienvenida')}>Soporte</button>
                <button style={{ ...topBtnStyle, background: '#7dd3fc', padding: '10px 55px' }}>Logo</button>
                <button style={topBtnStyle} onClick={handleLogout}>Exit</button>
            </div>

            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between' }}>
                
                {/* Menú Lateral */}
                <div style={{ position: 'relative', width: 200 }}>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#a78Bfa', padding: 10, borderRadius: 8, width: 48, fontSize: 18, border: 'none', cursor: 'pointer' }}>≡</button>
                    {menuOpen && (
                        <div style={{ position: 'absolute', top: 45, width: 190, background: '#f3f4f6', borderRadius: 12, padding: '10px 0', boxShadow: '0 2px 12px #0001', zIndex: 10 }}>
                             <button style={{...menuBtnStyle, background: '#c4b5fd'}}>Análisis de Negocio</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/solicitud-pedido')}>Solicitudes</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Historial</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/predicciones')}>Predicciones</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/inventario')}>Inventario</button>
                        </div>
                    )}
                </div>

                {/* Contenido Central */}
                <div style={{ flex: 1, margin: '0 20px', maxWidth: 600 }}>
                    <h2 style={{ fontFamily: 'cursive', marginBottom: 20, fontSize: 32, textAlign: 'center' }}>Análisis de Negocio</h2>
                    
                    {loading ? <p style={{textAlign: 'center'}}>Procesando datos...</p> : (
                        <>
                            {/* 1. GRÁFICA DE PROYECCIÓN (NUEVO) */}
                            <div style={cardGraphStyle}>
                                <h3 style={{ textAlign: 'center', color: '#78549b', marginBottom: 10 }}>🔮 Proyección Próximos 3 Meses</h3>
                                <div style={{ height: 200 }}>
                                    {data.proyeccion.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.proyeccion}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="mes" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="estimado" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : <p style={{textAlign:'center', color:'#888', paddingTop: 80}}>No hay predicciones futuras suficientes.</p>}
                                </div>
                            </div>

                            {/* 2. TABLA COMPARATIVA (NUEVO) */}
                            <div style={cardGraphStyle}>
                                <h3 style={{ textAlign: 'center', color: '#555', marginBottom: 10 }}>📊 Comparativa Anual (Kg)</h3>
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
                                        {data.comparativa.length > 0 ? data.comparativa.map((row, i) => (
                                            <tr key={i}>
                                                <td style={{...tdStyle, fontWeight: 'bold'}}>{row.mes}</td>
                                                <td style={tdStyle}>{row.actual}</td>
                                                <td style={tdStyle}>{row.anterior}</td>
                                                <td style={{
                                                    ...tdStyle, 
                                                    color: parseFloat(row.cambio) >= 0 ? '#166534' : '#991b1b',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {parseFloat(row.cambio) > 0 ? '+' : ''}{row.cambio}%
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan="4" style={{textAlign:'center', padding: 20}}>Sin datos históricos suficientes</td></tr>}
                                    </tbody>
                                </table>
                            </div>

{/* 3. Gráficas Detalladas (Corregido para mejor visibilidad) */}
                            
                            {/* Historial Completo */}
                            <div style={cardGraphStyle}>
                                <h4 style={{textAlign: 'center', fontSize: 18, color: '#555', marginBottom: 15}}>Historial de Consumo</h4>
                                <div style={{ height: 300 }}> {/* ⬅️ Aumentamos altura a 300px */}
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.historialConsumo}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="kg" fill="#a78Bfa" radius={[4, 4, 0, 0]} name="Kg Consumidos" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Preferencias (Pastel) */}
                            <div style={cardGraphStyle}>
                                <h4 style={{textAlign: 'center', fontSize: 18, color: '#555', marginBottom: 15}}>Preferencias de Producto</h4>
                                <div style={{ height: 300 }}> {/* ⬅️ Aumentamos altura a 300px */}
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={pieData} 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={80} // Radio interno más grande para estilo "Donut"
                                                outerRadius={110} 
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div style={{ width: 150 }}></div>
            </div>
        </div>
    );
}

export default AnalisisNegocio;