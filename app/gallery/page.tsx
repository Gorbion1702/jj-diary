'use client';

import Link from 'next/link';
import Image from 'next/image'; // Komponen bawaan Next.js untuk optimasi gambar
import { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function GalleryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [author, setAuthor] = useState<'Jason' | 'Jessica'>('Jason');
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(data);
    } catch (error) {
      console.error("Error mengambil foto:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fungsi untuk menangani saat user memilih file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Membuat URL preview sementara agar gambar terlihat sebelum diunggah
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih foto terlebih dahulu!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Buat referensi tempat file akan disimpan di Firebase Storage
      // Menggunakan timestamp agar nama file unik dan tidak tertimpa
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      
      // 2. Unggah file fisiknya ke Storage
      const snapshot = await uploadBytes(storageRef, file);
      
      // 3. Ambil URL publik dari file yang baru saja diunggah
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 4. Simpan URL dan detailnya ke Firestore Database
      await addDoc(collection(db, 'gallery'), {
        imageUrl: downloadURL,
        caption: caption,
        author: author,
        createdAt: new Date()
      });
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
      alert("Foto berhasil diunggah! 📸");
      
      fetchPhotos();
    } catch (error) {
      console.error("Error mengunggah foto:", error);
      alert("Gagal mengunggah foto. Pastikan ukuran file tidak terlalu besar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-8 space-y-6 md:space-y-8 px-4 md:px-0">
      
      <div className="flex items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">Galeri Kita 📸</h1>
        <Link href="/" className="shrink-0 text-sm font-medium text-diary-400 hover:text-pink-500 transition-colors mt-1 md:mt-0">
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl border-2 border-diary-200 shadow-sm space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Siapa yang mengunggah?</label>
          <div className="flex gap-3 md:gap-4">
            <button
              onClick={() => setAuthor('Jason')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl font-bold transition-all border-2 outline-none text-sm md:text-base
                ${author === 'Jason' 
                  ? 'border-blue-300 bg-blue-50 text-blue-500 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              👦🏻 Jason
            </button>
            <button
              onClick={() => setAuthor('Jessica')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl font-bold transition-all border-2 outline-none text-sm md:text-base
                ${author === 'Jessica' 
                  ? 'border-diary-300 bg-diary-50 text-diary-400 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              👧🏻 Jessica
            </button>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-100 my-4"></div>

        {/* Input File Foto */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">Pilih Foto:</label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-diary-100 file:text-diary-400 hover:file:bg-diary-200 transition-colors cursor-pointer"
          />
        </div>

        {/* Preview Foto */}
        {previewUrl && (
          <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border-2 border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Caption / Deskripsi (Opsional):
          </label>
          <input 
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 md:p-4 rounded-xl border-2 border-diary-100 focus:outline-none focus:border-diary-300 focus:ring-0 text-sm md:text-base text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Kenangan manis di..."
          />
        </div>

        <button 
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`w-full py-3 md:py-3.5 text-white font-bold rounded-xl transition-colors shadow-sm text-base md:text-lg
            ${(isUploading || !file) ? 'bg-slate-400 cursor-not-allowed' : 'bg-diary-400 hover:bg-[#f97ebf]'}
          `}
        >
          {isUploading ? 'Mengunggah Foto...' : 'Unggah Foto'}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg md:text-xl font-semibold text-slate-700">Album Kenangan</h3>
        
        {photos.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada foto yang diunggah.</p>
        ) : (
          /* Menggunakan Grid agar foto tampil seperti galeri (2 kolom di HP, 2 kolom di Desktop) */
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="relative w-full aspect-square bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption || 'Foto Galeri'} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 flex flex-col grow justify-between">
                  {photo.caption && (
                    <p className="text-slate-700 text-sm font-medium leading-snug mb-2 line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-auto">
                    <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md
                      ${photo.author === 'Jessica' 
                        ? 'bg-diary-100 text-diary-400' 
                        : 'bg-blue-100 text-blue-500'}
                    `}>
                      {photo.author}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {photo.createdAt?.toDate ? photo.createdAt.toDate().toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : ''}
                    </span>
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