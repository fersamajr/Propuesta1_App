import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import logoCafe from '../assets/logo-cafe-tech.png';

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
    const COLORS = ['#78549b', '#7dd3fc'];

    // --- Estilos ---
    const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const topBtnStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };
    
    const menuBtnStyle = (isActive) => ({
        width: '90%', margin: '8px auto', background: isActive ? '#c4b5fd' : '#f1f5f9', color: isActive ? '#333' : '#334155', padding: '10px', 
        borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal'
    });
    
    // Estilo de tarjeta/gráfica limpia
    const cardGraphStyle = { 
        width: '100%', 
        background: '#fff', 
        borderRadius: 16, 
        border: '1px solid #e2e8f0', 
        padding: 25, 
        marginBottom: 25, 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' 
    };
    
    // Estilo Tabla
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 15 };
    const thStyle = { textAlign: 'left', padding: '10px', borderBottom: '2px solid #a78Bfa', color: '#1e293b', fontSize: 14 };
    const tdStyle = { padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#333', fontSize: 14 };

    return (
        <div style={PAGE_CONTAINER}>
            
            {/* Barra Superior */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 }}>
                <Link to="/bienvenida" style={topBtnStyle}>Regresar</Link>
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
                             <button style={menuBtnStyle(true)}>Análisis de Negocio</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/solicitud-pedido')}>Solicitudes</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pedidos-anteriores')}>Historial</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/predicciones')}>Predicciones</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/inventario')}>Inventario</button>
                        </div>
                    )}
                </div>

                {/* Contenido Central */}
                <div style={{ flex: 1, margin: '0 20px', maxWidth: 650 }}>
                    <h2 style={{ color: '#1e293b', marginBottom: 20, fontSize: 32, textAlign: 'center' }}>📈 Mi Rendimiento</h2>
                    
                    {loading ? <p style={{textAlign: 'center'}}>Procesando datos...</p> : (
                        <>
                            {/* 1. GRÁFICA DE PROYECCIÓN */}
                            <div style={cardGraphStyle}>
                                <h3 style={{ textAlign: 'center', color: '#78549b', marginBottom: 15, fontSize: 20 }}>🔮 Proyección Próximos 3 Meses (Kg)</h3>
                                <div style={{ height: 250 }}>
                                    {data.proyeccion.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.proyeccion}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="mes" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="estimado" stroke="#a78Bfa" strokeWidth={3} name="Kg Estimados" activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : <p style={{textAlign:'center', color:'#888', paddingTop: 80}}>No hay predicciones futuras suficientes.</p>}
                                </div>
                            </div>

                            {/* 2. TABLA COMPARATIVA */}
                            <div style={cardGraphStyle}>
                                <h3 style={{ textAlign: 'center', color: '#555', marginBottom: 15, fontSize: 20 }}>📊 Comparativa Anual (Kg)</h3>
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
                                                <td style={tdStyle}>{row.actual} Kg</td>
                                                <td style={tdStyle}>{row.anterior} Kg</td>
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

                            {/* 3. Historial Completo (Barras) */}
                            <div style={cardGraphStyle}>
                                <h4 style={{textAlign: 'center', fontSize: 20, color: '#555', marginBottom: 15}}>Historial de Consumo (Kg)</h4>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.historialConsumo}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="kg" fill="#a78Bfa" radius={[4, 4, 0, 0]} name="Kg Consumidos" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 4. Preferencias (Pastel/Donut) */}
                            <div style={cardGraphStyle}>
                                <h4 style={{textAlign: 'center', fontSize: 20, color: '#555', marginBottom: 15}}>Preferencias de Producto</h4>
                                <div style={{ height: 350, display: 'flex', justifyContent: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={pieData} 
                                                cx="50%" 
                                                cy="45%" 
                                                innerRadius={70} 
                                                outerRadius={110} 
                                                paddingAngle={3}
                                                dataKey="value"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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