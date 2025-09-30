import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';

export default function ImprintPage() {
    return (
        <main>
            <Navbar />
            
            {/* Imprint Content */}
            <section className="min-h-screen bg-black text-white py-20 px-4 mt-32">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="font-new-black text-5xl md:text-7xl font-light mb-6">
                            Imprint
                        </h1>
                        <p className="text-gray-400 text-lg font-alexandria">
                            Legal information according to applicable law
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12 font-alexandria">
                        {/* Company Information */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Company Information
                            </h2>
                            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-8 space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Company Name</p>
                                    <p className="text-white text-xl">SENU Studio</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Legal Form</p>
                                    <p className="text-white">[Your Legal Form - e.g., LLC, GmbH, etc.]</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Registration Number</p>
                                    <p className="text-white">[Your Registration Number]</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">VAT ID</p>
                                    <p className="text-white">[Your VAT Identification Number]</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Contact Information
                            </h2>
                            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-8 space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Address</p>
                                    <p className="text-white">[Your Street Address]</p>
                                    <p className="text-white">[Your City, Postal Code]</p>
                                    <p className="text-white">[Your Country]</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Email</p>
                                    <a href="mailto:senu@senu.studio" className="text-yellow hover:text-yellow/80 transition-colors">
                                        senu@senu.studio
                                    </a>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                                    <p className="text-white">[Your Phone Number]</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Website</p>
                                    <a href="https://senu.studio" className="text-yellow hover:text-yellow/80 transition-colors">
                                        www.senu.studio
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Represented By */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Represented By
                            </h2>
                            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-8">
                                <p className="text-white mb-2">
                                    <span className="text-gray-400">Managing Director:</span> [Your Name]
                                </p>
                                <p className="text-white">
                                    <span className="text-gray-400">Position:</span> [Your Position/Title]
                                </p>
                            </div>
                        </div>

                        {/* Responsible for Content */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Responsible for Content
                            </h2>
                            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-8">
                                <p className="text-white mb-2">[Your Name]</p>
                                <p className="text-gray-300">[Your Address]</p>
                                <p className="text-gray-300">[Your City, Postal Code]</p>
                                <p className="text-gray-300">[Your Country]</p>
                            </div>
                        </div>

                        {/* Dispute Resolution */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Dispute Resolution
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                The European Commission provides a platform for online dispute resolution (ODR): 
                                <a 
                                    href="https://ec.europa.eu/consumers/odr" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-yellow hover:text-yellow/80 transition-colors ml-1"
                                >
                                    https://ec.europa.eu/consumers/odr
                                </a>
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                We are not willing or obliged to participate in dispute resolution proceedings 
                                before a consumer arbitration board.
                            </p>
                        </div>

                        {/* Liability for Content */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Liability for Content
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                As a service provider, we are responsible for our own content on these pages in 
                                accordance with general laws. However, we are not obligated to monitor transmitted 
                                or stored third-party information or to investigate circumstances that indicate 
                                illegal activity.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Obligations to remove or block the use of information under general laws remain 
                                unaffected. However, liability in this regard is only possible from the point in 
                                time at which we become aware of a specific infringement. Upon notification of 
                                corresponding violations, we will remove this content immediately.
                            </p>
                        </div>

                        {/* Liability for Links */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Liability for Links
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Our website contains links to external third-party websites over whose content we 
                                have no influence. Therefore, we cannot assume any liability for this external 
                                content. The respective provider or operator of the pages is always responsible 
                                for the content of the linked pages.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                The linked pages were checked for possible legal violations at the time of linking. 
                                Illegal content was not recognizable at the time of linking. However, permanent 
                                monitoring of the content of the linked pages is not reasonable without concrete 
                                evidence of an infringement. Upon notification of violations, we will remove such 
                                links immediately.
                            </p>
                        </div>

                        {/* Copyright */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Copyright
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                The content and works created by the site operators on these pages are subject to 
                                copyright law. The reproduction, editing, distribution, and any kind of exploitation 
                                outside the limits of copyright require the written consent of the respective author 
                                or creator.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Downloads and copies of this site are only permitted for private, non-commercial use. 
                                Insofar as the content on this site was not created by the operator, the copyrights 
                                of third parties are respected. In particular, third-party content is marked as such. 
                                Should you nevertheless become aware of a copyright infringement, please inform us 
                                accordingly. Upon notification of violations, we will remove such content immediately.
                            </p>
                        </div>

                        {/* Image Credits */}
                        <div>
                            <h2 className="text-3xl font-new-black font-light mb-6 text-yellow">
                                Image Credits
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                All images, graphics, and videos on this website are either created by SENU Studio 
                                or used with proper licensing. If you believe any content infringes on your copyright, 
                                please contact us immediately at senu@senu.studio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <SingleRibbon bgClass="bg-yellow" iconColorClass="bg-yellow-light" heightClass="h-[35px] md:h-[45px]" />
            <Footer />
        </main>
    );
}
