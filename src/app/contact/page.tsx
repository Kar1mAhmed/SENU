import { Suspense } from 'react';
import { Metadata } from 'next';
import GetInTouchSection from '@/components/contact';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import Navbar from '@/components/main/Navbar';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Get In Touch',
  description: 'Contact SENU creative studio for your video editing, motion graphics, graphic design, and creative content needs. Let\'s bring your vision to life.',
  path: '/contact',
  keywords: ['contact', 'get in touch', 'hire creative studio', 'video editing services', 'design inquiry']
});

export default function ContactPage() {
    return (
        <main>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
                <GetInTouchSection />
            </Suspense>
            <SingleRibbon bgClass="bg-blue" iconColorClass="bg-blue-soft" heightClass="h-[35px] md:h-[45px]" />
            <Footer />
        </main>
    );
}