'use client';

export default function Home() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Glassmorphism orbs with enhanced motion */}
      <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#5d31ff]/5 rounded-full blur-[100px] animate-float-slow backdrop-blur-xl"></div>
      <div className="absolute w-[250px] h-[250px] md:w-[550px] md:h-[550px] bg-[#1e1e1e]/20 rounded-full blur-[80px] animate-float-slow backdrop-blur-xl" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-[280px] h-[280px] md:w-[580px] md:h-[580px] bg-[#5d31ff]/8 rounded-full blur-[90px] animate-float-slow backdrop-blur-xl" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 text-center">
        {/* Modern SENU text with enhanced glow and subtle motion */}
        <h1 className="text-7xl md:text-9xl font-bold mb-8 animate-float-very-slow">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d31ff] to-[#8a5cff] drop-shadow-[0_0_30px_rgba(93,49,255,0.6)]">
            SENU
          </span>
        </h1>

        {/* Modern Coming Soon text with subtle motion */}
        <p className="text-lg md:text-xl font-light tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-float-very-slow" style={{ animationDelay: '0.5s' }}>
          COMING SOON
        </p>
      </div>
    </div>
  );
}
