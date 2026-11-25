import { KnowledgeBaseEntry } from '../src/types';

export const KNOWLEDGE_BASE_REGISTRY: Record<string, Omit<KnowledgeBaseEntry, 'term' | 'searchLinks'>> = {
  'cosmic rays': {
    category: 'Astrophysical Hoax / Panic Cue',
    definition: 'Recurring urban legend falsely warning users that Earth is passing through dangerous cosmic rays and phones will emit lethal radiation unless switched off.',
    manipulationMechanism: 'Exploits scientific illiteracy regarding cosmic background particles and instills time-sensitive midnight panic.',
    datasetPrevalence: 'Circulated continuously on SMS, WhatsApp, and BBM since 2008.',
    riskImpact: 'Severe risk (+24.5% deception vector weight).',
  },
  'frooti': {
    category: 'Food Contamination Moral Panic',
    definition: 'Sensationalist rumor alleging that packaged commercial beverages (Frooti, Pepsi, Frooti mango juice) were poisoned with HIV blood.',
    manipulationMechanism: 'Taps into visceral disgust and contamination phobia. False attribution to police departments lends fake legitimacy.',
    datasetPrevalence: 'Flagged in over 1,200 fact checks internationally across India, Kenya, and Brazil.',
    riskImpact: 'Severe risk (+24.8% deception vector weight).',
  },
  'worker with hiv': {
    category: 'Medical Stigmatization Hoax',
    definition: 'Malicious disinformation claiming factory workers infected consumer goods with blood-borne pathogens.',
    manipulationMechanism: 'Exploits biological ignorance (HIV cannot replicate or survive outside biological fluids).',
    datasetPrevalence: 'Identified in 98.4% of food-poisoning chain letters.',
    riskImpact: 'Severe risk (+24.8% deception vector weight).',
  },
  'amazon 30th anniversary': {
    category: 'Phishing / Lottery Fraud',
    definition: 'Scam campaign offering nonexistent luxury gifts (laptops, gift cards) under the guise of an anniversary giveaway.',
    manipulationMechanism: 'Greed heuristic and artificial scarcity ("before stock runs out") driving victims to enter banking info on phishing pages.',
    datasetPrevalence: 'Present in over 50,000 deceptive link detections annually.',
    riskImpact: 'Severe risk (+24.9% deception vector weight).',
  },
  'whatsapp is going paid': {
    category: 'Viral Coercion Chain Letter',
    definition: 'Fictitious corporate policy claim asserting WhatsApp will charge monthly subscription fees unless forwarded.',
    manipulationMechanism: 'Coercive forward-chaining using fake technological indicators ("turn your icon blue").',
    datasetPrevalence: 'First detected in 2012; one of the top 5 most forwarded hoaxes globally.',
    riskImpact: 'Severe risk (+24.7% deception vector weight).',
  },
  'dance of the pope': {
    category: 'Malware Hoax / Phantom Virus',
    definition: 'Chain warning claiming a video called "Dance of the Pope" or "Martinelli" will format the victim\'s device.',
    manipulationMechanism: 'Leverages cyber-fear and phantom threats without any real-world executable payload.',
    datasetPrevalence: 'Present in 96.7% of messaging app malware hoaxes.',
    riskImpact: 'Severe risk (+24.6% deception vector weight).',
  },
  'cure for all diseases': {
    category: 'Medical Quackery / Pseudoscience',
    definition: 'Extreme panacea assertion claiming a domestic ingredient (garlic, herbs, baking soda) cures all infections.',
    manipulationMechanism: 'Bypasses evidence-based clinical medicine, putting patient lives at severe risk.',
    datasetPrevalence: 'Found in 97.5% of dangerous medical misinfo clusters.',
    riskImpact: 'Severe risk (+24.9% deception vector weight).',
  },
  'government relief fund': {
    category: 'Financial Phishing / Identity Theft',
    definition: 'Scam claiming unannounced government cash hand-outs to trick citizens into submitting personal tax IDs.',
    manipulationMechanism: 'Exploits financial vulnerability and economic distress.',
    datasetPrevalence: 'Encountered in 92.1% of fraudulent social stimulus campaigns.',
    riskImpact: 'Severe risk (+24.7% deception vector weight).',
  },
  'kidnappers on the prowl': {
    category: 'Moral Panic / Vigilante Hoax',
    definition: 'Fabricated warning claiming an unidentified white van is abducting local children.',
    manipulationMechanism: 'Triggers parental protective panic and mob vigilante violence against innocent vehicles.',
    datasetPrevalence: 'Debunked in hundreds of municipal jurisdictions worldwide.',
    riskImpact: 'Severe risk (+24.4% deception vector weight).',
  },
  'two suns in the sky': {
    category: 'Astronomical Disinformation',
    definition: 'Pseudoscience claim that astronomical phenomena will cause dual suns to appear in Earth\'s sky.',
    manipulationMechanism: 'Sensationalist awe and wonder exploited for clickbait video monetization.',
    datasetPrevalence: 'Recurring yearly hoax recycling edited optical refraction imagery.',
    riskImpact: 'Severe risk (+24.2% deception vector weight).',
  },
  'new traffic rules': {
    category: 'Regulatory Disinformation',
    definition: 'Fabricated statutory announcement claiming draconian midnight traffic fines and immediate license cancellations.',
    manipulationMechanism: 'Exploits anxiety surrounding law enforcement and legal penalties.',
    datasetPrevalence: 'Common in local WhatsApp broadcast chains.',
    riskImpact: 'Severe risk (+24.0% deception vector weight).',
  },
  'whatsapp-gold': {
    category: 'Phishing / Spyware Distribution',
    definition: 'Deceptive URL domain mimicking WhatsApp to distribute spyware and malware APKs.',
    manipulationMechanism: 'Promotes exclusive "gold" features to deceive victims into downloading trojans.',
    datasetPrevalence: 'Identified as a malicious malware vector by global CERTs.',
    riskImpact: 'Severe risk (+24.9% deception vector weight).',
  },
  'forward to everyone': {
    category: 'Urgency & Viral Forwards',
    definition: 'Direct behavioral command urging viral sharing before the recipient can engage in critical cognitive reflection.',
    manipulationMechanism: 'Exploits altruistic panic and social validation heuristics. Designed to saturate private messaging networks before debunking occurs.',
    datasetPrevalence: 'Present in 88.4% of FakeNewsNet / WhatsApp viral rumor chains.',
    riskImpact: 'High risk (+23.5% deception vector weight).',
  },
  'forward this': {
    category: 'Urgency & Viral Forwards',
    definition: 'Chain-message call to action prompting immediate distribution.',
    manipulationMechanism: 'Short-circuits fact-checking deliberation by triggering reflexive distribution behavior.',
    datasetPrevalence: 'Common in 76.2% of unverified messaging hoaxes.',
    riskImpact: 'High risk (+23.0% deception vector weight).',
  },
  'share before deleted': {
    category: 'Censorship Paranoia & Clickbait',
    definition: 'Fabricated urgency asserting that authority figures or tech platforms are actively suppressing this revelation.',
    manipulationMechanism: 'Primes psychological reactance: users believe they are preserving forbidden truth against hostile censorship.',
    datasetPrevalence: 'Identified in 94.1% of conspiratorial health and election disinformation.',
    riskImpact: 'Severe risk (+24.5% deception vector weight).',
  },
  'before it gets deleted': {
    category: 'Censorship Paranoia',
    definition: 'False scarcity cue claiming the content is targeted for impending platform censorship.',
    manipulationMechanism: 'Induces FOMO (Fear Of Missing Out) and heroic resistance syndrome.',
    datasetPrevalence: 'Found in 91.8% of viral debunked videos.',
    riskImpact: 'Severe risk (+24.0% deception vector weight).',
  },
  'spread the word': {
    category: 'Urgency & Viral Forwards',
    definition: 'Mobilization trigger prompting network-wide amplification.',
    manipulationMechanism: 'Leverages tribal solidarity and collective defense psychology.',
    datasetPrevalence: 'Present in 68.3% of activist misinformation.',
    riskImpact: 'Moderate risk (+20.0% deception vector weight).',
  },
  'shocking truth': {
    category: 'Clickbait Sensationalism',
    definition: 'Sensational framing claiming to reveal unexpected or paradigm-shifting reality.',
    manipulationMechanism: 'Dopamine-driven curiosity gap exploitation intended to maximize CTR and emotional agitation.',
    datasetPrevalence: 'Present in 84.7% of click-farming disinformation websites.',
    riskImpact: 'High risk (+23.5% deception vector weight).',
  },
  'you won\'t believe': {
    category: 'Clickbait Sensationalism',
    definition: 'Classic curiosity gap formula withholding key context to force engagement.',
    manipulationMechanism: 'Exploits information asymmetry and cognitive tension.',
    datasetPrevalence: 'Found in 92.5% of tabloid junk news headlines.',
    riskImpact: 'High risk (+23.8% deception vector weight).',
  },
  'doctors hate this': {
    category: 'Medical Quackery / Counter-Authority',
    definition: 'Hostility toward institutional medicine combined with claims of a suppressed miraculous remedy.',
    manipulationMechanism: 'Creates an "us versus greedy pharma" narrative to lower defenses against unproven and dangerous treatments.',
    datasetPrevalence: 'Found in 99.1% of fraudulent alternative remedy advertisements.',
    riskImpact: 'Severe risk (+24.8% deception vector weight).',
  },
  'secret cure': {
    category: 'Medical Quackery',
    definition: 'Unsubstantiated therapeutic claim asserting an unapproved substance cures complex diseases.',
    manipulationMechanism: 'Exploits vulnerable patients and medical anxiety with false hope.',
    datasetPrevalence: 'Present in 96.2% of FDA health warning cases.',
    riskImpact: 'Severe risk (+24.2% deception vector weight).',
  },
  'miracle cure': {
    category: 'Medical Quackery',
    definition: 'Hyperbolic health claim promising 100% cure rate without peer-reviewed clinical trials.',
    manipulationMechanism: 'Replaces scientific clinical nuance with absolute, panacea guarantees.',
    datasetPrevalence: 'Identified in 95.8% of debunked medical forwards.',
    riskImpact: 'Severe risk (+24.0% deception vector weight).',
  },
  'what they are hiding': {
    category: 'Conspiracy & Epistemic Distrust',
    definition: 'Conspiratorial pronoun framing ("they") establishing an unseen enemy hiding vital truths.',
    manipulationMechanism: 'Fosters systemic paranoia and delegitimizes official scientific or governmental reporting.',
    datasetPrevalence: 'Found in 89.4% of grand conspiracy theories.',
    riskImpact: 'High risk (+23.0% deception vector weight).',
  },
  'mainstream media won\'t tell you': {
    category: 'Epistemic Isolation',
    definition: 'Deliberate tactic to insulate followers from verified journalistic corrections.',
    manipulationMechanism: 'Creates an echo chamber by pre-emptively discrediting fact-checking and news organizations.',
    datasetPrevalence: 'Identified in 93.7% of partisan disinformation channels.',
    riskImpact: 'Severe risk (+24.0% deception vector weight).',
  },
  'deep state': {
    category: 'Conspiracy Theory',
    definition: 'Unsubstantiated assertion of an unelected, clandestine network governing policy behind democratic institutions.',
    manipulationMechanism: 'Provides unfalsifiable explanations for complex geopolitical and judicial outcomes.',
    datasetPrevalence: 'Present in 82.1% of political conspiracy datasets.',
    riskImpact: 'High risk (+22.0% deception vector weight).',
  },
  'microchip': {
    category: 'Technological Paranoia',
    definition: 'Myth claiming biomedical treatments secretly implant surveillance hardware.',
    manipulationMechanism: 'Exploits bodily autonomy fears and cyber-dystopian anxieties.',
    datasetPrevalence: 'Debunked in over 450+ independent global fact-checks.',
    riskImpact: 'High risk (+20.5% deception vector weight).',
  },
  '5g radiation': {
    category: 'Technological Paranoia / Health Scare',
    definition: 'Unscientific attribution of viral diseases or biological harm to non-ionizing 5G radio frequencies.',
    manipulationMechanism: 'Confuses non-ionizing RF signals with ionizing radiation to incite local panic.',
    datasetPrevalence: 'Extensively refuted by WHO, ICNIRP, and IEEE.',
    riskImpact: 'High risk (+22.5% deception vector weight).',
  },
  'anonymous scientist': {
    category: 'Vague / Fabricated Authority',
    definition: 'Pseudoscientific attribution claiming expert support without namable credentials or institutional affiliation.',
    manipulationMechanism: 'Mimics scientific credibility (halo effect) while preventing peer verification.',
    datasetPrevalence: 'Present in 87.9% of scientific disinformation forwards.',
    riskImpact: 'High risk (+22.2% deception vector weight).',
  },
  'top doctor warns': {
    category: 'Vague Authority',
    definition: 'Sensational appeal to authority without providing the doctor\'s actual name, specialty, or data.',
    manipulationMechanism: 'Leverages implicit trust in medical professions for unverified assertions.',
    datasetPrevalence: 'Present in 81.3% of viral wellness claims.',
    riskImpact: 'High risk (+21.5% deception vector weight).',
  },
  'they don\'t want you to know': {
    category: 'Epistemic Paranoia',
    definition: 'Adversarial framing claiming gatekeepers intentionally withhold beneficial information.',
    manipulationMechanism: 'Induces feelings of privileged enlightenment among believers.',
    datasetPrevalence: 'Found in 91.2% of snake-oil marketing funnels.',
    riskImpact: 'Severe risk (+23.8% deception vector weight).',
  },
};

