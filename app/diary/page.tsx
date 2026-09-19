'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function DiaryPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State baru untuk memilih siapa yang sedang menulis (Default: Jason)
  const [author, setAuthor] = useState<'Jason' | 'Jessica'>('Jason');
  
  const [journals, setJournals] = useState<any[]>([]);

  const fetchJournals = async () => {
    try {
      const q = query(collection(db, 'diaries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJournals(data);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveJournal = async () => {
    if (!selectedMood) {
      alert("Pilih perasaanmu hari ini dulu, ya!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'diaries'), {
        mood: selectedMood,
        note: note,
        author: author, // Sekarang menggunakan state pilihan nama
        createdAt: new Date()
      });
      
      setSelectedMood(null);
      setNote('');
      alert("Jurnal berhasil disimpan! ❤️");
      
      fetchJournals();
    } catch (error) {
      console.error("Error menyimpan jurnal:", error);
      alert("Gagal menyimpan jurnal. Coba lagi, ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Diary & Perasaan 📖</h1>
        <Link href="/" className="text-sm font-medium text-diary-400 hover:text-pink-500 transition-colors">
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-diary-200 shadow-sm space-y-6">
        
        {/* Fitur Pemilih Penulis */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Siapa yang menulis?</label>
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

        <h2 className="text-xl font-semibold text-slate-700">Bagaimana perasaanmu hari ini?</h2>
        
        <div className="flex justify-between md:justify-start md:gap-4">
          {['😭', '😔', '😐', '🙂', '🥰'].map((emoji, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedMood(emoji)}
              className={`text-4xl p-2 md:p-4 rounded-2xl transition-all border-2 outline-none
                ${selectedMood === emoji 
                  ? 'bg-diary-200 border-diary-400 scale-110' 
                  : 'bg-diary-100 border-transparent hover:bg-diary-200 hover:scale-105' 
                }
              `}
              title="Pilih mood ini"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Ceritakan lebih detail (opsional):
          </label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 min-h-[160px] resize-none text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Hari ini aku merasa..."
          ></textarea>
        </div>

        <button 
          onClick={handleSaveJournal}
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl transition-colors shadow-sm text-lg
            ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-diary-400 hover:bg-[#f97ebf]'}
          `}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal'}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700">Catatan Sebelumnya</h3>
        
        {journals.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada jurnal. Jadilah yang pertama bercerita!</p>
        ) : (
          journals.map((journal) => (
            <div key={journal.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-400">
                  {journal.createdAt?.toDate ? journal.createdAt.toDate().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru saja'}
                </span>
                <span className="text-2xl">{journal.mood}</span>
              </div>
              
              {journal.note && (
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {journal.note}
                </p>
              )}
              
              {/* Warna label dibedakan berdasarkan nama author */}
              <div className={`mt-4 inline-block px-3 py-1 text-xs font-bold rounded-full
                ${journal.author === 'Jessica' 
                  ? 'bg-diary-100 text-diary-400' 
                  : 'bg-blue-100 text-blue-500'}
              `}>
                {journal.author}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}