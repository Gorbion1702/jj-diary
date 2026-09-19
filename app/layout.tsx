import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'J & J Diary ❤️',
  description: 'Ruang khusus untuk Jason & Jessica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      {/* Background utama aplikasi diubah menjadi warna Pink Sangat Pudar */}
      <body className={`${inter.className} bg-diary-100 text-slate-800 min-h-screen`}>
        
        {/* Navbar menggunakan warna Pink Pudar dengan logo Pink Tua */}
        <nav className="bg-diary-200 shadow-sm p-4 mb-6">
          {/* Di sini perubahannya: flex-col untuk HP, md:flex-row untuk Laptop, dan diberi gap */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <Link href="/" className="text-xl md:text-2xl font-bold text-diary-400 shrink-0">
              J & J Diary ❤️
            </Link>
            
            {/* Navigasi dibungkus dengan flex-wrap agar kalau layarnya sangat kecil, teksnya tidak keluar jalur */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <Link href="/diary" className="hover:text-diary-400 transition-colors">Diary</Link>
              <Link href="/bible-study" className="hover:text-diary-400 transition-colors">Alkitab</Link>
              <Link href="/books" className="hover:text-diary-400 transition-colors">Buku</Link>
              <Link href="/timeline" className="hover:text-diary-400 transition-colors">Timeline</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  )
}