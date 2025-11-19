import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
    const navigate = useNavigate();
    // Estado para KPIs y Gráfica
    const [stats, setStats] = useState({
        kpis: { pendientes: 0, pedidosMes: 0, alertasStock: 0 },
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await api.get('/pedidos/admin/global-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error cargando stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    // --- ESTILOS ---
    const containerStyle = { minHeight: '100vh', background: '#1e293b', color: '#fff', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const gridStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, maxWidth: 1200, width: '100%' };
    
    // Estilo Widget Superior
    const widgetStyle = (color) => ({
        flex: '1 1 200px', background: '#334155', padding: 20, borderRadius: 16, 
        borderLeft: `6px solid ${color}`, boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    });

    // Estilo Gráfica (MODIFICADO: Más compacta)
    const chartContainerStyle = {
        width: '52%', // ⬅️ Un poco más angosta
        minWidth: 400, // Para que no se rompa en pantallas chicas
        maxWidth: 1200, 
        background: '#334155', padding: 15, borderRadius: 16, 
        marginTop: 30, marginBottom: 30, border: '1px solid #475569'
    };

    return (
        <div style={containerStyle}>
            {/* HEADER */}
            <div style={{ width: '100%', maxWidth: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <h1 style={{ color: '#a78Bfa', margin: 0 }}>Panel de Control</h1>
                <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Salir</button>
            </div>

            {/* 1. BARRA DE PULSO (KPIs) */}
            <div style={{ ...gridStyle, marginBottom: 30, maxWidth: 1000 }}>
                <div style={widgetStyle('#f43f5e')}>
                    <div>
                        <div style={{fontSize: 12, color:'#94a3b8', textTransform:'uppercase'}}>Pedidos Pendientes</div>
                        <div style={{fontSize: 32, fontWeight:'bold'}}>{stats.kpis.pendientes}</div>
                    </div>
                    <div style={{fontSize: 30}}>🔥</div>
                </div>
                
                <div style={widgetStyle('#10b981')}>
                    <div>
                        <div style={{fontSize: 12, color:'#94a3b8', textTransform:'uppercase'}}>Pedidos del Mes</div>
                        <div style={{fontSize: 32, fontWeight:'bold'}}>{stats.kpis.pedidosMes}</div>
                    </div>
                    <div style={{fontSize: 30}}>📦</div>
                </div>

                <div style={widgetStyle('#f59e0b')}>
                    <div>
                        <div style={{fontSize: 12, color:'#94a3b8', textTransform:'uppercase'}}>Alertas Stock</div>
                        <div style={{fontSize: 32, fontWeight:'bold'}}>{stats.kpis.alertasStock}</div>
                    </div>
                    <div style={{fontSize: 30}}>📉</div>
                </div>
            </div>

            {/* 2. GRÁFICA DE SALUD DEL NEGOCIO */}
            <div style={chartContainerStyle}>
                <h3 style={{color: '#cbd5e1', marginLeft: 10, marginBottom: 10, fontSize: 16}}>📈 Salud del Negocio (Últimos 6 meses)</h3>
                {/* ⬅️ MODIFICADO: Altura reducida a 200px */}
                <div style={{ height: 200, width: '100%' }}>
                    <ResponsiveContainer>
                        <AreaChart data={stats.chartData}>
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a78Bfa" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#a78Bfa" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: 8}} itemStyle={{color: '#fff'}} />
                            <Area type="monotone" dataKey="kg" stroke="#a78Bfa" fillOpacity={1} fill="url(#colorVentas)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. GRID DE MENÚ (Accesos Rápidos) */}
            <h3 style={{color: '#94a3b8', alignSelf: 'center', marginBottom: 20}}>Accesos Rápidos</h3>
            <div style={gridStyle}>
                
                <MenuCard icon="📩" title="Solicitudes" desc="Aprobar nuevos pedidos" onClick={() => navigate('/admin/solicitudes')} />
                <MenuCard icon="📦" title="Pedidos" desc="Controlar entregas" onClick={() => navigate('/admin/pedidos')} />
                <MenuCard icon="👥" title="Clientes" desc="Directorio de usuarios" onClick={() => navigate('/admin/clientes')} />
                <MenuCard icon="💰" title="Pagos" desc="Registro de ingresos" onClick={() => navigate('/admin/pagos')} />
                <MenuCard icon="⚖️" title="Saldos" desc="Cuentas por cobrar" onClick={() => navigate('/admin/saldos')} />
                
                {/* Tarjeta destacada de Anuncios */}
                <MenuCard icon="📢" title="Anuncios" desc="Enviar correo masivo" onClick={() => navigate('/admin/broadcast')} color="#c084fc" />
                
                <MenuCard icon="📈" title="Predicciones" desc="Análisis futuro" onClick={() => navigate('/admin/predicciones')} />
                <MenuCard icon="🏭" title="Planeador" desc="Proyección producción" onClick={() => navigate('/admin/planeador')} />
                <MenuCard icon="🎯" title="Desviaciones" desc="Precisión del modelo" onClick={() => navigate('/admin/desviaciones')} />
                <MenuCard icon="🗃️" title="Inventario" desc="Monitor global" onClick={() => navigate('/admin/inventario')} />

            </div>
        </div>
    );
}

// Componente auxiliar (MODIFICADO: Tarjetas más grandes)
const MenuCard = ({ icon, title, desc, onClick, color }) => (
    <div 
        onClick={onClick}
        style={{ 
            background: '#334155', 
            padding: 20,            // ⬅️ Más padding (antes 20)
            borderRadius: 16,       // ⬅️ Bordes más redondeados
            width: 180,             // ⬅️ Ancho aumentado (antes 160)
            textAlign: 'center', 
            cursor: 'pointer', 
            border: color ? `2px solid ${color}` : '1px solid #475569', 
            transition: 'transform 0.2s', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Sombra suave
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = '#475569';
            e.currentTarget.style.transform = 'translateY(-5px)'; // Efecto flotante
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = '#334155';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ fontSize: 42, marginBottom: 10 }}>{icon}</div> {/* ⬅️ Ícono más grande (antes 32) */}
        <div style={{ fontSize: 18, fontWeight: 'bold', color: color || '#a78Bfa', marginBottom: 5 }}>{title}</div> {/* ⬅️ Título más grande */}
        <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0 }}>{desc}</p> {/* ⬅️ Texto desc más legible */}
    </div>
);

export default AdminDashboard;