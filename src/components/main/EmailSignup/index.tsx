import React from 'react';
import Button from '@/components/main/Button';

const EmailSignup = () => {
  return (
    <div className="relative z-20 flex justify-center mt-0 md:py-16 px-4">
      <div className="bg-transparent rounded-full p-1 flex items-center gap-x-1 border border-white/10 w-full max-w-[300px] md:max-w-md">
        <input
          type="email"
          placeholder="Enter you email address"
          className="bg-transparent text-white/50 placeholder:text-white/50 focus:outline-none focus:ring-0 text-xs md:text-sm px-2 py-2 flex-grow min-w-0"
        />
        <div className="flex-shrink-0">
          <Button className="w-[90px] h-[32px] md:w-[139px] md:h-[39px] font-light tracking-normal ">Message us</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSignup;
