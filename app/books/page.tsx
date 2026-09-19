'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function BooksPage() {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthorName, setBookAuthorName] = useState(''); // Nama pengarang buku
  const [review, setReview] = useState('');
  const [author, setAuthor] = useState<'Jason' | 'Jessica'>('Jason'); // Siapa yang mereview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [books, setBooks] = useState<any[]>([]);

  const fetchBooks = async () => {
    try {
      const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(data);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveBook = async () => {
    if (!bookTitle.trim() || !review.trim()) {
      alert("Judul buku dan pendapatmu wajib diisi ya!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'books'), {
        title: bookTitle,
        bookAuthor: bookAuthorName,
        review: review,
        author: author,
        createdAt: new Date()
      });
      
      setBookTitle('');
      setBookAuthorName('');
      setReview('');
      alert("Review buku berhasil disimpan! 📚");
      
      fetchBooks();
    } catch (error) {
      console.error("Error menyimpan buku:", error);
      alert("Gagal menyimpan data. Coba lagi, ya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Diskusi Buku 📚</h1>
        <Link href="/" className="text-sm font-medium text-diary-400 hover:text-pink-500 transition-colors">
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-diary-200 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Siapa yang membaca buku ini?</label>
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
            <label className="text-sm font-medium text-slate-600">Judul Buku:</label>
            <input 
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-slate-700 bg-slate-50 focus:bg-white transition-colors"
              placeholder="Misal: Atomic Habits"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600">Penulis Buku (Opsional):</label>
            <input 
              type="text"
              value={bookAuthorName}
              onChange={(e) => setBookAuthorName(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-slate-700 bg-slate-50 focus:bg-white transition-colors"
              placeholder="Misal: James Clear"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Pendapatmu tentang buku ini:
          </label>
          <textarea 
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 min-h-[160px] resize-none text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Buku ini menarik karena..."
          ></textarea>
        </div>

        <button 
          onClick={handleSaveBook}
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl transition-colors shadow-sm text-lg
            ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-diary-400 hover:bg-[#f97ebf]'}
          `}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Diskusi Buku'}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700">Daftar Buku yang Dibaca</h3>
        
        {books.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada buku yang dibahas.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{book.title}</h4>
                  {book.bookAuthor && (
                    <p className="text-sm font-medium text-slate-500">Oleh: {book.bookAuthor}</p>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {book.createdAt?.toDate ? book.createdAt.toDate().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru saja'}
                </span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl mt-4">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  "{book.review}"
                </p>
              </div>
              
              <div className={`mt-4 inline-block px-3 py-1 text-xs font-bold rounded-full
                ${book.author === 'Jessica' 
                  ? 'bg-diary-100 text-diary-400' 
                  : 'bg-blue-100 text-blue-500'}
              `}>
                Direview oleh {book.author}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}