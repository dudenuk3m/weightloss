import React, { useState } from 'react';
import { WeightLossProfile } from '../types';
import confetti from 'canvas-confetti';

interface AIScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WeightLossProfile;
  onLogMealCalories: (calories: number) => void;
}

interface ScanPreset {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  confidence: number;
  deficitImpact: string;
  summary: string;
  imageUrl: string;
  tag: string;
}

const PRESET_SCANS: ScanPreset[] = [
  {
    id: 'chicken-rice',
    name: 'Steamed Hainanese Chicken Breast (Skinless) & Cucumber',
    calories: 420,
    proteinGrams: 42,
    carbsGrams: 44,
    fatGrams: 7,
    confidence: 98,
    deficitImpact: 'Fits perfectly within daily -500 kcal deficit allowance',
    summary: 'High protein Singapore hawker choice. Skin removed eliminates ~140 kcal of saturated fat.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tag: 'HAWKER MACRO APPROVED',
  },
  {
    id: 'yong-tau-foo',
    name: 'ActiveSG Yong Tau Foo (Clear Soup, Tofu, Spinach, Bittergourd)',
    calories: 285,
    proteinGrams: 26,
    carbsGrams: 18,
    fatGrams: 8,
    confidence: 99,
    deficitImpact: 'Ultra-low caloric density, accelerative for visceral fat drop',
    summary: '6 non-fried pieces + green vegetables. Low sodium broth recommended by Coach Sarah.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    tag: 'LOW CALORIE CHAMPION',
  },
  {
    id: 'salmon-quinoa',
    name: 'Grilled Salmon Bowl w/ Edamame & Avocado',
    calories: 490,
    proteinGrams: 36,
    carbsGrams: 32,
    fatGrams: 21,
    confidence: 97,
    deficitImpact: 'High Omega-3 reduces inflammation and speeds recovery',
    summary: 'Nutrient-dense post-PCN run meal. Promotes lean muscle retention.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    tag: 'POST-RUN RECOVERY',
  },
  {
    id: 'inbody-sheet',
    name: 'InBody 570 Biometric Sheet Scan',
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    confidence: 100,
    deficitImpact: 'Visceral fat dropped from Level 9 to Level 8. Muscle mass maintained.',
    summary: 'Body composition scan decoded: Skeletal muscle 33.4kg, Body fat 19.8%, Basal metabolic rate 1,740 kcal.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    tag: 'INBODY TELEMETRY',
  },
];

