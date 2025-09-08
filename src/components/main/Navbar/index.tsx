'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/main/Button';
import { FaInstagram, FaBehance, FaVimeo } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('🧭 Navbar scroll detection activated - playing hide and seek with the footer!');

    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Hide navbar when footer is 200px from top of viewport
        const shouldHide = footerRect.top <= viewportHeight - 400;
        setIsVisible(!shouldHide);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-40 pt-[46px] px-4 lg:px-0 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
        <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-full w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1280px] h-[71px] mx-auto pr-4 lg:pr-[24px] py-[16px] flex items-center">
          <nav className="relative flex items-center justify-between w-full">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img src="/logo.svg" alt="Senu Logo" className="w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] mx-8 lg:mx-12" />
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
