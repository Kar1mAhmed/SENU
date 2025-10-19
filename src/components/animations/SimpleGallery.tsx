'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface GalleryItem {
  image: string;
  text: string;
  link?: string;
}

interface SimpleGalleryProps {
  items: GalleryItem[];
}

export default function SimpleGallery({ items }: SimpleGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const router = useRouter();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (link?: string) => {
    if (!isDragging && link) {
      router.push(link);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none h-full py-4 "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[200px] flex flex-col gap-3 cursor-pointer"
          onClick={() => handleClick(item.link)}
        >
          <div className="relative w-[200px] h-[250px] rounded-2xl overflow-hidden bg-neutral-900">
            <Image
              src={item.image}
              alt={item.text}
              fill
              className="object-cover"
              draggable={false}
              priority
              unoptimized
            />
          </div>
          <p className="font-new-black font-light text-white text-base text-center px-2">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}
