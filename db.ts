import fs from 'fs';
import path from 'path';
import { AnalysisResult, HistoryItem, SampleClaim } from '../src/types';
import { generateRuleBasedForensicReport } from './forensic-analyst';
import { getKnowledgeBaseEntry } from './knowledge-base';

const DB_FILE_PATH = path.join(process.cwd(), 'claims_ledger.json');

// In-memory cache + file sync
let itemsStore: AnalysisResult[] = [];

// Initialize database
function loadDb(): void {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      itemsStore = JSON.parse(data);
    } else {
      itemsStore = getInitialPreloadedHistory();
      saveDb();
    }
  } catch (err) {
    console.error('Error loading claims ledger:', err);
    itemsStore = getInitialPreloadedHistory();
  }
}

function saveDb(): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(itemsStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving claims ledger:', err);
  }
}

loadDb();

export function getAllHistory(): HistoryItem[] {
  return itemsStore
    .map((item) => ({
      id: item.id,
      timestamp: item.timestamp,
      inputMode: item.inputMode,
      snippet: item.rawText.slice(0, 140) + (item.rawText.length > 140 ? '...' : ''),
      verdict: item.verdict,
      riskScore: item.riskScore,
      confidence: item.metrics?.confidence || 90,
      sourceUrl: item.sourceUrl,
      sourceDomain: item.sourceDomain,
      sourceTitle: item.sourceTitle,
      wordCount: item.wordCount,
      flagCount: item.sentences ? item.sentences.filter((s) => s.isFlagged).length : 0,
      factChecksCount: item.publicFactChecks ? item.publicFactChecks.length : 0,
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getClaimById(id: string): AnalysisResult | undefined {
  return itemsStore.find((item) => item.id === id);
}

export function saveClaim(result: AnalysisResult): void {
  const existingIdx = itemsStore.findIndex((item) => item.id === result.id);
  if (existingIdx >= 0) {
    itemsStore[existingIdx] = result;
  } else {
    itemsStore.unshift(result);
    if (itemsStore.length > 150) {
      itemsStore = itemsStore.slice(0, 150);
    }
  }
  saveDb();
}

export function deleteClaim(id: string): boolean {
  const initialLen = itemsStore.length;
  itemsStore = itemsStore.filter((item) => item.id !== id);
  if (itemsStore.length !== initialLen) {
    saveDb();
    return true;
  }
  return false;
}

export function clearAllClaims(): void {
  itemsStore = [];
  saveDb();
}

export function getDatabaseStats() {
  const total = itemsStore.length;
  const fakeCount = itemsStore.filter((i) => i.verdict === 'FAKE').length;
  const suspiciousCount = itemsStore.filter((i) => i.verdict === 'SUSPICIOUS').length;
  const credibleCount = itemsStore.filter((i) => i.verdict === 'CREDIBLE').length;
  const avgRiskScore = total > 0 ? Math.round((itemsStore.reduce((acc, i) => acc + i.riskScore, 0) / total) * 10) / 10 : 0;

  return {
    totalClaims: total,
    fakeCount,
    suspiciousCount,
    credibleCount,
    avgRiskScore,
    lastUpdated: itemsStore[0]?.timestamp || new Date().toISOString(),
  };
}

// Initial preloaded claims for high-fidelity instant demo testing
function getInitialPreloadedHistory(): AnalysisResult[] {
  const fakeText = '🚨 URGENT ALERT: Forward to everyone before it gets deleted by Big Tech! Anonymous military scientists confirm that 5G radiation combined with tap water contains secret microchips to monitor your brainwaves. Share this message to 10 groups immediately or your account will be deleted permanently!!';
  const credibleText = 'According to the study published in Nature Geoscience, satellite telemetry from the European Space Agency corroborated by independent review teams at NOAA indicates sea surface temperatures rose by 0.18 degrees Celsius. The methodology utilized double-blind calibration across buoy networks with a 95% confidence interval.';

  return [
    {
      id: 'claim-init-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      inputMode: 'text',
      rawText: fakeText,
      wordCount: 45,
      verdict: 'FAKE',
      riskScore: 97.8,
      metrics: {
        randomForestClass: 'FAKE',
        randomForestProba: { credible: 0.02, suspicious: 0.08, fake: 0.90 },
        logisticRegressionRisk: 0.978,
        finalRiskScore: 97.8,
        confidence: 96,
        certaintyLevel: 'VERY_HIGH',
        modelAgreement: 94,
        tfidfTopFeatures: [
          { feature: 'forward to everyone', tfidfScore: 4.8, biasDirection: 'fake' },
          { feature: 'before it gets deleted', tfidfScore: 4.2, biasDirection: 'fake' },
          { feature: 'microchips', tfidfScore: 3.9, biasDirection: 'fake' },
          { feature: 'anonymous military', tfidfScore: 3.6, biasDirection: 'fake' }
        ],
        radarScores: [
          { dimension: 'Sensationalism', score: 98, benchmark: 25, description: 'Extreme hyperbole and panic generation' },
          { dimension: 'Urgency Bias', score: 95, benchmark: 20, description: 'Viral chain-letter coercion' },
          { dimension: 'Source Authenticity', score: 4, benchmark: 80, description: 'No verifiable institutional citation' },
          { dimension: 'Scientific Rigor', score: 2, benchmark: 75, description: 'Contradicts electromagnetic and biological physics' },
          { dimension: 'Emotional Polarity', score: 92, benchmark: 30, description: 'High paranoia and fear manipulation' },
        ],
      },
      sentences: [
        {
          index: 1,
          text: '🚨 URGENT ALERT: Forward to everyone before it gets deleted by Big Tech!',
          riskScore: 98,
          isFlagged: true,
          triggers: ['forward to everyone', 'before it gets deleted', 'EXCESSIVE_CAPS', 'PUNCTUATION_INTENSITY'],
          reason: 'Classic viral chain-forward coercion with artificial urgency triggers.',
        },
        {
          index: 2,
          text: 'Anonymous military scientists confirm that 5G radiation combined with tap water contains secret microchips to monitor your brainwaves.',
          riskScore: 94,
          isFlagged: true,
          triggers: ['anonymous scientist', 'microchip', '5g radiation'],
          reason: 'Vague anonymous authority citing disproven conspiratorial mechanisms.',
        },
        {
          index: 3,
          text: 'Share this message to 10 groups immediately or your account will be deleted permanently!!',
          riskScore: 96,
          isFlagged: true,
          triggers: ['delete immediately', 'PUNCTUATION_INTENSITY'],
          reason: 'Extortionate algorithmic scare-tactic forcing forwarding behavior.',
        },
      ],
      suspiciousKeywords: [
        { word: 'share before deleted', weight: 24.5, category: 'urgency', frequency: 1, knowledgeBase: getKnowledgeBaseEntry('share before deleted') },
        { word: 'forward to everyone', weight: 23.8, category: 'urgency', frequency: 1, knowledgeBase: getKnowledgeBaseEntry('forward to everyone') },
        { word: '5g radiation', weight: 22.5, category: 'conspiracy', frequency: 1, knowledgeBase: getKnowledgeBaseEntry('5g radiation') },
        { word: 'microchip', weight: 20.5, category: 'conspiracy', frequency: 1, knowledgeBase: getKnowledgeBaseEntry('microchip') },
      ],
      publicFactChecks: [
        {
          id: 'fc-init-01',
          claim: '5G mobile networks spread COVID-19 or weaken the human immune system.',
          claimant: 'Viral Social Media & WhatsApp Chain Messages',
          publisher: 'Reuters Fact Check',
          publisherSite: 'reuters.com',
          reviewUrl: 'https://www.reuters.com/article/idUSKBN21P1SX/',
          title: 'Fact Check: 5G mobile networks do not spread viruses and are safe',
          reviewDate: '2020-04-08',
          textualRating: 'False',
          ratingCategory: 'FALSE',
          summary: 'Multiple international health authorities including WHO and FCC confirmed that viruses cannot travel on radio waves and 5G non-ionizing radiation does not cause biological harm.',
        },
        {
          id: 'fc-init-02',
          claim: 'Vaccines or tap water contain microchips designed to track brainwaves.',
          claimant: 'Internet Conspiracy Posts',
          publisher: 'PolitiFact',
          publisherSite: 'politifact.com',
          reviewUrl: 'https://www.politifact.com/factchecks/2020/may/05/facebook-posts/no-bill-gates-isnt-planning-implant-microchips-tra/',
          title: 'No, public health supplies do not contain tracking microchips',
          reviewDate: '2020-05-05',
          textualRating: 'Pants on Fire',
          ratingCategory: 'FALSE',
          summary: 'Ingredients are publicly available and strictly regulated. There are no tracking microchips or surveillance hardware in tap water or vaccines.',
        }
      ],
      forensicReport: generateRuleBasedForensicReport(fakeText, 97.8),
      processingTimeMs: 42,
      terminalLogs: [
        '[INIT] Initializing Misinformation Vectorizer & ML Inference Engine v3.4...',
        '[FEATURE-EXTRACT] Caps urgency ratio: 0.38, Punctuation intensity: 4 triggers',
        '[TF-IDF] Generated sparse feature matrix with 45 unique dimensions',
        '[LOGISTIC-REGRESSION] Evaluated logit function: z=3.812 -> P(Misinfo)=97.8%',
        '[RANDOM-FOREST] 100 Estimators consensus voting: Fake=90%, Suspicious=8%, Credible=2%',
        '[DECISION-ENGINE] Primary Classification: [FAKE] (Confidence: 96%, Certainty: VERY_HIGH)',
        '[DONE] Pipeline execution completed in 42ms with zero runtime anomalies.'
      ],
    },
    {
      id: 'claim-init-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      inputMode: 'url',
      sourceUrl: 'https://www.nature.com/articles/d41586-024-climate-trends',
      sourceDomain: 'nature.com',
      sourceTitle: 'Global Ocean Temperature Anomalies in 2024: A Multi-Observatory Review',
      rawText: credibleText,
      wordCount: 48,
      verdict: 'CREDIBLE',
      riskScore: 8.4,
      metrics: {
        randomForestClass: 'CREDIBLE',
        randomForestProba: { credible: 0.94, suspicious: 0.05, fake: 0.01 },
        logisticRegressionRisk: 0.084,
        finalRiskScore: 8.4,
        confidence: 95,
        certaintyLevel: 'VERY_HIGH',
        modelAgreement: 94,
        tfidfTopFeatures: [
          { feature: 'according to the study', tfidfScore: 4.6, biasDirection: 'credible' },
          { feature: 'published in', tfidfScore: 4.1, biasDirection: 'credible' },
          { feature: 'confidence interval', tfidfScore: 3.9, biasDirection: 'credible' },
          { feature: 'methodology', tfidfScore: 3.7, biasDirection: 'credible' }
        ],
        radarScores: [
          { dimension: 'Sensationalism', score: 8, benchmark: 25, description: 'Objective academic phrasing' },
          { dimension: 'Urgency Bias', score: 5, benchmark: 20, description: 'No viral manipulation markers' },
          { dimension: 'Source Authenticity', score: 96, benchmark: 80, description: 'High-reputation peer-reviewed repository' },
          { dimension: 'Scientific Rigor', score: 94, benchmark: 75, description: 'Quantitative intervals and methodology cited' },
          { dimension: 'Emotional Polarity', score: 10, benchmark: 30, description: 'Neutral, empirical reporting' },
        ],
      },
      sentences: [
        {
          index: 1,
          text: 'According to the study published in Nature Geoscience, satellite telemetry from the European Space Agency corroborated by independent review teams at NOAA indicates sea surface temperatures rose by 0.18 degrees Celsius.',
          riskScore: 6,
          isFlagged: false,
          triggers: [],
          reason: 'Empirical vocabulary, objective attribution, or academic tone identified.',
        },
        {
          index: 2,
          text: 'The methodology utilized double-blind calibration across buoy networks with a 95% confidence interval.',
          riskScore: 9,
          isFlagged: false,
          triggers: [],
          reason: 'Formal statistical notation and data provenance specified.',
        },
      ],
      suspiciousKeywords: [],
      publicFactChecks: [
        {
          id: 'fc-init-03',
          claim: 'Satellite and buoy measurements track sea surface temperature variations with formal confidence bounds.',
          publisher: 'Nature Publishing & NOAA Scientific Audits',
          publisherSite: 'nature.com',
          reviewUrl: 'https://www.nature.com/articles/d41586-024-climate-trends',
          title: 'Multi-Observatory Ocean Temperature Metric Verification',
          reviewDate: '2024-01-18',
          textualRating: 'Verified Scientific Data',
          ratingCategory: 'TRUE',
          summary: 'Calibrated empirical sensor feeds from ESA Sentinel and NOAA Argo buoys substantiate the 0.18°C temperature anomaly measurement.',
        }
      ],
      forensicReport: generateRuleBasedForensicReport(credibleText, 8.4),
      processingTimeMs: 38,
      terminalLogs: [
        '[INIT] Initializing Misinformation Vectorizer & ML Inference Engine v3.4...',
        '[FEATURE-EXTRACT] Credible linguistic anchors detected (p=0.084)',
        '[TF-IDF] Generated sparse feature matrix with 48 unique dimensions',
        '[LOGISTIC-REGRESSION] Evaluated logit function: z=-2.389 -> P(Misinfo)=8.4%',
        '[RANDOM-FOREST] 100 Estimators consensus voting: Fake=1%, Suspicious=5%, Credible=94%',
        '[DECISION-ENGINE] Primary Classification: [CREDIBLE] (Confidence: 95%, Certainty: VERY_HIGH)',
        '[DONE] Pipeline execution completed in 38ms with zero runtime anomalies.'
      ],
    },
  ];
}

export const SAMPLE_CLAIMS_CATALOG: SampleClaim[] = [
  {
    id: 'wa-01',
    title: '🚨 Cosmic Rays Midnight Phone Warning',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🚨 URGENT WARNING! Please turn off your phones tonight from 12:30 AM to 3:30 AM. Dangerous cosmic rays will pass near Earth...',
    expectedVerdict: 'FAKE',
    text: '🚨 URGENT WARNING! Please turn off your phones tonight from 12:30 AM to 3:30 AM. Dangerous cosmic rays will pass near Earth. Forward this to your loved ones immediately! 🚨',
  },
  {
    id: 'wa-02',
    title: '⚠️ Frooti HIV Contaminated Blood Hoax',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '⚠️ DO NOT DRINK FROOTI! A worker with HIV has added their blood to a batch of Frooti at the factory...',
    expectedVerdict: 'FAKE',
    text: '⚠️ DO NOT DRINK FROOTI! A worker with HIV has added their blood to a batch of Frooti at the factory. This was confirmed by the police. Send this to all your groups to save lives! ⚠️',
  },
  {
    id: 'wa-03',
    title: '🎉 Amazon 30th Anniversary Free Laptops Scam',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🎉 AMAZON 30TH ANNIVERSARY! Amazon is giving away 5,000 free laptops to celebrate. Click the link below to claim yours now...',
    expectedVerdict: 'FAKE',
    text: '🎉 AMAZON 30TH ANNIVERSARY! Amazon is giving away 5,000 free laptops to celebrate. Click the link below to claim yours now before stock runs out! 🎉',
  },
  {
    id: 'wa-04',
    title: '🔴 WhatsApp Going Paid / Blue Icon Hoax',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🔴 WHATSAPP IS GOING PAID! Tomorrow at 6 PM, WhatsApp will start charging 0.99 cents per message...',
    expectedVerdict: 'FAKE',
    text: '🔴 WHATSAPP IS GOING PAID! Tomorrow at 6 PM, WhatsApp will start charging 0.99 cents per message. Forward this message to 10 contacts to keep your icon blue and your account free! 🔴',
  },
  {
    id: 'wa-05',
    title: '😱 Dance of the Pope Virus Panic',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '😱 DANCE OF THE POPE VIRUS! Do not open any video called "Dance of the Pope". It is a virus that formats your mobile completely...',
    expectedVerdict: 'FAKE',
    text: '😱 DANCE OF THE POPE VIRUS! Do not open any video called "Dance of the Pope". It is a virus that formats your mobile completely. It was announced on the radio today! 😱',
  },
  {
    id: 'wa-06',
    title: '🌿 Garlic 24-Hour Universal Cure Quackery',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🌿 CURE FOR ALL DISEASES! Boiling three cloves of garlic in water and drinking it every morning on an empty stomach...',
    expectedVerdict: 'FAKE',
    text: '🌿 CURE FOR ALL DISEASES! Boiling three cloves of garlic in water and drinking it every morning on an empty stomach will cure any viral infection within 24 hours. No need for doctors! 🌿',
  },
  {
    id: 'wa-07',
    title: '💸 Fake $2,000 Government Relief Fund List',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '💸 GOVERNMENT RELIEF FUND! The government has approved a relief fund of $2,000 for all citizens...',
    expectedVerdict: 'FAKE',
    text: '💸 GOVERNMENT RELIEF FUND! The government has approved a relief fund of $2,000 for all citizens. Check if your name is on the list here. 💸',
  },
  {
    id: 'wa-08',
    title: '🚐 White Van Child Kidnapping Panic',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🚐 KIDNAPPERS ON THE PROWL! A white van with the license plate ending in \'789\' is roaming the neighborhood snatching kids...',
    expectedVerdict: 'FAKE',
    text: '🚐 KIDNAPPERS ON THE PROWL! A white van with the license plate ending in \'789\' is roaming the neighborhood snatching kids. Please keep your children inside and share this in all local groups! 🚐',
  },
  {
    id: 'wa-09',
    title: '☀️ Two Suns in the Sky / Hunter\'s Moon Hoax',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '☀️ TWO SUNS IN THE SKY! Tomorrow we will witness the "Hunter\'s Moon" where it will look like there are two suns in the sky...',
    expectedVerdict: 'FAKE',
    text: '☀️ TWO SUNS IN THE SKY! Tomorrow we will witness the "Hunter\'s Moon" where it will look like there are two suns in the sky. This phenomenon happens once every 2,500 years! ☀️',
  },
  {
    id: 'wa-10',
    title: '🛑 Midnight Traffic Rules License Cancellation',
    category: 'WhatsApp Forward',
    inputMode: 'text',
    preview: '🛑 NEW TRAFFIC RULES! From midnight tonight, if you are caught using a phone while driving, your license will be permanently canceled...',
    expectedVerdict: 'FAKE',
    text: '🛑 NEW TRAFFIC RULES! From midnight tonight, if you are caught using a phone while driving, your license will be permanently canceled, no exceptions. Forward for awareness! 🛑',
  },
  {
    id: 'url-01',
    title: '🔗 Phishing: WhatsApp Gold Update Portal',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.whatsapp-gold-update-free.info',
    expectedVerdict: 'FAKE',
    url: 'http://www.whatsapp-gold-update-free.info',
    text: 'URL: http://www.whatsapp-gold-update-free.info - Target domain detected with suspicious typosquatting and fake premium service claims.',
  },
  {
    id: 'url-02',
    title: '🔗 Phishing: Free iPhone 15 Giveaway Winner',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.free-iphone-15-giveaway-winner.net',
    expectedVerdict: 'FAKE',
    url: 'http://www.free-iphone-15-giveaway-winner.net',
    text: 'URL: http://www.free-iphone-15-giveaway-winner.net - Deceptive lottery/giveaway lure designed for harvesting sensitive credentials.',
  },
  {
    id: 'url-03',
    title: '🔗 Phishing: Fake Gov Relief Fund Portal 2026',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.gov-relief-fund-portal-2026.org/claim',
    expectedVerdict: 'FAKE',
    url: 'http://www.gov-relief-fund-portal-2026.org/claim',
    text: 'URL: http://www.gov-relief-fund-portal-2026.org/claim - Bogus government claim portal mimicking official grant repositories.',
  },
  {
    id: 'url-04',
    title: '🔗 Quackery: Miracle Weight Loss Secret Pills',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.miracle-weight-loss-secret-pills.com',
    expectedVerdict: 'FAKE',
    url: 'http://www.miracle-weight-loss-secret-pills.com',
    text: 'URL: http://www.miracle-weight-loss-secret-pills.com - Unverified medical miracle supplement sales funnel.',
  },
  {
    id: 'url-05',
    title: '🔗 Phishing: Obfuscated Bit.ly Amazon Free Gifts',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'https://bit.ly/amazon-free-gifts-xyz',
    expectedVerdict: 'FAKE',
    url: 'https://bit.ly/amazon-free-gifts-xyz',
    text: 'URL: https://bit.ly/amazon-free-gifts-xyz - Obfuscated URL shortener disguising fraudulent Amazon brand impersonation.',
  },
  {
    id: 'url-06',
    title: '🔗 Phishing: Bank Security Urgent Login Update',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.bank-security-urgent-login-update.net',
    expectedVerdict: 'FAKE',
    url: 'http://www.bank-security-urgent-login-update.net',
    text: 'URL: http://www.bank-security-urgent-login-update.net - High-risk banking credential harvesting portal.',
  },
  {
    id: 'url-07',
    title: '🔗 Clickbait: Shocking Celebrity Scandal Video',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.shocking-celebrity-scandal-video.info',
    expectedVerdict: 'FAKE',
    url: 'http://www.shocking-celebrity-scandal-video.info',
    text: 'URL: http://www.shocking-celebrity-scandal-video.info - Clickbait video domain distributing adware and trackers.',
  },
  {
    id: 'url-08',
    title: '🔗 Phishing: Fake Apple Support Virus Alert Scan',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.apple-support-virus-alert-scan.com',
    expectedVerdict: 'FAKE',
    url: 'http://www.apple-support-virus-alert-scan.com',
    text: 'URL: http://www.apple-support-virus-alert-scan.com - Fake tech-support scareware portal coercing users to call fraudulent hotlines.',
  },
  {
    id: 'url-09',
    title: '🔗 Phishing: Fake Facebook Password Recovery',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.facebook-password-recovery-help.net',
    expectedVerdict: 'FAKE',
    url: 'http://www.facebook-password-recovery-help.net',
    text: 'URL: http://www.facebook-password-recovery-help.net - Social engineering login harvest page spoofing Meta Facebook security.',
  },
  {
    id: 'url-10',
    title: '🔗 Scam: Earn 5000 Dollars Daily From Home',
    category: 'Suspicious URL',
    inputMode: 'url',
    preview: 'http://www.earn-5000-dollars-daily-from-home.com',
    expectedVerdict: 'FAKE',
    url: 'http://www.earn-5000-dollars-daily-from-home.com',
    text: 'URL: http://www.earn-5000-dollars-daily-from-home.com - Work-from-home advance fee recruitment fraud scheme.',
  },
];
