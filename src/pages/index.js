import Link from "next/link";
import { Cpu, FileSpreadsheet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Report Agents Hub</h1>
      <p className="text-gray-400 mb-10 text-lg max-w-xl">
        Choose an agent to generate reports easily and instantly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/hardware-report" className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700 transition shadow">
          <Cpu className="mx-auto mb-3 w-10 h-10 text-blue-400" />
          <h2 className="font-semibold text-xl">Hardware Lifecycle Agent</h2>
          <p className="text-gray-400 mt-2">Generate aging hardware reports</p>
        </Link>

        <Link href="/sales-report" className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700 transition shadow">
          <FileSpreadsheet className="mx-auto mb-3 w-10 h-10 text-green-400" />
          <h2 className="font-semibold text-xl">Sales Report Agent</h2>
          <p className="text-gray-400 mt-2">Generate sales analytics reports</p>
        </Link>
      </div>
    </div>
  );
}
