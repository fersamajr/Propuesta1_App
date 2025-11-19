import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Predicciones() {
    const navigate = useNavigate();
    const [predicciones, setPredicciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    // Estados para el filtro de fecha
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
                // Llamada al endpoint que ya protegiste
                const response = await api.get('/predicciones/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPredicciones(response.data);
            } catch (error) {
                console.error("Error cargando predicciones", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredicciones();
    }, [navigate]);

    // Lógica de filtrado
    const prediccionesFiltradas = predicciones.filter(p => {
        if (!fechaInicio && !fechaFin) return true; // Si no hay filtro, mostrar todo
        const fechaPrediccion = new Date(p.fecha).getTime();
        const inicio = fechaInicio ? new Date(fechaInicio).getTime() : -Infinity;
        const fin = fechaFin ? new Date(fechaFin).getTime() : Infinity;
        return fechaPrediccion >= inicio && fechaPrediccion <= fin;
    });

    // Estilos (Reutilizables)
    const topBtnStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border: 'none', cursor: 'pointer' };
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    const cardStyle = {
        width: '100%', maxWidth: 800, background: '#f5f3ff', borderRadius: 16, border: '2px solid #d1d5db', padding: 32,
        boxShadow: '0 2px 12px #0001', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'
    };
    const itemStyle = {
        width: '100%', background: '#fff', marginBottom: 10, padding: 15, borderRadius: 8, border: '1px solid #e5e7eb',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
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
                             <button style={menuBtnStyle} onClick={() => navigate('/bienvenida')}>Inicio</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={{...menuBtnStyle, background: '#c4b5fd'}}>Predicciones</button>
                        </div>
                    )}
                </div>

                {/* Contenido Central */}
                <div style={{ flex: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'cursive', marginBottom: 20, fontSize: 32 }}>Predicciones</h2>
                    
                    <div style={cardStyle}>
                        {/* Controles de Filtro */}
                        <div style={{ width: '100%', marginBottom: 20, display: 'flex', gap: 10, justifyContent: 'center', background: '#e9d5ff', padding: 10, borderRadius: 8 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>Desde:</label>
                                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ padding: 5, borderRadius: 5, border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>Hasta:</label>
                                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ padding: 5, borderRadius: 5, border: '1px solid #ccc' }} />
                            </div>
                            <button 
                                onClick={() => { setFechaInicio(''); setFechaFin(''); }} 
                                style={{ marginTop: 18, padding: '5px 10px', background: '#fff', border: '1px solid #ccc', borderRadius: 5, cursor: 'pointer' }}
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
                            <div style={{ width: '100%', overflowY: 'auto', maxHeight: 400 }}>
                                {prediccionesFiltradas.map((pred) => (
                                    <div key={pred.id} style={itemStyle}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#4b5563' }}>
                                                Fecha Sugerida: {new Date(pred.fecha).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: 14, color: '#6b7280' }}>
                                                Cantidad estimada: <strong>{pred.cantidad} Kg</strong>
                                            </div>
                                        </div>
                                        {pred.asociadaAPedido && (
                                            <span style={{ background: '#bbf7d0', color: '#166534', padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 'bold' }}>
                                                Pedido Realizado
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Predicciones;