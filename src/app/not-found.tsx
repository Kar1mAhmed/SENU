'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import BackgroundGrid from '@/components/BackgroundGrid';
import Ribbon from '@/components/Ribbon';

export default function GlobalNotFound() {
  return (
    <>
      <Navbar />
      <BackgroundGrid />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Ribbon />
      </div>

      <main className="relative flex flex-col items-center justify-center text-center min-h-screen px-4">
        <div className="transform -rotate-[5deg]">
          <p className="text-white/10 font-new-black text-6xl md:text-8xl mb-4">ERROR</p>
          <h1 className="font-new-black text-[120px] md:text-[240px] leading-none text-white/5 tracking-tight select-none">404</h1>
        </div>
      </main>


    </>
  );
}
