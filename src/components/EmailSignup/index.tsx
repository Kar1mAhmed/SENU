import React from 'react';
import Button from '../Button';

const EmailSignup = () => {
  return (
    <div className="relative z-20 flex justify-center mt-0 md:py-16 px-4">
      <div className="bg-transparent rounded-full p-1 flex items-center gap-x-1 border border-white/10 w-full max-w-[260px] md:max-w-md">
        <input
          type="email"
          placeholder="Enter you email address"
          className="bg-transparent text-white/50 placeholder:text-white/50 focus:outline-none focus:ring-0 text-xs md:text-sm px-3 py-2 flex-grow"
        />
        <div className="flex-shrink-0">
          <Button className="w-[96px] h-[32px] md:w-[139px] md:h-[39px] font-normal tracking-normal">Get in touch</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSignup;
