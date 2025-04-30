'use client';

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#1e1e1e] flex items-center justify-center overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5d31ff]/10 via-[#1e1e1e]/20 to-[#5d31ff]/10 animate-gradient"></div>

      {/* Glowing orb effects */}
      <div className="absolute w-[600px] h-[600px] bg-[#5d31ff]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#1e1e1e]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-[500px] h-[500px] bg-[#5d31ff]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 text-center">
        {/* SENU text with gradient and glow */}
        <h1 className="text-7xl md:text-9xl font-bold mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5d31ff] via-[#7d5fff] to-[#5d31ff]">
            SENU
          </span>
        </h1>

        {/* Animated dots with glow */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-3 h-3 bg-[#5d31ff] rounded-full animate-bounce shadow-[0_0_20px_rgba(93,49,255,0.5)]"></div>
          <div className="w-3 h-3 bg-[#7d5fff] rounded-full animate-bounce shadow-[0_0_20px_rgba(125,95,255,0.5)]" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#5d31ff] rounded-full animate-bounce shadow-[0_0_20px_rgba(93,49,255,0.5)]" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Coming Soon text with gradient and animation */}
        <p className="text-xl md:text-2xl font-light tracking-widest">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5d31ff] via-[#7d5fff] to-[#5d31ff] animate-text-gradient">
            COMING SOON
          </span>
        </p>
      </div>
    </div>
  );
}
