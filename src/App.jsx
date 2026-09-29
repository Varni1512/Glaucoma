import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Eye,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BarChart3,
  Activity,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { predictGlaucoma } from './utils/api';
import { getAiClinicalDetails } from './utils/aiService';
import ModelBenchmarks from './components/ModelBenchmarks';
import AiClinicalDetails from './components/AiClinicalDetails';

export default function App() {
  const fileInputRef = useRef(null);
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash === '#benchmarks' ? 'benchmarks' : 'detect';
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [result, setResult] = useState(null);
  const [aiDetails, setAiDetails] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [outputTab, setOutputTab] = useState('scores'); // 'scores' | 'ai'
  const [error, setError] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#benchmarks') {
        setCurrentRoute('benchmarks');
      } else {
        setCurrentRoute('detect');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.location.hash = route === 'benchmarks' ? '#benchmarks' : '#detect';
  };

  // File Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const loadFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG).');
      return;
    }
    setError(null);
    setResult(null);
    setAiDetails(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setAiDetails(null);
    setError(null);
    setShowRawJson(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Predict
  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setAiError(null);
    setAiDetails(null);
    setLoadingStage('Analyzing image with model...');

    // If request takes longer than 4.5 seconds, notify about Render's cold start
    const coldStartTimer = setTimeout(() => {
      setLoadingStage('Connecting to Render server (free tier container is waking up, please wait)...');
    }, 4500);

    try {
      const res = await predictGlaucoma(selectedFile);
      clearTimeout(coldStartTimer);
      setResult(res);

      // Immediately fetch live AI Clinical Details from openai/gpt-oss-120b
      setAiLoading(true);
      try {
        const aiReport = await getAiClinicalDetails(res);
        setAiDetails(aiReport);
      } catch (aiErr) {
        console.error('AI Clinical report error:', aiErr);
        setAiError(aiErr.message || 'Failed to fetch AI details.');
      } finally {
        setAiLoading(false);
      }
    } catch (err) {
      clearTimeout(coldStartTimer);
      setError(err.message || 'Error occurred while contacting the prediction API.');
    } finally {
      clearTimeout(coldStartTimer);
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.raw, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f6f5f1] text-[#24303d] font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-[#e5e2da] px-6 flex items-center justify-between shrink-0 shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#eef1f4] border border-[#d8dee4] flex items-center justify-center text-[#2b4162]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1f2b37] tracking-tight">
              Glaucoma Eye Diagnostic AI
            </h1>
            <p className="text-[11px] text-[#697887]">
              Retinal Fundus Image Analysis
            </p>
          </div>
        </div>

        {/* Route Navigation Buttons */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center bg-[#f0eee8] p-1 rounded-lg border border-[#e2ded5] text-xs">
            <button
              onClick={() => navigateTo('detect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                currentRoute === 'detect'
                  ? 'bg-white text-[#1f2b37] shadow-xs'
                  : 'text-[#627383] hover:text-[#1f2b37]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#2b4162]" />
              <span>Live Detection</span>
            </button>

            <button
              onClick={() => navigateTo('benchmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                currentRoute === 'benchmarks'
                  ? 'bg-white text-[#1f2b37] shadow-xs'
                  : 'text-[#627383] hover:text-[#1f2b37]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#2b4162]" />
              <span>Model Evaluation & Benchmarks</span>
            </button>
          </nav>

          {/* Reset button (visible on detection tab when an image is active) */}
          {currentRoute === 'detect' && previewUrl && (
            <button
              onClick={handleClear}
              title="Reset Scan"
              className="text-xs text-[#677788] hover:text-[#8c352f] flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#e5e2da] hover:border-[#dfc3c1] bg-[#faf9f6] transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      {currentRoute === 'benchmarks' ? (
        /* ROUTE 2: Model Performance & Faculty Review View */
        <ModelBenchmarks />
      ) : (
        /* ROUTE 1: Live Detection (Non-Scrolling Split Layout) */
        <main className="flex-1 p-4 sm:p-5 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT COLUMN: Image Input & Preview */}
            <div className="lg:col-span-5 h-full flex flex-col bg-white rounded-xl border border-[#e5e2da] shadow-xs overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-[#eeece6] flex items-center justify-between shrink-0 bg-[#faf9f6]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2b4162]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#3c4e61]">
                    Input Retinal Image
                  </h2>
                </div>
                {selectedFile && (
                  <button
                    onClick={handleClear}
                    disabled={loading}
                    className="text-xs text-[#7d8c9a] hover:text-[#8c352f] flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
                {/* Error message */}
                {error && (
                  <div className="bg-[#fcf2f1] border border-[#f4d4d2] rounded-lg p-3.5 text-xs text-[#8c352f] space-y-2 shrink-0">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#a84a44]" />
                      <div className="flex-1">
                        <span className="font-semibold block mb-0.5">Prediction Request Failed</span>
                        <p className="leading-relaxed text-[#752a25]">{error}</p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handlePredict}
                        disabled={loading}
                        className="px-3 py-1 bg-[#8c352f] hover:bg-[#722b26] text-white rounded text-[11px] font-medium transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry Request</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Drop Zone OR Selected Preview */}
                {!previewUrl ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 min-h-[260px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-[#2b4162] bg-[#f2f5f8]'
                        : 'border-[#d8d5cb] hover:border-[#9ea8b3] bg-[#faf9f6] hover:bg-white'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-white border border-[#e5e2da] flex items-center justify-center text-[#4a5c6e] mb-3 shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-[#24303d]">
                      Drop glaucoma retinal scan here, or click to browse
                    </p>
                    <p className="text-[11px] text-[#788896] mt-1">
                      Supports color fundus images (PNG, JPG, JPEG)
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center bg-[#1e2631] rounded-lg p-3 border border-[#344253] overflow-hidden min-h-[240px]">
                    <img
                      src={previewUrl}
                      alt="Fundus Scan"
                      className="max-h-[300px] w-auto object-contain rounded"
                    />
                    <span className="text-[11px] font-mono text-[#a4b2c1] mt-2 truncate max-w-xs">
                      {selectedFile?.name || 'Selected scan'}
                    </span>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="shrink-0 pt-2 border-t border-[#eeece6]">
                  <button
                    type="button"
                    disabled={!selectedFile || loading}
                    onClick={handlePredict}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#2b4162] hover:bg-[#203350] text-white text-xs font-semibold flex items-center justify-center gap-2 border border-[#23354f] transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                        <span className="truncate">{loadingStage || 'Processing...'}</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Retinal Image</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Output, Percentages & AI Details */}
            <div className="lg:col-span-7 h-full flex flex-col bg-white rounded-xl border border-[#e5e2da] shadow-xs overflow-hidden">
              {/* Header with Output Tabs */}
              <div className="px-5 py-3 border-b border-[#eeece6] flex items-center justify-between shrink-0 bg-[#faf9f6]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3d7a52]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#3c4e61]">
                    Diagnostic Output
                  </h2>
                </div>

                {result && (
                  <div className="flex items-center bg-[#eeece6] p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setOutputTab('scores')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        outputTab === 'scores'
                          ? 'bg-white text-[#1f2b37] shadow-xs'
                          : 'text-[#677788] hover:text-[#1f2b37]'
                      }`}
                    >
                      Detection Scores
                    </button>
                    <button
                      onClick={() => setOutputTab('ai')}
                      className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                        outputTab === 'ai'
                          ? 'bg-white text-[#1f2b37] shadow-xs'
                          : 'text-[#677788] hover:text-[#1f2b37]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#2b4162]" />
                      <span>AI Details (gpt-oss-120b)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 p-5 overflow-y-auto">
                {!result ? (
                  /* Empty state */
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#f4f3ef] border border-[#e2dfd5] flex items-center justify-center text-[#7d8c9a]">
                      <Eye className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#24303d]">
                        Awaiting Retinal Scan
                      </h3>
                      <p className="text-xs text-[#718292] max-w-sm mt-1 leading-relaxed">
                        Upload an eye image on the left and click <strong>"Analyze Retinal Image"</strong> to view the model's prediction, percentage scores, and automated AI clinical guidance.
                      </p>
                    </div>
                  </div>
                ) : outputTab === 'ai' ? (
                  /* Tab 2: AI Clinical Details */
                  <AiClinicalDetails
                    aiDetails={aiDetails}
                    loading={aiLoading}
                    error={aiError}
                    onRetry={async () => {
                      if (!result) return;
                      setAiLoading(true);
                      setAiError(null);
                      try {
                        const updated = await getAiClinicalDetails(result);
                        setAiDetails(updated);
                      } catch (e) {
                        setAiError(e.message);
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                  />
                ) : (
                  /* Tab 1: Detection Scores & Percentages */
                  <div className="space-y-5">
                    {/* Primary Verdict Banner: Soft English Brick or Sage */}
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                        result.isGlaucoma
                          ? 'bg-[#fcf1f0] border-[#f4d4d2] text-[#8c352f]'
                          : 'bg-[#edf4ee] border-[#d4e2d7] text-[#2d5c3d]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                            result.isGlaucoma
                              ? 'bg-[#a84a44] text-white'
                              : 'bg-[#3d7a52] text-white'
                          }`}
                        >
                          {result.isGlaucoma ? (
                            <AlertTriangle className="w-6 h-6" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                            Detection Verdict
                          </span>
                          <h3 className="text-xl font-bold tracking-tight">
                            {result.prediction}
                          </h3>
                          <p className="text-xs opacity-90 mt-0.5">
                            {result.isGlaucoma
                              ? 'Glaucomatous optic nerve head cupping detected'
                              : 'Healthy retinal fundus morphology detected'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-semibold text-[#6d7c8a] block">
                          Dominant Score
                        </span>
                        <span className="text-2xl font-extrabold tracking-tight text-[#1e2a36]">
                          {result.isGlaucoma ? result.glaucomaProb : result.healthyProb}%
                        </span>
                      </div>
                    </div>

                    {/* Percentage Breakdown Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#3d4f61] uppercase tracking-wider">
                          Probability Breakdown
                        </h4>
                        <span className="text-[11px] text-[#788896]">
                          Processed at {result.timestamp}
                        </span>
                      </div>

                      {/* Glaucoma Metric Card */}
                      <div className="p-4 rounded-lg border border-[#eeece6] bg-[#faf9f6] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#8c352f] flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#b85d56]" />
                            Glaucoma Probability
                          </span>
                          <span className="text-sm font-bold text-[#1f2b37]">
                            {result.glaucomaProb}%
                          </span>
                        </div>
                        {/* Flat solid terracotta bar - NO GRADIENTS */}
                        <div className="w-full bg-[#e8e5dc] h-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#b85d56] transition-all duration-500 rounded-full"
                            style={{ width: `${result.glaucomaProb}%` }}
                          />
                        </div>
                      </div>

                      {/* Healthy Metric Card */}
                      <div className="p-4 rounded-lg border border-[#eeece6] bg-[#faf9f6] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#2d5c3d] flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4a6b57]" />
                            Healthy Probability
                          </span>
                          <span className="text-sm font-bold text-[#1f2b37]">
                            {result.healthyProb}%
                          </span>
                        </div>
                        {/* Flat solid sage bar - NO GRADIENTS */}
                        <div className="w-full bg-[#e8e5dc] h-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4a6b57] transition-all duration-500 rounded-full"
                            style={{ width: `${result.healthyProb}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Preview Prompt Callout */}
                    {aiDetails && (
                      <div className="p-3.5 rounded-lg border border-[#d6dfeb] bg-[#f4f7fa] flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#2b4162] shrink-0" />
                          <span className="text-[#2b4162] font-medium">
                            AI Clinical Details available: {aiDetails.stage}
                          </span>
                        </div>
                        <button
                          onClick={() => setOutputTab('ai')}
                          className="px-3 py-1 rounded bg-[#2b4162] hover:bg-[#203350] text-white text-[11px] font-semibold transition shrink-0"
                        >
                          View AI Report →
                        </button>
                      </div>
                    )}

                    {/* Raw API JSON Accordion */}
                    <div className="pt-2 border-t border-[#eeece6]">
                      <button
                        type="button"
                        onClick={() => setShowRawJson(!showRawJson)}
                        className="text-xs font-medium text-[#657686] hover:text-[#1e2a36] flex items-center justify-between w-full py-1"
                      >
                        <span>Show Exact API JSON Response</span>
                        {showRawJson ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {showRawJson && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleCopyJson}
                              className="text-[11px] text-[#556778] hover:text-[#1e2a36] flex items-center gap-1 bg-[#eeece6] px-2 py-0.5 rounded border border-[#dfdbcf]"
                            >
                              {copied ? (
                                <Check className="w-3 h-3 text-[#3d7a52]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-[#1e2631] text-[#d6e0ea] font-mono text-[11px] rounded border border-[#344253] overflow-x-auto max-h-36">
                            {JSON.stringify(result.raw, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}