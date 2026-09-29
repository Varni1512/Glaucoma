import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Layers,
  CheckCircle2,
  Maximize2,
  X,
  FileText,
  TrendingUp,
  Cpu,
} from 'lucide-react';

const BENCHMARK_ITEMS = [
  {
    id: 'sota',
    title: 'State-of-the-Art Comparison (RIM-ONE r12)',
    category: 'Benchmark Comparison',
    figureNumber: 'Table III & Fig. 5',
    image: '/research/fig5_sota_comparison.png',
    description:
      'Comparison between proposed ensemble model accuracy (89.43%) against prominent existing published works on the RIM-ONE r12 benchmark.',
    keyStats: [
      { label: 'Proposed Ensemble', value: '89.43%' },
      { label: 'Yi et al. [16]', value: '86.80%' },
      { label: 'Agrawal et al. [25]', value: '86.13%' },
      { label: 'Kirar et al. [21]', value: '83.60%' },
      { label: 'Maheshwari et al. [14]', value: '80.66%' },
    ],
  },
  {
    id: 'classification_report',
    title: 'Classification Report & Performance Metrics',
    category: 'Class Metrics',
    figureNumber: 'Fig. 4 & Summary Table',
    image: '/research/fig4_classification_report.png',
    description:
      'Detailed precision, recall, and F1-score for binary classes (Glaucoma n=688, Healthy n=1252) evaluated on the RIM-ONE r12 dataset.',
    keyStats: [
      { label: 'Glaucoma Precision', value: '0.90' },
      { label: 'Glaucoma Recall', value: '0.80' },
      { label: 'Healthy Recall', value: '0.95' },
      { label: 'Overall F1-Score', value: '0.89' },
    ],
  },
  {
    id: 'confusion_matrix',
    title: 'Aggregated 10-Fold Confusion Matrix',
    category: 'Cross-Validation Matrix',
    figureNumber: 'Fig. 3',
    image: '/research/fig3_confusion_matrix.png',
    description:
      'Aggregated confusion matrix across 10 folds of stratified cross-validation. Shows 547 True Positives and 1188 True Negatives.',
    keyStats: [
      { label: 'True Glaucoma', value: '547' },
      { label: 'True Healthy', value: '1188' },
      { label: 'False Positives', value: '64' },
      { label: 'False Negatives', value: '141' },
    ],
  },
  {
    id: 'cross_validation',
    title: '10-Fold Stratified Cross-Validation Results',
    category: 'Fold Performance',
    figureNumber: 'Table II & Fig. 2',
    image: '/research/fig2_cross_validation.png',
    description:
      'Performance consistency across all 10 folds illustrating accuracy, sensitivity, and specificity distribution.',
    keyStats: [
      { label: 'Mean Accuracy', value: '89.43%' },
      { label: 'Mean Sensitivity', value: '79.51%' },
      { label: 'Mean Specificity', value: '94.85%' },
    ],
  },
  {
    id: 'terminal_logs',
    title: 'Training Execution & Voting Ensemble Terminal Log',
    category: 'Execution Proof',
    figureNumber: 'Execution Console',
    image: '/research/fig1_terminal_results.png',
    description:
      'Console execution logs of the ensemble model (SVM + Random Forest + Gradient Boosting voting together) with ± standard deviation metrics.',
    keyStats: [
      { label: 'Ensemble Type', value: 'SVM + RF + GB' },
      { label: 'Accuracy std', value: '± 1.33%' },
      { label: 'Specificity std', value: '± 1.69%' },
    ],
  },
];

