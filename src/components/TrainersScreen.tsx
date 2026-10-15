import React, { useState, useMemo } from 'react';
import { Coach, WeightLossProfile } from '../types';
import { COACHES_DATA } from '../data/coachesData';

interface TrainersScreenProps {
  profile: WeightLossProfile;
  onSelectCoach: (coach: Coach) => void;
  onOpenPremium: () => void;
  onOpenSgSync: () => void;
}

export const TrainersScreen: React.FC<TrainersScreenProps> = ({
  profile,
  onSelectCoach,
  onOpenPremium,
  onOpenSgSync,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('Best Match');
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const filters = [
    { id: 'Best Match', label: 'Best Match', icon: 'auto_awesome' },
    { id: 'Online Video', label: 'Online Video', icon: 'videocam' },
    { id: 'Price: $$', label: 'Price: $$', icon: 'payments' },
    { id: 'Dietitian', label: 'Dietitian', icon: 'nutrition' },
    { id: '4.8+', label: '4.8+', icon: 'star' },
    { id: 'In-Person Gym', label: 'In-Person Gym', icon: 'fitness_center' },
    { id: 'ActiveSG', label: 'ActiveSG Lead', icon: 'verified' },
  ];

  const featuredCoach = COACHES_DATA[0]; // Sarah Jenkins

  // Filter available specialists
  const filteredSpecialists = useMemo(() => {
    return COACHES_DATA.slice(1).filter((coach) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        coach.name.toLowerCase().includes(q) ||
        coach.specialty.toLowerCase().includes(q) ||
        coach.credentials.toLowerCase().includes(q) ||
        coach.location.toLowerCase().includes(q) ||
        coach.highlights.some((h) => h.toLowerCase().includes(q));

      // Filter match
      let matchesFilter = true;
      if (selectedFilter === 'Online Video') {
        matchesFilter = coach.location.toLowerCase().includes('online');
      } else if (selectedFilter === 'Price: $$') {
        matchesFilter = coach.hourlyRate <= 50;
      } else if (selectedFilter === 'Dietitian') {
        matchesFilter =
          coach.credentials.toLowerCase().includes('rd') ||
          coach.specialty.toLowerCase().includes('nutrition') ||
          coach.credentials.toLowerCase().includes('biochem');
      } else if (selectedFilter === '4.8+') {
        matchesFilter = coach.rating >= 4.8;
      } else if (selectedFilter === 'In-Person Gym') {
        matchesFilter =
          coach.location.toLowerCase().includes('tampines') ||
          coach.location.toLowerCase().includes('kallang') ||
          coach.location.toLowerCase().includes('gym');
      } else if (selectedFilter === 'ActiveSG') {
        matchesFilter =
          coach.credentials.toLowerCase().includes('activesg') ||
          coach.bio.toLowerCase().includes('activesg');
      }

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Singapore Sports Weight Loss Telemetry Quick Banner */}
      <div
        onClick={onOpenSgSync}
        className="mt-1 p-3 rounded-2xl bg-gradient-to-r from-[#181c22] via-[#1c2026] to-[#181c22] border border-[#c3f400]/40 flex items-center justify-between cursor-pointer hover:border-[#c3f400] transition-all shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c3f400]/15 flex items-center justify-center text-[#c3f400] shrink-0">
            <span className="material-symbols-outlined text-[20px] fill">vital_signs</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">
                🇸🇬 Singapore Sports Telemetry
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10e575] animate-ping"></span>
            </div>
            <p className="font-sans text-[12px] text-[#dfe2eb] font-semibold">
              Sync weight loss with Outdoor Walking (46%) &amp; Running (25%)
            </p>
          </div>
        </div>
        <div className="flex items-center text-[#c3f400] group-hover:translate-x-1 transition-transform">
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </div>
      </div>

      {/* Header Intro & Stats Bar */}
      <div className="flex flex-col pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#6fff9a] tracking-widest flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6fff9a] animate-pulse"></span>
              Telemetry-Matched
            </span>
            <h1 className="font-sans text-[26px] font-bold text-[#dfe2eb] tracking-tight mt-0.5">
              Elite Coaching
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-[#262a31] px-3 py-1.5 rounded-full border border-[#3c4a3d]/50">
            <span className="material-symbols-outlined text-[#c3f400] text-[16px] fill">
              verified
            </span>
            <span className="font-mono text-[11px] font-bold text-[#dfe2eb]">38 Online</span>
          </div>
        </div>
        <p className="font-sans text-[13px] text-[#bacbb9] mt-1 leading-relaxed">
          Biometrically paired specialists tailored to your metabolic deficit &amp; athletic targets.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col space-y-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bacbb9] text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c22] text-[#dfe2eb] placeholder-[#859585] font-sans text-[14px] pl-11 pr-11 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6fff9a] border border-[#3c4a3d]/60 shadow-inner"
            placeholder="Search 'Weight Loss', 'Hyrox', 'Keto', or 'CSCS'..."
            type="text"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-[#bacbb9] hover:text-[#dfe2eb]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          ) : null}
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              showFilterOptions
                ? 'bg-[#6fff9a] text-[#003918]'
                : 'bg-[#262a31] text-[#bacbb9] hover:text-[#6fff9a]'
            }`}
            title="Toggle filters"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>

        {/* Scrollable Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#6fff9a] text-[#003918] shadow-sm shadow-[#6fff9a]/30 font-bold'
                    : 'bg-[#181c22] text-[#bacbb9] hover:text-[#dfe2eb] border border-[#3c4a3d]/40'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured AI Match Card (Sarah Jenkins) */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#1c2026] to-[#181c22] p-4 shadow-xl border border-[#3c4a3d]/60 overflow-hidden group">
        {/* Ambient Energy Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#6fff9a]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#6fff9a]/15 via-transparent to-transparent pointer-events-none rounded-tr-2xl"></div>

        {/* Match Header Badge */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 bg-[#6fff9a]/15 text-[#6fff9a] px-2.5 py-1 rounded-full border border-[#6fff9a]/30">
            <span className="material-symbols-outlined text-[14px] fill">psychology</span>
            <span className="font-mono text-[10px] font-bold tracking-wide">
              {featuredCoach.aiCompatibility}% AI COMPATIBILITY
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#262a31] px-2 py-0.5 rounded-md text-[#c3f400]">
            <span className="material-symbols-outlined text-[14px] fill">star</span>
            <span className="font-mono text-[11px] font-bold">{featuredCoach.rating}</span>
            <span className="text-[#bacbb9] font-sans text-[11px]">
              ({featuredCoach.reviewCount})
            </span>
          </div>
        </div>

        {/* Trainer Hero Row */}
        <div className="flex gap-3 pt-1">
          <div className="relative shrink-0">
            <img
              className="w-20 h-20 rounded-2xl object-cover bg-[#31353c] border border-[#3c4a3d]/80"
              alt={featuredCoach.imageAlt}
              src={featuredCoach.imageUrl}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1c2026] flex items-center justify-center border border-[#10141a]">
              <span className="material-symbols-outlined text-[#6fff9a] text-[14px] fill">
                verified
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="font-sans text-[18px] font-bold text-[#dfe2eb] truncate">
                {featuredCoach.name}
              </h2>
            </div>
            <p className="font-mono text-[10px] text-[#6fff9a] uppercase tracking-wider font-semibold mt-0.5">
              {featuredCoach.credentials}
            </p>
            <p className="font-sans text-[12px] text-[#bacbb9] line-clamp-1 mt-1">
              {featuredCoach.specialty}
            </p>
          </div>
        </div>

        {/* Biometric Match Reason */}
        <div className="my-3 p-2.5 rounded-xl bg-[#0a0e14]/80 border border-[#3c4a3d]/40 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#87f5ff] text-[18px] shrink-0 mt-0.5">
            query_stats
          </span>
          <p className="font-sans text-[12px] text-[#bacbb9] leading-tight">
            Matched with your{' '}
            <span className="text-[#dfe2eb] font-semibold">
              -{profile.targetDeficitKcal} kcal deficit target
            </span>{' '}
            and current InBody visceral fat index ({profile.visceralFatLevel}).
          </p>
        </div>

        {/* Pricing & Consultation Action */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[26px] font-bold text-[#dfe2eb] leading-none">
                ${featuredCoach.hourlyRate}
              </span>
              <span className="font-mono text-[11px] text-[#bacbb9]">
                / {featuredCoach.sessionDuration}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#abd600] uppercase tracking-wider font-semibold">
              Free with Premium
            </span>
          </div>
          <button
            onClick={() => onSelectCoach(featuredCoach)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[13px] font-bold shadow-lg shadow-[#10e575]/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Book Consult</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* PulseAI Premium Teaser Card */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#262a31] via-[#1c2026] to-[#262a31] p-4 shadow-md border border-[#3c4a3d]/50 overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#c3f400]/15 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c3f400]/20 flex items-center justify-center shrink-0 text-[#c3f400]">
            <span className="material-symbols-outlined text-[22px] fill">workspace_premium</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[16px] font-bold text-[#dfe2eb]">PulseAI Premium</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-bold">
                $100/mo
              </span>
            </div>
            <p className="font-sans text-[12px] text-[#bacbb9] mt-1 leading-relaxed">
              Includes{' '}
              <span className="text-[#c3f400] font-semibold">2x monthly 1-on-1 trainer calls</span>
              , unlimited AI food scans, and continuous macro adaptation.
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <button
                onClick={onOpenPremium}
                className="px-3.5 py-1.5 rounded-full bg-[#353940] hover:bg-[#484f58] text-[#dfe2eb] font-mono text-[11px] font-bold transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>Upgrade Tier</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
              <span className="font-sans text-[11px] text-[#bacbb9]">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Directory Section */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-[18px] font-bold text-[#dfe2eb]">Available Specialists</h3>
          <span
            onClick={() => {
              setSelectedFilter('Best Match');
              setSearchQuery('');
            }}
            className="font-mono text-[11px] text-[#6fff9a] font-bold uppercase cursor-pointer hover:underline"
          >
            View All ({COACHES_DATA.length - 1 + 38})
          </span>
        </div>

        {filteredSpecialists.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#181c22] text-center border border-[#3c4a3d]/40">
            <span className="material-symbols-outlined text-[32px] text-[#859585]">
              person_search
            </span>
            <p className="font-sans text-[14px] text-[#dfe2eb] font-semibold mt-2">
              No specialists matched your filter
            </p>
            <p className="font-sans text-[12px] text-[#bacbb9] mt-1">
              Try clearing filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedFilter('Best Match');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#262a31] text-[#6fff9a] font-mono text-[11px] font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSpecialists.map((coach) => (
            <div
              key={coach.id}
              className="bg-[#181c22] rounded-2xl p-4 shadow-sm hover:bg-[#1c2026] border border-[#3c4a3d]/40 transition-all flex flex-col space-y-2.5"
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    className="w-16 h-16 rounded-xl object-cover bg-[#31353c] border border-[#3c4a3d]/60"
                    alt={coach.imageAlt}
                    src={coach.imageUrl}
                  />
                  {coach.tag && (
                    <span
                      className={`absolute -top-1 -left-1 px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider ${coach.tag.bgColor} ${coach.tag.textColor}`}
                    >
                      {coach.tag.text}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-sans text-[16px] font-bold text-[#dfe2eb] truncate">
                      {coach.name}
                    </h4>
                    <div className="flex items-center gap-0.5 text-[#c3f400] shrink-0">
                      <span className="material-symbols-outlined text-[14px] fill">star</span>
                      <span className="font-mono text-[11px] font-bold">{coach.rating}</span>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-[#6fff9a] uppercase tracking-wide font-semibold">
                    {coach.title}
                  </p>
                  <p className="font-sans text-[12px] text-[#bacbb9] line-clamp-1 mt-0.5">
                    {coach.bio}
                  </p>
                </div>
              </div>

              {/* Detail Badges */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {coach.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#262a31] text-[#bacbb9] font-mono text-[10px] flex items-center gap-1 border border-[#3c4a3d]/30"
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {idx === 0 ? 'schedule' : 'speed'}
                      </span>
                      <span>{highlight}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-mono text-[22px] font-bold text-[#dfe2eb]">
                    ${coach.hourlyRate}
                  </span>
                  <span className="font-mono text-[11px] text-[#bacbb9]">
                    / {coach.sessionDuration}
                  </span>
                </div>
                <button
                  onClick={() => onSelectCoach(coach)}
                  className="px-4 py-2 rounded-full bg-[#31353c] hover:bg-[#10e575] hover:text-[#003918] text-[#dfe2eb] font-mono text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Trust & Verification Footer Strip */}
      <div className="rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 p-3 flex items-center justify-between text-[#bacbb9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6fff9a] text-[20px] fill">shield</span>
          <span className="font-sans text-[12px]">
            All coaches accredited with CPR &amp; NCCA standards
          </span>
        </div>
        <span
          className="material-symbols-outlined text-[16px] text-[#859585] cursor-pointer hover:text-[#dfe2eb]"
          title="Accreditation details"
        >
          help_outline
        </span>
      </div>
    </div>
  );
};
