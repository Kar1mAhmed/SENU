'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/main/Button';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📧 Navigating to contact page with email:', email);
    
    // Navigate to contact page with email as URL parameter
    if (email.trim()) {
      router.push(`/contact?email=${encodeURIComponent(email)}`);
    } else {
      router.push('/contact');
    }
  };

  return (
    <div className="relative z-20 flex justify-center mt-0 md:py-16 px-4">
      <form onSubmit={handleSubmit} className="bg-transparent rounded-full p-1 flex items-center gap-x-1 border border-white/10 w-full max-w-[300px] md:max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter you email address"
          className="bg-transparent text-white/50 placeholder:text-white/50 focus:outline-none focus:ring-0 text-xs md:text-sm px-2 py-2 flex-grow min-w-0"
        />
        <div className="flex-shrink-0">
          <Button type="submit" className="w-[90px] h-[32px] md:w-[139px] md:h-[39px] font-light tracking-normal">Message us</Button>
        </div>
      </form>
    </div>
  );
};

export default EmailSignup;
