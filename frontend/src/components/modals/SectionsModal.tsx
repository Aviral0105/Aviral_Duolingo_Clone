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
          <h2 className="text-xl font-black text-gray-800">Hindi Sections</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Section 1 */}
          <div className="border-2 border-[#58cc02] bg-emerald-50/50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#58cc02] uppercase tracking-wider">
                Section 1 • Unlocked
              </span>
              <h3 className="text-sm font-black text-gray-800">Rookie: Form basic sentences</h3>
              <span className="text-[10px] text-gray-500 font-bold">🇮🇳 Units 1 to 3</span>
            </div>
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById("unit-1");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-3d-green px-3 py-1.5 text-xs font-black rounded-xl text-white uppercase"
            >
              Continue
            </button>
          </div>

          {/* Section 2 */}
          <div className="border-2 border-sky-300 bg-sky-50/40 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-wider">
                Section 2 • Explorer
              </span>
              <h3 className="text-sm font-black text-gray-800">Greet people & describe things</h3>
              <span className="text-[10px] text-gray-500 font-bold">🇮🇳 Unit 2</span>
            </div>
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById("unit-2");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="btn-3d-white px-3 py-1 text-xs font-black rounded-xl"
            >
              Jump here
            </button>
          </div>

          {/* Section 3 */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Section 3 • Traveler
              </span>
              <h3 className="text-sm font-black text-gray-700">Talk about family & food</h3>
              <span className="text-[10px] text-gray-400 font-bold">🇮🇳 Unit 3</span>
            </div>
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById("unit-3");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="btn-3d-white px-3 py-1 text-xs font-black rounded-xl"
            >
              Jump here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
