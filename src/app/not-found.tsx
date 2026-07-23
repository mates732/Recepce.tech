import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center">
        <span className="mb-4 inline-block font-mono text-xs tracking-[0.3em] text-[#8b5cf6]/50">
          [ 404 ]
        </span>
        <h2 className="mb-4 text-2xl font-bold text-white/80">
          Cesta nenalezena
        </h2>
        <p className="mb-8 font-mono text-sm text-white/30">
          Tato stránka neexistuje nebo byla přesunuta.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-mono text-xs tracking-wider text-white/40 transition-all duration-300 hover:border-[#00d4ff]/20 hover:text-[#00d4ff]/60"
        >
          Zpět na MINDSPACE
        </Link>
      </div>
    </div>
  );
}