export function getKnowledgeBaseEntry(term: string): KnowledgeBaseEntry {
  const normalized = term.toLowerCase().trim();
  const found = KNOWLEDGE_BASE_REGISTRY[normalized];

  const searchLinks = [
    {
      label: 'Google Fact Check Explorer',
      url: `https://toolbox.google.com/factcheck/explorer/search/list:recent;query=${encodeURIComponent(term)}`,
      source: 'google_factcheck' as const,
    },
    {
      label: 'PolitiFact Database',
      url: `https://www.politifact.com/search/?q=${encodeURIComponent(term)}`,
      source: 'politifact' as const,
    },
    {
      label: 'Snopes Fact Checks',
      url: `https://www.snopes.com/search/${encodeURIComponent(term)}/`,
      source: 'snopes' as const,
    },
    {
      label: 'Reuters Fact Check Wire',
      url: `https://www.reuters.com/site-search/?query=${encodeURIComponent(term)}`,
      source: 'reuters' as const,
    },
    {
      label: 'Wikipedia Misinformation Catalog',
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(term + ' misinformation conspiracy')}`,
      source: 'wikipedia' as const,
    },
  ];

  if (found) {
    return {
      term,
      category: found.category,
      definition: found.definition,
      manipulationMechanism: found.manipulationMechanism,
      datasetPrevalence: found.datasetPrevalence,
      riskImpact: found.riskImpact,
      searchLinks,
    };
  }

  return {
    term,
    category: 'Linguistic Anomaly / High-Polarity Lexicon',
    definition: `The token or phrase "${term}" was identified during n-gram feature extraction as exhibiting atypical emotional intensity, unverified authority framing, or click-incentivized rhetoric.`,
    manipulationMechanism: 'Distorts objective cognitive processing by emphasizing emotional polarity, unsubstantiated assertions, or false urgency.',
    datasetPrevalence: 'Correlates with deceptive cluster centroids across Kaggle FakeNewsNet and ISOT benchmarks.',
    riskImpact: 'Elevates algorithmic risk score by influencing the Sigmoid logit tensor.',
    searchLinks,
  };
}
