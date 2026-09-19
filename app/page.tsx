import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      
      {/* Header Sambutan */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
          Selamat datang di <span className="text-diary-400">J & J Diary</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Ruang aman untuk kita berbagi cerita, bertumbuh dalam iman, dan merencanakan masa depan bersama.
        </p>
      </div>

      {/* Grid Menu Cepat (Diperbaiki agar kembali 2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
        
        {/* Kartu menu dengan warna dasar putih dan aksen border/hover Pink Sedang */}
        <Link href="/diary" className="group p-6 bg-white border-2 border-diary-200 rounded-2xl shadow-sm hover:shadow-md hover:border-diary-300 transition-all text-left flex flex-col justify-between h-32">
          <h3 className="text-xl font-semibold text-slate-700 group-hover:text-diary-400 transition-colors">📖 Diary & Perasaan</h3>
          <p className="text-sm text-slate-500">Bagaimana kabarmu hari ini?</p>
        </Link>

        <Link href="/bible-study" className="group p-6 bg-white border-2 border-diary-200 rounded-2xl shadow-sm hover:shadow-md hover:border-diary-300 transition-all text-left flex flex-col justify-between h-32">
          <h3 className="text-xl font-semibold text-slate-700 group-hover:text-diary-400 transition-colors">✝️ Pendalaman Alkitab</h3>
          <p className="text-sm text-slate-500">Mari bertumbuh bersama.</p>
        </Link>

        <Link href="/books" className="group p-6 bg-white border-2 border-diary-200 rounded-2xl shadow-sm hover:shadow-md hover:border-diary-300 transition-all text-left flex flex-col justify-between h-32">
          <h3 className="text-xl font-semibold text-slate-700 group-hover:text-diary-400 transition-colors">📚 Diskusi Buku</h3>
          <p className="text-sm text-slate-500">Buku apa yang sedang kamu baca?</p>
        </Link>

        <Link href="/timeline" className="group p-6 bg-white border-2 border-diary-200 rounded-2xl shadow-sm hover:shadow-md hover:border-diary-300 transition-all text-left flex flex-col justify-between h-32">
          <h3 className="text-xl font-semibold text-slate-700 group-hover:text-diary-400 transition-colors">🗓️ Timeline Dating</h3>
          <p className="text-sm text-slate-500">Rencana pertemuan kita selanjutnya.</p>
        </Link>

      </div>
    </div>
  );
}