import { useState } from "react";
import Link from "next/link";
import { Menu, X, Cpu, BarChart } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="bg-gray-900 text-white w-64 h-full fixed top-0 left-0 border-r border-gray-700 p-4 hidden md:flex flex-col">
      <h2 className="text-xl font-bold mb-6">Agents</h2>
      <nav className="flex flex-col gap-3">
        <Link href="/hardware-report" className="flex items-center gap-2 hover:text-blue-400 transition">
          <Cpu size={18} /> Aged Hardware Report
        </Link>
        <Link href="/sales-report" className="flex items-center gap-2 hover:text-blue-400 transition">
          <BarChart size={18} /> Sales Report
        </Link>
      </nav>
    </aside>
  );
}

// Mobile version
export function MobileSidebar({ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} className="p-3">
        <Menu size={28} className="text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 p-4 z-50 border-r border-gray-700">
            <button onClick={() => setOpen(false)} className="mb-4">
              <X size={28} className="text-white" />
            </button>
            <nav className="flex flex-col gap-3">
              <Link href="/hardware-report" className="flex items-center gap-2 hover:text-blue-400" onClick={() => setOpen(false)}>
                <Cpu size={18} /> Aged Hardware Report
              </Link>
              <Link href="/sales-report" className="flex items-center gap-2 hover:text-blue-400" onClick={() => setOpen(false)}>
                <BarChart size={18} /> Sales Report
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
