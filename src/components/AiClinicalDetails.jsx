import React from 'react';
import {
  Sparkles,
  Pill,
  Stethoscope,
  ShieldAlert,
  ShieldCheck,
  HeartPulse,
  Info,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function AiClinicalDetails({ aiDetails, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e2da] p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#2b4162]" />
        <div>
          <h4 className="text-xs font-bold text-[#1f2b37] uppercase tracking-wider">
            Generating AI Clinical Evaluation
          </h4>
          <p className="text-[11px] text-[#788896] mt-1 font-mono">
            Model: openai/gpt-oss-120b
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#fcf1f0] border border-[#f4d4d2] rounded-xl p-5 text-xs text-[#8c352f] space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#a84a44] mt-0.5" />
          <div className="flex-1 space-y-1">
            <span className="font-bold text-sm block">AI Generation Error</span>
            <p className="leading-relaxed text-[#752a25]">{error}</p>
          </div>
        </div>
        {onRetry && (
          <div className="flex justify-end">
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-[#8c352f] hover:bg-[#722b26] text-white rounded-md text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry AI Report</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!aiDetails) return null;

  const isGlaucoma = aiDetails.isGlaucoma;

  return (
    <div className="bg-white rounded-xl border border-[#e5e2da] p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eeece6]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#eef2f6] border border-[#d6dfeb] flex items-center justify-center text-[#2b4162]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1f2b37] uppercase tracking-wider">
              AI Clinical Report & Medical Details
            </h3>
            <p className="text-[11px] text-[#788896]">
              Automated image-based assessment
            </p>
          </div>
        </div>

        {/* Model Badge */}
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#faf9f6] text-[#4d5f70] border border-[#e5e2da]">
          Model: {aiDetails.model}
        </span>
      </div>

      {/* Stage Assessment Box */}
      <div className={`p-4 rounded-lg border ${aiDetails.stageBadge} space-y-1.5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isGlaucoma ? (
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#8c352f]" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#2d5c3d]" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {isGlaucoma ? 'Assessed Stage' : 'Eye Health Status'}
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/80 border border-current shadow-2xs">
            {aiDetails.stage}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-95">
          {aiDetails.stageDescription}
        </p>
      </div>

      {/* Medications & Prescription Guidance */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3c4e61] uppercase tracking-wider">
          <Pill className="w-3.5 h-3.5 text-[#2b4162]" />
          <span>{isGlaucoma ? 'Recommended First-Line Medications' : 'Recommended Eye Care Drops'}</span>
        </div>

        <div className="space-y-2">
          {aiDetails.medications?.map((med, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-[#eeece6] bg-[#faf9f6] text-xs space-y-1"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-bold text-[#1f2b37]">{med.name}</span>
                <span className="text-[11px] font-semibold text-[#8c352f] bg-[#fcf2f1] px-2 py-0.5 rounded border border-[#edd7d5] self-start sm:self-auto">
                  {med.dosage}
                </span>
              </div>
              <p className="text-[11px] text-[#556778] leading-relaxed">
                {med.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Required Clinical Tests & Actions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3c4e61] uppercase tracking-wider">
          <Stethoscope className="w-3.5 h-3.5 text-[#2b4162]" />
          <span>Clinical Tests & Next Steps</span>
        </div>
        <ul className="space-y-1.5 text-xs text-[#526373]">
          {aiDetails.clinicalActions?.map((action, i) => (
            <li
              key={i}
              className="flex items-start gap-2 p-2 rounded bg-[#faf9f6] border border-[#eeece6]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2b4162] mt-1.5 shrink-0" />
              <span className="leading-snug">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lifestyle Precautions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3c4e61] uppercase tracking-wider">
          <HeartPulse className="w-3.5 h-3.5 text-[#2b4162]" />
          <span>Precautions & Daily Care</span>
        </div>
        <ul className="space-y-1 text-xs text-[#526373] list-disc list-inside pl-1">
          {aiDetails.lifestyleGuidance?.map((guide, i) => (
            <li key={i} className="leading-relaxed">
              {guide}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="pt-2 border-t border-[#eeece6] flex items-start gap-1.5 text-[11px] text-[#7a8999]">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9aa7b5]" />
        <p className="leading-tight">
          AI clinical insights are generated by <code>{aiDetails.model}</code> for decision-support. Final therapeutic decisions must be made by a certified ophthalmologist.
        </p>
      </div>
    </div>
  );
}
