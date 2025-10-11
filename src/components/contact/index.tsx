'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContactFormData, ContactMethod } from '@/lib/types';
import { FiCopy, FiCheck, FiChevronDown, FiX, FiAlertCircle } from 'react-icons/fi';
import { contactAPI } from '@/lib/api-client';
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import FadeIn from '@/components/animations/FadeIn';



// Country names mapping
const countryNames: Record<string, string> = {
  'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
  'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
  'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway',
  'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'CZ': 'Czech Republic', 'PT': 'Portugal',
  'GR': 'Greece', 'IE': 'Ireland', 'HU': 'Hungary', 'RO': 'Romania', 'BG': 'Bulgaria',
  'RU': 'Russia', 'UA': 'Ukraine', 'TR': 'Turkey', 'IL': 'Israel', 'SA': 'Saudi Arabia',
  'AE': 'UAE', 'QA': 'Qatar', 'KW': 'Kuwait', 'BH': 'Bahrain', 'OM': 'Oman',
  'JO': 'Jordan', 'LB': 'Lebanon', 'EG': 'Egypt', 'ZA': 'South Africa', 'NG': 'Nigeria',
  'KE': 'Kenya', 'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'IN': 'India',
  'TH': 'Thailand', 'VN': 'Vietnam', 'PH': 'Philippines', 'ID': 'Indonesia', 'MY': 'Malaysia',
  'SG': 'Singapore', 'NZ': 'New Zealand', 'BR': 'Brazil', 'MX': 'Mexico', 'AR': 'Argentina',
  'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru', 'VE': 'Venezuela'
};

// Generate all country codes from libphonenumber-js with unique keys
const countryCodes = getCountries().map(country => ({
  code: `+${getCountryCallingCode(country)}`,
  country: country,
  name: countryNames[country] || country,
  key: `${country}-${getCountryCallingCode(country)}` // Unique key combining country code and calling code
})).sort((a, b) => a.name.localeCompare(b.name));

export default function GetInTouchSection() {
  const searchParams = useSearchParams();

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  // Pre-fill email from URL parameter
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      console.log('📧 Pre-filling email from URL:', emailParam);
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  console.log('🚀 GetInTouchSection rendered with new design');

  const validateEmail = (email: string): boolean => {
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
    try {
      // Find the country from the country code
      const country = countryCodes.find(c => c.code === countryCode);
      if (!country) return false;

      // Validate using libphonenumber-js
      const fullNumber = `${countryCode}${phone.replace(/\s/g, '')}`;
      return isValidPhoneNumber(fullNumber, country.country as CountryCode);
    } catch (error) {
      console.error('Phone validation error:', error);
      return false;
    }
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
    setIsCountryDropdownOpen(false); // Close country dropdown when changing method
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('info@senu.studio');
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
      } else if (!validatePhoneNumber(formData.phoneNumber, formData.countryCode || '+1')) {
        newErrors.phoneNumber = 'Please enter a valid phone number for the selected country';
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
      // Submit to backend API
      await contactAPI.create({
        name: formData.name,
        contactMethod: formData.contactMethod,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message,
      });

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

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      console.log('💥 Form submission failed faster than my patience with loading screens:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-glass-fill backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheck className="w-10 h-10 text-green-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-new-black text-center text-white mb-4">
              MESSAGE SENT!
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-center font-alexandria mb-8">
              Thanks for reaching out! We&apos;ll get back to you as soon as possible.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue hover:bg-blue/80 text-white font-alexandria font-semibold py-4 px-6 rounded-full transition-all duration-300 uppercase tracking-wider"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-glass-fill backdrop-blur-md border border-red-500/50 rounded-2xl p-8 md:p-12 max-w-md w-full animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiAlertCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-new-black text-center text-white mb-4">
              OOPS!
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-center font-alexandria mb-8">
              {errorMessage}
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-alexandria font-semibold py-4 px-6 rounded-full transition-all duration-300 uppercase tracking-wider"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

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

        <div className="relative z-10 w-full max-w-6xl mx-auto mt-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Side - Heading */}
            <FadeIn direction="left" duration={0.8}>
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
            </FadeIn>

            {/* Right Side - Contact Form */}
            <FadeIn direction="right" delay={0.2} duration={0.8}>
              <div className="relative">
                {/* Header with Email and Actions */}
                <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-400 text-sm font-alexandria uppercase tracking-wider">
                    DROP A LINE
                  </p>
                  <button
                    onClick={copyEmailToClipboard}
                    className={`flex items-center gap-2 text-sm font-alexandria transition-colors ${isEmailCopied ? 'text-green-400' : 'text-gray-400 hover:text-white'
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
                  info@senu.studio
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
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        setIsCountryDropdownOpen(false); // Close country dropdown
                      }}
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
                        onClick={() => {
                          setIsCountryDropdownOpen(!isCountryDropdownOpen);
                          setIsDropdownOpen(false); // Close method dropdown
                          setCountrySearch(''); // Reset search
                        }}
                        className="bg-transparent border-b border-[#8E8E8E] text-white py-3 px-0 pr-8 focus:outline-none focus:border-blue transition-colors font-alexandria text-left min-w-[80px]"
                      >
                        {formData.countryCode}
                        <FiChevronDown className={`w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCountryDropdownOpen && (
                        <div
                          className="absolute top-full left-0 w-64 mt-1 bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg z-50 overflow-hidden"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                          }}
                        >
                          {/* Search Input */}
                          <div className="p-2 border-b border-white/10">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country..."
                              className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue"
                              autoFocus
                            />
                          </div>

                          {/* Country List */}
                          <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {countryCodes
                              .filter(country =>
                                countrySearch === '' ||
                                country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                country.code.includes(countrySearch)
                              )
                              .map((country, index, filteredArray) => (
                                <button
                                  key={country.key}
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('countryCode', country.code);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearch('');
                                  }}
                                  className={`w-full text-left px-6 py-3 text-white hover:bg-white/10 transition-colors font-alexandria text-sm ${index < filteredArray.length - 1 ? 'border-b border-white/10' : ''
                                    }`}
                                >
                                  {country.code} {country.name}
                                </button>
                              ))}
                          </div>
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
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}