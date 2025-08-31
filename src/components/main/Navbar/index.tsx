'use client';

import React, { useState } from 'react';
import Button from '@/components/main/Button';
import { FaInstagram, FaBehance, FaVimeo} from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 pt-[46px] px-4 lg:px-0">
        <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-full max-w-[1240px] h-[71px] mx-auto pl-4 pr-4 lg:pl-[64px] lg:pr-[24px] py-[16px] flex items-center">
          <nav className="relative flex items-center justify-between w-full">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img src="/logo.svg" alt="Senu Logo" className="ml-2 w-[200px] h-[32px] md:w-[261px] md:h-[35px]" />
              </a>
            </div>

            {/* Center: Nav Links (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-x-8 font-alexandria text-xs uppercase font-normal text-neutral-300">
                <a href="/about" className="hover:text-white transition-colors">About</a>
                <a href="/service" className="hover:text-white transition-colors">Service</a>
                <a href="/portfolio" className="hover:text-white transition-colors">Portfolio</a>
              </div>
            </div>

            {/* Right: Socials and Button (Desktop) */}
            <div className="hidden lg:flex flex-shrink-0 items-center gap-x-6">
              <div className="flex items-center gap-x-5 text-neutral-300 text-[15px]"> 
                <a href="https://www.behance.net/senustudio" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaBehance /></a>
                <a href="https://www.instagram.com/senustudio?igsh=MWlwYXVsNzhjaGl4OQ==" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://vimeo.com/user148650237?fl=pp&fe=sh" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaVimeo /></a>
                <a href="https://x.com/SenuStudio?t=aOfXFTohTylen_owLZcawQ&s=09" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><SiX /></a>
              </div>
              <Button>Get in touch</Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mr-2 text-white text-[25px]">
                <FiMenu />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Popup */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-[140px] left-0 w-full z-50 px-4">
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-3xl p-8">
            <nav className="flex flex-col items-center text-center gap-y-6">
              <a href="/about" onClick={() => setIsMenuOpen(false)} className="font-alexandria text-sm font-normal uppercase text-neutral-300 hover:text-white transition-colors w-full pb-4 border-b border-white/10">About</a>
              <a href="/service" onClick={() => setIsMenuOpen(false)} className="font-alexandria text-sm font-normal uppercase text-neutral-300 hover:text-white transition-colors w-full pb-4 border-b border-white/10">Service</a>
              <a href="/portfolio" onClick={() => setIsMenuOpen(false)} className="font-alexandria text-sm font-normal uppercase text-neutral-300 hover:text-white transition-colors w-full pb-4">Portfolio</a>
            </nav>

            <div className="flex flex-col items-center gap-y-8 mt-8">
              <div className="flex items-center gap-x-8 text-white text-2xl">
              <a href="https://www.behance.net/senustudio" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaBehance /></a>
                <a href="https://www.instagram.com/senustudio?igsh=MWlwYXVsNzhjaGl4OQ==" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://vimeo.com/user148650237?fl=pp&fe=sh" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><FaVimeo /></a>
                <a href="https://x.com/SenuStudio?t=aOfXFTohTylen_owLZcawQ&s=09" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer"><SiX /></a>
              </div>
              <Button className="w-full h-[48px]">Get in touch</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
