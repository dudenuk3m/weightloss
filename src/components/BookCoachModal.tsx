import React, { useState } from 'react';
import { Coach, WeightLossProfile } from '../types';
import confetti from 'canvas-confetti';

interface BookCoachModalProps {
  coach: Coach | null;
  isOpen: boolean;
  onClose: () => void;
  profile: WeightLossProfile;
  onBookingConfirmed: (coachName: string, slot: string) => void;
}

export const BookCoachModal: React.FC<BookCoachModalProps> = ({
  coach,
  isOpen,
  onClose,
  profile,
  onBookingConfirmed,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [consultFocus, setConsultFocus] = useState<string>(
    'Weight Loss & Deficit Periodization'
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !coach) return null;

  const currentSlot = selectedSlot || coach.availableSlots[0] || 'Today 17:00';

  const handleConfirm = () => {
    setIsConfirmed(true);
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#10e575', '#c3f400', '#ffffff'],
    });

    setTimeout(() => {
      onBookingConfirmed(coach.name, currentSlot);
      setIsConfirmed(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[20px] fill">
              event_available
            </span>
            <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              Book Telemetry Consultation
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Coach Bio Card */}
          <div className="flex gap-3 p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/50">
            <img
              src={coach.imageUrl}
              alt={coach.name}
              className="w-16 h-16 rounded-xl object-cover bg-[#262a31] border border-[#3c4a3d]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-[16px] font-bold text-[#dfe2eb]">{coach.name}</h3>
                <span className="font-mono text-[11px] font-bold text-[#c3f400]">
                  ★ {coach.rating}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#6fff9a] font-semibold">
                {coach.credentials}
              </p>
              <p className="font-sans text-[11px] text-[#bacbb9] mt-0.5 line-clamp-1">
                {coach.location}
              </p>
            </div>
          </div>

          {/* Biometric Sync Context */}
          <div className="p-2.5 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#87f5ff] text-[18px] shrink-0 mt-0.5">
              sync
            </span>
            <p className="font-sans text-[11px] text-[#bacbb9]">
              Coach will receive your live telemetry: -{profile.targetDeficitKcal} kcal deficit,
              current weight ({profile.currentWeightKg}kg), and InBody visceral fat level (
              {profile.visceralFatLevel}).
            </p>
          </div>

          {/* Focus Selector */}
          <div>
            <label className="block text-[11px] font-mono text-[#859585] uppercase mb-1.5">
              Consultation Focus
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                'Weight Loss & Deficit Periodization',
                'Singapore Hawker Meal Macro Guide',
                'InBody Visceral Fat Deep-Dive',
                'Zone 2 Running & ActiveSG Schedule',
              ].map((focus) => (
                <button
                  key={focus}
                  type="button"
                  onClick={() => setConsultFocus(focus)}
                  className={`px-3 py-2 rounded-xl text-left font-sans text-[12px] font-semibold border transition-all ${
                    consultFocus === focus
                      ? 'bg-[#10e575]/15 border-[#10e575] text-[#dfe2eb]'
                      : 'bg-[#181c22] border-[#3c4a3d]/40 text-[#bacbb9] hover:text-[#dfe2eb]'
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-[11px] font-mono text-[#859585] uppercase mb-1.5">
              Select Available Slot (SGT)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {coach.availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2.5 rounded-xl font-mono text-[11px] font-bold border transition-all flex items-center justify-between ${
                    currentSlot === slot
                      ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-sm'
                      : 'bg-[#181c22] text-[#dfe2eb] border-[#3c4a3d]/40 hover:border-[#859585]'
                  }`}
                >
                  <span>{slot}</span>
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Guarantee */}
          <div className="p-3 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40 flex items-center justify-between">
            <div>
              <span className="font-mono text-[20px] font-bold text-[#dfe2eb]">
                ${coach.hourlyRate}
              </span>
              <span className="font-mono text-[10px] text-[#bacbb9]">
                {' '}
                / {coach.sessionDuration}
              </span>
              <p className="font-mono text-[9px] text-[#6fff9a]">Included with PulseAI Premium</p>
            </div>
            <span className="font-mono text-[10px] text-[#859585]">100% Satisfaction or Refund</span>
          </div>
        </div>

        {/* Action */}
        <div className="p-4 border-t border-[#3c4a3d]/50 bg-[#181c22] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full bg-[#262a31] text-[#bacbb9] font-mono text-[11px] font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmed}
            className="flex-1 py-2.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[13px] font-bold shadow-lg shadow-[#10e575]/20 active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
          >
            {isConfirmed ? 'Confirming Session...' : `Confirm Slot (${currentSlot})`}
          </button>
        </div>
      </div>
    </div>
  );
};
