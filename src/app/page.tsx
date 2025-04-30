'use client';

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#1e1e1e] flex items-center justify-center overflow-hidden relative">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e1e] via-[#1e1e1e] via-[#5d31ff]/3 to-[#1e1e1e]"></div>

      {/* Enhanced glowing orb effects */}
      <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#5d31ff]/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute w-[250px] h-[250px] md:w-[550px] md:h-[550px] bg-[#1e1e1e]/30 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-[280px] h-[280px] md:w-[580px] md:h-[580px] bg-[#5d31ff]/15 rounded-full blur-[90px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 text-center">
        {/* SENU text with glow */}
        <h1 className="text-7xl md:text-9xl font-bold mb-8">
          <span className="text-[#5d31ff] drop-shadow-[0_0_30px_rgba(93,49,255,0.6)]">
            SENU
          </span>
        </h1>

        {/* Animated dots with glow */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-3 h-3 bg-[#5d31ff] rounded-full animate-bounce shadow-[0_0_30px_rgba(93,49,255,0.6)]"></div>
          <div className="w-3 h-3 bg-[#5d31ff] rounded-full animate-bounce shadow-[0_0_30px_rgba(93,49,255,0.6)]" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#5d31ff] rounded-full animate-bounce shadow-[0_0_30px_rgba(93,49,255,0.6)]" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Coming Soon text */}
        <p className="text-xl md:text-2xl font-light tracking-widest text-[#5d31ff] drop-shadow-[0_0_20px_rgba(93,49,255,0.4)]">
          COMING SOON
        </p>
      </div>
    </div>
  );
}
