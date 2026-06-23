import CRMSidebar from "@/components/crm/CRMSidebar";
import CRMBottomNav from "@/components/crm/CRMBottomNav";
import "./globals.css";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <CRMSidebar />
      </div>

      {/* Main content */}
      <div className="md:ml-56 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-8">{children}</div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <CRMBottomNav />
      </div>
    </div>
  );
}
