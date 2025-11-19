import Sidebar, { MobileSidebar } from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />

      <MobileSidebar />

      <main className="flex-1 md:ml-64 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