export const AIScanModal: React.FC<AIScanModalProps> = ({
  isOpen,
  onClose,
  profile,
  onLogMealCalories,
}) => {
  const [selectedScan, setSelectedScan] = useState<ScanPreset>(PRESET_SCANS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);

  if (!isOpen) return null;

  const handleSimulateScan = (preset: ScanPreset) => {
    setIsScanning(true);
    setHasScanned(false);
    setSelectedScan(preset);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 800);
  };

  const handleConfirmLog = () => {
    if (selectedScan.calories > 0) {
      onLogMealCalories(selectedScan.calories);
      confetti({
        particleCount: 40,
        spread: 50,
        colors: ['#10e575', '#c3f400'],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[20px] fill">
              photo_camera
            </span>
            <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              PulseAI Computer Vision HUD
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full h-56 bg-[#0a0e14] overflow-hidden flex items-center justify-center">
          <img
            src={selectedScan.imageUrl}
            alt={selectedScan.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isScanning ? 'opacity-30 blur-sm' : 'opacity-90'
            }`}
          />

          {/* 4 Corner Reticles (Kinetic Emerald #10E575) */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#10e575]"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#10e575]"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#10e575]"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#10e575]"></div>

          {/* Scanning Laser Beam */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-[#10e575] shadow-[0_0_12px_#10e575] animate-bounce"></div>
          )}

          {/* Computer Vision Target Box */}
          {!isScanning && (
            <div className="absolute inset-8 border border-dashed border-[#10e575]/70 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                <span className="px-1.5 py-0.5 rounded bg-[#10e575] text-[#003918] font-mono text-[9px] font-bold">
                  MATCH: {selectedScan.confidence}%
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#0a0e14]/80 text-[#87f5ff] font-mono text-[9px]">
                  RAW FOCUS
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] text-[#c3f400] bg-[#0a0e14]/80 px-1 rounded">
                  {selectedScan.tag}
                </span>
                <span className="font-mono text-[10px] text-[#dfe2eb] bg-[#0a0e14]/80 px-1 rounded">
                  {selectedScan.calories > 0 ? `${selectedScan.calories} kcal` : 'Biometrics'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scan Selector Pills */}
        <div className="px-4 py-2 bg-[#181c22] border-b border-[#3c4a3d]/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-[#859585] uppercase shrink-0">Sample:</span>
          {PRESET_SCANS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSimulateScan(preset)}
              className={`px-2.5 py-1 rounded-full font-mono text-[10px] whitespace-nowrap transition-all shrink-0 ${
                selectedScan.id === preset.id
                  ? 'bg-[#10e575] text-[#003918] font-bold'
                  : 'bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb]'
              }`}
            >
              {preset.id === 'inbody-sheet' ? '📊 InBody Sheet' : preset.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Scan Telemetry Breakdown */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-[15px] font-bold text-[#dfe2eb]">
                {selectedScan.name}
              </h3>
              <span className="font-mono text-[10px] text-[#c3f400] font-bold">
                {selectedScan.confidence}% CONFIDENCE
              </span>
            </div>
            <p className="font-sans text-[12px] text-[#bacbb9] mt-1 leading-relaxed">
              {selectedScan.summary}
            </p>
          </div>

          {/* Macronutrient Pills */}
          {selectedScan.calories > 0 ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40">
                <span className="font-mono text-[9px] text-[#859585] uppercase">Calories</span>
                <span className="font-mono text-[16px] font-bold text-[#c3f400] block">
                  {selectedScan.calories}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40">
                <span className="font-mono text-[9px] text-[#859585] uppercase">Protein</span>
                <span className="font-mono text-[16px] font-bold text-[#6fff9a] block">
                  {selectedScan.proteinGrams}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40">
                <span className="font-mono text-[9px] text-[#859585] uppercase">Carbs</span>
                <span className="font-mono text-[16px] font-bold text-[#dfe2eb] block">
                  {selectedScan.carbsGrams}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40">
                <span className="font-mono text-[9px] text-[#859585] uppercase">Fat</span>
                <span className="font-mono text-[16px] font-bold text-[#87f5ff] block">
                  {selectedScan.fatGrams}g
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#859585] uppercase">Visceral Fat Level</span>
                <span className="font-mono text-[20px] font-bold text-[#6fff9a] block">Level 8</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#859585] uppercase">Skeletal Muscle</span>
                <span className="font-mono text-[20px] font-bold text-[#dfe2eb] block">33.4 kg</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#859585] uppercase">Target Deficit</span>
                <span className="font-mono text-[20px] font-bold text-[#c3f400] block">-500 kcal</span>
              </div>
            </div>
          )}

          {/* Deficit Impact Note */}
          <div className="p-2.5 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#10e575] text-[18px] shrink-0 mt-0.5">
              verified
            </span>
            <p className="font-sans text-[11px] text-[#bacbb9]">
              <strong className="text-[#dfe2eb]">Deficit Impact:</strong>{' '}
              {selectedScan.deficitImpact}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#3c4a3d]/50 bg-[#181c22] flex items-center justify-between gap-3">
          <button
            onClick={() => handleSimulateScan(selectedScan)}
            className="px-4 py-2.5 rounded-full bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[11px] font-bold transition-all cursor-pointer"
          >
            Re-Scan
          </button>
          <button
            onClick={handleConfirmLog}
            className="flex-1 py-2.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[13px] font-bold shadow-lg shadow-[#10e575]/20 active:scale-95 transition-all text-center cursor-pointer"
          >
            {selectedScan.calories > 0
              ? `Log +${selectedScan.calories} kcal`
              : 'Save InBody Biometrics'}
          </button>
        </div>
      </div>
    </div>
  );
};
