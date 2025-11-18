import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login'; // Ajusta la ruta según dónde lo guardaste
import Bienvenida from './pages/Bienvenida';
import Contacto from './pages/Contacto';
import logoCafe from './assets/logo-cafe-tech.png'
// ¡Paso 1: Importa el archivo CSS Module!
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}> 
      <nav className={styles.topBar}>
        <Link to="/contacto" className={styles.navLink}>
          Contáctanos
        </Link>
        
        {/*
          CAMBIO AQUI: Ahora es un Link con una imagen dentro.
          La ruta al home (/) es la ruta por defecto para un logo.
        */}
        <Link to="/" className={styles.logoLink}> {/* Envolvemos la imagen en un Link */}
          <img 
            src={logoCafe}// O {coffeeBeanImage} si lo importaste desde src/assets
            alt="Grano de café" 
            className={styles.logo} 
          />
        </Link>
        
        <Link to="/login" className={styles.navLink}>
          Iniciar sesión
        </Link>
      </nav>

      <div className={styles.heroSection}>
        <h2>Información de la empresa</h2>
        <p>Aquí puedes poner texto corto, descripción y tus servicios principales.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/Bienvenida' element={<Bienvenida />}/>
        <Route path='/Contacto' element={<Contacto />}/>
      </Routes>
    </Router>
  );
}

export default App;