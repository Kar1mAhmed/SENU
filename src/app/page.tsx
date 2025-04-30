'use client';

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#1e1e1e] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-6xl font-bold mb-4">SENU</h1>
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-white text-xl">Coming Soon</p>
      </div>
    </div>
  );
}
