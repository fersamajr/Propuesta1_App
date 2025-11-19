import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- ESTADOS DEL MODAL ---
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    
    // Formulario unificado
    const [formData, setFormData] = useState({
        // Datos de Usuario
        username: '',
        email: '',
        rol: 'Cliente',
        isActive: true,
        // Datos de Perfil
        firstName: '',
        lastName: '',
        restaurant: '',
        direction: '',
        precioAcordado: 0,
        notas: ''
    });

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClientes(response.data);
        } catch (error) {
            console.error("Error cargando clientes", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. ABRIR MODAL Y CARGAR DATOS
    const handleEdit = (cliente) => {
        setEditingClient(cliente);
        setFormData({
            username: cliente.username || '',
            email: cliente.email || '',
            rol: cliente.rol || 'Cliente',
            isActive: cliente.isActive,
            
            firstName: cliente.perfil?.firstName || '',
            lastName: cliente.perfil?.lastName || '',
            restaurant: cliente.perfil?.restaurant || '',
            direction: cliente.perfil?.direction || '',
            precioAcordado: cliente.perfil?.precioAcordado || 0,
            notas: cliente.perfil?.notas || ''
        });
        setShowModal(true);
    };

    // 2. GUARDAR CAMBIOS
    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            // A. Actualizar Usuario
            await api.patch(`/users/${editingClient.id}`, {
                username: formData.username,
                email: formData.email,
                rol: formData.rol,
                isActive: formData.isActive === 'true' || formData.isActive === true
            }, config);

            // B. Actualizar Perfil (Si existe el perfil, si no, podrías crear uno aquí)
            if (editingClient.perfil) {
                await api.patch(`/profile/admin/${editingClient.id}`, {
                    // ⚠️ AQUÍ ESTÁ LA CORRECCIÓN DE LAS LLAVES:
                    firstName: formData.firstName,   // Antes: firstname
                    lastName: formData.lastName,     // Antes: lastname
                    restaurant: formData.restaurant, // Antes: restaurante
                    direction: formData.direction,   // Antes: direccion
                    precioAcordado: Number(formData.precioAcordado),
                    notas: formData.notas
                }, config);
            }

            alert('✅ Cliente actualizado correctamente');
            setShowModal(false);
            fetchClientes(); // Recargar lista

        } catch (error) {
            console.error("Error guardando", error);
            alert("Error al actualizar. Verifica los datos.");
        }
    };

    // Manejo de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Estilos
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: 14 };
    const thStyle = { background: '#334155', color: '#fff', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#333', verticalAlign: 'middle' };
    
    // Estilos Modal
    const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContent = { background: '#fff', padding: 30, borderRadius: 12, width: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
    const formGroup = { marginBottom: 15, display: 'flex', flexDirection: 'column' };
    const labelStyle = { fontWeight: 'bold', marginBottom: 5, fontSize: 13, color: '#475569' };
    const inputStyle = { padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14 };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 20 }}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: 20, padding: '10px 20px', cursor: 'pointer' }}>⬅ Volver</button>
            
            <h2 style={{ color: '#1e293b' }}>Directorio de Clientes</h2>

            {loading ? <p>Cargando...</p> : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Usuario / Email</th>
                            <th style={thStyle}>Negocio</th>
                            <th style={thStyle}>Precio / Rol</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(user => (
                            <tr key={user.id} style={{ background: '#fff' }}>
                                <td style={tdStyle}>
                                    <div style={{fontWeight: 'bold'}}>{user.username}</div>
                                    <div style={{fontSize: 12, color: '#64748b'}}>{user.email}</div>
                                </td>
                                <td style={tdStyle}>
                                    {user.perfil ? (
                                        <>
                                            <div style={{fontWeight:'bold', color:'#78549b'}}>{user.perfil.restaurant}</div>
                                            <div style={{fontSize:11}}>{user.perfil.direction}</div>
                                        </>
                                    ) : <span style={{fontStyle:'italic', color:'#999'}}>--</span>}
                                </td>
                                <td style={tdStyle}>
                                    <div style={{fontWeight:'bold', color:'#166534'}}>${user.perfil?.precioAcordado || 0}</div>
                                    <div style={{fontSize:11}}>{user.rol}</div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        background: user.isActive ? '#dcfce7' : '#fee2e2',
                                        color: user.isActive ? '#166534' : '#991b1b',
                                        padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 'bold'
                                    }}>
                                        {user.isActive ? 'ACTIVO' : 'INACTIVO'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button 
                                        onClick={() => handleEdit(user)}
                                        style={{padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer'}}
                                    >
                                        ✏️ Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* --- MODAL DE EDICIÓN --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3 style={{marginBottom: 20, color: '#1e293b', borderBottom: '1px solid #eee', paddingBottom: 10}}>
                            Editar Cliente
                        </h3>
                        <form onSubmit={handleSave} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                            
                            {/* COLUMNA 1: DATOS DE CUENTA */}
                            <div style={{gridColumn: 'span 2'}}>
                                <h4 style={{color: '#a78Bfa', margin: '0 0 10px 0'}}>Cuenta de Usuario</h4>
                            </div>
                            
                            <div style={formGroup}>
                                <label style={labelStyle}>Usuario</label>
                                <input name="username" value={formData.username} onChange={handleChange} style={inputStyle} required />
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} style={inputStyle} required type="email"/>
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Rol</label>
                                <select name="rol" value={formData.rol} onChange={handleChange} style={inputStyle}>
                                    <option value="Cliente">Cliente</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Estado</label>
                                <select name="isActive" value={formData.isActive} onChange={handleChange} style={inputStyle}>
                                    <option value={true}>Activo</option>
                                    <option value={false}>Inactivo</option>
                                </select>
                            </div>

                            {/* COLUMNA 2: DATOS DE PERFIL */}
                            <div style={{gridColumn: 'span 2', marginTop: 10}}>
                                <h4 style={{color: '#a78Bfa', margin: '0 0 10px 0'}}>Perfil de Negocio</h4>
                            </div>

                            <div style={formGroup}>
                                <label style={labelStyle}>Nombre</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Apellido</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Restaurante</label>
                                <input name="restaurant" value={formData.restaurant} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={formGroup}>
                                <label style={labelStyle}>Precio Acordado ($)</label>
                                <input name="precioAcordado" type="number" value={formData.precioAcordado} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{...formGroup, gridColumn: 'span 2'}}>
                                <label style={labelStyle}>Dirección</label>
                                <input name="direction" value={formData.direction} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{...formGroup, gridColumn: 'span 2'}}>
                                <label style={labelStyle}>Notas Internas</label>
                                <textarea name="notas" value={formData.notas} onChange={handleChange} style={{...inputStyle, height: 60}} />
                            </div>

                            {/* BOTONES */}
                            <div style={{gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20}}>
                                <button type="button" onClick={() => setShowModal(false)} style={{padding:'10px 20px', background:'#ef4444', color:'#fff', border:'none', borderRadius:6, cursor:'pointer'}}>Cancelar</button>
                                <button type="submit" style={{padding:'10px 20px', background:'#22c55e', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:'bold'}}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminClientes;