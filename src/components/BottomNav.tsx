import React from 'react';

export type NavTab = 'today' | 'run';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#10141a]/95 backdrop-blur-xl border-t border-[#3c4a3d]/40 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center h-20 px-6 max-w-md mx-auto relative">
        {/* Tab 1: Today (Weight) */}
        <button
          type="button"
          onClick={() => onTabChange('today')}
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all cursor-pointer group ${
            currentTab === 'today'
              ? 'text-[#10e575]'
              : 'text-[#859585] hover:text-[#dfe2eb]'
          }`}
        >
          <div
            className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'today'
                ? 'bg-[#10e575]/15 text-[#10e575]'
                : 'text-[#859585] group-hover:text-[#dfe2eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              monitor_weight
            </span>
          </div>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider font-bold mt-0.5 transition-colors ${
              currentTab === 'today' ? 'text-[#10e575]' : 'text-[#859585]'
            }`}
          >
            Today
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full bg-[#10e575] mt-0.5 transition-all duration-300 ${
              currentTab === 'today' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />
        </button>

        {/* Center Divider */}
        <div className="w-px h-8 bg-[#3c4a3d]/40" />

        {/* Tab 2: Run (Weather, PM2.5, Log Run) */}
        <button
          type="button"
          onClick={() => onTabChange('run')}
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all cursor-pointer group ${
            currentTab === 'run'
              ? 'text-[#c3f400]'
              : 'text-[#859585] hover:text-[#dfe2eb]'
          }`}
        >
          <div
            className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'run'
                ? 'bg-[#c3f400]/15 text-[#c3f400]'
                : 'text-[#859585] group-hover:text-[#dfe2eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              directions_run
            </span>
          </div>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider font-bold mt-0.5 transition-colors ${
              currentTab === 'run' ? 'text-[#c3f400]' : 'text-[#859585]'
            }`}
          >
            Run
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full bg-[#c3f400] mt-0.5 transition-all duration-300 ${
              currentTab === 'run' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
