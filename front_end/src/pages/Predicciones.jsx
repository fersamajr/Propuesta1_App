import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import logoCafe from '../assets/logo-cafe-tech.png';

function Predicciones() {
    const navigate = useNavigate();
    const [predicciones, setPredicciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const fetchPredicciones = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await api.get('/predicciones/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPredicciones(response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))); // Ordenar por fecha descendente
            } catch (error) {
                console.error("Error cargando predicciones", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredicciones();
    }, [navigate]);

    const prediccionesFiltradas = predicciones.filter(p => {
        if (!fechaInicio && !fechaFin) return true;
        const fechaPrediccion = new Date(p.fecha).getTime();
        const inicio = fechaInicio ? new Date(fechaInicio).getTime() : -Infinity;
        // Ajustar fin para incluir el día completo
        const fin = fechaFin ? new Date(fechaFin + 'T23:59:59').getTime() : Infinity;
        return fechaPrediccion >= inicio && fechaPrediccion <= fin;
    });

    // --- Estilos ---
    const PAGE_CONTAINER = { minHeight: '100vh', background: '#f8fafc', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const topBtnStyle = { background: '#a78Bfa', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' };
    const logoImgStyle = { maxHeight: 40, width: 'auto' };
    const menuBtnStyle = (isActive) => ({
        width: '90%', margin: '8px auto', background: isActive ? '#c4b5fd' : '#f1f5f9', color: isActive ? '#333' : '#334155', padding: '10px', 
        borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? 'bold' : 'normal'
    });
    const cardStyle = {
        width: '100%', maxWidth: 800, background: '#fff', borderRadius: 16, border: '1px solid #c4b5fd', padding: 32,
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'
    };
    
    // Estilos del filtro mejorados
    const filterContainerStyle = { 
        width: '100%', marginBottom: 20, display: 'flex', gap: 15, justifyContent: 'center', 
        background: '#f5f3ff', padding: 15, borderRadius: 12, border: '1px solid #e0e7ff'
    };
    const inputStyle = { padding: 8, borderRadius: 5, border: '1px solid #cbd5e1' };
    
    const itemStyle = {
        width: '100%', background: '#f8fafc', marginBottom: 12, padding: 18, borderRadius: 10, border: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s'
    };
    
    return (
        <div style={PAGE_CONTAINER}>
            
            {/* Barra Superior */}
            <div style={{ width: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
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
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/bienvenida')}>Inicio</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                             <button style={menuBtnStyle(false)} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={menuBtnStyle(true)}>Predicciones</button>
                        </div>
                    )}
                </div>

                {/* Contenido Central */}
                <div style={{ flex: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#1e293b', marginBottom: 20, fontSize: 32 }}>🔮 Predicciones de Consumo</h2>
                    
                    <div style={cardStyle}>
                        {/* Controles de Filtro */}
                        <div style={filterContainerStyle}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2, color: '#475569' }}>Desde:</label>
                                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2, color: '#475569' }}>Hasta:</label>
                                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={inputStyle} />
                            </div>
                            <button 
                                onClick={() => { setFechaInicio(''); setFechaFin(''); }} 
                                style={{ marginTop: 22, padding: '8px 15px', background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}
                            >
                                Limpiar
                            </button>
                        </div>

                        {/* Lista de Predicciones */}
                        {loading ? (
                            <p>Cargando predicciones...</p>
                        ) : prediccionesFiltradas.length === 0 ? (
                            <p>No se encontraron predicciones en este rango.</p>
                        ) : (
                            <div style={{ width: '100%', overflowY: 'auto', maxHeight: 400, marginTop: 10 }}>
                                {prediccionesFiltradas.map((pred) => (
                                    <div key={pred.id} style={itemStyle} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#78549b', fontSize: 18 }}>
                                                Fecha Sugerida: {new Date(pred.fecha).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: 14, color: '#475569', marginTop: 5 }}>
                                                Cantidad estimada: <strong style={{color: '#a78Bfa'}}>{pred.cantidad} Kg</strong>
                                            </div>
                                        </div>
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ width: 220 }}></div>
            </div>
        </div>
    );
}

export default Predicciones;