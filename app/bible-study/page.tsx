'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function BibleStudyPage() {
  const [verse, setVerse] = useState('');
  const [reflection, setReflection] = useState('');
  const [author, setAuthor] = useState<'Jason' | 'Jessica'>('Jason');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studies, setStudies] = useState<any[]>([]);

  const fetchStudies = async () => {
    try {
      // Kita menggunakan koleksi baru bernama 'bible_studies'
      const q = query(collection(db, 'bible_studies'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudies(data);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveStudy = async () => {
    if (!verse.trim() || !reflection.trim()) {
      alert("Isi ayat dan renungannya dulu ya!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'bible_studies'), {
        verse: verse,
        reflection: reflection,
        author: author,
        createdAt: new Date()
      });
      
      setVerse('');
      setReflection('');
      alert("Renungan berhasil dibagikan! ✝️");
      
      fetchStudies();
    } catch (error) {
      console.error("Error menyimpan renungan:", error);
      alert("Gagal menyimpan renungan. Coba lagi, ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Pendalaman Alkitab ✝️</h1>
        <Link href="/" className="text-sm font-medium text-diary-400 hover:text-pink-500 transition-colors">
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-diary-200 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Siapa yang membagikan renungan?</label>
          <div className="flex gap-4">
            <button
              onClick={() => setAuthor('Jason')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 outline-none
                ${author === 'Jason' 
                  ? 'border-blue-300 bg-blue-50 text-blue-500 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              👦🏻 Jason
            </button>
            <button
              onClick={() => setAuthor('Jessica')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 outline-none
                ${author === 'Jessica' 
                  ? 'border-diary-300 bg-diary-50 text-diary-400 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              👧🏻 Jessica
            </button>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-100 my-4"></div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Ayat Alkitab (Misal: Amsal 3:5-6)
          </label>
          <input 
            type="text"
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Tulis kitab, pasal, dan ayat..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Renungan / Pesan yang didapat:
          </label>
          <textarea 
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 min-h-[160px] resize-none text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Hari ini aku belajar bahwa..."
          ></textarea>
        </div>

        <button 
          onClick={handleSaveStudy}
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl transition-colors shadow-sm text-lg
            ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-diary-400 hover:bg-[#f97ebf]'}
          `}
        >
          {isSubmitting ? 'Membagikan...' : 'Bagikan Renungan'}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700">Diskusi Sebelumnya</h3>
        
        {studies.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada renungan. Mari mulai bertumbuh bersama!</p>
        ) : (
          studies.map((study) => (
            <div key={study.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-bold text-diary-400">{study.verse}</h4>
                  <span className="text-xs font-medium text-slate-400">
                    {study.createdAt?.toDate ? study.createdAt.toDate().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru saja'}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">
                {study.reflection}
              </p>
              
              <div className={`mt-4 inline-block px-3 py-1 text-xs font-bold rounded-full
                ${study.author === 'Jessica' 
                  ? 'bg-diary-100 text-diary-400' 
                  : 'bg-blue-100 text-blue-500'}
              `}>
                {study.author}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}