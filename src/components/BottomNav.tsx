import React from 'react';

export type NavTab = 'today' | 'trainers' | 'challenges' | 'progress' | 'sg-sync';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenScan?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#10141a]/90 backdrop-blur-xl border-t border-[#3c4a3d]/30 shadow-[0_-2px_16px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center h-20 px-2 max-w-lg mx-auto relative">
        {/* Today Tab */}
        <button
          onClick={() => onTabChange('today')}
          className={`group flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'today'
              ? 'text-[#6fff9a]'
              : 'text-[#bacbb9] hover:text-[#dfe2eb]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
            dashboard
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold mt-1 transition-colors ${
              currentTab === 'today' ? 'text-[#6fff9a]' : 'text-[#bacbb9]'
            }`}
          >
            Today
          </span>
          <span
            className={`w-1 h-1 rounded-full bg-[#6fff9a] mt-0.5 transition-opacity ${
              currentTab === 'today' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

        {/* Trainers Tab */}
        <button
          onClick={() => onTabChange('trainers')}
          className={`group flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'trainers'
              ? 'text-[#6fff9a]'
              : 'text-[#bacbb9] hover:text-[#dfe2eb]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
            sports_gymnastics
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold mt-1 transition-colors ${
              currentTab === 'trainers' ? 'text-[#6fff9a]' : 'text-[#bacbb9]'
            }`}
          >
            Trainers
          </span>
          <span
            className={`w-1 h-1 rounded-full bg-[#6fff9a] mt-0.5 transition-opacity ${
              currentTab === 'trainers' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>


        {/* SG Sports Deficit Sync / Challenges */}
        <button
          onClick={() => onTabChange('sg-sync')}
          className={`group flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'sg-sync'
              ? 'text-[#c3f400]'
              : 'text-[#bacbb9] hover:text-[#dfe2eb]'
          }`}
          title="Singapore Sports Weight Loss Deficit Sync"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
              sync_saved_locally
            </span>
            <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded bg-[#c3f400] text-[#161e00] font-bold">
              SG
            </span>
          </div>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold mt-1 transition-colors ${
              currentTab === 'sg-sync' ? 'text-[#c3f400]' : 'text-[#bacbb9]'
            }`}
          >
            SG Sports
          </span>
          <span
            className={`w-1 h-1 rounded-full bg-[#c3f400] mt-0.5 transition-opacity ${
              currentTab === 'sg-sync' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

        {/* Progress Tab */}
        <button
          onClick={() => onTabChange('progress')}
          className={`group flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'progress'
              ? 'text-[#6fff9a]'
              : 'text-[#bacbb9] hover:text-[#dfe2eb]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
            monitoring
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-semibold mt-1 transition-colors ${
              currentTab === 'progress' ? 'text-[#6fff9a]' : 'text-[#bacbb9]'
            }`}
          >
            Progress
          </span>
          <span
            className={`w-1 h-1 rounded-full bg-[#6fff9a] mt-0.5 transition-opacity ${
              currentTab === 'progress' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};
