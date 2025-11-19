import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Inventario() {
    const navigate = useNavigate();
    const [cantidadActual, setCantidadActual] = useState(0);
    const [ultimaCantidad, setUltimaCantidad] = useState(0);
    
    // Inputs del formulario
    const [inputMolido, setInputMolido] = useState('');
    const [inputGrano, setInputGrano] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    // 1. Cargar Inventario al inicio
    useEffect(() => {
        const fetchInventario = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await api.get('/inventario/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Si existe inventario, seteamos los valores. Si es null, es 0.
                if (response.data) {
                    setCantidadActual(response.data.cantidad || 0);
                    setUltimaCantidad(response.data.ultimaCantidad || 0);
                }
            } catch (error) {
                console.error("Error cargando inventario", error);
                // Si da 404 es que aún no tiene registro, no es grave, se queda en 0
            } finally {
                setLoading(false);
            }
        };
        fetchInventario();
    }, [navigate]);

    // 2. Actualizar Inventario
    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        
        // Sumamos lo que el usuario ingresó (convertimos a float, si está vacío es 0)
        const nuevoMolido = parseFloat(inputMolido) || 0;
        const nuevoGrano = parseFloat(inputGrano) || 0;
        const nuevoTotal = nuevoMolido + nuevoGrano;

        if (nuevoTotal <= 0) {
            setMessage('⚠️ Por favor ingresa una cantidad válida.');
            return;
        }

        try {
            // Enviamos el nuevo total y guardamos el actual como "ultimaCantidad"
            const payload = {
                cantidad: nuevoTotal,
                ultimaCantidad: cantidadActual // Movemos el actual al historial
            };

            // Intentamos crear primero (por si no existe), si falla intentamos actualizar
            // Ojo: Tu backend tiene POST y PATCH. 
            // Una estrategia segura es intentar PATCH, y si da 404, hacer POST.
            // Para simplificar usaremos PATCH asumiendo que el usuario se crea con inventario o usaremos una lógica mixta.
            
            let response;
            try {
                // Intentamos actualizar
                response = await api.patch('/inventario/me', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                // Si falla (ej. 404), intentamos crear
                response = await api.post('/inventario/me', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setCantidadActual(response.data.cantidad);
            setUltimaCantidad(response.data.ultimaCantidad);
            setMessage('✅ Inventario actualizado correctamente.');
            setInputMolido('');
            setInputGrano('');
            
            // Borrar mensaje después de 3 seg
            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            console.error(error);
            setMessage('❌ Error al actualizar inventario.');
        }
    };

    // Estilos
    const topBtnStyle = { background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8, border: 'none', cursor: 'pointer' };
    const menuBtnStyle = { width: '90%', margin: '8px auto', background: '#a78Bfa', color: '#222', padding: '10px', borderRadius: 8, border: 'none', fontSize: 15, display: 'block', cursor: 'pointer' };
    
    const displayCardStyle = {
        width: '100%', height: 150, background: '#e9d5ff', borderRadius: 16, border: '2px solid #222', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 30,
        boxShadow: '2px 2px 0px #000'
    };

    const inputStyle = {
        width: '100%', padding: '12px', borderRadius: 8, background: '#e5e7eb', 
        border: '2px solid #222', fontSize: 16, outline: 'none'
    };

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
                             <button style={menuBtnStyle} onClick={() => navigate('/bienvenida')}>Inicio</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pedidos-anteriores')}>Pedidos Anteriores</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/pagos')}>Pagos</button>
                             <button style={menuBtnStyle} onClick={() => navigate('/predicciones')}>Predicciones</button>
                             <button style={{...menuBtnStyle, background: '#c4b5fd'}}>Inventario</button>
                        </div>
                    )}
                </div>

                {/* Área Central */}
                <div style={{ flex: 1, maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'cursive', marginBottom: 20, fontSize: 32 }}>Inventario</h2>

                    {/* Tarjeta de Cantidad Actual */}
                    <div style={displayCardStyle}>
                        <span style={{ fontSize: 18, fontWeight: '500', color: '#4b5563', marginBottom: 10 }}>Cantidad Actual Total</span>
                        <span style={{ fontSize: 40, fontWeight: 'bold', color: '#1f2937' }}>
                            {loading ? '...' : `${cantidadActual} Kg`}
                        </span>
                        <span style={{ fontSize: 12, color: '#666' }}>(Anterior: {ultimaCantidad} Kg)</span>
                    </div>

                    <h3 style={{ fontFamily: 'cursive', fontSize: 24, marginBottom: 20 }}>Actualizar Inventario</h3>

                    {/* Formulario */}
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <label style={{ width: 150, fontWeight: 'bold', fontFamily: 'cursive', fontSize: 18 }}>Cantidad Molido</label>
                            <input 
                                type="number" 
                                style={inputStyle} 
                                value={inputMolido}
                                onChange={(e) => setInputMolido(e.target.value)}
                                placeholder="Kg"
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
                            <label style={{ width: 150, fontWeight: 'bold', fontFamily: 'cursive', fontSize: 18 }}>Cantidad Grano</label>
                            <input 
                                type="number" 
                                style={inputStyle} 
                                value={inputGrano}
                                onChange={(e) => setInputGrano(e.target.value)}
                                placeholder="Kg"
                            />
                        </div>

                        <button 
                            onClick={handleUpdate}
                            style={{ 
                                width: '100%', padding: '15px', background: '#c4b5fd', border: '2px solid #222', borderRadius: 12,
                                fontSize: 18, fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px #000'
                            }}
                        >
                            Actualizar
                        </button>

                        {message && <p style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>{message}</p>}
                    </div>
                </div>

                {/* Espaciador derecho */}
                <div style={{ width: 200 }}></div>
            </div>
        </div>
    );
}

export default Inventario;