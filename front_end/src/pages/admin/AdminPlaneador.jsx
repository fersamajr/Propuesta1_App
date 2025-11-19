import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function AdminPlaneador() {
    // --- ESTADOS ---
    const [viewData, setViewData] = useState({ totalKg: 0, detalle: [], dailyAvg: 0, daysCount: 0 });
    const [chartData, setChartData] = useState([]);
    const [allPredictions, setAllPredictions] = useState([]); 
    
    // Filtros
    const [fechas, setFechas] = useState({ inicio: '', fin: '' });
    
    // Inventario (Automático)
    const [inventario, setInventario] = useState(0); 
    
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    // Carga inicial de TODOS los datos necesarios
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Ejecutamos ambas peticiones en paralelo para mayor velocidad
            const [planningRes, invRes] = await Promise.all([
                api.get('/predicciones/planeador-inventario', config), // Demanda
                api.get('/inventario/me', config)                      // Tu Stock
            ]);
            
            // 1. Configurar Inventario
            if (invRes.data) {
                setInventario(invRes.data.cantidad || 0);
            }

            // 2. Configurar Predicciones
            setAllPredictions(planningRes.data.detalle);
            procesarDatos(planningRes.data.detalle);

        } catch (error) {
            console.error("Error cargando datos del planeador", error);
        } finally {
            setLoading(false);
        }
    };

    // Procesamiento matemático (Reutilizable para el filtro)
    const procesarDatos = (listaPredicciones) => {
        const totalKg = listaPredicciones.reduce((acc, curr) => acc + curr.cantidad, 0);

        // Agrupar para gráfica
        const grouped = {};
        listaPredicciones.forEach(p => {
            const fechaKey = new Date(p.fecha).toISOString().split('T')[0];
            const label = new Date(p.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
            if (!grouped[label]) grouped[label] = 0;
            grouped[label] += p.cantidad;
        });

        const activeDays = Object.keys(grouped).length || 1;
        const dailyAvg = activeDays > 0 ? (totalKg / activeDays).toFixed(1) : 0;

        const chart = Object.keys(grouped).map(key => ({
            fecha: key,
            kg: grouped[key]
        }));

        setViewData({ totalKg, detalle: listaPredicciones, dailyAvg, daysCount: activeDays });
        setChartData(chart);
    };

    // --- CÁLCULO DEL REQUERIMIENTO NETO ---
    // A Pedir = Demanda Filtrada - Inventario Real
    const diferencia = viewData.totalKg - inventario;
    const esDeficit = diferencia > 0; // True si falta, False si sobra
    const aPedir = esDeficit ? diferencia : 0; 
    const sobrante = !esDeficit ? Math.abs(diferencia) : 0;

    // Manejo de filtros de fecha
    const handleFilter = () => {
        if (!fechas.inicio && !fechas.fin) {
            procesarDatos(allPredictions);
            return;
        }
        const filtrados = allPredictions.filter(p => {
            const fechaP = new Date(p.fecha).toISOString().split('T')[0];
            const inicioValido = fechas.inicio ? fechaP >= fechas.inicio : true;
            const finValido = fechas.fin ? fechaP <= fechas.fin : true;
            return inicioValido && finValido;
        });
        procesarDatos(filtrados);
    };

    const clearFilter = () => {
        setFechas({ inicio: '', fin: '' });
        procesarDatos(allPredictions);
    };

    // --- ESTILOS ---
    const containerStyle = { minHeight: '100vh', background: '#f8fafc', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const statsContainerStyle = { display: 'flex', gap: '20px', flexWrap: 'wrap', width: '100%', maxWidth: 1000, marginBottom: 30, justifyContent: 'center' };
    
    const cardBase = { background: '#fff', padding: 25, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #e2e8f0', flex: '1 1 200px', minWidth: 220 };
    
    // Tarjeta Dinámica (Roja/Verde)
    const actionCardStyle = {
        ...cardBase,
        background: esDeficit ? '#fff1f2' : '#f0fdf4',
        borderColor: esDeficit ? '#fecdd3' : '#bbf7d0',
        borderWidth: 2,
        position: 'relative',
        overflow: 'hidden'
    };

    const filterContainerStyle = { background: '#fff', padding: '15px 25px', borderRadius: 12, marginBottom: 30, display: 'flex', gap: 20, alignItems: 'end', border: '1px solid #cbd5e1', flexWrap: 'wrap', justifyContent: 'center' };
    const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: 5 };
    const labelStyle = { fontSize: 13, color: '#64748b', fontWeight: '600' };
    const inputStyle = { padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 };

    return (
        <div style={containerStyle}>
            <div style={{width: '100%', maxWidth: 1100}}>
                <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver al Panel</button>
                
                <h2 style={{ color: '#1e293b', textAlign: 'center', marginBottom: 10 }}>Planeador de Abastecimiento</h2>
                
                {/* --- BARRA DE FILTROS --- */}
                <div style={filterContainerStyle}>
                    {/* INFO DE INVENTARIO (Solo lectura) */}
                    <div style={{display:'flex', alignItems:'center', gap: 10, background: '#eff6ff', padding: '5px 15px', borderRadius: 8, border: '1px solid #bfdbfe', height: 38}}>
                        <span style={{fontSize: 20}}>📦</span>
                        <div>
                            <div style={{fontSize: 10, color: '#3b82f6', fontWeight: 'bold', textTransform:'uppercase'}}>Tu Stock Actual</div>
                            <div style={{fontSize: 16, fontWeight: 'bold', color: '#1e3a8a'}}>{inventario} Kg</div>
                        </div>
                    </div>

                    <div style={{width: 1, height: 40, background: '#e2e8f0', margin: '0 5px'}}></div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Desde</label>
                        <input type="date" value={fechas.inicio} onChange={(e) => setFechas({...fechas, inicio: e.target.value})} style={inputStyle}/>
                    </div>
                    
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Hasta</label>
                        <input type="date" value={fechas.fin} onChange={(e) => setFechas({...fechas, fin: e.target.value})} style={inputStyle}/>
                    </div>

                    <div style={{display: 'flex', gap: 10, paddingBottom: 2}}>
                        <button onClick={handleFilter} style={{background: '#7c3aed', color:'white', border:'none', padding:'9px 20px', borderRadius:6, cursor:'pointer', fontWeight: 'bold'}}>
                            Aplicar
                        </button>
                        {(fechas.inicio || fechas.fin) && (
                            <button onClick={clearFilter} style={{background: 'transparent', color:'#64748b', border:'1px solid #cbd5e1', padding:'9px 15px', borderRadius:6, cursor:'pointer'}}>
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {loading ? <p style={{textAlign:'center'}}>Analizando inventario y demanda...</p> : (
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        
                        {/* --- KPIs PRINCIPALES --- */}
                        <div style={statsContainerStyle}>
                            
                            {/* 1. DEMANDA */}
                            <div style={cardBase}>
                                <h3 style={{margin:0, color:'#64748b', fontSize:12, textTransform:'uppercase'}}>Demanda Proyectada</h3>
                                <div style={{fontSize: 42, fontWeight:'bold', color: '#475569', margin:'5px 0'}}>
                                    {viewData.totalKg} <span style={{fontSize:16}}>Kg</span>
                                </div>
                                <div style={{fontSize:12, color:'#94a3b8'}}>En el periodo seleccionado</div>
                            </div>

                            {/* 2. BALANCE NETO */}
                            <div style={actionCardStyle}>
                                <h3 style={{margin:0, color: esDeficit ? '#be123c' : '#15803d', fontSize:13, textTransform:'uppercase', fontWeight:'bold'}}>
                                    {esDeficit ? '🚨 FALTANTE (A PRODUCIR)' : '✅ COBERTURA TOTAL'}
                                </h3>
                                <div style={{fontSize: 48, fontWeight:'bold', color: esDeficit ? '#e11d48' : '#16a34a', margin:'5px 0'}}>
                                    {esDeficit ? aPedir : `+${sobrante}`} <span style={{fontSize:18}}>Kg</span>
                                </div>
                                <div style={{fontSize: 12, color: esDeficit ? '#be123c' : '#15803d', fontWeight: 'bold'}}>
                                    {esDeficit 
                                        ? `Tu stock (${inventario} Kg) no es suficiente.` 
                                        : `Tu stock (${inventario} Kg) cubre la demanda.`}
                                </div>
                            </div>

                        </div>

                        {/* GRÁFICA */}
                        <div style={{ ...cardBase, width: '100%', maxWidth: 1000, padding: 20, marginBottom: 30, textAlign: 'left' }}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
                                <h3 style={{color:'#334155', margin:0}}>Flujo de Demanda</h3>
                                <div style={{fontSize: 12, color:'#64748b'}}>Línea roja = Tu Límite de Stock ({inventario} Kg)</div>
                            </div>
                            
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="fecha" />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip />
                                        
                                        {/* Área de Demanda */}
                                        <Area type="monotone" dataKey="kg" stroke="#7c3aed" fillOpacity={1} fill="url(#colorKg)" name="Demanda" />
                                        
                                        {/* LÍNEA DE REFERENCIA VISUAL DE TU INVENTARIO */}
                                        {/* (Opcional: muestra visualmente si la demanda supera tu stock en un día específico) */}
                                        {/* <ReferenceLine y={inventario} label="Mi Stock" stroke="red" strokeDasharray="3 3" /> */}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* TABLA DETALLE */}
                        <div style={{width: '100%', maxWidth: 1000}}>
                             <h4 style={{color: '#475569'}}>Detalle de Proyección</h4>
                             {viewData.detalle.length > 0 ? (
                                <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                                    <thead style={{background: '#f8fafc'}}>
                                        <tr>
                                            <th style={{padding:12, textAlign:'left', color:'#475569'}}>Fecha</th>
                                            <th style={{padding:12, textAlign:'left', color:'#475569'}}>Cliente</th>
                                            <th style={{padding:12, textAlign:'right', color:'#475569'}}>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewData.detalle.map(p => (
                                            <tr key={p.id} style={{borderBottom: '1px solid #e2e8f0'}}>
                                                <td style={{padding:12}}>{new Date(p.fecha).toLocaleDateString()}</td>
                                                <td style={{padding:12}}>
                                                    <strong>{p.usuario?.username}</strong>
                                                    <span style={{fontSize:11, color:'#64748b', marginLeft:5}}>({p.usuario?.perfil?.restaurant})</span>
                                                </td>
                                                <td style={{padding:12, textAlign:'right', fontWeight:'bold', color:'#7c3aed'}}>
                                                    {p.cantidad} Kg
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             ) : (
                                <p style={{textAlign:'center', color:'#94a3b8'}}>No hay datos para el rango seleccionado.</p>
                             )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPlaneador;