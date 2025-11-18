import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bienvenida() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('token desde localStorage:', token);
    if (!token){
        console.log('No token found, no se hace la llamada al perfil');
        return;
    }

    axios.get('http://localhost:3000/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProfile(res.data))
    .catch(err => {
        console.error('Error consultando perfil', err);
        setProfile(null);
    });
    }, []);


    const username = profile ? `${profile.firstName} ${profile.lastName}` : 'Nombre del Usuario';

    return (
        <div style={{ minHeight: '100vh', background: '#fff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Barra superior */}
        <div style={{
            width: 650, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20
        }}>
            <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}>Soporte</button>
            <button style={{ background: '#7dd3fc', color: '#222', padding: '10px 55px', borderRadius: 8 }}>Logo</button>
            <button style={{ background: '#a78Bfa', color: '#222', padding: '10px 30px', borderRadius: 8 }}>Exit</button>
        </div>

        <div style={{
            width: 900,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            {/* Menú Desplegable */}
            <div style={{ position: 'relative', width: 200 }}>
            <button
                style={{
                background: '#a78Bfa', color: '#222', padding: 10, borderRadius: 8, marginBottom: 8, width: 48, fontSize: 18,
                }}
                onClick={() => setMenuOpen(s => !s)}
            >
                ≡
            </button>
            {menuOpen && (
                <div style={{
                position: 'absolute',
                top: 45,
                left: 0,
                width: 190,
                background: '#f3f4f6',
                borderRadius: 12,
                boxShadow: '0 2px 12px #0001',
                padding: '10px 0'
                }}>
                <button style={menuBtnStyle}>Análisis de Negocio</button>
                <button style={menuBtnStyle}>Solicitudes de pedidos</button>
                <button style={menuBtnStyle}>Pedidos Anteriores</button>
                <button style={menuBtnStyle}>Pagos</button>
                <button style={menuBtnStyle}>Predicciones</button>
                <button style={menuBtnStyle}>Inventario</button>
                </div>
            )}
            </div>

            {/* Contenido Central */}
            <div style={{ flex: 1, margin: '0 20px' }}>
            <h2 style={{
                color: '#6b7280', fontWeight: 600, marginBottom: 26
            }}>Bienvenido "{username}"</h2>
            <div style={{
                background: '#f5f3ff', padding: 30, borderRadius: 12, width: 380, boxShadow: '0 2px 12px #0001'
            }}>
                <h3 style={{ marginBottom: 16, color: '#78549b' }}>Atajos</h3>
                <button style={mainBtnStyle}>Hacer pedido</button>
                <button style={mainBtnStyle}>Ver todos los pedidos</button>
                <button style={mainBtnStyle}>Saldo Actual</button>
                <button style={mainBtnStyle}>Predicciones (Beta)</button>
            </div>
            </div>

            {/* Panel derecho */}
            <div style={{
            width: 130, display: 'flex', flexDirection: 'column', gap: 10
            }}>
            <div style={sideInfoStyle}>Información General</div>
            <div style={sideInfoStyle}>Último pedido</div>
            <div style={sideInfoStyle}>Pedidos Pendientes</div>
            <div style={sideInfoStyle}>Inventario</div>
            <div style={sideInfoStyle}>Próximo Pedido</div>
            </div>
        </div>
        </div>
    );
    }

    // Estilos para botones del menú desplegable y panel derecho
    const menuBtnStyle = {
    width: '90%',
    margin: '8px auto',
    background: '#a78Bfa',
    color: '#222',
    padding: '10px',
    borderRadius: 8,
    border: 'none',
    fontSize: 15,
    display: 'block',
    };

    const mainBtnStyle = {
    width: '100%',
    margin: '10px 0',
    background: '#a78Bfa',
    color: '#222',
    padding: '15px',
    borderRadius: 8,
    fontSize: 17,
    fontWeight: 500,
    border: 'none',
    };

    const sideInfoStyle = {
    background: '#f472b6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 500,
    };

export default Bienvenida;
