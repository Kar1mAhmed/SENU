'use client';

import { useState } from 'react';
import { ContactFormData, ContactMethod } from '@/lib/types';

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+31', country: 'NL' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
  { code: '+41', country: 'CH' },
  { code: '+43', country: 'AT' },
  { code: '+32', country: 'BE' },
  { code: '+351', country: 'PT' },
  { code: '+353', country: 'IE' },
  { code: '+358', country: 'FI' },
  { code: '+420', country: 'CZ' },
  { code: '+48', country: 'PL' },
  { code: '+36', country: 'HU' },
  { code: '+30', country: 'GR' },
  { code: '+90', country: 'TR' },
  { code: '+7', country: 'RU' },
  { code: '+86', country: 'CN' },
  { code: '+81', country: 'JP' },
  { code: '+82', country: 'KR' },
  { code: '+91', country: 'IN' },
  { code: '+61', country: 'AU' },
  { code: '+64', country: 'NZ' },
  { code: '+55', country: 'BR' },
  { code: '+52', country: 'MX' },
  { code: '+54', country: 'AR' },
  { code: '+56', country: 'CL' },
  { code: '+57', country: 'CO' },
  { code: '+51', country: 'PE' },
  { code: '+58', country: 'VE' },
  { code: '+27', country: 'ZA' },
  { code: '+20', country: 'EG' },
  { code: '+971', country: 'AE' },
  { code: '+966', country: 'SA' },
  { code: '+965', country: 'KW' },
  { code: '+974', country: 'QA' },
  { code: '+973', country: 'BH' },
  { code: '+968', country: 'OM' },
  { code: '+962', country: 'JO' },
  { code: '+961', country: 'LB' },
  { code: '+972', country: 'IL' },
];

const contactMethods = [
  { value: 'email', label: 'EMAIL' },
  { value: 'whatsapp', label: 'WHATSAPP' }
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
  const [isContactMethodOpen, setIsContactMethodOpen] = useState(false);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);

  console.log('🚀 GetInTouchSection rendered with formData:', {
    ...formData,
    email: formData.email ? `${formData.email.substring(0, 10)}...` : '',
    phoneNumber: formData.phoneNumber ? `***${formData.phoneNumber.slice(-4)}` : ''
  });

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
    
    setIsContactMethodOpen(false);
  };

  const handleCountryCodeChange = (code: string) => {
    handleInputChange('countryCode', code);
    setIsCountryCodeOpen(false);
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
    } else {
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
        contactMethod: 'whatsapp',
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

  const currentContactMethod = contactMethods.find(method => method.value === formData.contactMethod);
  const currentCountryCode = countryCodes.find(country => country.code === formData.countryCode);

  return (
    <section className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
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
            {/* Glass morphism container */}
            <div className="bg-glass-fill backdrop-blur-md border border-gray-700/30 rounded-2xl p-8 md:p-10">
              
              {/* Contact Info Header */}
              <div className="mb-8">
                <p className="text-yellow text-sm font-alexandria uppercase tracking-wider mb-2">
                  DROP A LINE
                </p>
                <h3 className="text-yellow text-2xl md:text-3xl font-new-black">
                  hello@senu.design
                </h3>
                <button className="text-gray-400 text-sm mt-2 hover:text-white transition-colors">
                  COPY EMAIL 📋
                </button>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Field */}
                <div>
                  <label className="block text-white text-sm font-alexandria mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Contact Method Selector */}
                <div>
                  <label className="block text-white text-sm font-alexandria mb-3">
                    YOUR PREFERRED PLATFORM TO CONTACT *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsContactMethodOpen(!isContactMethodOpen)}
                      className="w-full bg-transparent border-b border-gray-600 text-white py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria text-left flex justify-between items-center"
                    >
                      <span>{currentContactMethod?.label}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isContactMethodOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isContactMethodOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-glass-fill backdrop-blur-md border border-white/10 rounded-xl z-50 overflow-hidden">
                        {contactMethods.map((method, index) => (
                          <div key={method.value}>
                            <button
                              type="button"
                              onClick={() => handleContactMethodChange(method.value as ContactMethod)}
                              className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors font-alexandria text-sm uppercase"
                            >
                              {method.label}
                            </button>
                            {index < contactMethods.length - 1 && (
                              <div className="border-b border-white/10" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditional Fields */}
                {formData.contactMethod === 'email' ? (
                  <div>
                    <label className="block text-white text-sm font-alexandria mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white text-sm font-alexandria mb-2">
                        CODE
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryCodeOpen(!isCountryCodeOpen)}
                          className="w-full bg-transparent border-b border-gray-600 text-white py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria text-left flex justify-between items-center"
                        >
                          <span>{formData.countryCode}</span>
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform ${isCountryCodeOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isCountryCodeOpen && (
                          <div className="absolute top-full left-0 w-48 mt-2 bg-glass-fill backdrop-blur-md border border-white/10 rounded-xl z-50 max-h-48 overflow-y-auto">
                            {countryCodes.map((country, index) => (
                              <div key={country.code}>
                                <button
                                  type="button"
                                  onClick={() => handleCountryCodeChange(country.code)}
                                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors font-alexandria text-sm flex justify-between"
                                >
                                  <span>{country.code}</span>
                                  <span className="text-gray-400">{country.country}</span>
                                </button>
                                {index < countryCodes.length - 1 && (
                                  <div className="border-b border-white/10" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-white text-sm font-alexandria mb-2">
                        PHONE *
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-blue transition-colors font-alexandria"
                        placeholder="123456789"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red text-sm mt-1 col-span-3">{errors.phoneNumber}</p>
                    )}
                  </div>
                )}

                {/* Message Field */}
                <div>
                  <label className="block text-white text-sm font-alexandria mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-gray-600 text-white placeholder-gray-500 py-3 px-4 rounded-lg focus:outline-none focus:border-blue transition-colors font-alexandria resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue hover:bg-blue/80 text-white font-alexandria font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDING...' : 'HIT US'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(isContactMethodOpen || isCountryCodeOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsContactMethodOpen(false);
            setIsCountryCodeOpen(false);
          }}
        />
      )}
    </section>
  );
}