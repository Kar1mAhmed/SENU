import GetInTouchSection from '@/components/contact';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
import Navbar from '@/components/main/Navbar';

export default function ContactPage() {
    return (
        <main>
            <Navbar />
            <GetInTouchSection />
            <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
            <Footer />
        </main>
    );
}