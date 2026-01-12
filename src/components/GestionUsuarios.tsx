import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { UserPlus, Trash2, Edit } from 'lucide-react';

const roles = ["Administrador", "Vendedor", "Secretaria", "Entrenador", "Alumno"];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'Alumno' });

  useEffect(() => {
    const q = query(collection(db, "usuarios"));
    return onSnapshot(q, (snap) => {
      setUsuarios(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "usuarios"), form);
    setForm({ nombre: '', email: '', rol: 'Alumno' });
  };

  return (
    <div className="card">
      <h2><UserPlus /> Gestión de Personal</h2>
      <form onSubmit={guardar} className="grid-form">
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button type="submit">Crear Usuario</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Rol</th><th>Email</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td><span className={`badge ${u.rol}`}>{u.rol}</span></td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => deleteDoc(doc(db, "usuarios", u.id))}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
