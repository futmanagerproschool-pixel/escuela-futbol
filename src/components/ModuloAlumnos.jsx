import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc } from "firebase/firestore";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Users, FileDown, FileText, Trash2 } from 'lucide-react';

export default function ModuloAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({
    nombres: '', documento: '', fechaNac: '', sangre: '', peso: '', talla: '',
    direccion: '', posicion: '', categoria: '', perfil: 'Diestro',
    padres: '', telPadres: '', colegio: '', grado: '', observaciones: ''
  });

  useEffect(() => {
    const q = query(collection(db, "alumnos"));
    return onSnapshot(q, (snap) => {
      setAlumnos(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
  }, []);

  const calcularEdad = (f) => f ? new Date().getFullYear() - new Date(f).getFullYear() : 0;
  const calcularIMC = (p, t) => (p && t) ? (p / ((t/100) * (t/100))).toFixed(2) : 0;

  const guardar = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "alumnos"), {
      ...form,
      edad: calcularEdad(form.fechaNac),
      imc: calcularIMC(form.peso, form.talla),
      fechaRegistro: new Date().toLocaleDateString()
    });
    alert("Alumno registrado");
  };

  const exportarFichaPDF = (alumno) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("FICHA TÉCNICA DEL ALUMNO", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Nombre: ${alumno.nombres}`, 20, 40);
    doc.text(`Documento: ${alumno.documento}`, 20, 50);
    doc.text(`Edad: ${alumno.edad} años`, 20, 60);
    doc.text(`Categoría: ${alumno.categoria}`, 20, 70);
    doc.text(`Posición: ${alumno.posicion} (${alumno.perfil})`, 20, 80);
    doc.text(`Sangre: ${alumno.sangre} | IMC: ${alumno.imc}`, 20, 90);
    doc.text(`Colegio: ${alumno.colegio} (${alumno.grado})`, 20, 100);
    doc.text(`Padres: ${alumno.padres}`, 20, 110);
    doc.text(`Teléfono: ${alumno.telPadres}`, 20, 120);
    doc.text(`Observaciones: ${alumno.observaciones}`, 20, 130);
    doc.save(`Ficha_${alumno.nombres}.pdf`);
  };

  return (
    <div className="card">
      <h2><Users /> Registro Detallado de Alumnos</h2>
      
      <form onSubmit={guardar} className="grid-form-3">
        <input placeholder="Nombres y Apellidos" onChange={e=>setForm({...form, nombres: e.target.value})} required />
        <input placeholder="Documento" onChange={e=>setForm({...form, documento: e.target.value})} />
        <input type="date" title="Fecha Nacimiento" onChange={e=>setForm({...form, fechaNac: e.target.value})} />
        
        <select onChange={e=>setForm({...form, sangre: e.target.value})}>
          <option value="">Tipo de Sangre</option>
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <input placeholder="Peso (kg)" type="number" onChange={e=>setForm({...form, peso: e.target.value})} />
        <input placeholder="Talla (cm)" type="number" onChange={e=>setForm({...form, talla: e.target.value})} />
        <input placeholder="Dirección" onChange={e=>setForm({...form, direccion: e.target.value})} />
        <input placeholder="Categoría" onChange={e=>setForm({...form, categoria: e.target.value})} />
        
        <select onChange={e=>setForm({...form, posicion: e.target.value})}>
          <option value="">Posición de Juego</option>
          <option>Portero</option><option>Defensa</option><option>Mediocampista</option><option>Delantero</option>
        </select>

        <select onChange={e=>setForm({...form, perfil: e.target.value})}>
          <option>Diestro</option><option>Zurdo</option><option>Ambos</option>
        </select>

        <input placeholder="Nombres Padres" onChange={e=>setForm({...form, padres: e.target.value})} />
        <input placeholder="Teléfono Padres" onChange={e=>setForm({...form, telPadres: e.target.value})} />
        <input placeholder="Colegio" onChange={e=>setForm({...form, colegio: e.target.value})} />
        <input placeholder="Grado" onChange={e=>setForm({...form, grado: e.target.value})} />
        
        <textarea style={{gridColumn: 'span 3'}} placeholder="Observaciones y EPS" onChange={e=>setForm({...form, observaciones: e.target.value})}></textarea>
        
        <button type="submit" className="btn-main">Guardar Alumno</button>
      </form>

      <div className="table-container mt-20">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Cat.</th><th>Edad</th><th>Posición</th><th>Ficha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {alumnos.map(a => (
              <tr key={a.id}>
                <td>{a.nombres}</td>
                <td>{a.categoria}</td>
                <td>{a.edad}</td>
                <td>{a.posicion}</td>
                <td>
                  <button onClick={() => exportarFichaPDF(a)} className="btn-pdf"><FileText size={16}/></button>
                </td>
                <td>
                  <button onClick={() => deleteDoc(doc(db, "alumnos", a.id))}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
