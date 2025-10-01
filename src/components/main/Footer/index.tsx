'use client';

import React from 'react';
import Button from '@/components/main/Button';
import { FaInstagram, FaBehance, FaVimeo } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { WithClassName } from '@/lib/types';
import Link from "next/link";

const Footer: React.FC<WithClassName> = ({ className }) => {
  console.log('ðŸ¦¶ Footer component rendering - time to put our best foot forward!');

  return (
    <footer className={`bg-black text-white ${className}`}>
      {/* Main CTA Section */}
      <div className="relative bg-black py-20 lg:py-32 overflow-hidden">
        {/* Glowing Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(193, 60, 27, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(193, 60, 27, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(250, 197, 58, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250, 197, 58, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px',
            animation: 'pulse 3s ease-in-out infinite'
          }}></div>

          {/* Glowing dots at grid intersections */}

        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="font-new-black text-4xl lg:text-6xl xl:text-8xl leading-tight mb-16 transition-transform duration-300">
              <span className="text-orange animate-pulse">LET'S BOOST</span>
              <br />
              <span className="text-white">YOUR BRAND</span>
            </h2>
            <div className="flex justify-center">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <Link href="/contact">
                  <Button className="w-auto px-16 py-4  font-bold shadow-2xl hover:shadow-orange/20 !text-[13px] h-auto">Let's Create</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">

          {/* Mobile Layout - Stacked and Centered */}
          <div className="block lg:hidden">
            {/* Logo - Centered using flexbox */}
            <div className="w-full flex justify-center mb-8">
              <img src="/logo.svg" alt="Senu Logo" className="w-32 h-auto mb-6 transform transition-transform duration-300" />
            </div>

            {/* Social Media - Centered using flexbox */}
            <div className="w-full flex justify-center mb-8">
              <div className="flex items-center gap-5 text-neutral-300 text-[18px]">
                <a
                  href="https://www.behance.net/senustudio"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaBehance />
                </a>
                <a
                  href="https://www.instagram.com/senustudio?igsh=MWlwYXVsNzhjaGl4OQ=="
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://vimeo.com/user148650237?fl=pp&fe=sh"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaVimeo />
                </a>
                <a
                  href="https://x.com/SenuStudio?t=aOfXFTohTylen_owLZcawQ&s=09"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiX />
                </a>
              </div>
            </div>

            {/* Navigation Links - Two Columns */}
            <div className="grid grid-cols-2 gap-8">
              {/* Home Page Links */}
              <div className="text-center">
                <h3 className="font-alexandria text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                  HOME PAGE
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      PORTFOLIO
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      ABOUT
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Utility Pages Links */}
              <div className="text-center">
                <h3 className="font-alexandria text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                  UTILITY PAGES
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/brand" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      BRAND
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      CONTACT US
                    </a>
                  </li>
                  <li>
                    <a href="/styleguide" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                      STYLEGUIDE
                    </a>
                  </li>

                </ul>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Logo and Social Media */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <img src="/logo.svg" alt="Senu Logo" className="w-32 h-auto mb-6 transform transition-transform duration-300" />
              </div>

              <div className="flex items-center gap-5 text-neutral-300 text-[18px]">
                <a
                  href="https://www.behance.net/senustudio"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaBehance />
                </a>
                <a
                  href="https://www.instagram.com/senustudio?igsh=MWlwYXVsNzhjaGl4OQ=="
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://vimeo.com/user148650237?fl=pp&fe=sh"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaVimeo />
                </a>
                <a
                  href="https://x.com/SenuStudio?t=aOfXFTohTylen_owLZcawQ&s=09"
                  className="hover:text-white transition-colors transform hover:scale-110 duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiX />
                </a>
              </div>
            </div>

            {/* Home Page Links */}
            <div>
              <h3 className="font-alexandria text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                HOME PAGES
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    PORTFOLIO
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    ABOUT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Utility Pages Links */}
            <div>
              <h3 className="font-alexandria text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                UTILITY PAGES
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    PRIVACY&POLICY
                  </a>
                </li>
                <li>
                  <a href="/contact" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    CONTACT US
                  </a>
                </li>
                <li>
                  <a href="/imprint" className="font-alexandria text-sm text-gray-300 hover:text-white transition-colors uppercase">
                    IMPRINT
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="font-alexandria text-xs text-gray-500 uppercase tracking-wider">
              © 2025 ALL RIGHTS RESERVED
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="font-alexandria text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider">
                PRIVACY
              </a>
              <a href="/imprint" className="font-alexandria text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider">
                IMPRINT
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;