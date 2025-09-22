'use client';

import { useState } from 'react';
import { ContactFormData, ContactMethod } from '@/lib/types';
import { FiCopy, FiCheck, FiChevronDown } from 'react-icons/fi';

const countryCodes = [
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+39', country: 'IT', name: 'Italy' },
  { code: '+34', country: 'ES', name: 'Spain' },
  { code: '+31', country: 'NL', name: 'Netherlands' },
  { code: '+46', country: 'SE', name: 'Sweden' },
  { code: '+47', country: 'NO', name: 'Norway' },
  { code: '+45', country: 'DK', name: 'Denmark' },
  { code: '+41', country: 'CH', name: 'Switzerland' },
  { code: '+43', country: 'AT', name: 'Austria' },
  { code: '+32', country: 'BE', name: 'Belgium' },
  { code: '+351', country: 'PT', name: 'Portugal' },
  { code: '+353', country: 'IE', name: 'Ireland' },
  { code: '+358', country: 'FI', name: 'Finland' },
  { code: '+420', country: 'CZ', name: 'Czech Republic' },
  { code: '+48', country: 'PL', name: 'Poland' },
  { code: '+36', country: 'HU', name: 'Hungary' },
  { code: '+30', country: 'GR', name: 'Greece' },
  { code: '+90', country: 'TR', name: 'Turkey' },
  { code: '+7', country: 'RU', name: 'Russia' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+82', country: 'KR', name: 'South Korea' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+64', country: 'NZ', name: 'New Zealand' },
  { code: '+55', country: 'BR', name: 'Brazil' },
  { code: '+52', country: 'MX', name: 'Mexico' },
  { code: '+54', country: 'AR', name: 'Argentina' },
  { code: '+56', country: 'CL', name: 'Chile' },
  { code: '+57', country: 'CO', name: 'Colombia' },
  { code: '+51', country: 'PE', name: 'Peru' },
  { code: '+58', country: 'VE', name: 'Venezuela' },
  { code: '+27', country: 'ZA', name: 'South Africa' },
  { code: '+20', country: 'EG', name: 'Egypt' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+965', country: 'KW', name: 'Kuwait' },
  { code: '+974', country: 'QA', name: 'Qatar' },
  { code: '+973', country: 'BH', name: 'Bahrain' },
  { code: '+968', country: 'OM', name: 'Oman' },
  { code: '+962', country: 'JO', name: 'Jordan' },
  { code: '+961', country: 'LB', name: 'Lebanon' },
  { code: '+972', country: 'IL', name: 'Israel' },
];

export default function GetInTouchSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    contactMethod: 'email',
    countryCode: '+1',
    phoneNumber: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  console.log('🚀 GetInTouchSection rendered with new design');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    console.log(`📝 Field ${field} updated to:`, value.length > 50 ? `${value.substring(0, 50)}...` : value);
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContactMethodChange = (method: ContactMethod) => {
    console.log('🔄 Contact method changed to:', method);
    setFormData(prev => ({
      ...prev,
      contactMethod: method,
      // Clear the non-selected method's data
      ...(method === 'email' ? { phoneNumber: '', countryCode: '+1' } : { email: '' })
    }));
    
    // Clear related errors
    setErrors(prev => ({
      ...prev,
      email: undefined,
      phoneNumber: undefined,
      countryCode: undefined
    }));
    
    setIsDropdownOpen(false);
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('senu@senu.studio');
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2000);
      console.log('📋 Email copied to clipboard successfully!');
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.contactMethod === 'email') {
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (formData.contactMethod === 'phone' || formData.contactMethod === 'whatsapp') {
      if (!formData.phoneNumber?.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    console.log('🔍 Form validation result:', isValid ? 'valid' : 'invalid', 
      isValid ? '' : `Errors: ${Object.keys(newErrors).join(', ')}`);
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('❌ Form submission blocked due to validation errors');
      return;
    }

    setIsSubmitting(true);
    console.log('📤 Form submission started for contact method:', formData.contactMethod);

    try {
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('✅ Form submitted successfully! Time to celebrate 🎉');
      
      // Reset form
      setFormData({
        name: '',
        contactMethod: 'email',
        countryCode: '+1',
        phoneNumber: '',
        email: '',
        message: '',
      });
      
      // Show success message (you might want to add a toast notification here)
      alert('Message sent successfully!');
      
    } catch (error) {
      console.log('💥 Form submission failed faster than my patience with loading screens:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-button:start:decrement,
        .custom-scrollbar::-webkit-scrollbar-button:end:increment {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      <section className="relative min-h-screen flex items-center justify-center p-4 md:p-8 my-12 mb-24 md:my-2 md:mb-2">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(26, 26, 26, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 26, 26, 1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Heading */}
          <div className="text-left">
            <h2 className="font-new-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight">
              GET YOUR PROJECT
              <br />
              <span className="text-blue">IN THE NEXT LEVEL</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mt-6 font-alexandria">
              Ready to bring your vision to life? Let&apos;s start the conversation.
            </p>
          </div>

          {/* Right Side - Contact Form */}
          <div className="relative">
            {/* Header with Email and Actions */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 text-sm font-alexandria uppercase tracking-wider">
                  DROP A LINE
                </p>
                <button 
                  onClick={copyEmailToClipboard}
                  className={`flex items-center gap-2 text-sm font-alexandria transition-colors ${
                    isEmailCopied ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  COPY EMAIL 
                  {isEmailCopied ? (
                    <FiCheck className="w-4 h-4" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <h3 className="text-yellow text-4xl md:text-5xl lg:text-6xl font-new-black font-light">
                senu@senu.studio
              </h3>
            </div>

            {/* Contact Form - No Background */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-transparent border-b border-[#8E8E8E] text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                    placeholder="NAME *"
                  />
                  {errors.name && (
                    <p className="text-red text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-transparent border-b border-[#8E8E8E] text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                    placeholder="EMAIL *"
                  />
                  {errors.email && (
                    <p className="text-red text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Contact Method Dropdown */}
              <div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-transparent border-b border-[#8E8E8E] text-gray-400 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria text-left flex justify-between items-center"
                  >
                    <span className="uppercase">
                      {formData.contactMethod === 'phone' ? 'PHONE CALL' : 
                       formData.contactMethod === 'whatsapp' ? 'WHATSAPP' : 'EMAIL'}
                    </span>
                    <FiChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg z-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange('phone')}
                        className="w-full text-left px-6 py-4 text-white hover:bg-white/10 transition-colors font-alexandria uppercase border-b border-white/10"
                      >
                        PHONE CALL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange('whatsapp')}
                        className="w-full text-left px-6 py-4 text-white hover:bg-white/10 transition-colors font-alexandria uppercase border-b border-white/10"
                      >
                        WHATSAPP
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange('email')}
                        className="w-full text-left px-6 py-4 text-white hover:bg-white/10 transition-colors font-alexandria uppercase"
                      >
                        EMAIL
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Phone */}
              <div>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="bg-transparent border-b border-[#8E8E8E] text-white py-3 px-0 pr-8 focus:outline-none focus:border-blue transition-colors font-alexandria text-left min-w-[80px]"
                    >
                      {formData.countryCode}
                      <FiChevronDown className={`w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 w-64 mt-1 bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg z-50 max-h-60 overflow-y-auto custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                        }}
                      >
                        {countryCodes.map((country, index) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              handleInputChange('countryCode', country.code);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-6 py-3 text-white hover:bg-white/10 transition-colors font-alexandria text-sm ${
                              index < countryCodes.length - 1 ? 'border-b border-white/10' : ''
                            }`}
                          >
                            {country.code} {country.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="flex-1 bg-transparent border-b border-[#8E8E8E] text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                    placeholder="PHONE *"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Row 4: Message Field (Single Line) */}
              <div>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-transparent border-b border-[#8E8E8E] text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                  placeholder="MESSAGE"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue hover:bg-blue/80 text-white font-alexandria font-semibold py-4 px-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isSubmitting ? 'SENDING...' : 'HIT US'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}