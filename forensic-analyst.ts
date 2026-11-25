import { ForensicAnalysisReport, StatementSeparation, SuspiciousClaimItem, EmotionalManipulation, EvidenceGapItem, RiskScoring } from '../src/types';

// Deterministic rule-based forensic breakdown for instant zero-latency processing or fallback
export function generateRuleBasedForensicReport(text: string, riskScore: number): ForensicAnalysisReport {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const sentences = normalized
    .split(/(?<=[.?!])\s+(?=[A-Z0-9"']|\n)/g)
    .flatMap((s) => s.split(/\n{2,}/))
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const facts: string[] = [];
  const claims: string[] = [];
  const opinions: string[] = [];
  const uncertainties: string[] = [];

  const suspiciousClaims: SuspiciousClaimItem[] = [];
  const emotionalExamples: { phrase: string; analysis: string }[] = [];
  const emotionalTactics: Set<string> = new Set();
  const evidenceGaps: EvidenceGapItem[] = [];

  // Linguistic regex patterns
  const factIndicators = /\b(published in|study shows|data confirms|measured|recorded|peer-reviewed|according to|reuters|associated press|nasa|who|cdc|official report|discovered in \d{4}|percent|temperature reached)\b/i;
  const opinionIndicators = /\b(i believe|in my opinion|best|worst|terrible|amazing|evil|disgraceful|heroic|should be|must agree|obviously|clearly|unacceptable|masterpiece)\b/i;
  const uncertaintyIndicators = /\b(might|could possibly|allegedly|rumored|unconfirmed|speculated|perhaps|some say|sources claim|may be)\b/i;
  const forwardIndicators = /\b(forward to everyone|share before deleted|delete immediately|urgent alert|act now|what they are hiding|mainstream media won't tell you|secret cure|miracle cure|100% cure|deep state|microchip|5g)\b/i;

  for (const sentence of sentences) {
    const sLower = sentence.toLowerCase();

    // Check statement separation
    if (opinionIndicators.test(sentence) && !factIndicators.test(sentence)) {
      opinions.push(sentence);
    } else if (uncertaintyIndicators.test(sentence)) {
      uncertainties.push(sentence);
    } else if (factIndicators.test(sentence) && !forwardIndicators.test(sentence)) {
      facts.push(sentence);
    } else {
      claims.push(sentence);
    }

    // Check suspicious & misleading claims
    if (forwardIndicators.test(sentence) || (sentence.includes('!') && sentence.match(/[A-Z]{4,}/))) {
      let flawType = 'Misleading Framing & Urgency Pressure';
      let explanation = 'Sentence leverages urgent commands or sensational phrasing without empirical verification.';
      
      if (sLower.includes('cure') || sLower.includes('miracle')) {
        flawType = 'Unsupported Biomedical Claim';
        explanation = 'Promises complete medical cure without clinical trial evidence or FDA/EMA documentation.';
      } else if (sLower.includes('media won\'t') || sLower.includes('they are hiding')) {
        flawType = 'Conspiratorial Framing / Epistemic Isolation';
        explanation = 'Pre-emptively dismisses mainstream verification sources to prevent independent cross-checking.';
      } else if (sLower.includes('5g') || sLower.includes('microchip')) {
        flawType = 'Pseudoscience / False Causation';
        explanation = 'Attributes biological effects or surveillance capabilities without mechanistic scientific plausibility.';
      }

      suspiciousClaims.push({
        statement: sentence,
        flaw_type: flawType,
        explanation,
      });
    }

    // Check emotional manipulation
    if (/(urgent|warning|shocking|secret|evil|destroy|catastrophic|horrifying|wake up|alert)/i.test(sentence)) {
      emotionalTactics.add('sensationalism');
      emotionalTactics.add('fear-mongering');
      emotionalExamples.push({
        phrase: sentence,
        analysis: 'Uses heightened emotional vocabulary to bypass critical skepticism and evoke an immediate defensive reaction.',
      });
    } else if (/(share|forward|before it gets deleted|tell everyone)/i.test(sentence)) {
      emotionalTactics.add('urgency-pressure');
      emotionalTactics.add('outrage-baiting');
      emotionalExamples.push({
        phrase: sentence,
        analysis: 'Appeals to viral forwarding behavior and FOMO rather than rational verification.',
      });
    }

    // Check evidence gaps
    if ((sLower.includes('proven') || sLower.includes('experts say') || sLower.includes('doctors agree') || sLower.includes('scientists discovered')) && !factIndicators.test(sentence)) {
      evidenceGaps.push({
        claim: sentence,
        missing_evidence: 'Specific academic citation, lead author name, publishing journal, or verifiable dataset link.',
      });
    }
  }

  // Ensure arrays have at least reasonable defaults if text is short
  if (facts.length === 0 && claims.length === 0 && sentences.length > 0) {
    if (riskScore <= 30) {
      facts.push(sentences[0]);
    } else {
      claims.push(sentences[0]);
    }
  }

  if (suspiciousClaims.length === 0 && riskScore > 40 && sentences.length > 0) {
    suspiciousClaims.push({
      statement: sentences[0],
      flaw_type: 'Unsubstantiated Assertion',
      explanation: 'Core assertion lacks primary source attribution or corroborating documentary evidence.',
    });
  }

  if (evidenceGaps.length === 0 && riskScore > 35 && sentences.length > 0) {
    evidenceGaps.push({
      claim: sentences[0],
      missing_evidence: 'Direct primary source documentation, institutional press release, or peer-reviewed empirical verification.',
    });
  }

  // Severity Level mapping
  let severityLevel: RiskScoring['severity_level'] = 'Low';
  if (riskScore >= 75) {
    severityLevel = 'Severe';
  } else if (riskScore >= 50) {
    severityLevel = 'High';
  } else if (riskScore >= 25) {
    severityLevel = 'Moderate';
  } else {
    severityLevel = 'Low';
  }

  let reasoning = '';
  if (riskScore >= 68) {
    reasoning = `The analyzed text displays high markers of sensationalism, unverified urgency, and evidential deficits. The presence of viral forward tropes, exaggerated casualty or cure assertions, and the absence of peer-reviewed or mainstream corroboration justify a high risk assessment.`;
  } else if (riskScore >= 35) {
    reasoning = `The analyzed text exhibits moderate ambiguity. While some factual elements or neutral context may be present, subjective opinions or speculative claims lack authoritative source citations.`;
  } else {
    reasoning = `The analyzed text demonstrates consistent empirical grounding, objective journalistic vocabulary, and clear attribution to identifiable entities without manipulative emotional priming.`;
  }

  return {
    statement_separation: {
      facts,
      claims,
      opinions,
      uncertainties,
    },
    suspicious_and_misleading_claims: suspiciousClaims,
    emotional_manipulation: {
      detected: emotionalExamples.length > 0,
      tactics: Array.from(emotionalTactics),
      examples: emotionalExamples,
    },
    evidence_gap_analysis: evidenceGaps,
    risk_scoring: {
      score: riskScore,
      severity_level: severityLevel,
    },
    reasoning,
  };
}
