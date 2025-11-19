import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { 
    Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, ComposedChart, Line, Legend, ReferenceLine, BarChart
} from 'recharts';

function AdminDesviaciones() {
    // 1. ESTADOS NUEVOS PARA EL FILTRO
    const [allData, setAllData] = useState([]);        // Todos los datos crudos procesados
    const [filteredData, setFilteredData] = useState([]); // Datos que se muestran en pantalla
    const [selectedClient, setSelectedClient] = useState('all'); // Cliente seleccionado
    const [clientList, setClientList] = useState([]);  // Lista para el <select>

    const [stats, setStats] = useState({ 
        stdDev: 0, mean: 0, mape: 0,      
        meanDays: 0, stdDevDays: 0        
    }); 
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    // 2. EFECTO DE FILTRADO: Se ejecuta cuando cambia el cliente seleccionado o llegan datos
    useEffect(() => {
        applyFilter();
    }, [selectedClient, allData]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/predicciones/analisis-desviacion', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const rawData = response.data;
            const validData = rawData.filter(item => item.pedido && item.pedido.createdAt);

            // Pre-procesamiento básico (Cálculos matemáticos)
            const preProcessed = validData.map((item) => {
                const dPred = new Date(item.fecha);
                dPred.setHours(0,0,0,0);
                const dReal = new Date(item.pedido.createdAt);
                dReal.setHours(0,0,0,0);
                const diffTime = dReal - dPred;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                const kgPred = parseFloat(item.cantidad) || 0;
                const kgReal = (item.pedido.solicitudPedido?.grano || 0) + (item.pedido.solicitudPedido?.molido || 0);
                const diffKg = kgReal - kgPred;
                const errorKgPct = kgPred !== 0 ? ((diffKg / kgPred) * 100).toFixed(1) : 0;
                
                const dateObj = new Date(item.fecha);

                return {
                    ...item,
                    cliente: item.usuario?.username || 'Anon',
                    fechaObj: dateObj, // Guardamos objeto fecha para ordenar si es necesario
                    shortDate: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                    fechaDisplay: dateObj.toLocaleDateString(),
                    fechaRealDisplay: dReal.toLocaleDateString(),
                    kgPred, kgReal, diffDays, diffKg,
                    errorKgPct: parseFloat(errorKgPct)
                };
            });

            // Extraer lista única de clientes para el Dropdown
            const uniqueClients = [...new Set(preProcessed.map(item => item.cliente))];
            setClientList(uniqueClients.sort());

            setAllData(preProcessed); // Guardamos la "Fuente de la Verdad"

        } catch (error) {
            console.error("Error cargando análisis", error);
            setError("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    // 3. LÓGICA DE FILTRADO Y ESTADÍSTICAS
    const applyFilter = () => {
        if (allData.length === 0) return;

        // A. Filtrar
        let temp = selectedClient === 'all' 
            ? allData 
            : allData.filter(d => d.cliente === selectedClient);

        // B. Re-etiquetar para la gráfica (Para que empiece en #1 tras filtrar)
        const dataWithLabels = temp.map((item, index) => ({
            ...item,
            chartLabel: `${item.cliente.substring(0, 6)} (${item.shortDate}) #${index + 1}`
        }));

        // C. Calcular Estadísticas (Sobre los datos filtrados)
        if (dataWithLabels.length > 0) {
            // Stats Kilos
            const diffsKg = dataWithLabels.map(d => d.diffKg);
            const meanKg = diffsKg.reduce((a, b) => a + b, 0) / diffsKg.length;
            const varKg = diffsKg.reduce((a, b) => a + Math.pow(b - meanKg, 2), 0) / diffsKg.length;
            const stdDevKg = Math.sqrt(varKg);
            const absPctErrors = dataWithLabels.map(d => Math.abs(d.errorKgPct));
            const mape = absPctErrors.reduce((a, b) => a + b, 0) / absPctErrors.length;

            // Stats Días
            const diffsDays = dataWithLabels.map(d => d.diffDays);
            const meanDays = diffsDays.reduce((a, b) => a + b, 0) / diffsDays.length;
            const varDays = diffsDays.reduce((a, b) => a + Math.pow(b - meanDays, 2), 0) / diffsDays.length;
            const stdDevDays = Math.sqrt(varDays);

            setStats({ 
                mean: parseFloat(meanKg.toFixed(2)), 
                stdDev: parseFloat(stdDevKg.toFixed(2)),
                mape: parseFloat(mape.toFixed(1)),
                meanDays: parseFloat(meanDays.toFixed(1)),
                stdDevDays: parseFloat(stdDevDays.toFixed(1))
            });
        } else {
            // Resetear stats si no hay datos
            setStats({ stdDev: 0, mean: 0, mape: 0, meanDays: 0, stdDevDays: 0 });
        }

        setFilteredData(dataWithLabels);
    };

    // --- HELPERS ---
    const getDayStatusBadge = (diffDays) => {
        const absDays = Math.abs(diffDays);
        let config = { text: 'Fuera de serie', bg: '#fee2e2', color: '#991b1b' };
        if (absDays <= 1) config = { text: 'En rango', bg: '#dcfce7', color: '#166534' };
        else if (absDays <= 3) config = { text: 'Aceptable', bg: '#fef9c3', color: '#854d0e' };

        return (
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', background: config.bg, color: config.color, display: 'inline-block', whiteSpace: 'nowrap' }}>
                {config.text}
            </span>
        );
    };

    const getKgBadgeStyle = (val) => {
        const isHigh = Math.abs(val) > 15;
        return {
            padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px',
            background: isHigh ? '#fee2e2' : '#dcfce7', color: isHigh ? '#991b1b' : '#166534', display: 'inline-block'
        };
    };

    if (loading) return <div style={styles.loadingContainer}>Detectando patrones...</div>;
    if (error) return <div style={styles.errorContainer}>{error}</div>;

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>
                
                {/* HEADER CON BOTÓN Y SELECTOR */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                    <button onClick={() => navigate('/admin')} style={styles.backButton}>⬅ Volver</button>
                    
                    {/* 👇 4. UI DEL FILTRO */}
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <label style={{fontWeight: 'bold', color: '#475569'}}>Filtrar por Cliente:</label>
                        <select 
                            value={selectedClient} 
                            onChange={(e) => setSelectedClient(e.target.value)}
                            style={styles.select}
                        >
                            <option value="all">-- Todos los Clientes --</option>
                            {clientList.map(client => (
                                <option key={client} value={client}>{client}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ================= SECCIÓN KILOS ================= */}
                <h2 style={styles.sectionTitle}>⚖️ Precisión de Cantidad (Kg)</h2>

                <div style={styles.kpiContainer}>
                    <KPICard title="Error Promedio (Kg)" value={`${stats.mean > 0 ? '+' : ''}${stats.mean} Kg`} color={stats.mean > 0 ? '#166534' : '#dc2626'} />
                    <KPICard title="Volatilidad (Kg)" value={`±${stats.stdDev}`} color="#475569" />
                    <div style={{...styles.kpiCard, display:'flex', alignItems:'center', justifyContent:'center', gap:15}}>
                        <div style={{height: 80, width: 80}}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={[{ value: Math.min(stats.mape, 100) }, { value: Math.max(0, 100 - stats.mape) }]} innerRadius={25} outerRadius={35} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                                        <Cell fill={stats.mape < 15 ? '#22c55e' : '#ef4444'} />
                                        <Cell fill="#e5e7eb" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{textAlign:'left'}}>
                            <h4 style={{margin:0, color:'#64748b'}}>MAPE Global</h4>
                            <span style={{fontSize: 24, fontWeight:'bold', color: stats.mape < 15 ? '#166534' : '#7f1d1d'}}>{stats.mape}%</span>
                        </div>
                    </div>
                </div>

                <div style={styles.cardGraph}>
                    <h3 style={styles.graphTitle}>Desviación de Kilos vs Error %</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={filteredData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="chartLabel" scale="band" fontSize={12} tickMargin={10} tickFormatter={(val) => val.split(' #')[0]} />
                                <YAxis yAxisId="left" label={{ value: 'Desviación (Kg)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Error %', angle: 90, position: 'insideRight', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: 8 }} />
                                <Legend />
                                <ReferenceLine yAxisId="left" y={0} stroke="#000" strokeOpacity={0.2} />
                                <Bar yAxisId="left" dataKey="diffKg" name="Diferencia (Kg)" barSize={30} radius={[4, 4, 0, 0]}>
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.diffKg >= 0 ? '#166534' : '#dc2626'} />
                                    ))}
                                </Bar>
                                <Line yAxisId="right" type="monotone" dataKey="errorKgPct" name="Error %" stroke="#ff7300" strokeWidth={3} dot={{r: 4}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* ================= SECCIÓN DÍAS ================= */}
                <h2 style={{...styles.sectionTitle, marginTop: 50}}>🗓️ Precisión de Tiempo (Días)</h2>

                <div style={styles.kpiContainer}>
                    <KPICard 
                        title="Desviación Promedio" 
                        value={`${stats.meanDays > 0 ? '+' : ''}${stats.meanDays} días`} 
                        color={stats.meanDays === 0 ? '#166534' : '#b91c1c'} 
                        note={stats.meanDays > 0 ? '(Tendencia a Atrasarse)' : stats.meanDays < 0 ? '(Tendencia a Adelantarse)' : '(Exactitud Perfecta)'}
                    />
                    <KPICard title="Volatilidad Temporal" value={`±${stats.stdDevDays} días`} color="#475569" note="Estabilidad del intervalo" />
                    <KPICard title="Pedidos Perfectos" value={`${filteredData.filter(d => d.diffDays === 0).length}`} color="#0f766e" note={`De un total de ${filteredData.length}`} />
                </div>

                <div style={styles.cardGraph}>
                    <h3 style={styles.graphTitle}>Desviación Temporal (Días)</h3>
                    <p style={{textAlign:'center', fontSize:12, color:'#888', marginBottom:20}}>Negativo: Se adelantó | Positivo: Se atrasó | 0: Exacto</p>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="chartLabel" scale="band" fontSize={12} tickMargin={10} tickFormatter={(val) => val.split(' #')[0]} />
                                <YAxis label={{ value: 'Días de Diferencia', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: 8 }} cursor={{fill: 'transparent'}} />
                                <Legend />
                                <ReferenceLine y={0} stroke="#000" strokeOpacity={0.2} />
                                <Bar dataKey="diffDays" name="Días de Diferencia" barSize={40} radius={[4, 4, 0, 0]}>
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-day-${index}`} fill={entry.diffDays === 0 ? '#166534' : entry.diffDays > 0 ? '#dc2626' : '#2563eb'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TABLA DETALLADA */}
                <h3 style={{marginTop: 40, color: '#334155'}}>Detalle {selectedClient !== 'all' ? `de ${selectedClient}` : 'General'}</h3>
                <div style={{overflowX: 'auto'}}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Cliente</th>
                                <th style={styles.th}>Comparativa</th>
                                <th style={{...styles.th, background:'#475569'}}>Error Días</th>
                                <th style={{...styles.th, background:'#475569'}}>Estatus</th>
                                <th style={{...styles.th, background:'#64748b'}}>Error Kg</th>
                                <th style={{...styles.th, background:'#64748b'}}>Error % Kg</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id} style={{ background: '#fff' }}>
                                    <td style={styles.td}>
                                        <div style={{fontWeight:'bold'}}>{item.cliente}</div>
                                        <div style={{fontSize:11, color:'#64748b'}}>{item.usuario?.perfil?.restaurant}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontSize:12}}>🗓️ P: {item.fechaDisplay}</div>
                                        <div style={{fontSize:12}}>🛒 R: {item.fechaRealDisplay}</div>
                                        <hr style={{border:'0', borderTop:'1px dashed #eee', margin:'5px 0'}}/>
                                        <div style={{fontSize:12}}>⚖️ P: {item.kgPred} Kg</div>
                                        <div style={{fontSize:12}}>📦 R: {item.kgReal} Kg</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 'bold', color: item.diffDays === 0 ? '#166534' : item.diffDays > 0 ? '#dc2626' : '#2563eb'}}>
                                            {item.diffDays > 0 ? `+${item.diffDays}` : item.diffDays} días
                                        </div>
                                    </td>
                                    <td style={styles.td}>{getDayStatusBadge(item.diffDays)}</td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 'bold', color: item.diffKg >= 0 ? '#166534' : '#dc2626'}}>
                                            {item.diffKg > 0 ? '+' : ''}{item.diffKg.toFixed(1)} Kg
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={getKgBadgeStyle(item.errorKgPct)}>{item.errorKgPct}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const KPICard = ({ title, value, color, note }) => (
    <div style={styles.kpiCard}>
        <h4 style={{margin:0, color:'#64748b'}}>{title}</h4>
        <span style={{fontSize: 28, fontWeight:'bold', color}}>{value}</span>
        {note && <div style={{fontSize: 11, color: '#94a3b8', marginTop: 4}}>{note}</div>}
    </div>
);

const styles = {
    pageContainer: { minHeight: '100vh', background: '#f1f5f9', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    contentWrapper: { width: '100%', maxWidth: 1200 },
    backButton: { padding: '8px 16px', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff' },
    select: { padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, minWidth: 200 },
    sectionTitle: { color: '#1e293b', marginBottom: 20, borderBottom: '2px solid #e2e8f0', paddingBottom: 10 },
    graphTitle: { textAlign:'center', color:'#555', marginBottom:5 },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b', fontSize: 18 },
    errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#dc2626', fontSize: 18 },
    kpiContainer: { display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' },
    kpiCard: { flex: 1, minWidth: 200, background: '#f8fafc', padding: 15, borderRadius: 8, textAlign: 'center', border: '1px solid #cbd5e1' },
    cardGraph: { width: '100%', background: '#fff', borderRadius: 16, border: '2px solid #e5e7eb', padding: 20, marginBottom: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 },
    th: { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' },
    td: { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' },
};

export default AdminDesviaciones;