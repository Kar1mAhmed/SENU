import EmailSignup from '@/components/EmailSignup';
import HeroSection from '@/components/HeroSection';
import Ribbon from '@/components/Ribbon';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <main>
        <HeroSection />
        <EmailSignup />
        <Ribbon />
      </main>
    </div>
  );
}
