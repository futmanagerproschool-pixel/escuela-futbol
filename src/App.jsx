import React, { useState } from 'react';
import GestionUsuarios from './components/GestionUsuarios';
import ModuloAlumnos from './components/ModuloAlumnos';
import './index.css';

function App() {
  const [tab, setTab] = useState('alumnos');

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h1>Soccer Escuela ⚽</h1>
        <button className={tab === 'usuarios' ? 'active' : ''} onClick={() => setTab('usuarios')}>👥 Usuarios</button>
        <button className={tab === 'alumnos' ? 'active' : ''} onClick={() => setTab('alumnos')}>🎓 Alumnos</button>
        <button disabled>💰 Pagos (Próximamente)</button>
      </nav>

      <main className="content">
        {tab === 'usuarios' ? <GestionUsuarios /> : <ModuloAlumnos />}
      </main>
    </div>
  );
}

export default App;
