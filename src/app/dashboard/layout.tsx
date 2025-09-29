// Dashboard layout without main navbar
import BackgroundGrid from '@/components/main/BackgroundGrid';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BackgroundGrid />
            <div className="relative z-10">
                {children}
            </div>
        </>
    );
}
