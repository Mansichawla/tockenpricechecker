import { ArrowLeft } from 'lucide-react';

export default function DashboardHeader({ onBackToForm }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={onBackToForm}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Form
      </button>
      <h1 className="text-3xl font-bold text-gray-800">Price Dashboard</h1>
    </div>
  );
}