export default function ModelBenchmarks() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? BENCHMARK_ITEMS
      : BENCHMARK_ITEMS.filter((item) => item.id === activeFilter);

  return (
    <div className="h-full flex flex-col overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Title & Overview Banner */}
      <div className="bg-white rounded-xl border border-[#e5e2da] p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#eef2f6] text-[#2b4162] border border-[#d6dfeb]">
              Academic & Research Validation
            </span>
            <span className="text-xs text-[#788896]">Dataset: RIM-ONE r12</span>
          </div>
          <h2 className="text-lg font-bold text-[#1f2b37] mt-1 tracking-tight">
            Model Evaluation & Benchmark Performance
          </h2>
          <p className="text-xs text-[#627383] mt-0.5 max-w-2xl leading-relaxed">
            Empirical results of the proposed Soft Voting Ensemble (SVM + Random Forest + Gradient Boosting) across 10-fold stratified cross-validation.
          </p>
        </div>

        {/* 3 Key Research KPI Badges */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          <div className="p-3 bg-[#faf9f6] rounded-lg border border-[#eeece6] text-center">
            <span className="text-[10px] uppercase font-bold text-[#6f7e8c] block">
              Mean Accuracy
            </span>
            <span className="text-lg font-extrabold text-[#1f2b37] block mt-0.5">
              89.43%
            </span>
            <span className="text-[10px] text-[#8695a3]">± 1.33%</span>
          </div>

          <div className="p-3 bg-[#faf9f6] rounded-lg border border-[#eeece6] text-center">
            <span className="text-[10px] uppercase font-bold text-[#6f7e8c] block">
              Specificity
            </span>
            <span className="text-lg font-extrabold text-[#2d5c3d] block mt-0.5">
              94.89%
            </span>
            <span className="text-[10px] text-[#8695a3]">± 1.69%</span>
          </div>

          <div className="p-3 bg-[#faf9f6] rounded-lg border border-[#eeece6] text-center">
            <span className="text-[10px] uppercase font-bold text-[#6f7e8c] block">
              Sensitivity
            </span>
            <span className="text-lg font-extrabold text-[#8c352f] block mt-0.5">
              79.51%
            </span>
            <span className="text-[10px] text-[#8695a3]">± 3.52%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeFilter === 'all'
              ? 'bg-[#2b4162] text-white shadow-xs'
              : 'bg-white border border-[#e5e2da] text-[#556778] hover:bg-[#faf9f6]'
          }`}
        >
          All Outputs ({BENCHMARK_ITEMS.length})
        </button>
        {BENCHMARK_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFilter(item.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              activeFilter === item.id
                ? 'bg-[#2b4162] text-white shadow-xs'
                : 'bg-white border border-[#e5e2da] text-[#556778] hover:bg-[#faf9f6]'
            }`}
          >
            {item.figureNumber}
          </button>
        ))}
      </div>

      {/* Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-[#e5e2da] overflow-hidden shadow-xs flex flex-col hover:border-[#cfcbbe] transition"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#faf9f6] border-b border-[#eeece6] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#788896]">
                  {item.figureNumber} • {item.category}
                </span>
                <h3 className="text-xs font-bold text-[#1f2b37] mt-0.5">
                  {item.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(item)}
                title="Expand Full Resolution"
                className="p-1.5 text-[#6c7c8c] hover:text-[#1f2b37] hover:bg-[#eeece6] rounded-md transition"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div
              onClick={() => setSelectedImage(item)}
              className="bg-[#faf9f7] p-3 flex items-center justify-center cursor-pointer border-b border-[#eeece6] group relative min-h-[260px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="max-h-[300px] w-auto object-contain rounded transition group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-[#2b4162]/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-[11px] font-semibold text-[#1f2b37] bg-white/95 px-3 py-1 rounded-md border border-[#e5e2da] shadow-xs flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3" />
                  Click to Expand
                </span>
              </div>
            </div>

            {/* Description & Key Stats */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#526373] leading-relaxed">
                {item.description}
              </p>

              {/* Stats badges */}
              <div className="pt-2 border-t border-[#eeece6] flex flex-wrap gap-2">
                {item.keyStats.map((st, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 bg-[#faf9f6] border border-[#e5e2da] rounded text-[11px] flex items-center gap-1.5"
                  >
                    <span className="text-[#788896]">{st.label}:</span>
                    <span className="font-bold text-[#1f2b37]">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Full Resolution View */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-[#1e2631]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-[#d8d5cb] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="px-5 py-3.5 bg-[#faf9f6] border-b border-[#eeece6] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#788896]">
                  {selectedImage.figureNumber}
                </span>
                <h3 className="text-sm font-bold text-[#1f2b37]">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 text-[#6c7c8c] hover:text-[#1f2b37] rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-[#faf9f7]">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>

            <div className="px-5 py-3 bg-white border-t border-[#eeece6] text-xs text-[#526373]">
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
