"use client";

interface SectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SectionsModal({ isOpen, onClose }: SectionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h2 className="text-xl font-black text-gray-800">French Sections</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Section 1 */}
          <div className="border-2 border-[#58cc02] bg-emerald-50/50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#58cc02] uppercase tracking-wider">
                Section 1
              </span>
              <h3 className="text-sm font-black text-gray-800">Bonjour!</h3>
              <span className="text-[10px] text-gray-500 font-bold">🇫🇷 5 to 9</span>
            </div>
            <span className="text-3xl">🦉</span>
          </div>

          {/* Section 2 */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Section 2
              </span>
              <h3 className="text-sm font-black text-gray-700">Je commence en français.</h3>
              <span className="text-[10px] text-gray-400 font-bold">🇫🇷 10 to 19</span>
            </div>
            <button className="btn-3d-white px-3 py-1 text-xs font-black rounded-xl">
              Jump here
            </button>
          </div>

          {/* Section 3 */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Section 3
              </span>
              <h3 className="text-sm font-black text-gray-700">Je connais quelques mots.</h3>
              <span className="text-[10px] text-gray-400 font-bold">🇫🇷 20 to 29</span>
            </div>
            <button className="btn-3d-white px-3 py-1 text-xs font-black rounded-xl">
              Jump here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
