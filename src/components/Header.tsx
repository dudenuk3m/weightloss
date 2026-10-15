import React from 'react';

interface HeaderProps {
  currentWeightKg: number;
  targetWeightKg: number;
  onUpdateTarget?: (target: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeightKg,
  targetWeightKg,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#10141a]/90 backdrop-blur-xl border-b border-[#3c4a3d]/30 shadow-[0_1px_12px_rgba(0,0,0,0.3)]">
      <div className="h-16 px-4 flex items-center justify-between max-w-lg mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10e575] to-[#c3f400] p-1.5 shadow-[0_0_16px_rgba(16,229,117,0.4)] shrink-0 flex items-center justify-center">
            <img
              alt="Weight X Run Shoe Logo"
              className="w-6 h-6 object-contain"
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003918'><path d='M2 17.5c0-.83.67-1.5 1.5-1.5h1.2l2.3-3.1c.5-.7 1.3-1.1 2.2-1.1h3.3l.8-1.5c.37-.7 1.1-1.2 1.9-1.2h2c.8 0 1.5.4 1.8 1.1l1.7 3.3c.4.8.4 1.7 0 2.5l-.8 1.5h1.9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3.5C2.67 20.5 2 19.83 2 19v-1.5zm6.5-4.2l-1.5 2.2h4.5l-.5-1.1c-.2-.4-.6-.7-1.1-.7H8.5zm6.1-.8h-1.8l.5 1h2.2l-.9-1z'/></svg>"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[19px] font-bold tracking-tight text-[#dfe2eb] leading-none flex items-center gap-1">
              Weight <span className="text-[#c3f400]">X</span> Run
            </span>
            <span className="text-[10px] font-mono text-[#859585] tracking-wider uppercase mt-0.5">
              Singapore
            </span>
          </div>
        </div>

        {/* Clean Weight Target Status */}
        <div className="flex items-center gap-2 bg-[#181c22]/90 border border-[#3c4a3d]/60 px-3 py-1.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[#10e575] text-[16px]">
            flag
          </span>
          <div className="flex items-baseline gap-1 font-mono text-[11px]">
            <span className="text-[#859585]">Goal:</span>
            <span className="text-[#c3f400] font-bold">{targetWeightKg} kg</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
