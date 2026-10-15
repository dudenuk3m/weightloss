import React from 'react';
import { WeightLossProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WeightLossProfile;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const toggleDevice = (key: keyof WeightLossProfile['connectedDevices']) => {
    onUpdateProfile({
      connectedDevices: {
        ...profile.connectedDevices,
        [key]: !profile.connectedDevices[key],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[20px] fill">
              account_circle
            </span>
            <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              Profile &amp; Sensor Telemetry
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* User Bio Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/50">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Oyx7_FKNT7yBHAl67tNNMuqnpOfwHfe9FF7BfJio9dU_4bC_W4LDky5Z5ipcTyWNbPu36_wSg8bVgJdxfayjibmVRo6dgz-anWgRfpXtglXYCd2ibsv9lq7Y6pogLJjDxYSoM0pqTTGIEKxFpajJla_supEdnf7k47TR-0ixcGOEEvNKeOiatbo-PChes7xOiCSxZjrHMJpeHSwObZyzHKwjpDK8EHedVb_RtrbVYywkxr-y60Vm"
              alt="Ervin"
              className="w-14 h-14 rounded-full border-2 border-[#10e575] object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-[16px] font-bold text-[#dfe2eb]">Ervin Tan</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-mono text-[10px] font-bold">
                  ActiveSG PRO
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#bacbb9]">Ervint84@gmail.com</p>
              <p className="font-mono text-[10px] text-[#859585] mt-0.5">
                ActiveSG ID: SG-7729-ACT • Singapore East Coast
              </p>
            </div>
          </div>

          {/* Deficit Target Slider */}
          <div className="p-3.5 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#859585] uppercase">
                Daily Deficit Target
              </label>
              <span className="font-mono text-[16px] font-bold text-[#c3f400]">
                -{profile.targetDeficitKcal} kcal
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={1000}
              step={50}
              value={profile.targetDeficitKcal}
              onChange={(e) =>
                onUpdateProfile({ targetDeficitKcal: parseInt(e.target.value) })
              }
              className="w-full accent-[#10e575] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#859585]">
              <span>-300 kcal (Gentle)</span>
              <span>-500 kcal (Recommended)</span>
              <span>-800+ kcal (Aggressive)</span>
            </div>
          </div>

          {/* Connected Sensors & Sync */}
          <div>
            <h4 className="text-[11px] font-mono text-[#859585] uppercase mb-2">
              Connected Telemetry Platforms
            </h4>
            <div className="space-y-2">
              {[
                {
                  key: 'activeSg' as const,
                  name: 'ActiveSG Pass & Sports Hub API',
                  desc: 'Syncs public pool, gym check-ins, and court sessions',
                  icon: 'verified',
                },
                {
                  key: 'appleHealth' as const,
                  name: 'Apple Health / HealthKit',
                  desc: 'Continuous steps, heart rate zones, and active calories',
                  icon: 'vital_signs',
                },
                {
                  key: 'inBody' as const,
                  name: 'InBody 570 Composition Cloud',
                  desc: 'Visceral fat level, body fat % and skeletal muscle mass',
                  icon: 'scale',
                },
                {
                  key: 'strava' as const,
                  name: 'Strava Singapore (PCN Routes)',
                  desc: 'East Coast Park, Marina Bay, and Round Island cycling',
                  icon: 'directions_bike',
                },
                {
                  key: 'garmin' as const,
                  name: 'Garmin Connect SG',
                  desc: 'VO2 Max and training readiness telemetry',
                  icon: 'watch',
                },
              ].map((device) => {
                const isConnected = profile.connectedDevices[device.key];
                return (
                  <div
                    key={device.key}
                    className="p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#262a31] text-[#6fff9a] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          {device.icon}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                          {device.name}
                        </h5>
                        <p className="font-sans text-[10px] text-[#859585]">{device.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDevice(device.key)}
                      className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold transition-all ${
                        isConnected
                          ? 'bg-[#10e575]/20 text-[#6fff9a] border border-[#10e575]/40'
                          : 'bg-[#262a31] text-[#859585]'
                      }`}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3c4a3d]/50 bg-[#181c22]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#10e575] text-[#003918] font-mono text-[13px] font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
