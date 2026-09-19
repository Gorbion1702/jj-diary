'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function TimelinePage() {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState<'Jason' | 'Jessica'>('Jason');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      // Mengurutkan berdasarkan tanggal acara (eventDate), bukan tanggal pembuatan
      const q = query(collection(db, 'timeline_events'), orderBy('eventDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(data);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveEvent = async () => {
    if (!date || !title.trim()) {
      alert("Tanggal dan judul acara wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'timeline_events'), {
        eventDate: date, // Menyimpan string tanggal (YYYY-MM-DD)
        title: title,
        description: description,
        author: author,
        createdAt: new Date() // Menyimpan waktu pencatatan
      });
      
      setDate('');
      setTitle('');
      setDescription('');
      alert("Momen berhasil ditambahkan ke timeline! 🗓️");
      
      fetchEvents();
    } catch (error) {
      console.error("Error menyimpan momen:", error);
      alert("Gagal menyimpan data. Coba lagi, ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi utilitas untuk memformat tanggal YYYY-MM-DD menjadi lebih mudah dibaca
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Timeline Dating 🗓️</h1>
        <Link href="/" className="text-sm font-medium text-diary-400 hover:text-pink-500 transition-colors">
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-diary-200 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Siapa yang menambahkan momen ini?</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600">Tanggal Momen:</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600">Judul Momen:</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-slate-700 bg-slate-50 focus:bg-white transition-colors"
              placeholder="Misal: Nonton Konser Bareng"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Cerita atau Detail (Opsional):
          </label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 min-h-[120px] resize-none text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Kesan hari itu..."
          ></textarea>
        </div>

        <button 
          onClick={handleSaveEvent}
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl transition-colors shadow-sm text-lg
            ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-diary-400 hover:bg-[#f97ebf]'}
          `}
        >
          {isSubmitting ? 'Menyimpan...' : 'Tambahkan Momen'}
        </button>
      </div>

      <div className="space-y-0 pt-6 mt-4 relative">
        <h3 className="text-lg font-semibold text-slate-700 mb-6">Perjalanan Kita</h3>
        
        {/* Garis Vertikal untuk Timeline */}
        <div className="absolute left-[27px] top-[70px] bottom-0 w-[2px] bg-diary-200 z-0 hidden md:block"></div>

        {events.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada momen yang tercatat.</p>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.id} className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 z-10">
                
                {/* Indikator Titik (Desktop) */}
                <div className="hidden md:flex items-center justify-center w-14 h-14 bg-diary-100 rounded-full border-4 border-white shadow-sm shrink-0 mt-1">
                  <span className="text-xl">🤍</span>
                </div>

                {/* Konten Kartu */}
                <div className="flex-1 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-1">
                    <h4 className="text-xl font-bold text-slate-800">{event.title}</h4>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full w-max">
                      {formatDate(event.eventDate)}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className={`mt-4 inline-block px-3 py-1 text-xs font-bold rounded-full
                    ${event.author === 'Jessica' 
                      ? 'bg-diary-100 text-diary-400' 
                      : 'bg-blue-100 text-blue-500'}
                  `}>
                    Ditambahkan oleh {event.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}