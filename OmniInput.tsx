import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Globe,
  Image as ImageIcon,
  Sparkles,
  Upload,
  ArrowRight,
  Zap,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Copy,
  ScanLine,
  Video,
  Film,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { InputMode, SampleClaim } from '../types';
import { soundFx } from '../utils/audio';

interface OmniInputProps {
  onAnalyze: (payload: {
    text: string;
    inputMode: InputMode;
    url?: string;
    title?: string;
    videoBase64?: string;
    videoMimeType?: string;
    videoName?: string;
  }) => void;
  isLoading: boolean;
  sampleClaims: SampleClaim[];
}

export const OmniInput: React.FC<OmniInputProps> = ({ onAnalyze, isLoading, sampleClaims }) => {
  const [activeTab, setActiveTab] = useState<InputMode>('text');
  const [textValue, setTextValue] = useState<string>('');
  const [urlValue, setUrlValue] = useState<string>('');
  const [isScrapingUrl, setIsScrapingUrl] = useState<boolean>(false);
  const [scrapedMetadata, setScrapedMetadata] = useState<{ title?: string; domain?: string; author?: string } | null>(null);

  // Image OCR state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');

  // Video Deepfake State
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [videoMimeType, setVideoMimeType] = useState<string>('video/mp4');
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [isVideoScanning, setIsVideoScanning] = useState<boolean>(false);
  const [videoScanProgress, setVideoScanProgress] = useState<number>(0);
  const [videoScanStatus, setVideoScanStatus] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect URL paste in text mode
  const handleTextChange = (val: string) => {
    setTextValue(val);
    setErrorMessage(null);
    if ((activeTab === 'text' && val.trim().startsWith('http://')) || val.trim().startsWith('https://')) {
      if (!val.includes(' ') && val.length < 300) {
        setUrlValue(val.trim());
      }
    }
  };

  // Scrape URL manually or during tab action
  const handleScrapeUrl = async (overrideUrl?: string) => {
    const target = overrideUrl || urlValue;
    if (!target || !target.startsWith('http')) {
      setErrorMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setIsScrapingUrl(true);
    setErrorMessage(null);
    soundFx.playScan();

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scrape target URL');
      }
      setTextValue(data.article.content);
      setScrapedMetadata({
        title: data.article.title,
        domain: data.article.domain,
        author: data.article.author,
      });
      soundFx.playBeep(880, 0.08);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsScrapingUrl(false);
    }
  };

  // Video File Processing
  const processVideoFile = (file: File) => {
    const allowedExtensions = ['.mp4', '.mov', '.webm'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const validMime = file.type.startsWith('video/') || allowedExtensions.includes(ext);

    if (!validMime) {
      setErrorMessage('Invalid video format. Please upload .mp4, .mov, or .webm video files.');
      return;
    }

    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_VIDEO_SIZE) {
      setVideoPreview(null);
      setVideoBase64(null);
      setVideoName(null);
      setIsVideoScanning(false);
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
      setErrorMessage('[ERROR] FILE_TOO_LARGE: Video exceeds the 50MB optimization limit. Please upload a clip under 50MB for fast forensic analysis.');
      soundFx.playVerdict(true);
      return;
    }

    setErrorMessage(null);
    setIsVideoScanning(true);
    setVideoScanProgress(15);
    setVideoScanStatus('INITIALIZING_VIDEO_FRAME_EXTRACTOR...');
    setVideoName(file.name);
    const mime = file.type || (ext === '.mov' ? 'video/quicktime' : ext === '.webm' ? 'video/webm' : 'video/mp4');
    setVideoMimeType(mime);
    soundFx.playScan();

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 60) + 15;
        setVideoScanProgress(pct);
        setVideoScanStatus(`INGESTING_VIDEO_BYTES (${Math.round(e.loaded / 1024)} KB)...`);
      }
    };

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setVideoBase64(dataUrl);
      setVideoScanProgress(100);
      setVideoScanStatus('VIDEO_INGEST_COMPLETE // READY_FOR_GEMINI_DEEPFAKE_SCAN');
      setIsVideoScanning(false);
      soundFx.playBeep(920, 0.1);

      if (!textValue || textValue.trim().length === 0) {
        setTextValue(`[VIDEO_DEEPFAKE_PAYLOAD]: ${file.name}\nAnalyzing visual frames for deepfake synthetic artifacts and audio track for voice cloning.`);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read video file.');
      setIsVideoScanning(false);
    };

    reader.readAsDataURL(file);
  };

  // OCR Processing with Tesseract.js
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP, Screenshot)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setIsOcrProcessing(true);
      setOcrProgress(10);
      setOcrStatusText('Initializing Neural OCR Matrix...');
      soundFx.playScan();

      try {
        const worker = await createWorker('eng');
        setOcrProgress(40);
        setOcrStatusText('Extracting text tensors from pixels...');

        const ret = await worker.recognize(dataUrl);
        setOcrProgress(90);
        setOcrStatusText('Normalizing UTF-8 stream...');

        const extracted = ret.data.text.trim();
        await worker.terminate();

        if (!extracted || extracted.length < 5) {
          throw new Error('Could not extract legible text. Please paste text directly or provide a higher resolution crop.');
        }

        setTextValue(extracted);
        setOcrProgress(100);
        setOcrStatusText('OCR Extraction Complete.');
        soundFx.playBeep(920, 0.1);
      } catch (ocrErr) {
        setErrorMessage((ocrErr as Error).message || 'OCR extraction failed');
      } finally {
        setIsOcrProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Paste image handler from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setActiveTab('image');
            processImageFile(blob);
          }
          break;
        } else if (items[i].type.indexOf('video') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setActiveTab('video');
            processVideoFile(blob);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleSelectSample = (sample: SampleClaim) => {
    soundFx.playClick();
    setActiveTab(sample.inputMode);
    setTextValue(sample.text);
    if (sample.url) {
      setUrlValue(sample.url);
    }
    setScrapedMetadata({
      title: sample.title,
    });
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textValue || textValue.trim().length === 0) {
      if (activeTab === 'url' && urlValue) {
        handleScrapeUrl();
        return;
      }
      if (activeTab === 'video' && videoName) {
        // Fallback title for video
      } else {
        setErrorMessage('INPUT_EMPTY: Paste claim payload, URL endpoint, image screenshot, or upload a video.');
        return;
      }
    }
    soundFx.playScan();
    onAnalyze({
      text: textValue || (videoName ? `Video Deepfake Target: ${videoName}` : 'Video analysis payload'),
      inputMode: activeTab,
      url: activeTab === 'url' ? urlValue : undefined,
      title: scrapedMetadata?.title || (videoName ? `Video Deepfake: ${videoName}` : undefined),
      videoBase64: videoBase64 || undefined,
      videoMimeType: videoMimeType || undefined,
      videoName: videoName || undefined,
    });
  };

  const handleClear = () => {
    soundFx.playClick();
    setTextValue('');
    setUrlValue('');
    setImagePreview(null);
    setVideoPreview(null);
    setVideoName(null);
    setVideoBase64(null);
    setIsVideoScanning(false);
    setScrapedMetadata(null);
    setErrorMessage(null);
  };

  const wordCount = textValue.split(/\s+/).filter(Boolean).length;
  const charCount = textValue.length;

  return (
    <div className="w-full space-y-4">
      {/* Main Omni-Input Container (Immersive UI Frame) */}
      <div className="border-neon bg-black p-4 sm:p-5 shadow-[0_0_15px_rgba(0,255,65,0.1)] relative">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#00ff41]/20 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41] opacity-90">
              MULTI_MODAL_INPUT (TEXT / URL / IMAGE / VIDEO)
            </label>
            <div className="flex gap-1">
              <div className="h-1 w-6 bg-[#00ff41]" />
              <div className="h-1 w-3 bg-[#00ff41]/40" />
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[#00ff41]/70">
            <span>TOKENS: <strong className="text-white">{wordCount}</strong></span>
            <span className="opacity-30">|</span>
            <span>BYTES: <strong className="text-white">{charCount}</strong></span>
          </div>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('text');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#00ff41] text-black border border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>RAW_TEXT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('url');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[#00ff41] text-black border border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>URL_SCRAPER</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('image');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'bg-[#00ff41] text-black border border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>IMAGE_OCR</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('video');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#00ff41] text-black border border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-black text-[#00ff41]/70 border border-[#00ff41]/20 hover:bg-[#00ff41]/10 hover:text-[#00ff41]'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>VIDEO_DEEPFAKE</span>
          </button>
        </div>

        {/* Dynamic Mode Forms */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* URL Scraper Bar */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="w-3.5 h-3.5 text-[#00ff41] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    id="input-url"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    placeholder="https://news-outlet.com/article/sample-headline..."
                    className="w-full pl-8 pr-3 py-2 bg-[#080808] border border-[#00ff41]/30 text-white placeholder-[#00ff41]/30 text-xs focus:outline-none focus:border-[#00ff41] font-mono"
                  />
                </div>
                <button
                  type="button"
                  id="btn-scrape-url"
                  disabled={isScrapingUrl || !urlValue}
                  onClick={() => handleScrapeUrl()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-black border border-[#00ff41]/40 hover:bg-[#00ff41]/10 text-[#00ff41] text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isScrapingUrl ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-[#00ff41]" />
                      <span>SCRAPING...</span>
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-3 h-3 text-[#00ff41]" />
                      <span>FETCH_TARGET</span>
                    </>
                  )}
                </button>
              </div>

              {scrapedMetadata?.title && (
                <div className="px-3 py-2 bg-[#00ff41]/5 border border-[#00ff41]/20 text-[11px] flex items-center justify-between">
                  <span className="text-white truncate">
                    NEWS: {scrapedMetadata.title}
                  </span>
                  {scrapedMetadata.domain && (
                    <span className="text-[#00ff41] text-[10px] shrink-0 ml-2 font-bold">
                      [{scrapedMetadata.domain}]
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Video Deepfake Dropzone */}
          {activeTab === 'video' && (
            <div className="space-y-3">
              <div
                onClick={() => videoFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processVideoFile(e.dataTransfer.files[0]);
                  }
                }}
                className="cursor-pointer border border-dashed border-[#00ff41]/40 hover:border-[#00ff41] p-5 text-center bg-[#080808] hover:bg-[#00ff41]/5 transition-all group relative overflow-hidden"
              >
                <input
                  type="file"
                  ref={videoFileInputRef}
                  accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processVideoFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-black border border-[#00ff41]/50 flex items-center justify-center text-[#00ff41] group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                    {isVideoScanning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Video className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-wide">
                      DRAG & DROP VIDEO FILE (.MP4, .MOV, .WEBM)
                    </p>
                    <p className="text-[10px] text-[#00ff41]/70 mt-0.5">
                      Neural audio/video frame analysis for AI deepfakes, voice clones, and visual manipulation
                    </p>
                  </div>
                </div>

                {isVideoScanning && (
                  <div className="mt-3 max-w-sm mx-auto">
                    <div className="flex items-center justify-between text-[9px] text-[#00ff41] mb-1 font-bold">
                      <span className="animate-pulse">{videoScanStatus}</span>
                      <span>{videoScanProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black overflow-hidden border border-[#00ff41]/40 relative">
                      <div
                        className="h-full bg-[#00ff41] transition-all duration-300 shadow-[0_0_10px_#00ff41]"
                        style={{ width: `${videoScanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {videoPreview && (
                <div className="p-3 bg-black border border-[#00ff41] space-y-2 relative shadow-[0_0_12px_rgba(0,255,65,0.15)]">
                  <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
                    <div className="flex items-center gap-2 truncate">
                      <Film className="w-4 h-4 text-[#00ff41] shrink-0" />
                      <span className="text-xs font-bold text-white truncate font-mono">
                        TARGET_VIDEO: {videoName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoName(null);
                        setVideoBase64(null);
                      }}
                      className="p-1 text-gray-400 hover:text-[#ff3e3e] transition-colors"
                      title="Remove Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full sm:w-48 h-28 object-cover border border-[#00ff41]/40 bg-black rounded-none"
                    />
                    <div className="flex-1 space-y-1 text-left w-full">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-[9px] font-bold uppercase">
                        <ScanLine className="w-3 h-3 animate-spin" />
                        <span>FRAMES_INGESTED // READY_FOR_GEMINI</span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Media container: <span className="text-[#00ff41] font-mono">{videoMimeType}</span>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Visual frames and audio track ready for deepfake artifact and voice cloning inspection.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image OCR Dropzone */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processImageFile(e.dataTransfer.files[0]);
                  }
                }}
                className="cursor-pointer border border-dashed border-[#00ff41]/40 hover:border-[#00ff41] p-4 text-center bg-[#080808] hover:bg-[#00ff41]/5 transition-all group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-black border border-[#00ff41]/40 flex items-center justify-center text-[#00ff41] group-hover:scale-110 transition-transform">
                    {isOcrProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </div>
                  <p className="text-xs text-white">
                    DRAG SCREENSHOT OR PRESS <span className="text-[#00ff41] font-bold">CTRL+V</span> TO EXTRACT
                  </p>
                  <p className="text-[10px] text-[#00ff41]/60">
                    Supports Twitter, WhatsApp, Reddit crops • Automated Neural OCR Vectorizer
                  </p>
                </div>

                {isOcrProcessing && (
                  <div className="mt-3 max-w-xs mx-auto">
                    <div className="flex items-center justify-between text-[9px] text-[#00ff41] mb-1 font-bold">
                      <span>{ocrStatusText}</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-black overflow-hidden border border-[#00ff41]/30">
                      <div
                        className="h-full bg-[#00ff41] transition-all duration-300 shadow-[0_0_8px_#00ff41]"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {imagePreview && (
                <div className="flex items-center gap-3 p-2 bg-black border border-[#00ff41]/30">
                  <img src={imagePreview} alt="OCR source" className="w-12 h-12 object-cover border border-[#00ff41]/40" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#00ff41] font-bold block uppercase">
                      TESSERACT_OCR_STREAM
                    </span>
                    <span className="text-[11px] text-gray-300 truncate block">
                      {textValue ? `${textValue.slice(0, 70)}...` : 'Reading optical characters...'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setTextValue('');
                    }}
                    className="p-1.5 text-gray-500 hover:text-[#ff3e3e]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Core Text Input Area */}
          <div className="relative">
            <textarea
              id="input-claim-text"
              rows={4}
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={
                activeTab === 'url'
                  ? '[SCANNING_TARGET] Scraped article body will appear here for continuous ML regression...'
                  : activeTab === 'image'
                  ? '[OCR_BUFFER] Extracted textual contents will stream here...'
                  : activeTab === 'video'
                  ? '[VIDEO_PAYLOAD] Optional notes or context for deepfake video detection...'
                  : '[ENTER_INTEL] Paste viral WhatsApp rumor, news excerpt, or clickbait claim here...'
              }
              className="w-full p-3 bg-[#080808] border border-[#00ff41]/30 text-xs text-[#00ff41] placeholder-[#00ff41]/30 focus:outline-none focus:border-[#00ff41] resize-none leading-relaxed min-h-[110px]"
              spellCheck={false}
            />

            {!textValue && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const clip = await navigator.clipboard.readText();
                    if (clip) handleTextChange(clip);
                  } catch {
                    // Clipboard permissions
                  }
                }}
                className="absolute right-2.5 bottom-2.5 flex items-center gap-1 px-2 py-0.5 bg-black hover:bg-[#00ff41]/20 text-[10px] text-[#00ff41] border border-[#00ff41]/30 uppercase font-bold cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>PASTE</span>
              </button>
            )}
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 bg-[#180000] border border-[#ff3e3e] text-[#ff3e3e] text-xs font-mono shadow-[0_0_15px_rgba(255,62,62,0.35)] animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff3e3e]" />
              <span className="font-bold tracking-wide">{errorMessage}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              id="btn-clear-input"
              disabled={isLoading || (!textValue && !urlValue && !imagePreview && !videoPreview)}
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] text-[#00ff41]/60 hover:text-[#ff3e3e] border border-white/10 hover:border-[#ff3e3e]/40 uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR_BUFFER</span>
            </button>

            <button
              type="submit"
              id="btn-execute-inference"
              disabled={isLoading || isScrapingUrl || isOcrProcessing || isVideoScanning}
              className="btn-neon-action flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>
                    {activeTab === 'video' || videoName ? '[UPLOADING_TO_GEMINI_FILES_API...]' : 'ANALYZING_PAYLOAD...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{activeTab === 'video' ? 'ANALYZE_DEEPFAKE_VIDEO' : 'RUN_CORE_ENGINE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
