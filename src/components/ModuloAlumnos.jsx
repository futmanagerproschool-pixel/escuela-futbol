import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc } from "firebase/firestore";
import * as XLSX from 'xlsx';
import { Users, FileDown, FileUp } from 'lucide-react';

export default function ModuloAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ nombres: '', fechaNac: '', peso: '', talla: '', categoria: '', posicion: '', telPadres: '' });

  useEffect(() => {
    const q = query(collection(db, "alumnos"));
    return onSnapshot(q, (snap) => {
      setAlumnos(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
  }, []);

  const calcularEdad = (f) => {
    if(!f) return 0;
    return new Date().getFullYear() - new Date(f).getFullYear();
  };

  const calcularIMC = (p, t) => {
    if(!p || !t) return 0;
    const mt = t / 100;
    return (p / (mt * mt)).toFixed(2);
  };

  const guardar = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "alumnos"), {
      ...form,
      edad: calcularEdad(form.fechaNac),
      imc: calcularIMC(form.peso, form.talla)
    });
    setForm({ nombres: '', fechaNac: '', peso: '', talla: '', categoria: '', posicion: '', telPadres: '' });
  };

  const exportar = () => {
    const ws = XLSX.utils.json_to_sheet(alumnos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alumnos");
    XLSX.writeFile(wb, "BaseDatos_Alumnos.xlsx");
  };

  return (
    <div className="card">
      <div className="header-flex">
        <h2><Users /> Ficha de Alumnos</h2>
        <div className="buttons">
          <button className="btn-excel" onClick={exportar}><FileDown size={16}/> Exportar</button>
        </div>
      </div>

      <form onSubmit={guardar} className="grid-form-3">
        <input placeholder="Nombres" value={form.nombres} onChange={e=>setForm({...form, nombres: e.target.value})} />
        <input type="date" value={form.fechaNac} onChange={e=>setForm({...form, fechaNac: e.target.value})} />
        <input placeholder="Peso (kg)" type="number" onChange={e=>setForm({...form, peso: e.target.value})} />
        <input placeholder="Talla (cm)" type="number" onChange={e=>setForm({...form, talla: e.target.value})} />
        <input placeholder="Categoría" value={form.categoria} onChange={e=>setForm({...form, categoria: e.target.value})} />
        <input placeholder="Tel. Padres" value={form.telPadres} onChange={e=>setForm({...form, telPadres: e.target.value})} />
        <div className="info-box">
          Edad: {calcularEdad(form.fechaNac)} | IMC: {calcularIMC(form.peso, form.talla)}
        </div>
        <button type="submit" className="btn-main">Registrar Alumno</button>
      </form>

      <table className="mt-20">
        <thead>
          <tr><th>Nombre</th><th>Edad</th><th>IMC</th><th>Categoría</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.id}>
              <td>{a.nombres}</td>
              <td>{a.edad}</td>
              <td>{a.imc}</td>
              <td>{a.categoria}</td>
              <td><button onClick={()=>deleteDoc(doc(db, "alumnos", a.id))}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
