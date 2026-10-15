import React from 'react';
import { WeightLossProfile } from '../types';
import confetti from 'canvas-confetti';

interface ChallengesScreenProps {
  profile: WeightLossProfile;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const challenges = [
    {
      id: 'hpb-steps',
      title: 'ActiveSG National Steps Challenge (Season 8)',
      category: 'Walking & Daily NEAT',
      reward: '+300 XP & HPB eVouchers',
      progress: 8420,
      target: 10000,
      unit: 'steps',
      daysLeft: 5,
      joined: true,
      color: '#6fff9a',
      icon: 'footprint',
    },
    {
      id: 'hyrox-sg',
      title: 'Hyrox Singapore Expo Prep 2026',
      category: 'Functional Endurance w/ Marcus Vance',
      reward: '+500 XP & Pro Badge',
      progress: 3,
      target: 5,
      unit: 'sessions',
      daysLeft: 12,
      joined: true,
      color: '#c3f400',
      icon: 'speed',
    },
    {
      id: 'pcn-coastal',
      title: 'PCN Coast-to-Coast 50km Stride',
      category: 'Outdoor Walking & Cycling (Top SG Sport)',
      reward: '+450 XP & ECP Finisher Shield',
      progress: 32,
      target: 50,
      unit: 'km',
      daysLeft: 9,
      joined: false,
      color: '#00ddeb',
      icon: 'directions_bike',
    },
    {
      id: 'deficit-mastery',
      title: 'Singapore 14-Day -500 kcal Deficit Sprint',
      category: 'Fat Loss Consistency',
      reward: '+600 XP & Free Consultation',
      progress: 14,
      target: 14,
      unit: 'days',
      daysLeft: 0,
      joined: true,
      completed: true,
      color: '#10e575',
      icon: 'military_tech',
    },
  ];

  const districtsLeaderboard = [
    { rank: 1, district: 'Tampines & East Coast', points: '142,390 XP', participants: 4820 },
    { rank: 2, district: 'Bishan & Central Ridges', points: '128,150 XP', participants: 3950 },
    { rank: 3, district: 'Jurong Lake & West Coast', points: '119,840 XP', participants: 3620 },
    { rank: 4, district: 'Marina Bay & Downtown', points: '114,200 XP', participants: 2980 },
    { rank: 5, district: 'Woodlands & North Route', points: '98,700 XP', participants: 2410 },
  ];

  const handleClaimReward = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      colors: ['#c3f400', '#10e575', '#ffffff'],
    });
    onUpdateProfile({
      xpPoints: profile.xpPoints + 600,
    });
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-mono text-[10px] text-[#c3f400] uppercase font-bold tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
            ActiveSG &amp; Community Leagues
          </span>
          <h1 className="font-sans text-[24px] font-bold text-[#dfe2eb] tracking-tight">
            Singapore Challenges
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-[#181c22] px-2.5 py-1 rounded-full border border-[#3c4a3d]/50">
          <span className="material-symbols-outlined text-[#c3f400] text-[16px] fill">trophy</span>
          <span className="font-mono text-[11px] font-bold text-[#dfe2eb]">Rank #14 East</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
          return (
            <div
              key={challenge.id}
              className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/50 shadow-md space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#6fff9a] font-semibold uppercase">
                    {challenge.category}
                  </span>
                  <h3 className="font-sans text-[15px] font-bold text-[#dfe2eb] mt-0.5">
                    {challenge.title}
                  </h3>
                  <span className="font-mono text-[11px] text-[#c3f400]">
                    🎁 Reward: {challenge.reward}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#262a31] flex items-center justify-center text-[#c3f400] shrink-0">
                  <span className="material-symbols-outlined text-[20px] fill">
                    {challenge.icon}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#bacbb9]">
                    {challenge.progress} / {challenge.target} {challenge.unit}
                  </span>
                  <span className="text-[#dfe2eb] font-bold">{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/40">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: challenge.color,
                    }}
                  ></div>
                </div>
              </div>

              {/* Action / Status */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-sans text-[11px] text-[#859585]">
                  {challenge.completed ? '🎉 Goal Completed!' : `${challenge.daysLeft} days remaining`}
                </span>
                {challenge.completed ? (
                  <button
                    onClick={handleClaimReward}
                    className="px-3.5 py-1.5 rounded-full bg-[#c3f400] hover:bg-[#d4ff00] text-[#161e00] font-mono text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    Claim +600 XP
                  </button>
                ) : (
                  <button className="px-3 py-1 rounded-full bg-[#262a31] text-[#dfe2eb] font-mono text-[11px] font-semibold">
                    In Progress
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Singapore Districts Leaderboard */}
      <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[18px]">
              leaderboard
            </span>
            <h3 className="font-sans text-[14px] font-bold text-[#dfe2eb]">
              ActiveSG Districts Leaderboard
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#bacbb9]">Weekly Reset</span>
        </div>

        <div className="space-y-2">
          {districtsLeaderboard.map((d) => (
            <div
              key={d.rank}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                d.rank === 1
                  ? 'bg-[#10141a] border-[#c3f400]/40'
                  : 'bg-[#10141a]/60 border-[#3c4a3d]/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                    d.rank === 1
                      ? 'bg-[#c3f400] text-[#161e00]'
                      : 'bg-[#262a31] text-[#bacbb9]'
                  }`}
                >
                  {d.rank}
                </span>
                <div>
                  <span className="font-sans text-[13px] font-bold text-[#dfe2eb]">
                    {d.district}
                  </span>
                  <p className="font-mono text-[10px] text-[#859585]">
                    {d.participants.toLocaleString()} active citizens
                  </p>
                </div>
              </div>
              <span className="font-mono text-[12px] font-bold text-[#6fff9a]">{d.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
