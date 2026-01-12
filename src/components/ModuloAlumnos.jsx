import React, { useState, useEffect } from 'react';
import { X, Upload, Save, FileText, Camera, Calendar, Activity } from 'lucide-react';
import { Student, BloodType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student, photoFile?: File, docFiles?: File[]) => void;
  initialData?: Student | null; // Si esto existe, el modal entra en MODO EDICIÓN
}

const CATEGORIES = ['Teteros', 'Baby', 'Pre-Infantil', 'Infantil', 'Sub-13', 'Sub-15', 'Sub-17', 'Sub-20'];
const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StudentModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '', lastName: '', document: '', dob: '', bloodType: 'O+',
    weight: 0, height: 0, category: 'Teteros', position: '',
    status: 'ACTIVE', processType: 'FORMATIVA', // 'LIGA' o 'FORMATIVA'
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: '',
    parents: { fatherName: '', motherName: '', phone: '', address: '' }
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);

  // Efecto para CARGAR DATOS si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset si es nuevo
      setFormData({ status: 'ACTIVE', processType: 'FORMATIVA', category: 'Teteros', entryDate: new Date().toISOString().split('T')[0] });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">
              {initialData ? 'EDITAR FICHA' : 'NUEVA INSCRIPCIÓN'}
            </h2>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Gestión de Talento Humano</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
        </div>

        <div className="p-8 space-y-8">
          {/* 1. Perfil y Foto */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative group">
              <div className="w-40 h-40 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-slate-50">
                {(photoFile || formData.photo) ? (
                  <img src={photoFile ? URL.createObjectURL(photoFile) : formData.photo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={40} /></div>
                )}
              </div>
              <input type="file" id="photo" hidden onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
              <label htmlFor="photo" className="absolute bottom-2 right-2 bg-emerald-500 text-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Upload size={18} />
              </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Nombres</label>
                <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Apellidos</label>
                <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none" />
              </div>
            </div>
          </div>

          {/* 2. Información Deportiva */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[2.5rem]">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Categoría</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-white rounded-2xl font-bold mt-1 shadow-sm border-none">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Proceso</label>
              <select value={formData.processType} onChange={e => setFormData({...formData, processType: e.target.value as any})} className="w-full p-4 bg-white rounded-2xl font-bold mt-1 shadow-sm border-none">
                <option value="FORMATIVA">FORMATIVA</option>
                <option value="LIGA">COMPETICIÓN (LIGA)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Posición</label>
              <input value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="Ej: Delantero" className="w-full p-4 bg-white rounded-2xl font-bold mt-1 shadow-sm border-none" />
            </div>
          </div>

          {/* 3. Fechas de Gestión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Calendar size={12}/> Fecha de Ingreso</label>
              <input type="date" value={formData.entryDate} onChange={e => setFormData({...formData, entryDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 border-none" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><X size={12}/> Fecha de Retiro (Opcional)</label>
              <input type="date" value={formData.exitDate} onChange={e => setFormData({...formData, exitDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 border-none text-rose-500" />
            </div>
          </div>

          {/* 4. Cargue de Documentos (Documentación Legal) */}
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2"><FileText /> Documentación (PDF/JPG)</h3>
              <input type="file" id="docs" multiple hidden onChange={e => setDocFiles(Array.from(e.target.files || []))} />
              <label htmlFor="docs" className="text-[10px] bg-slate-900 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-600">Subir Archivos</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {docFiles.length > 0 ? docFiles.map((f, i) => (
                <span key={i} className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold">📄 {f.name}</span>
              )) : <p className="text-xs text-slate-400 italic">No hay documentos cargados (Registro Civil, EPS, Seguro...)</p>}
            </div>
          </div>

          {/* Footer Acciones */}
          <div className="flex gap-4 pt-8">
            <button onClick={() => onSave(formData as Student, photoFile || undefined, docFiles)} className="flex-1 bg-emerald-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100">
              <Save /> {initialData ? 'Actualizar Ficha' : 'Guardar Inscripción'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
