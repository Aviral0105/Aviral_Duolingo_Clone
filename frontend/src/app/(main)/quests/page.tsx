"use client";

export default function QuestsPage() {
  return (
    <div className="flex flex-col select-none">
      {/* Purple Quests Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl text-white p-6 flex items-center justify-between shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-black">Quests</h1>
          <p className="text-xs font-bold text-purple-200 mt-1">
            Complete quests to earn rewards!
          </p>
        </div>
        <div className="text-6xl">🦉💎</div>
      </div>

      <div className="space-y-4">
        {/* Daily Quest */}
        <div className="border-2 border-gray-200 rounded-3xl p-5 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Daily Quest
            </span>
            <span className="text-xs font-black text-orange-500">⏱️ 4H</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-800">Earn 10 XP</h3>
              <div className="w-56 bg-gray-200 h-3.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#ffc800] h-full w-2/3 rounded-full"></div>
              </div>
              <div className="text-xs font-black text-gray-400 mt-1.5">7 / 10 XP</div>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>

        {/* Friends Quest */}
        <div className="border-2 border-gray-200 rounded-3xl p-5 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Friends Quest
            </span>
            <span className="text-xs font-black text-red-500">⏱️ 13H</span>
          </div>
          <h3 className="text-base font-black text-gray-800">Follow your first friend</h3>
          <button className="w-full mt-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-white">
            + Find a Friend
          </button>
        </div>
      </div>
    </div>
  );
}
