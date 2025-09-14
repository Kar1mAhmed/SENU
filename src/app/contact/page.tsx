import GetInTouchSection from '@/components/contact';
import Footer from '@/components/main/Footer';
import SingleRibbon from '@/components/main/SingleRibbon';
export default function ContactPage() {
    return (
        <main>
            <GetInTouchSection />
            <SingleRibbon bgClass="bg-orange" iconColorClass="bg-yellow" heightClass="h-[35px] md:h-[45px]" />
            <Footer />
        </main>
    );
}