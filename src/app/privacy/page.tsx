import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';

export default function PrivacyPage() {
    return (
        <main>
            <Navbar />

            {/* Privacy Policy Content */}
            <section className="min-h-screen bg-black text-white py-20 px-4 mt-32">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="font-new-black text-5xl md:text-7xl font-light mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-400 text-lg font-alexandria">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12 font-alexandria">
                        {/* Section 1 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                1. Information We Collect
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We collect information that you provide directly to us when you use our services,
                                including when you create an account, submit inquiries, or communicate with us.
                                This may include your name, email address, phone number, and any other information
                                you choose to provide.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                We also automatically collect certain information about your device when you use
                                our website, including your IP address, browser type, operating system, and browsing
                                behavior through cookies and similar technologies.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                2. How We Use Your Information
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process and complete transactions</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Communicate with you about products, services, and events</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                3. Information Sharing and Disclosure
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We do not sell, trade, or rent your personal information to third parties.
                                We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>With your consent or at your direction</li>
                                <li>With service providers who perform services on our behalf</li>
                                <li>To comply with legal obligations or respond to lawful requests</li>
                                <li>To protect the rights, property, and safety of our company and users</li>
                                <li>In connection with a merger, acquisition, or sale of assets</li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                4. Data Security
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                We take reasonable measures to protect your information from unauthorized access,
                                use, or disclosure. However, no internet transmission is completely secure, and we
                                cannot guarantee the absolute security of your information. We use industry-standard
                                encryption and security protocols to protect your data.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                5. Cookies and Tracking Technologies
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                We use cookies and similar tracking technologies to collect information about your
                                browsing activities. You can control cookies through your browser settings, but
                                disabling cookies may affect your ability to use certain features of our website.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                6. Your Rights and Choices
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Depending on your location, you may have certain rights regarding your personal
                                information, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                <li>Access to your personal information</li>
                                <li>Correction of inaccurate information</li>
                                <li>Deletion of your information</li>
                                <li>Objection to processing of your information</li>
                                <li>Data portability</li>
                                <li>Withdrawal of consent</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                7. Children&apos;s Privacy
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                Our services are not directed to children under the age of 13, and we do not
                                knowingly collect personal information from children. If we learn that we have
                                collected information from a child under 13, we will take steps to delete that
                                information as soon as possible.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                8. Changes to This Privacy Policy
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any
                                changes by posting the new Privacy Policy on this page and updating the &quot;Last
                                updated&quot; date. We encourage you to review this Privacy Policy periodically for
                                any changes.
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-4 text-yellow">
                                9. Contact Us
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or our privacy practices,
                                please contact us at:
                            </p>
                            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
                                <p className="text-white mb-2">
                                    <span className="text-yellow font-semibold">Email:</span> info@senu.studio
                                </p>
                                <p className="text-white mb-2">
                                    <span className="text-yellow font-semibold">Address:</span> [Your Company Address]
                                </p>
                                <p className="text-white">
                                    <span className="text-yellow font-semibold">Phone:</span> [Your Phone Number]
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SingleRibbon bgClass="bg-blue" iconColorClass="bg-blue-soft" heightClass="h-[35px] md:h-[45px]" />
            <Footer />
        </main>
    );
}
